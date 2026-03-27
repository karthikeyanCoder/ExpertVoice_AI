import { createContext, useContext, useState, useCallback } from 'react'

const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [conversations, setConversations] = useState([])

  // Load conversations from localStorage on mount
  const loadConversations = useCallback(() => {
    try {
      const saved = localStorage.getItem('expertvoice_conversations')
      if (saved) {
        setConversations(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load conversations:', e)
    }
  }, [])

  // Save conversations to localStorage
  const saveConversations = useCallback((convs) => {
    try {
      localStorage.setItem('expertvoice_conversations', JSON.stringify(convs))
      setConversations(convs)
    } catch (e) {
      console.error('Failed to save conversations:', e)
    }
  }, [])

  // Add a message to current conversation
  const addMessage = useCallback((role, content) => {
    setMessages((prev) => [...prev, { role, content }])
  }, [])

  // Clear current conversation
  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  // Start new conversation
  const newConversation = useCallback(() => {
    if (messages.length > 0) {
      const convId = Date.now()
      const newConv = {
        id: convId,
        title: messages[0]?.content?.substring(0, 50) || 'Conversation',
        timestamp: new Date().toISOString(),
        messages: messages,
      }
      saveConversations([newConv, ...conversations])
    }
    clearMessages()
  }, [messages, conversations, saveConversations, clearMessages])

  const value = {
    messages,
    setMessages,
    addMessage,
    clearMessages,
    isLoading,
    setIsLoading,
    error,
    setError,
    conversations,
    newConversation,
    loadConversations,
    saveConversations,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}
