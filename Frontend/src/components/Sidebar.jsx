import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/Button'
import { cn } from '../lib/utils'

export default function Sidebar({ onNewChat, conversations = [], onLoadConversation = () => {} }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-40 p-2 hover:bg-muted rounded-lg transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:static w-64 h-screen bg-card border-r border-border flex flex-col z-30 transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">EV</span>
            </div>
            <span className="font-semibold text-foreground hidden md:inline">ExpertVoice</span>
          </div>

          <Button
            onClick={() => {
              onNewChat()
              setIsOpen(false)
            }}
            className="w-full"
            size="md"
          >
            <span>+ New Chat</span>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-3 mt-2">
            Recent Chats
          </div>

          {/* Recent Conversations */}
          {conversations.length > 0 ? (
            <div className="space-y-1">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    onLoadConversation(conv.id)
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors group"
                  title={conv.title}
                >
                  <div className="text-sm font-medium text-foreground truncate group-hover:text-primary">
                    {conv.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(conv.timestamp).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground px-3 py-6 text-center">
              No conversations yet
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border space-y-1">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="w-full justify-start text-sm"
            size="md"
          >
            <span>🏠</span>
            <span>Home</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}

