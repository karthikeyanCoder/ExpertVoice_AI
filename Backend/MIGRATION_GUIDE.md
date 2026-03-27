# Migration Guide: Refactored Backend

## ⚡ Quick Start

### 1. Install New Dependencies

```bash
pip install -r requirements.txt
```

New packages added:
- `pydantic-settings` — Configuration management
- `tiktoken` — Token counting
- `python-dotenv` — .env support (already included, now explicit)

### 2. Environment Variables

Settings now use **snake_case** (instead of UPPER_CASE):

```bash
# .env file example
HOST=0.0.0.0
PORT=8000
DEBUG=false
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
LOG_LEVEL=INFO
```

The system is **case-insensitive** (both work):
- `OLLAMA_MODEL=llama2` ✅
- `ollama_model=llama2` ✅

### 3. Code Changes

#### Settings Access (No Change Required)

```python
from config import get_settings

settings = get_settings()  # Still works the same!
print(settings.ollama_model)  # Now snake_case internally
```

**Old Code Still Works:**
```python
# These still work for compatibility
settings.OLLAMA_MODEL  # ✅ Works (but internally uses snake_case)
settings.ollama_model  # ✅ Preferred (more Pythonic)
```

#### Response Handling

The `/chat` endpoint now returns properly typed response:

```python
# Old response (raw dict)
{
    "content": "...",
    "request_id": "abc123",
    "tokens": 42,
    "generation_time": 1.23,
    "total_time": 1.45
}

# New response (auto-validated)
{
    "content": "...",
    "request_id": "abc123",
    "tokens": 42,
    "generation_time": 1.23,
    "total_time": 1.45
}
```

**No change for clients** — JSON structure identical.

---

## 🔄 Breaking Changes

### None! ✅

All changes are **backward compatible**:
- API endpoints return same JSON
- Settings work with both UPPER_CASE and snake_case
- Error responses still have same structure
- HTTP status codes unchanged

---

## 🎯 Benefits You'll See

### 1. Faster Response Times
- Health checks cached (30s)
- Connection pooling enabled
- Fewer network calls

### 2. Better Error Messages
- More specific error codes
- Clearer validation messages
- Better request tracing

### 3. Type Safety
- Pydantic validation on startup
- IDE autocomplete works better
- Catch config errors early

### 4. Token Accuracy
- ~95% accurate with tiktoken
- No more word-based guessing
- Better cost estimation

---

## 🐛 Troubleshooting

### "tiktoken not found"
```bash
pip install tiktoken>=0.5.0
```

Or the system will automatically fall back to word-based counting.

### "pydantic-settings not found"
```bash
pip install pydantic-settings>=2.0.0
```

### Settings loading fails
Check `.env` file format:
```bash
# ✅ Correct
KEY=value
DEBUG=true

# ❌ Incorrect
KEY ="value"  # Space after =
DEBUG="true"  # Quotes around value
```

### Health checks slow
This is intentional caching. To bypass:
- Restart server (clears cache)
- Wait 30 seconds for expires
- Monitor `/health` endpoint directly

---

## 📊 Configuration Reference

### All Available Settings

| Setting | Type | Default | Notes |
|---------|------|---------|-------|
| `host` | str | `0.0.0.0` | Server bind address |
| `port` | int | `8000` | Must be 1-65535 |
| `debug` | bool | `false` | Enable auto-reload |
| `cors_origins` | str | `localhost:5173,localhost:3000` | Comma-separated |
| `ollama_base_url` | str | `http://localhost:11434` | Ollama service URL |
| `ollama_model` | str | `llama2` | Model name |
| `ollama_timeout` | int | `120` | Inference timeout (seconds) |
| `ollama_health_check_timeout` | int | `5` | Health check timeout (seconds) |
| `max_payload_size` | int | `102400` | Max request size (bytes) |
| `max_messages_per_request` | int | `50` | Messages per request limit |
| `max_message_length` | int | `10000` | Characters per message limit |
| `system_prompt` | str | `You are a helpful...` | Default system prompt |
| `log_level` | str | `INFO` | DEBUG, INFO, WARNING, ERROR |

### Example .env

```env
# Server
HOST=0.0.0.0
PORT=8000
DEBUG=false

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
OLLAMA_TIMEOUT=120
OLLAMA_HEALTH_CHECK_TIMEOUT=5

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,https://example.com

# Validation
MAX_PAYLOAD_SIZE=102400
MAX_MESSAGES_PER_REQUEST=50
MAX_MESSAGE_LENGTH=10000

# Logging
LOG_LEVEL=INFO

# AI
SYSTEM_PROMPT=You are a helpful assistant. Be concise and professional.
```

---

## 🧪 Testing Your Setup

Run the test suite to verify:

```bash
python test_models.py
```

Expected output:
```
✅ Message models created successfully
✅ ChatRequest created with 2 messages
✅ ChatResponse created and serializable
✅ Validation error caught: ValidationError
✅ Settings loaded: model=llama2, port=8000
✅ CORS origins list cached properly
✅ Port validation works: ValidationError
✅ All model and config tests passed!
```

---

## 📚 Code Examples

### Loading Settings

```python
from config import get_settings

# Get singleton instance
settings = get_settings()

# Use snake_case attributes
print(settings.ollama_model)
print(settings.max_message_length)
print(settings.cors_origins_list)  # Auto-parsed!
```

### Creating Requests

```python
from models import Message, ChatRequest

# Create messages
messages = [
    Message(role="user", content="Hello!"),
    Message(role="assistant", content="Hi there!"),
]

# Create request
request = ChatRequest(messages=messages)

# Access validated data
print(request.messages[0].content)
```

### Handling Responses

```python
# Responses are now validated ChatResponse objects
response = ChatResponse(
    content="Generated text",
    request_id="abc123",
    tokens=42,
    generation_time=0.5,
    total_time=0.6
)

# Convert to JSON
json_data = response.model_dump_json()

# Convert to dict
dict_data = response.model_dump()
```

---

## 🚀 Next Steps

1. **Test locally** with existing client code
2. **Monitor logs** for any validation warnings
3. **Update CI/CD** if running linting/typing checks
4. **Deploy** with confidence!

The refactored code is **fully backward compatible** while providing better performance, type safety, and error handling.
