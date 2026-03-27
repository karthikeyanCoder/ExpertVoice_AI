"""
Structured logging configuration.
Uses Python's logging module with JSON formatting for production.
"""

import logging
import json
from datetime import datetime
from typing import Optional


class JSONFormatter(logging.Formatter):
    """
    Format logs as JSON for easier parsing and analysis.
    
    Converts log records to JSON structure including timestamp, level, logger name,
    message, and optionally request_id for request tracing.
    """

    def format(self, record: logging.LogRecord) -> str:
        """
        Convert log record to JSON format.
        
        Args:
            record: The logging record to format
            
        Returns:
            JSON string representation of the log record
        """
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Add exception info if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        
        # Add extra fields if available
        if hasattr(record, "request_id"):
            log_data["request_id"] = record.request_id
        
        return json.dumps(log_data)


class PlainTextFormatter(logging.Formatter):
    """
    Format logs as human-readable plain text.
    
    Includes timestamp, logger name, level, optional request_id, and message.
    Handles cases where request_id may not be present.
    """

    def format(self, record: logging.LogRecord) -> str:
        """
        Convert log record to formatted plain text.
        
        Args:
            record: The logging record to format
            
        Returns:
            Formatted string with timestamp, level, request_id (if available), and message
        """
        # Build base format
        base_format = "%(asctime)s - %(name)s - %(levelname)s"
        
        # Add request_id if available
        if hasattr(record, "request_id"):
            format_str = base_format + " - [%(request_id)s]"
        else:
            format_str = base_format
        
        format_str += " - %(message)s"
        
        # Create a formatter with the appropriate format string
        formatter = logging.Formatter(format_str, datefmt="%Y-%m-%d %H:%M:%S")
        return formatter.format(record)


def configure_logging(
    level: str = "INFO",
    use_json: bool = False
) -> logging.Logger:
    """
    Configure application logging.
    
    Sets up the logger with either JSON or plain text formatting.
    Supports optional request_id injection for request tracing.
    
    Args:
        level: Logging level string (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        use_json: Whether to use JSON formatting (True for production)
        
    Returns:
        Configured logger instance ready for use
        
    Example:
        >>> logger = configure_logging(level="DEBUG", use_json=False)
        >>> logger.info("Server started")
        2024-01-15 10:30:45 - main - INFO - Server started
    """
    logger = logging.getLogger("main")
    logger.setLevel(getattr(logging, level, logging.INFO))
    
    # Remove existing handlers to avoid duplicates
    logger.handlers.clear()
    
    # Create console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(getattr(logging, level, logging.INFO))
    
    # Set appropriate formatter
    if use_json:
        formatter = JSONFormatter()
    else:
        formatter = PlainTextFormatter()
    
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    return logger


class RequestIdFilter(logging.Filter):
    """
    Filter that adds request_id to all logging records.
    
    Useful for request tracing - injects request_id into all log records
    so they can be correlated with the original request.
    """
    
    def __init__(self, request_id: str = "N/A") -> None:
        """
        Initialize the filter with a request_id.
        
        Args:
            request_id: The request ID to inject (defaults to 'N/A')
        """
        super().__init__()
        self.request_id = request_id
    
    def filter(self, record: logging.LogRecord) -> bool:
        """
        Add request_id to the log record.
        
        Args:
            record: The log record to annotate
            
        Returns:
            Always True to allow the record to be logged
        """
        # Only set if not already present (allows override)
        if not hasattr(record, "request_id"):
            record.request_id = self.request_id
        return True
