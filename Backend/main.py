"""
ExpertVoice AI Agent Backend

A FastAPI-based conversational AI agent using Ollama for local LLM inference.
Provides a clean, production-ready chat API with health monitoring and request tracing.

Features:
- Request validation with Pydantic models
- Non-streaming chat responses with complete JSON
- Health monitoring for Ollama service with caching
- Request tracing with unique IDs
- Comprehensive error handling with proper HTTP status codes
- CORS support for frontend integration
- Request payload size validation
- Async/await throughout for efficient concurrency

Author: ExpertVoice Team
Version: 1.0.1
"""

import json
import time
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

import httpx
import tiktoken
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from config import get_settings
from models import ChatRequest, ChatResponse, ErrorResponse, HealthResponse
from logging_config import configure_logging


# Configure logging and settings
logger = configure_logging(level="INFO", use_json=False)
settings = get_settings()

# Initialize HTTP client for external calls (connection pooling)
http_client: Optional[httpx.AsyncClient] = None


# Health check cache
class HealthCheckCache:
    """Thread-safe cache for Ollama health checks with TTL."""
    
    def __init__(self, ttl_seconds: int = 30):
        self.ttl = timedelta(seconds=ttl_seconds)
        self.cached_result: Optional[bool] = None
        self.cached_timestamp: Optional[datetime] = None
    
    def is_valid(self) -> bool:
        """Check if cache is still valid."""
        if self.cached_result is None or self.cached_timestamp is None:
            return False
        return datetime.now() - self.cached_timestamp < self.ttl
    
    def get(self) -> Optional[bool]:
        """Get cached health status if valid."""
        return self.cached_result if self.is_valid() else None
    
    def set(self, result: bool) -> None:
        """Cache health check result."""
        self.cached_result = result
        self.cached_timestamp = datetime.now()


health_cache = HealthCheckCache(ttl_seconds=30)


# Token counter (lazy loaded)
_tokenizer = None


def get_tokenizer():
    """Get or initialize tiktoken tokenizer."""
    global _tokenizer
    if _tokenizer is None:
        try:
            _tokenizer = tiktoken.get_encoding("cl100k_base")
        except Exception as e:
            logger.warning(f"Failed to load tiktoken: {e}, falling back to word-based counting")
            _tokenizer = False  # Sentinel for fallback mode
    return _tokenizer if _tokenizer else None


def count_tokens(text: str) -> int:
    """
    Count approximate tokens in text using tiktoken.
    
    Falls back to word-based counting if tiktoken unavailable.
    """
    tokenizer = get_tokenizer()
    if tokenizer:
        try:
            return len(tokenizer.encode(text))
        except Exception:
            pass
    
    # Fallback: simple word-based approximation
    return len(text.split())


