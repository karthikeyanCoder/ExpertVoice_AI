# ExpertVoice_AI 🎯

> A powerful **local AI Expert Assistant** with voice input & voice output. Dynamically adapts to any role—Teacher, Developer, Content Writer, Career Coach, or domain expert. Built with **React + FastAPI + Ollama** (fully offline & free).

---

## 📋 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Usage Examples](#usage-examples)
- [License](#license)

---

## 🎯 Overview

**ExpertVoice_AI** is a full-stack conversational AI application that brings the power of local language models to your desktop. Unlike cloud-based AI services, this application runs entirely on your machine—no data leaves your computer, no subscriptions required, and no internet dependency.

### Why ExpertVoice_AI?
- ✅ **100% Offline** — All processing happens locally. No data sent to external servers.
- ✅ **Free & Open Source** — No subscription fees, no API costs.
- ✅ **Multi-Role AI** — Seamlessly switch between expert personas (Teacher, Developer, Writer, Coach, etc.).
- ✅ **Voice-Enabled** — Ask questions via voice, receive answers via voice output.
- ✅ **Production-Ready** — Professional error handling, health monitoring, and request tracing.

---

## ⚡ Key Features

| Feature | Benefit |
|---------|---------|
| **Voice Input & Output** | Hands-free interaction—ask questions naturally, listen to responses. |
| **Adaptive AI Roles** | Get expert-level assistance tailored to your needs. |
| **Conversation History** | Persistent chat history with localStorage-based conversation management. |
| **Health Monitoring** | Built-in Ollama service health checks with caching. |
| **Request Validation** | Pydantic-based input validation for data integrity. |
| **Async Architecture** | Non-blocking, efficient API handling with FastAPI. |
| **Modern UI** | Clean, responsive frontend built with React and Tailwind CSS. |
| **CORS Support** | Secure cross-origin resource sharing for frontend-backend communication. |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER INTERFACE (Frontend)                  │
│                  React + Tailwind CSS + Vite                    │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐   │
│  │  Chat Interface │  │ Message History │  │   Sidebar    │   │
│  │  Voice Input    │  │  (localStorage) │  │  Chat List   │   │
│  │  Voice Output   │  │                 │  │              │   │
│  └────────┬────────┘  └─────────────────┘  └──────────────┘   │
└───────────┼────────────────────────────────────────────────────┘
            │ HTTP Requests (Chat API)
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API LAYER (Backend)                          │
│                  FastAPI + Async/Await                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Request Validation  │  Error Handling  │  Health Check │  │
│  │  (Pydantic Models)   │  CORS Middleware │  Caching      │  │
│  │                      │                   │              │  │
│  │  Request Tracing · Logging · Monitoring                 │  │
│  └─────────────────────────┬──────────────────────────────┘  │
└────────────────────────────┼───────────────────────────────────┘
                             │ HTTP Requests (Ollama API)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 LLM ENGINE (Ollama)                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │   Local Language Model (LLaMA, Mistral, etc.)         │   │
│  │   • No internet required                              │   │
│  │   • Privacy-preserving inference                      │   │
│  │   • Fast responses on local hardware                  │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow
1. **User Input** → Chat message or voice input captured in frontend
2. **API Request** → Frontend sends message to FastAPI backend
3. **Validation** → Backend validates request with Pydantic models
4. **Ollama Query** → Backend forwards message to local Ollama service
5. **AI Response** → Ollama processes with local LLM
6. **Response Return** → Backend returns AI response to frontend
7. **Display** → Frontend displays response + optional voice output

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — Modern, component-based UI framework
- **Vite** — Fast build tool and dev server
- **Tailwind CSS** — Utility-first CSS framework
- **React Router** — Client-side routing
- **Custom UI Components** — Button, Card, Input, etc.

### Backend
- **FastAPI** — High-performance async web framework
- **Uvicorn** — ASGI server for FastAPI
- **Pydantic** — Data validation and serialization
- **HTTPx** — Async HTTP client for Ollama communication
- **TikToken** — Token counting for language models
- **Python-dotenv** — Environment variable management

### AI/ML
- **Ollama** — Local LLM inference engine
- **Supported Models** — LLaMA 2, Mistral, and other compatible models

### DevOps & Tools
- **Git** — Version control
- **GitHub** — Repository hosting
- **Docker** (optional) — Containerization support

---

## 📁 Project Structure

```
ExpertVoice_AI/
├── Backend/                    # FastAPI server
│   ├── main.py                # Application entry point
│   ├── config.py              # Configuration management
│   ├── models.py              # Pydantic data models
│   ├── logging_config.py       # Logging setup
│   ├── requirements.txt        # Python dependencies
│   ├── test_models.py          # Model tests
│   ├── MIGRATION_GUIDE.md      # Upgrade instructions
│   └── .env                    # Environment variables
│
├── Frontend/                   # React application
│   ├── index.html              # Main HTML entry
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind setup
│   ├── package.json            # Node dependencies
│   │
│   └── src/
│       ├── main.jsx            # React entry point
│       ├── App.jsx             # Root component
│       ├── index.css           # Global styles
│       │
│       ├── pages/              # Page components
│       │   ├── ChatPage.jsx        # Main chat interface
│       │   └── LandingPage.jsx     # Landing page
│       │
│       ├── components/         # Reusable components
│       │   ├── ChatInput.jsx       # Message input box
│       │   ├── MessageBubble.jsx   # Chat message display
│       │   ├── Sidebar.jsx         # Conversation sidebar
│       │   └── ui/                 # UI primitives
│       │       ├── Button.jsx
│       │       ├── Card.jsx
│       │       └── Input.jsx
│       │
│       ├── context/            # React context
│       │   └── ChatContext.jsx     # Shared state management
│       │
│       ├── utils/              # Helper utilities
│       │   └── api.js              # API client functions
│       │
│       └── lib/                # Shared libraries
│           └── utils.js            # Utility functions
│
├── README.md                   # This file
├── LICENSE                     # License information
└── .gitignore                  # Git ignore rules
```

### Key Directories
- **Backend/** — REST API server handling all AI logic
- **Frontend/** — User-facing React application
- **Backend/models.py** — Chat request/response schemas
- **Frontend/context/ChatContext.jsx** — Global chat state
- **Frontend/utils/api.js** — API communication layer

---

## 🔄 How It Works

### 1. **User Sends a Message**
```
User types question in ChatInput → Message stored in React state
```

### 2. **Frontend API Call**
```
ChatPage.jsx calls chatAPI.sendMessage(userMessage)
→ HTTP POST to http://localhost:8000/api/chat
→ Request body: { "message": "...", "conversation_id": "..." }
```

### 3. **Backend Processing**
```
FastAPI receives request
→ Validates with ChatRequest Pydantic model
→ Logs request with unique tracing ID
→ Checks Ollama service health
→ Forwards message to Ollama API
```

### 4. **Ollama AI Processing**
```
Ollama receives message
→ Processes with local language model
→ Generates intelligent response based on context
```

### 5. **Response Flow Back**
```
Ollama returns AI response
→ Backend wraps in ChatResponse model
→ Returns JSON to frontend with response + metadata
```

### 6. **Frontend Display**
```
Frontend receives response
→ Shows AI message in MessageBubble component
→ Optionally plays voice output
→ Stores conversation in localStorage
→ Updates sidebar with conversation history
```

---

## 💡 Usage Examples

### Example 1: Ask as a Teacher
**User Input:**
> "Explain quantum entanglement in simple terms"

**AI Response (as Teacher):**
> "Imagine you have two coins that are mysteriously linked. When you flip one coin and it lands on heads, the other instantly becomes tails as well, no matter how far apart they are. That's similar to quantum entanglement..."

---

### Example 2: Ask as a Developer
**User Input:**
> "How do I optimize a React component that uses useEffect heavily?"

**AI Response (as Developer):**
> "Here are some optimization strategies:
> 1. Use useMemo to cache expensive computations
> 2. Split useEffect into multiple hooks...
> [Code examples follow]"

---

### Example 3: Voice Interaction
1. **Click microphone icon**
2. **Speak your question**: "What's the capital of France?"
3. **AI processes and responds**
4. **Voice output plays**: "The capital of France is Paris..."

---

## 📄 License

This project is open source and available under the **MIT License**. Feel free to use, modify, and distribute it freely.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve ExpertVoice_AI:

1. **Fork** the repository
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

---

## 📧 Questions or Feedback?

Have ideas for improvements? Found a bug? Feel free to open an issue or reach out!

---

**Built with ❤️ by the ExpertVoice Team**
