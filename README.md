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



## 📄 License

This project is open source and available under the **MIT License**. Feel free to use, modify, and distribute it freely.

---



## 📧 Questions or Feedback?

Have ideas for improvements? Found a bug? Feel free to open an issue or reach out!

---

**Built with ❤️ by Karthikeyan M**
