import { useState } from 'react'
import { cn } from '../lib/utils'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.content)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    }
  }

  // Parse markdown formatting
  const parseContent = (text) => {
    const parts = []
    let lastIndex = 0

    // Handle bold text with **text**
    const boldRegex = /\*\*(.*?)\*\*/g
    let match

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before bold
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
      }
      // Add bold text
      parts.push({ type: 'bold', content: match[1] })
      lastIndex = boldRegex.lastIndex
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) })
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }]
  }

  // Format content with line breaks and proper spacing
  const formatContent = (text) => {
    return text.split('\n').map((line, idx) => {
      const parsedParts = parseContent(line)
      const isCodeLine = line.trim().startsWith('```') || line.trim().startsWith('  ') || line.match(/^    /)
      const isEmpty = line.trim() === ''

      return (
        <div
          key={idx}
          className={cn(
            'leading-relaxed',
            isEmpty && 'h-2',
            isCodeLine && 'font-mono text-sm bg-foreground/5 px-3 py-2 rounded border border-border/20 my-1 overflow-x-auto'
          )}
        >
          {isEmpty ? (
            <span className="invisible">.</span>
          ) : (
            <>
              {parsedParts.map((part, pidx) =>
                part.type === 'bold' ? (
                  <strong key={pidx} className="font-semibold text-foreground">
                    {part.content}
                  </strong>
                ) : (
                  <span key={pidx}>{part.content}</span>
                )
              )}
            </>
          )}
        </div>
      )
    })
  }

  return (
    <div className={cn('flex mb-6 animate-fade-in gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
          EV
        </div>
      )}

      <div
        className={cn(
          'max-w-2xl rounded-lg',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-none px-4 py-3 shadow-sm'
            : 'bg-muted/50 text-foreground rounded-tl-none border border-border/60 px-4 py-4'
        )}
      >
        {/* Message Content */}
        <div className="text-sm md:text-base leading-relaxed font-normal space-y-1 break-words">
          {formatContent(message.content)}
        </div>

        {/* Voice Button for AI responses */}
        {!isUser && (
          <button
            onClick={handleSpeak}
            className={cn(
              'mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200',
              isSpeaking
                ? 'bg-primary text-primary-foreground'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            )}
          >
            <span>{isSpeaking ? '🔊' : '🔉'}</span>
            <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
          </button>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
          U
        </div>
      )}
    </div>
  )
}

