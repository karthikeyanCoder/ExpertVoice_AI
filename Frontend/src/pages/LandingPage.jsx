import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardTitle } from '../components/ui/Card'

export default function LandingPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: '🧠',
      title: 'Intelligent AI',
      description: 'Advanced language models for thoughtful, accurate responses',
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Get responses in seconds, not minutes',
    },
    {
      icon: '🔒',
      title: 'Completely Private',
      description: 'Your data never leaves your machine',
    },
    {
      icon: '🎤',
      title: 'Voice & Text',
      description: 'Ask questions however you prefer',
    },
  ]

  const benefits = [
    {
      number: '1',
      title: 'Ask Anything',
      description: 'From creative writing to coding help, get instant answers',
    },
    {
      number: '2',
      title: 'Get Results Fast',
      description: 'Optimized models deliver responses in seconds',
    },
    {
      number: '3',
      title: 'Keep it Private',
      description: 'Everything stays local. No cloud, no tracking.',
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">EV</span>
            </div>
            <span className="font-semibold text-lg text-foreground">ExpertVoice</span>
          </div>
          <Button onClick={() => navigate('/chat')} size="md">
            Launch Chat
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Gradient Background Element */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05),rgba(0,0,0,0.5))]"></div>

          {/* Hero Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-5xl">✨</span>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
              Your Personal
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                AI Assistant
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Fast, private, intelligent. Run powerful local AI right on your machine.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              onClick={() => navigate('/chat')}
              size="lg"
              className="text-base"
            >
              Start Chatting
              <span>→</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base"
            >
              Learn More
            </Button>
          </div>

          {/* Trusted Badge */}
          <div className="pt-8 text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
              Run locally • No cloud dependency • No data collection
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 md:px-6 py-20 bg-card/30 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Designed for Excellence
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for intelligent conversations, built with care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="border-border/50 bg-background/50 hover:bg-background/80 transition-colors">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">{feature.title}</h3>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 md:px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple and Intuitive
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="relative">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary font-bold text-lg">
                      {benefit.number}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
                {idx < benefits.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-6 py-20 border-t border-border">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-muted-foreground">
            Start your conversation with ExpertVoice AI today
          </p>
          <Button
            onClick={() => navigate('/chat')}
            size="lg"
            className="text-base"
          >
            Launch Chat Now
            <span>→</span>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12 px-4 md:px-6 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 ExpertVoice AI. Built with privacy and excellence in mind.
          </p>
        </div>
      </footer>
    </div>
  )
}

