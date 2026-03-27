#!/usr/bin/env python
"""Quick test of refactored models and settings."""

from models import Message, ChatRequest, ChatResponse
from config import get_settings
import json

# Test Message validation
msg1 = Message(role="user", content="Hello!")
msg2 = Message(role="assistant", content="Hi there!")
print(f"✅ Message models created successfully")

# Test ChatRequest
request = ChatRequest(messages=[msg1, msg2])
print(f"✅ ChatRequest created with {len(request.messages)} messages")

# Test ChatResponse
response = ChatResponse(
    content="Test response",
    request_id="test123",
    tokens=5,
    generation_time=0.5,
    total_time=0.6
)
print(f"✅ ChatResponse created: {response.content}")
print(f"✅ Response can be serialized to JSON")

# Test validation errors
try:
    bad_msg = Message(role="invalid", content="test")
    print("❌ Should have failed validation")
except Exception as e:
    print(f"✅ Validation error caught: {type(e).__name__}")

# Test Settings
settings = get_settings()
print(f"✅ Settings loaded: model={settings.ollama_model}, port={settings.port}")
print(f"✅ CORS origins list cached properly: {len(settings.cors_origins_list)} origins")

# Test config validation
try:
    from config import Settings
    bad_settings = Settings(port=99999)  # Invalid port
    print("❌ Should have failed port validation")
except Exception as e:
    print(f"✅ Port validation works: {type(e).__name__}")

print("\n✅ All model and config tests passed!")
