"""
Configuration management for ExpertVoice AI Agent.

Loads settings from environment variables with sensible defaults using
Pydantic BaseSettings for automatic validation and type safety.

Environment Variables:
    HOST: Server host (default: 0.0.0.0)
    PORT: Server port (default: 8000)
    DEBUG: Enable debug mode (default: False)
    CORS_ORIGINS: Comma-separated CORS origins
    OLLAMA_BASE_URL: Ollama service URL
    OLLAMA_MODEL: Model name to use
    OLLAMA_TIMEOUT: Model inference timeout in seconds
    OLLAMA_HEALTH_CHECK_TIMEOUT: Health check timeout in seconds
    MAX_PAYLOAD_SIZE: Max request payload size in bytes
    MAX_MESSAGES_PER_REQUEST: Max messages per request
    MAX_MESSAGE_LENGTH: Max length per message
    LOG_LEVEL: Logging level (DEBUG, INFO, WARNING, ERROR)
    SYSTEM_PROMPT: System prompt for the AI model
"""

from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings with automatic env-var loading and validation.
    
    Uses Pydantic BaseSettings for proper type safety and validation.
    All settings are loaded from environment variables or .env file.
    """

    # ========================================================================
    # API Configuration
    # ========================================================================
    host: str = Field(default="0.0.0.0", description="Server host address")
    port: int = Field(default=8000, description="Server port number")
    debug: bool = Field(default=False, description="Enable debug mode with auto-reload")

    # ========================================================================
    # CORS Configuration
    # ========================================================================
    cors_origins: str = Field(
        default="http://localhost:5173,http://localhost:3000",
        description="Comma-separated list of allowed CORS origins"
    )

    # ========================================================================
    # Ollama/Model Configuration
    # ========================================================================
    ollama_base_url: str = Field(
        default="http://localhost:11434",
        description="Base URL for Ollama API service"
    )
    ollama_model: str = Field(default="llama2", description="Name of the model to use")
    ollama_timeout: int = Field(
        default=20,
        description="Model inference timeout in seconds (optimized for 1-20 sec SLA)"
    )
    ollama_health_check_timeout: int = Field(
        default=5,
        description="Health check timeout in seconds"
    )

    # ========================================================================
    # Request Validation Configuration
    # ========================================================================
    max_payload_size: int = Field(
        default=102400,
        description="Maximum request payload size in bytes (100KB)"
    )
    max_messages_per_request: int = Field(
        default=50,
        description="Maximum messages allowed per request"
    )
    max_message_length: int = Field(
        default=10000,
        description="Maximum character length per message"
    )

    # ========================================================================
    # System Prompt Configuration
    # ========================================================================
    system_prompt: str = Field(
        default="You are a helpful AI Assistant. Answer questions clearly and concisely. Be friendly and professional.",
        description="System prompt that defines AI behavior"
    )

    # ========================================================================
    # Logging Configuration
    # ========================================================================
    log_level: str = Field(default="INFO", description="Logging level")

    # Pydantic configuration
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @field_validator("port")
    @classmethod
    def validate_port(cls, v: int) -> int:
        """Validate port is in valid range."""
        if not 1 <= v <= 65535:
            raise ValueError("Port must be between 1 and 65535")
        return v

    @field_validator("log_level")
    @classmethod
    def validate_log_level(cls, v: str) -> str:
        """Validate log level is supported."""
        valid_levels = {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}
        if v.upper() not in valid_levels:
            raise ValueError(f"Log level must be one of {valid_levels}")
        return v.upper()

    @property
    def cors_origins_list(self) -> List[str]:
        """
        Parse CORS origins from comma-separated string.
        
        Returns:
            List of CORS origin URLs, cached after first access
        """
        if not hasattr(self, "_cors_origins_list"):
            self._cors_origins_list = [
                origin.strip() for origin in self.cors_origins.split(",")
            ]
        return self._cors_origins_list


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Get cached settings instance (singleton pattern).
    
    Returns a singleton Settings instance to ensure all parts of the
    application use the same configuration object.
    
    Returns:
        Settings: Cached Settings instance
        
    Example:
        >>> settings = get_settings()
        >>> print(settings.ollama_model)
        "llama2"
    """
    return Settings()

