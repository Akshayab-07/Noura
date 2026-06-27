'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  Leaf, Zap, Brain, TrendingUp, Check, Star, 
  ArrowRight, ChevronDown, Menu, X,
  Apple, Salad, Heart, Shield
} from 'lucide-react'

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/40">
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Leaf className="w-4 h-4 text-on-primary" />
              </div>
              <span className="font-headline text-xl font-bold text-primary">Noura</span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold">
                How it Works
              </a>
              <a href="#features" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold">
                Features
              </a>
              <Link href="/login" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold">
                Login
              </Link>
              <Link href="/signup" className="btn-primary">
                Get Started
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-xl hover:bg-surface-container-low transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden py-4 border-t border-outline-variant/40 animate-fade-in">
              <div className="flex flex-col gap-3">
                <a href="#how-it-works" className="px-4 py-2 text-on-surface-variant text-sm font-semibold hover:text-primary" onClick={() => setMenuOpen(false)}>How it Works</a>
                <a href="#features" className="px-4 py-2 text-on-surface-variant text-sm font-semibold hover:text-primary" onClick={() => setMenuOpen(false)}>Features</a>
                <Link href="/login" className="px-4 py-2 text-on-surface-variant text-sm font-semibold" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link href="/signup" className="btn-primary text-center mx-4" onClick={() => setMenuOpen(false)}>Get Started Free</Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 px-4">
          {/* Background blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-container/20 organic-shape-1 blur-3xl animate-spin-slow" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary-container/30 organic-shape-2 blur-2xl" style={{animation: 'spin 40s linear infinite reverse'}} />
          </div>

          <div className="page-container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div className="flex flex-col gap-6 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-secondary-container/60 px-4 py-2 rounded-full w-fit">
                  <span className="text-lg">🌱</span>
                  <span className="text-on-secondary-container text-xs font-semibold">Gentle Growth Awaits</span>
                </div>

                <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-background leading-tight tracking-tight">
                  AI Nutrition Planner Built Around{' '}
                  <span className="text-gradient">YOUR Deficiencies</span>
                </h1>

                <p className="text-on-surface-variant text-lg leading-relaxed">
                  Fix Vitamin D, B12, Iron and more with personalized Indian meal plans. 
                  Most apps ask what&apos;s wrong with you. <strong className="text-on-surface">Noura figures it out.</strong>
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <Link href="/signup" className="btn-primary flex items-center justify-center gap-2 text-base py-4 px-8">
                    Start Free — No Card Needed
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a href="#how-it-works" className="btn-ghost flex items-center justify-center gap-2 text-base py-4 px-8">
                    See How It Works
                    <ChevronDown className="w-4 h-4" />
                  </a>
                </div>

                {/* Trust signals */}
                <div className="flex items-center gap-6 mt-2 flex-wrap">
                  <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                    <Check className="w-4 h-4 text-primary" />
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                    <Check className="w-4 h-4 text-primary" />
                    <span>Indian meal plans</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                    <Check className="w-4 h-4 text-primary" />
                    <span>AI-powered</span>
                  </div>
                </div>
              </div>

              {/* Right - Hero visual */}
              <div className="relative flex items-center justify-center h-[400px] lg:h-[500px]">
                {/* Main card */}
                <div className="relative bg-surface-container-lowest rounded-3xl p-6 shadow-hover w-72 animate-float">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center">
                      <span className="text-xl">🥗</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-on-surface">Today&apos;s Plan Ready!</p>
                      <p className="text-xs text-on-surface-variant">4 meals planned</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {['🌅 Poha with peanuts', '☀️ Dal with spinach', '🌙 Roti sabzi + dahi', '🍎 Banana + walnuts'].map((meal, i) => (
                      <div key={i} className="flex items-center gap-2 bg-surface-container-low rounded-xl px-3 py-2">
                        <span className="text-sm">{meal}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-outline-variant/40 flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant">Iron Score</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full w-4/5 bg-primary rounded-full" />
                      </div>
                      <span className="text-xs font-bold text-primary">80%</span>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute top-8 right-4 bg-surface-container-lowest rounded-2xl px-3 py-2 shadow-card animate-fade-in" style={{animationDelay: '0.2s'}}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    <span className="text-xs font-bold text-on-surface">7 Day Streak!</span>
                  </div>
                </div>

                <div className="absolute bottom-12 left-0 bg-surface-container-lowest rounded-2xl px-3 py-2 shadow-card animate-fade-in" style={{animationDelay: '0.4s'}}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    <span className="text-xs font-bold text-on-surface">B12 Improving</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section id="features" className="section bg-surface-container-low">
          <div className="page-container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-background mb-4">
                You Know Something&apos;s Wrong. But What Do You Eat?
              </h2>
              <p className="text-on-surface-variant text-lg">
                Breaking old habits is tough when the path isn&apos;t clear. Noura helps you navigate the common hurdles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Zap className="w-5 h-5" />, color: 'error', title: 'Constant Fatigue', desc: 'Crashing mid-afternoon? Iron and B12 deficiency could be the silent culprit.' },
                { icon: <Brain className="w-5 h-5" />, color: 'secondary', title: "Don't Know What to Eat", desc: 'Generic advice doesn\'t work. You need a plan built for YOUR deficiencies.' },
                { icon: <TrendingUp className="w-5 h-5" />, color: 'tertiary', title: 'No Way to Track', desc: 'Without tracking, how do you know if you\'re actually getting better?' },
                { icon: <Heart className="w-5 h-5" />, color: 'primary', title: 'Forget Supplements', desc: 'Smart reminders help you stay consistent with supplements and meals.' },
              ].map((item, i) => (
                <div key={i} className="card hover-lift">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    item.color === 'error' ? 'bg-error-container text-error' :
                    item.color === 'secondary' ? 'bg-secondary-container text-secondary' :
                    item.color === 'tertiary' ? 'bg-tertiary-container text-tertiary' :
                    'bg-primary-container text-primary'
                  }`}>
                    {item.icon}
                  </div>
                  <h3 className="font-headline text-base font-semibold text-on-surface mb-2">{item.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="section">
          <div className="page-container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-background mb-4">
                How Noura Works
              </h2>
              <p className="text-on-surface-variant text-lg">
                From your deficiencies to a full weekly meal plan — in under 3 minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', icon: '🧬', title: 'Tell Us About Yourself', desc: 'Enter your known deficiencies or describe your symptoms. Noura uses AI to figure out the rest.' },
                { step: '02', icon: '🤖', title: 'AI Builds Your Plan', desc: 'Gemini AI generates a 7-day Indian meal plan targeting exactly your deficiencies.' },
                { step: '03', icon: '✅', title: 'Track Daily', desc: 'Log each meal as you eat it. Mark it done in one tap. Watch your scores improve.' },
                { step: '04', icon: '📈', title: 'Improve Over Time', desc: 'Weekly progress charts and achievements show your nutrition journey growing.' },
              ].map((item, i) => (
                <div key={i} className="relative card hover-lift">
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-soft">
                    <span className="text-on-primary text-xs font-bold">{item.step}</span>
                  </div>
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <h3 className="font-headline text-lg font-semibold text-on-surface mb-2">{item.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Highlight */}
        <section className="section bg-gradient-brand">
          <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-background mb-6">
                  Everything You Need to Fix Your Nutrition
                </h2>
                <div className="space-y-4">
                  {[
                    { icon: <Apple className="w-5 h-5" />, title: 'Personalized Indian Meal Plans', desc: 'Dal, roti, idli, eggs, sabzi — real food you already love, optimized for your health.' },
                    { icon: <Salad className="w-5 h-5" />, title: 'Pinterest-Style Recipes', desc: 'Browse hundreds of deficiency-targeted recipes with filters by meal type and diet.' },
                    { icon: <Shield className="w-5 h-5" />, title: 'Smart Supplement Reminders', desc: 'Never forget your Vitamin D or B12 tablets with gentle daily reminders.' },
                    { icon: <TrendingUp className="w-5 h-5" />, title: 'Progress Charts & Streaks', desc: 'Visual charts show your Nutrition Score improving week over week.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-2xl shadow-soft">
                      <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-on-surface text-sm mb-1">{item.title}</h3>
                        <p className="text-on-surface-variant text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature visual */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'B12 Score', value: '72%', color: 'bg-primary-container', emoji: '💊' },
                  { label: 'Iron Score', value: '58%', color: 'bg-secondary-container', emoji: '🥬' },
                  { label: 'Vitamin D', value: '45%', color: 'bg-tertiary-container', emoji: '☀️' },
                  { label: 'Calcium', value: '84%', color: 'bg-surface-container', emoji: '🥛' },
                ].map((card, i) => (
                  <div key={i} className={`${card.color} rounded-2xl p-5 flex flex-col gap-3`}>
                    <span className="text-2xl">{card.emoji}</span>
                    <div>
                      <p className="text-xs text-on-surface-variant font-medium">{card.label}</p>
                      <p className="text-2xl font-bold text-on-surface font-headline">{card.value}</p>
                    </div>
                    <div className="h-2 bg-white/50 rounded-full">
                      <div 
                        className="h-full bg-primary/70 rounded-full transition-all" 
                        style={{ width: card.value }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      
        {/* Trust Section */}
<section className="py-12 bg-surface-container-low">
  <div className="page-container">
    <div className="text-center mb-8">
      <h2 className="font-headline text-2xl font-bold text-on-background mb-2">
        Backed by Verified Research
      </h2>
      <p className="text-on-surface-variant text-sm">
        Every meal recommendation is grounded in official Indian nutrition science
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        {
          icon: '🏛️',
          title: 'ICMR Dietary Guidelines 2024',
          desc: 'Indian Council of Medical Research — official dietary recommendations for Indians',
        },
        {
          icon: '🔬',
          title: 'NIN IFCT 2017',
          desc: 'National Institute of Nutrition — Indian Food Composition Tables with nutrient data for 856 Indian foods',
        },
        {
          icon: '📊',
          title: 'ICMR-NIN RDA 2020',
          desc: 'Recommended Dietary Allowances specific to Indian population including EAR values',
        },
      ].map((item, i) => (
        <div key={i} className="card text-center">
          <div className="text-4xl mb-4">{item.icon}</div>
          <h3 className="font-headline font-bold text-on-surface text-sm mb-2">{item.title}</h3>
          <p className="text-on-surface-variant text-xs leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
    <p className="text-center text-xs text-on-surface-variant mt-6">
      ⚠️ Noura provides general nutrition guidance only. Always consult a registered dietitian or doctor before making dietary changes.
    </p>
  </div>
</section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="page-container text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-primary mb-4">
              Ready to Fix Your Nutrition?
            </h2>
            <p className="text-on-primary/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of Indians who are fixing their vitamin deficiencies one meal at a time.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-on-primary text-primary px-8 py-4 rounded-full font-bold text-base hover:bg-primary-fixed-dim transition-all hover:-translate-y-0.5 shadow-hover">
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-outline-variant/40 bg-surface">
        <div className="page-container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-on-primary" />
            </div>
            <span className="font-headline font-bold text-primary">Noura</span>
          </div>
          <p className="text-on-surface-variant text-sm text-center">
  © 2026 Noura. Built with ❤️ for better nutrition.
  <br />
  <span className="text-xs">Data: ICMR Dietary Guidelines 2024 · NIN IFCT 2017 · ICMR-NIN RDA 2020 · Not medical advice.</span>
</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-on-surface-variant hover:text-primary text-sm transition-colors">Login</Link>
            <Link href="/signup" className="text-on-surface-variant hover:text-primary text-sm transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
