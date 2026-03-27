"""
Pydantic models for request/response validation.

Defines the data schemas used throughout the ExpertVoice AI Agent API.
All request and response bodies are validated against these models to ensure
type safety and data integrity.

Models:
    - Message: Individual message in a conversation
    - ChatRequest: Request payload for /chat endpoint
    - ChatResponse: Full response from chat endpoint
    - ErrorResponse: Error response structure
    - HealthResponse: Health check endpoint response
"""

from typing import Optional
from pydantic import BaseModel, Field, field_validator


class Message(BaseModel):
    """
    A single message in a conversation.
    
    Represents either a user query, assistant response, or system instruction.
    Part of the conversation history sent to the model.
    
    Attributes:
        role: Message sender role - must be 'user', 'assistant', or 'system'
        content: The actual message text (non-empty)
        
    Example:
        >>> msg = Message(role="user", content="Hello, how are you?")
        >>> print(msg.role)
        "user"
    """
    
    role: str = Field(
        ...,
        description="Message role: 'user', 'assistant', or 'system'"
    )
    content: str = Field(
        ...,
        description="Message content (non-empty)"
    )

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        """
        Validate that role is one of the allowed values.
        
        Args:
            v: The role value to validate
            
        Returns:
            Lowercase role value
            
        Raises:
            ValueError: If role is not in valid_roles set
        """
        valid_roles = {"user", "assistant", "system"}
        if v.lower() not in valid_roles:
            raise ValueError(f"role must be one of {valid_roles}, got '{v}'")
        return v.lower()

    @field_validator("content")
    @classmethod
    def validate_content(cls, v: str) -> str:
        """
        Validate that content is not empty.
        
        Args:
            v: The content value to validate
            
        Returns:
            Stripped content value
            
        Raises:
            ValueError: If content is empty or whitespace-only
        """
        if not v or not v.strip():
            raise ValueError("content cannot be empty")
        return v.strip()


class ChatRequest(BaseModel):
    """
    Request body for the /chat endpoint.
    
    Contains a list of messages (conversation history) to send to the model
    for inference. At least one message is required.
    
    Attributes:
        messages: List of Message objects (min 1, max 50)
        
    Example:
        >>> request = ChatRequest(messages=[
        ...     Message(role="user", content="What's the weather?")
        ... ])
        >>> print(len(request.messages))
        1
    """
    
    messages: list[Message] = Field(
        ...,
        description="List of messages in conversation (min 1, max 50)",
        min_items=1,
        max_items=50
    )

    @field_validator("messages")
    @classmethod
    def validate_messages_not_empty(cls, v: list[Message]) -> list[Message]:
        """
        Ensure at least one message is present.
        
        Args:
            v: List of messages to validate
            
        Returns:
            The validated message list
            
        Raises:
            ValueError: If message list is empty
        """
        if not v:
            raise ValueError("messages list cannot be empty")
        return v


class ChatResponse(BaseModel):
    """
    Complete response from the /chat endpoint.
    
    Contains the generated content, metadata, and request tracing information.
    Non-streaming response with full content in one object.
    
    Attributes:
        content: The complete generated response text
        request_id: Unique identifier correlating to the original request
        tokens: Approximate token count in response
        generation_time: Time spent in model inference (seconds)
        total_time: Total request processing time (seconds)
        
    Example:
        >>> response = ChatResponse(
        ...     content="Hello! I'm doing well.",
        ...     request_id="abc12345",
        ...     tokens=12,
        ...     generation_time=1.23,
        ...     total_time=1.45
        ... )
    """
    
    content: str = Field(
        ...,
        description="Complete generated response text"
    )
    request_id: str = Field(
        ...,
        description="Unique request identifier for tracing"
    )
    tokens: int = Field(
        ...,
        description="Approximate token count in response"
    )
    generation_time: float = Field(
        ...,
        description="Model inference time in seconds"
    )
    total_time: float = Field(
        ...,
        description="Total request processing time in seconds"
    )


class ErrorResponse(BaseModel):
    """
    Standard error response structure.
    
    Returned when an error occurs during processing. Uses categorical error
    codes to allow clients to handle different error types appropriately.
    
    Attributes:
        error: Human-readable error message
        error_code: Categorical code for programmatic error handling
        request_id: Unique identifier for debugging/logging
        
    Error Codes:
        - VALIDATION_ERROR: Invalid request parameter
        - MODEL_ERROR: LLM inference error
        - TIMEOUT: Request/model inference timeout
        - SERVICE_UNAVAILABLE: Ollama service not responding
        - INTERNAL_ERROR: Unexpected server error
        
    Example:
        >>> error = ErrorResponse(
        ...     error="Model not found",
        ...     error_code="MODEL_ERROR",
        ...     request_id="abc123"
        ... )
        >>> print(error.error_code)
        "MODEL_ERROR"
    """
    
    error: str = Field(
        ...,
        description="Human-readable error message"
    )
    error_code: str = Field(
        ...,
        description="Error code for categorization (e.g., MODEL_ERROR, TIMEOUT)"
    )
    request_id: Optional[str] = Field(
        None,
        description="Unique request identifier for tracing"
    )


class HealthResponse(BaseModel):
    """
    Response from the /health endpoint.
    
    Provides overall service health status and details about Ollama availability
    and the currently configured model.
    
    Attributes:
        status: Overall service status ('ok' or 'degraded')
        ollama_available: Whether Ollama service is responding
        model: Name of the currently configured model
        message: Human-readable status message
        
    Status Values:
        - 'ok': All services operational
        - 'degraded': Service running but some components unavailable
        
    Example:
        >>> health = HealthResponse(
        ...     status="ok",
        ...     ollama_available=True,
        ...     model="llama2",
        ...     message="Service is operational"
        ... )
        >>> print(health.status)
        "ok"
    """
    
    status: str = Field(
        ...,
        description="Overall status: 'ok' or 'degraded'"
    )
    ollama_available: bool = Field(
        ...,
        description="Whether Ollama is reachable and responding"
    )
    model: Optional[str] = Field(
        None,
        description="Name of current model"
    )
    message: Optional[str] = Field(
        None,
        description="Additional status message"
    )

