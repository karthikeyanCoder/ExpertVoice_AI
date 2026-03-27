import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatInput from '../components/ChatInput'
import MessageBubble from '../components/MessageBubble'
import Sidebar from '../components/Sidebar'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { chatAPI } from '../utils/api'

export default function ChatPage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [conversations, setConversations] = useState([])
  const [currentConvId, setCurrentConvId] = useState(null)
  const messagesEndRef = useRef(null)

  // Load conversations from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('expertvoice_conversations')
      if (saved) {
        setConversations(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load conversations:', e)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (userMessage) => {
    if (!userMessage.trim()) return

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)
    setError(null)

    try {
      const allMessages = [...messages, { role: 'user', content: userMessage }]
      const response = await chatAPI.sendMessage(allMessages)

      if (response.content) {
        setMessages((prev) => [...prev, { role: 'assistant', content: response.content }])
      }
    } catch (err) {
      console.error('Error sending message:', err)
      setError(
        err.response?.data?.detail ||
        'Failed to get response from AI. Please check if the backend is running.'
      )
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = useCallback(() => {
    // Save current conversation before creating new one
    if (messages.length > 0) {
      const convId = Date.now()
      const title = messages[0]?.content?.substring(0, 50) || 'Conversation'
      const newConv = {
        id: convId,
        title: title,
        timestamp: new Date().toISOString(),
        messages: messages,
      }
      
      const updated = [newConv, ...conversations]
      setConversations(updated)
      
      try {
        localStorage.setItem('expertvoice_conversations', JSON.stringify(updated))
      } catch (e) {
        console.error('Failed to save conversation:', e)
      }
    }
    
    // Clear for new chat
    setMessages([])
    setError(null)
    setCurrentConvId(null)
  }, [messages, conversations])

  const handleLoadConversation = useCallback((convId) => {
    const conv = conversations.find((c) => c.id === convId)
    if (conv) {
      setMessages(conv.messages)
      setCurrentConvId(convId)
      setError(null)
    }
  }, [conversations])

  const quickPrompts = [
    {
      icon: '💡',
      title: 'Explain a concept',
      description: 'Break down complex ideas simply',
      prompt: 'Explain quantum computing in simple terms',
    },
    {
      icon: '📝',
      title: 'Write something',
      description: 'Create content like poems, stories, code',
      prompt: 'Write a short poem about artificial intelligence',
    },
    {
      icon: '🤔',
      title: 'Answer a question',
      description: 'Get detailed answers to any question',
      prompt: 'How does photosynthesis work?',
    },
    {
      icon: '💻',
      title: 'Help with coding',
      description: 'Get programming help and explanations',
      prompt: 'How do I reverse a string in Python?',
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar 
        onNewChat={handleNewChat}
        conversations={conversations}
        onLoadConversation={handleLoadConversation}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm p-4 md:p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">ExpertVoice AI</h1>
            <p className="text-sm text-muted-foreground mt-1">Powered by Mistral • Local • Private</p>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-background/50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
              {/* Welcome Section */}
              <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 via-accent/30 to-primary/20 flex items-center justify-center">
                    <span className="text-3xl">✨</span>
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                  Welcome to ExpertVoice
                </h2>
                <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                  Your intelligent local AI assistant. Ask anything and get thoughtful responses instantly.
                </p>
              </div>

              {/* Quick Prompts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
                {quickPrompts.map((prompt, idx) => (
                  <Card
                    key={idx}
                    className="cursor-pointer hover:bg-muted/50 transition-colors group border-border/50"
                    onClick={() => handleSendMessage(prompt.prompt)}
                  >
                    <div className="p-4">
                      <div className="text-3xl mb-3">{prompt.icon}</div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {prompt.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{prompt.description}</p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Tips Section */}
              <div className="text-sm text-muted-foreground text-center space-y-2">
                <p className="flex items-center justify-center gap-2">
                  <span>💬</span>
                  <span>Click a card above or type your question to get started</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="space-y-8">
                {messages.map((msg, idx) => (
                  <MessageBubble key={idx} message={msg} />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-3 border border-border">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-destructive">
                    <p className="font-semibold text-sm mb-1">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  )
}

