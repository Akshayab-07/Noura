'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Leaf, Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Login failed. Check your email and password.')
        } else {
          toast.error('Login failed. Please try again.')
        }
        return
      }
      toast.success('Welcome back!')
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-brand flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary-container/30 organic-shape-1 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary-container/40 organic-shape-2 blur-2xl" />
        </div>

        <div className="relative z-10 text-center max-w-sm">
          <div className="text-8xl mb-6 animate-float">🥗</div>
          <h2 className="font-headline text-3xl font-bold text-on-background mb-4">
            Welcome back to your nutrition journey
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Your personalized Indian meal plan is waiting. Let&apos;s get you eating right for your deficiencies.
          </p>

          {/* Floating stats */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-soft text-left">
              <p className="text-2xl font-bold text-primary font-headline">87%</p>
              <p className="text-xs text-on-surface-variant mt-1">users see improvement in 4 weeks</p>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-soft text-left">
              <p className="text-2xl font-bold text-primary font-headline">Indian</p>
              <p className="text-xs text-on-surface-variant mt-1">foods only — dal, roti, sabzi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Leaf className="w-4 h-4 text-on-primary" />
            </div>
            <span className="font-headline text-xl font-bold text-primary">Noura</span>
          </Link>

          <div className="mb-8">
            <h1 className="font-headline text-3xl font-bold text-on-background mb-2">Log in</h1>
            <p className="text-on-surface-variant">Continue your nutrition journey</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="input pr-12"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors p-1"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="login-btn"
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Sign up free
            </Link>
          </p>

          <p className="text-center text-xs text-outline mt-8">
            ⚠️ This app is for nutrition guidance only. Not medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}
