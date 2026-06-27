'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Leaf, Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dietType, setDietType] = useState<'vegetarian' | 'non-vegetarian'>('vegetarian')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { toast.error('Please enter your name.'); return }
    if (!email.trim()) { toast.error('Please enter your email.'); return }
    if (password.length < 6) { toast.error('Password must be at least 6 characters.'); return }

    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            diet_type: dietType,
          },
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('This email is already registered. Try logging in instead.')
        } else {
          toast.error('Could not create your account. Please try again.')
        }
        return
      }

      if (data.user) {
        // 1. Create the user profile record first and CRITICALLY wait for it to finish
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            name: name, // Fixed: Changed from full_name to name to match your database screenshot
            diet_type: dietType,
          })

        if (profileError) {
          console.error("Profile creation error:", profileError)
          toast.error('Account created, but failed to initialize profile.')
          return
        }

        // 2. If you have any code right below here inserting deficiencies/allergies, 
        // make sure it runs AFTER the profile insert above is successful.

        toast.success('Account created! Let\'s set up your profile.')
        router.push('/onboarding')
        router.refresh()
      }
    } catch (err) {
      console.error("Signup catch block error:", err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-brand flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary-container/30 organic-shape-1 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary-container/40 organic-shape-2 blur-2xl" />
        </div>

        <div className="relative z-10 text-center max-w-sm">
          <div className="text-8xl mb-6 animate-float">🌱</div>
          <h2 className="font-headline text-3xl font-bold text-on-background mb-4">
            Start your journey to better nutrition
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Tell us your deficiencies or describe your symptoms. Noura will build a personalized Indian meal plan just for you.
          </p>

          <div className="mt-8 space-y-3 text-left">
            {[
              '🧬 AI-powered deficiency detection',
              '🥗 7-day Indian meal plans',
              '📈 Weekly progress tracking',
              '🔔 Supplement reminders',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-surface-container-lowest rounded-xl px-4 py-3 shadow-soft">
                <span className="text-sm font-medium text-on-surface">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Leaf className="w-4 h-4 text-on-primary" />
            </div>
            <span className="font-headline text-xl font-bold text-primary">Noura</span>
          </Link>

          <div className="mb-8">
            <h1 className="font-headline text-3xl font-bold text-on-background mb-2">Create account</h1>
            <p className="text-on-surface-variant">Free forever. No credit card needed.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="name">
                Your name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Priya Sharma"
                className="input"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="signup-email">
                Email address
              </label>
              <input
                id="signup-email"
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
              <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="signup-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input pr-12"
                  autoComplete="new-password"
                  required
                  minLength={6}
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

            {/* Diet type */}
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">
                Diet Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="diet-vegetarian"
                  onClick={() => setDietType('vegetarian')}
                  className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                    dietType === 'vegetarian'
                      ? 'border-primary bg-primary-container/30 text-primary'
                      : 'border-outline-variant text-on-surface-variant hover:border-primary/50'
                  }`}
                >
                  🥦 Vegetarian
                </button>
                <button
                  type="button"
                  id="diet-non-vegetarian"
                  onClick={() => setDietType('non-vegetarian')}
                  className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                    dietType === 'non-vegetarian'
                      ? 'border-primary bg-primary-container/30 text-primary'
                      : 'border-outline-variant text-on-surface-variant hover:border-primary/50'
                  }`}
                >
                  🍗 Non-Vegetarian
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="signup-btn"
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Free Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Log in
            </Link>
          </p>

          <p className="text-center text-xs text-outline mt-8">
            ⚠️ This app provides nutrition guidance only. Always consult a doctor for medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}