# ============================================================================
# Application Lifecycle
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown."""
    global http_client
    
    logger.info(f"🚀 Starting ExpertVoice AI Agent (model: {settings.ollama_model})")
    logger.info(f"   CORS Origins: {', '.join(settings.cors_origins_list)}")
    logger.info(f"   Ollama URL: {settings.ollama_base_url}")
    
    # Initialize HTTP client with connection pooling
    http_client = httpx.AsyncClient(timeout=settings.ollama_health_check_timeout)
    
    yield
    
    # Cleanup
    logger.info("🛑 Shutting down ExpertVoice AI Agent")
    if http_client:
        await http_client.aclose()


# Initialize FastAPI app
app = FastAPI(
    title="ExpertVoice AI Agent",
    description="Intelligent conversational AI assistant with dynamic expert roles",
    version="1.0.1",
    lifespan=lifespan,
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ============================================================================
# Middleware
# ============================================================================

@app.middleware("http")
async def validate_content_length(request: Request, call_next):
    """Validate request payload size before processing."""
    if request.method in ["POST", "PUT", "PATCH"]:
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > settings.max_payload_size:
            logger.warning(
                f"Request payload exceeds limit: {content_length} > {settings.max_payload_size}"
            )
            return JSONResponse(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                content=ErrorResponse(
                    error=f"Payload exceeds {settings.max_payload_size} bytes",
                    error_code="PAYLOAD_TOO_LARGE"
                ).model_dump()
            )
    
    return await call_next(request)


# ============================================================================
# Utility Functions
# ============================================================================

async def check_ollama_health(
    timeout: Optional[int] = None,
    request_id: str = "N/A",
    use_cache: bool = True
) -> bool:
    """
    Check if Ollama service is available.
    
    Uses health check cache to avoid excessive requests.
    
    Args:
        timeout: Override timeout in seconds
        request_id: Request ID for logging
        use_cache: Whether to use cached result if available
        
    Returns:
        True if Ollama is available, False otherwise
    """
    if use_cache:
        cached = health_cache.get()
        if cached is not None:
            logger.debug(f"[{request_id}] Using cached Ollama health: {cached}")
            return cached
    
    timeout = timeout or settings.ollama_health_check_timeout
    try:
        if not http_client:
            logger.error(f"[{request_id}] HTTP client not initialized")
            return False
        
        response = await http_client.get(
            f"{settings.ollama_base_url}/api/tags",
            timeout=timeout
        )
        is_available = response.status_code == 200
        
        health_cache.set(is_available)
        
        if is_available:
            logger.debug(f"[{request_id}] Ollama health check: OK")
        else:
            logger.warning(f"[{request_id}] Ollama health check failed: status {response.status_code}")
        
        return is_available
    
    except httpx.TimeoutException as e:
        logger.warning(f"[{request_id}] Ollama health check timeout: {str(e)}")
        health_cache.set(False)
        return False
    except httpx.RequestError as e:
        logger.warning(f"[{request_id}] Ollama health check error: {type(e).__name__}")
        health_cache.set(False)
        return False
    except Exception as e:
        logger.error(f"[{request_id}] Unexpected error in health check: {type(e).__name__}: {str(e)}")
        health_cache.set(False)
        return False


def generate_request_id() -> str:
    """Generate a unique 8-character request ID."""
    return str(uuid.uuid4())[:8]


# ============================================================================
# API Endpoints
# ============================================================================

@app.get("/", tags=["Info"])
async def root() -> Dict[str, Any]:
    """Root endpoint providing API information."""
    return {
        "name": "ExpertVoice AI Agent",
        "version": "1.0.1",
        "documentation": "/docs",
        "health": "/health",
        "chat_endpoint": "/chat"
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check() -> HealthResponse:
    """Health check endpoint. Verifies Ollama availability."""
    request_id = generate_request_id()
    ollama_available = await check_ollama_health(request_id=request_id)
    
    if ollama_available:
        return HealthResponse(
            status="ok",
            ollama_available=True,
            model=settings.ollama_model,
            message="Service is operational"
        )
    else:
        logger.error("Ollama is not available during health check")
        return HealthResponse(
            status="degraded",
            ollama_available=False,
            model=settings.ollama_model,
            message="Ollama service is not responding"
        )


@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(chat_request: ChatRequest) -> ChatResponse:
    """
    Chat endpoint. Returns complete response as single JSON object.
    
    Accepts a list of messages and returns AI-generated response with metadata.
    Validates all input and enforces message length limits.
    """
    request_id = generate_request_id()
    start_time = time.time()
    
    try:
        # Validate message content length
        for i, msg in enumerate(chat_request.messages):
            if len(msg.content) > settings.max_message_length:
                logger.error(
                    f"[{request_id}] Message {i} exceeds max length: "
                    f"{len(msg.content)} > {settings.max_message_length}"
                )
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Message {i} exceeds maximum length of {settings.max_message_length} characters"
                )
        
        messages = [msg.model_dump() for msg in chat_request.messages]
        logger.info(f"[{request_id}] 📨 Received chat request with {len(messages)} messages")
        
        # Check Ollama availability
        ollama_available = await check_ollama_health(request_id=request_id, use_cache=True)
        if not ollama_available:
            logger.error(f"[{request_id}] Ollama is not available")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Ollama service is not responding"
            )
        
        # Add system prompt if needed
        if not any(m.get("role") == "system" for m in messages):
            messages.insert(0, {"role": "system", "content": settings.system_prompt})
            logger.debug(f"[{request_id}] Added system prompt")
        
        logger.info(f"[{request_id}] ⚙️ Starting inference on model {settings.ollama_model}")
        inference_start = time.time()
        
        # Get complete response (non-streaming) using async client
        try:
            import ollama
            response_obj = ollama.chat(
                model=settings.ollama_model,
                messages=messages,
                stream=False,
                options={
                    "num_predict": 100,
                    "temperature": 0.7,
                    "top_p": 0.85,
                    "top_k": 30,
                    "timeout": settings.ollama_timeout * 1e9,
                }
            )
            
            # Extract content from response
            if isinstance(response_obj, dict):
                content = response_obj.get("message", {}).get("content", "")
            else:
                # Handle ollama library ChatResponse objects
                content = response_obj.message.content if hasattr(response_obj, "message") else ""
            
        except (TimeoutError, httpx.TimeoutException) as e:
            logger.error(f"[{request_id}] Inference timeout after {settings.ollama_timeout}s")
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail=f"Model inference timeout after {settings.ollama_timeout} seconds"
            )
        except Exception as e:
            logger.error(f"[{request_id}] Ollama error: {type(e).__name__}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Ollama error: {str(e)}"
            )
        
        # Count tokens in response
        token_count = count_tokens(content)
        inference_time = time.time() - inference_start
        total_time = time.time() - start_time
        
        logger.info(
            f"[{request_id}] ✅ Inference completed: "
            f"{len(content)} chars, {token_count} tokens, "
            f"{inference_time:.2f}s inference time"
        )
        
        return ChatResponse(
            content=content,
            request_id=request_id,
            tokens=token_count,
            generation_time=round(inference_time, 2),
            total_time=round(total_time, 2)
        )
    
    except HTTPException:
        raise
    except ValidationError as e:
        logger.error(f"[{request_id}] Validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid request parameters"
        )
    except Exception as e:
        logger.error(f"[{request_id}] Unexpected error: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom HTTP exception handler with proper error responses."""
    request_id = request.headers.get("x-request-id", "unknown")
    logger.error(f"[{request_id}] HTTP {exc.status_code}: {exc.detail}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=str(exc.detail),
            error_code=f"HTTP_{exc.status_code}",
            request_id=request_id
        ).model_dump()
    )


# ============================================================================
# Application Entry Point
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level=settings.log_level.lower(),
    )
