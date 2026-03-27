import { useState } from 'react'
import { cn } from '../lib/utils'

export default function ChatInput({ onSendMessage, isLoading }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="border-t border-border bg-background p-4 md:p-6">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        {/* Modern Pill-shaped Input Container */}
        <div className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-full bg-muted/50 border border-border/60 transition-all duration-200',
          'focus-within:bg-muted focus-within:border-primary/40 focus-within:shadow-sm'
        )}>
          {/* Plus Icon */}
          <button
            type="button"
            disabled={isLoading}
            className="flex-shrink-0 p-1.5 hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add"
          >
            <span className="text-lg">+</span>
          </button>

          {/* Input Field */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask ExpertVoice anything..."
            disabled={isLoading}
            className={cn(
              'flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm md:text-base',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          />

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Attach Button */}
            <button
              type="button"
              disabled={isLoading}
              className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Attach files"
            >
              <span className="text-base">📎</span>
            </button>

            {/* Microphone Button */}
            <button
              type="button"
              disabled={isLoading}
              className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Voice input"
            >
              <span className="text-base">🎤</span>
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={cn(
                'flex-shrink-0 p-2 rounded-lg transition-all duration-200',
                isLoading || !input.trim()
                  ? 'bg-primary/40 text-primary-foreground/70 cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
              )}
              title="Send message"
            >
              {isLoading ? (
                <span className="text-base">⏳</span>
              ) : (
                <span className="text-base">→</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

