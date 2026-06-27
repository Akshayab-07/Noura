'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Leaf, Loader2, ChevronRight, Check, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const DEFICIENCIES = [
  { id: 'Vitamin B12', label: 'Vitamin B12', emoji: '💊' },
  { id: 'Vitamin D', label: 'Vitamin D', emoji: '☀️' },
  { id: 'Vitamin A', label: 'Vitamin A', emoji: '🥕' },
  { id: 'Vitamin C', label: 'Vitamin C', emoji: '🍊' },
  { id: 'Vitamin E', label: 'Vitamin E', emoji: '🌻' },
  { id: 'Vitamin K', label: 'Vitamin K', emoji: '🥦' },
  { id: 'Iron', label: 'Iron', emoji: '🩸' },
  { id: 'Calcium', label: 'Calcium', emoji: '🦴' },
  { id: 'Folate', label: 'Folate / Folic Acid', emoji: '🥬' },
  { id: 'Magnesium', label: 'Magnesium', emoji: '⚡' },
  { id: 'Zinc', label: 'Zinc', emoji: '🔬' },
  { id: 'Omega 3', label: 'Omega-3', emoji: '🐟' },
  { id: 'Iodine', label: 'Iodine', emoji: '🧂' },
  { id: 'Potassium', label: 'Potassium', emoji: '🍌' },
  { id: 'Selenium', label: 'Selenium', emoji: '🌾' },
  { id: 'Biotin', label: 'Biotin (B7)', emoji: '💇' },
  { id: 'Vitamin B6', label: 'Vitamin B6', emoji: '🥑' },
  { id: 'Phosphorus', label: 'Phosphorus', emoji: '🦷' },
]

const SYMPTOMS = [
  { id: 'tired', label: 'Tired often', emoji: '😴' },
  { id: 'hair_fall', label: 'Hair fall', emoji: '💇' },
  { id: 'muscle_weakness', label: 'Muscle weakness', emoji: '💪' },
  { id: 'frequent_illness', label: 'Frequent illness', emoji: '🤒' },
  { id: 'low_energy', label: 'Low energy', emoji: '🔋' },
  { id: 'pale_skin', label: 'Pale skin', emoji: '😶' },
  { id: 'bone_pain', label: 'Bone pain', emoji: '🦴' },
  { id: 'poor_concentration', label: 'Poor concentration', emoji: '🧠' },
  { id: 'mood_swings', label: 'Mood swings', emoji: '😤' },
  { id: 'slow_healing', label: 'Slow healing wounds', emoji: '🩹' },
  { id: 'dry_skin', label: 'Dry skin', emoji: '🧴' },
  { id: 'brittle_nails', label: 'Brittle nails', emoji: '💅' },
  { id: 'night_blindness', label: 'Poor night vision', emoji: '👁️' },
  { id: 'cramps', label: 'Muscle cramps', emoji: '⚡' },
  { id: 'bleeding_gums', label: 'Bleeding gums', emoji: '🦷' },
]

const CONDITIONS = [
  { id: 'high_cholesterol', label: 'High Cholesterol', emoji: '❤️' },
  { id: 'gut_issues', label: 'Gut Issues / IBS', emoji: '🫁' },
  { id: 'anaemia', label: 'Anaemia', emoji: '🩸' },
  { id: 'pcos', label: 'PCOS', emoji: '🌸' },
  { id: 'thyroid', label: 'Thyroid', emoji: '🦋' },
  { id: 'diabetes', label: 'Diabetes', emoji: '💉' },
  { id: 'general_weakness', label: 'General Weakness', emoji: '⚡' },
  { id: 'hypertension', label: 'Hypertension', emoji: '🫀' },
  { id: 'arthritis', label: 'Arthritis', emoji: '🦵' },
  { id: 'osteoporosis', label: 'Osteoporosis', emoji: '🦴' },
  { id: 'kidney_issues', label: 'Kidney Issues', emoji: '🫘' },
  { id: 'liver_issues', label: 'Liver Issues', emoji: '🟟' },
  { id: 'migraine', label: 'Migraine', emoji: '🤯' },
  { id: 'skin_issues', label: 'Skin Issues / Acne', emoji: '✨' },
]

const ALLERGIES = [
  { id: 'lactose', label: 'Lactose Intolerant', emoji: '🥛' },
  { id: 'gluten', label: 'Gluten Intolerant', emoji: '🌾' },
  { id: 'nuts', label: 'Nut Allergy', emoji: '🥜' },
  { id: 'eggs', label: 'Egg Allergy', emoji: '🥚' },
  { id: 'soy', label: 'Soy Allergy', emoji: '🫘' },
  { id: 'shellfish', label: 'Shellfish Allergy', emoji: '🦐' },
  { id: 'fish', label: 'Fish Allergy', emoji: '🐟' },
  { id: 'sesame', label: 'Sesame Allergy', emoji: '🌱' },
  { id: 'mustard', label: 'Mustard Allergy', emoji: '🌿' },
  { id: 'coconut', label: 'Coconut Allergy', emoji: '🥥' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [knowsDeficiencies, setKnowsDeficiencies] = useState<boolean | null>(null)
  const [selectedDeficiencies, setSelectedDeficiencies] = useState<string[]>([])
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [inferredDeficiencies, setInferredDeficiencies] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])
  const [inferring, setInferring] = useState(false)
  const [showInferred, setShowInferred] = useState(false)
  const [saving, setSaving] = useState(false)

  const toggleItem = (list: string[], setList: (v: string[]) => void, id: string) => {
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id])
  }

  const handleInferDeficiencies = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error('Please select at least one symptom.')
      return
    }
    setInferring(true)
    try {
      const res = await fetch('/api/symptoms/infer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setInferredDeficiencies(data.deficiencies || [])
      setSelectedDeficiencies(data.deficiencies || [])
      setShowInferred(true)
    } catch {
      toast.error('AI is taking too long. Try again in a moment.')
    } finally {
      setInferring(false)
    }
  }

  const handleFinish = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user }, error: userAuthError } = await supabase.auth.getUser()

      console.log("AUTH ERROR:", userAuthError)
      console.log("USER:", user)

      if (!user) {
        router.push('/login')
        return
      }

      const uid = user.id

      const deficiencyPromises = selectedDeficiencies.map(async (d) => {
        const { error } = await supabase
          .from('user_deficiencies')
          .upsert({ user_id: uid, deficiency_name: d }, { onConflict: 'user_id,deficiency_name' })
        if (error) console.error(`DEFICIENCY ERROR [${d}]:`, JSON.stringify(error, null, 2))
      })

      const conditionPromises = selectedConditions.map(async (c) => {
        const { error } = await supabase
          .from('user_conditions')
          .upsert({ user_id: uid, condition_name: c }, { onConflict: 'user_id,condition_name' })
        if (error) console.error(`CONDITION ERROR [${c}]:`, JSON.stringify(error, null, 2))
      })

      const allergyPromises = selectedAllergies.map(async (a) => {
        const { error } = await supabase
          .from('user_allergies')
          .upsert({ user_id: uid, allergy_name: a }, { onConflict: 'user_id,allergy_name' })
        if (error) console.error(`ALLERGY ERROR [${a}]:`, JSON.stringify(error, null, 2))
      })

      await Promise.all([...deficiencyPromises, ...conditionPromises, ...allergyPromises])

      const { error: usersError } = await supabase
        .from('users')
        .update({ onboarding_complete: true })
        .eq('id', uid)

      console.log("USERS UPDATE ERROR:", usersError)

      const { error: streakError } = await supabase
        .from('streaks')
        .upsert(
          {
            user_id: uid,
            current_streak: 0,
            longest_streak: 0,
            last_active_date: new Date().toISOString().split('T')[0],
          },
          { onConflict: 'user_id' }
        )

      console.log("STREAK ERROR:", streakError)

      toast.success('Profile saved!')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error("HANDLE FINISH ERROR:", error)
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-surface/90 backdrop-blur-md border-b border-outline-variant/40 sticky top-0 z-40">
        <div className="page-container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Leaf className="w-4 h-4 text-on-primary" />
            </div>
            <span className="font-headline text-xl font-bold text-primary">Noura</span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-1">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  step > s ? 'bg-primary text-on-primary' :
                  step === s ? 'bg-primary text-on-primary ring-4 ring-primary/20' :
                  'bg-surface-container text-on-surface-variant'
                )}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && <div className={cn('w-8 h-0.5 transition-colors', step > s ? 'bg-primary' : 'bg-outline-variant')} />}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 page-container py-10 max-w-2xl">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <span className="text-5xl mb-4 block">🧬</span>
              <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-background mb-3">
                Do you know your deficiencies?
              </h1>
              <p className="text-on-surface-variant">
                Step 1 of 3 — This helps us build your personalized meal plan
              </p>
            </div>

            {knowsDeficiencies === null && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setKnowsDeficiencies(true)}
                  className="card hover-lift text-left border-2 border-transparent hover:border-primary/30 transition-all"
                >
                  <span className="text-3xl mb-3 block">✅</span>
                  <h3 className="font-headline font-semibold text-on-surface mb-1">Yes, I know them</h3>
                  <p className="text-sm text-on-surface-variant">I have test results or have been diagnosed</p>
                </button>
                <button
                  onClick={() => setKnowsDeficiencies(false)}
                  className="card hover-lift text-left border-2 border-transparent hover:border-primary/30 transition-all"
                >
                  <span className="text-3xl mb-3 block">🤔</span>
                  <h3 className="font-headline font-semibold text-on-surface mb-1">No, show me symptoms</h3>
                  <p className="text-sm text-on-surface-variant">I'll describe how I feel and AI will figure it out</p>
                </button>
              </div>
            )}

            {knowsDeficiencies === true && (
              <div className="animate-fade-in">
                <h2 className="font-headline text-lg font-semibold text-on-surface mb-4">
                  Select your deficiencies:
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {DEFICIENCIES.map(d => (
                    <button
                      key={d.id}
                      onClick={() => toggleItem(selectedDeficiencies, setSelectedDeficiencies, d.id)}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all text-left',
                        selectedDeficiencies.includes(d.id)
                          ? 'border-primary bg-primary-container/30 text-primary'
                          : 'border-outline-variant text-on-surface hover:border-primary/40'
                      )}
                    >
                      <span>{d.emoji}</span>
                      <span className="text-xs">{d.label}</span>
                      {selectedDeficiencies.includes(d.id) && <Check className="w-3 h-3 ml-auto flex-shrink-0" />}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button className="btn-ghost" onClick={() => setKnowsDeficiencies(null)}>Back</button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={selectedDeficiencies.length === 0}
                    className="btn-primary flex items-center gap-2 flex-1 justify-center disabled:opacity-50"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {knowsDeficiencies === false && !showInferred && (
              <div className="animate-fade-in">
                <h2 className="font-headline text-lg font-semibold text-on-surface mb-2">
                  How have you been feeling? (Pick up to 5)
                </h2>
                <p className="text-sm text-on-surface-variant mb-4">Select your most common symptoms</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {SYMPTOMS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        if (!selectedSymptoms.includes(s.id) && selectedSymptoms.length >= 5) {
                          toast.error('Select up to 5 symptoms')
                          return
                        }
                        toggleItem(selectedSymptoms, setSelectedSymptoms, s.id)
                      }}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all text-left',
                        selectedSymptoms.includes(s.id)
                          ? 'border-primary bg-primary-container/30 text-primary'
                          : 'border-outline-variant text-on-surface hover:border-primary/40'
                      )}
                    >
                      <span>{s.emoji}</span>
                      <span className="text-xs">{s.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button className="btn-ghost" onClick={() => setKnowsDeficiencies(null)}>Back</button>
                  <button
                    onClick={handleInferDeficiencies}
                    disabled={inferring || selectedSymptoms.length === 0}
                    className="btn-primary flex items-center gap-2 flex-1 justify-center disabled:opacity-50"
                  >
                    {inferring
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Analysing...</>
                      : <>Analyse with AI <ChevronRight className="w-4 h-4" /></>
                    }
                  </button>
                </div>
              </div>
            )}

            {knowsDeficiencies === false && showInferred && (
              <div className="animate-fade-in">
                <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-5 mb-5">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-tertiary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-on-surface-variant">
                      <strong className="text-on-surface">⚠️ This is not medical advice.</strong> Please confirm with a doctor.
                    </p>
                  </div>
                  <h3 className="font-headline font-semibold text-on-surface mb-3">
                    Based on your symptoms, you may have:
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {inferredDeficiencies.map(d => (
                      <span key={d} className="badge-primary px-3 py-1.5 text-sm font-semibold rounded-full">
                        {DEFICIENCIES.find(x => x.id === d)?.emoji} {d}
                      </span>
                    ))}
                  </div>
                </div>

                <h2 className="font-headline text-base font-semibold text-on-surface mb-3">Edit if needed:</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {DEFICIENCIES.map(d => (
                    <button
                      key={d.id}
                      onClick={() => toggleItem(selectedDeficiencies, setSelectedDeficiencies, d.id)}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all text-left',
                        selectedDeficiencies.includes(d.id)
                          ? 'border-primary bg-primary-container/30 text-primary'
                          : 'border-outline-variant text-on-surface hover:border-primary/40'
                      )}
                    >
                      <span>{d.emoji}</span>
                      <span className="text-xs">{d.label}</span>
                      {selectedDeficiencies.includes(d.id) && <Check className="w-3 h-3 ml-auto flex-shrink-0" />}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button className="btn-ghost" onClick={() => setShowInferred(false)}>Back</button>
                  <button
                    onClick={() => setStep(2)}
                    className="btn-primary flex items-center gap-2 flex-1 justify-center"
                  >
                    Looks right, continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <span className="text-5xl mb-4 block">🏥</span>
              <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-background mb-3">
                Any other conditions?
              </h1>
              <p className="text-on-surface-variant">Step 2 of 3 — Optional. This helps us avoid problematic foods.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {CONDITIONS.map(c => (
                <button
                  key={c.id}
                  onClick={() => toggleItem(selectedConditions, setSelectedConditions, c.id)}
                  className={cn(
                    'flex items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-all text-left',
                    selectedConditions.includes(c.id)
                      ? 'border-primary bg-primary-container/30 text-primary'
                      : 'border-outline-variant text-on-surface hover:border-primary/40'
                  )}
                >
                  <span className="text-xl">{c.emoji}</span>
                  <span className="text-xs">{c.label}</span>
                  {selectedConditions.includes(c.id) && <Check className="w-3 h-3 ml-auto flex-shrink-0" />}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button
                onClick={() => setStep(3)}
                className="btn-primary flex items-center gap-2 flex-1 justify-center"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              className="w-full text-center text-sm text-on-surface-variant mt-3 hover:text-primary transition-colors"
              onClick={() => setStep(3)}
            >
              Skip — I have no conditions
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <span className="text-5xl mb-4 block">🚫</span>
              <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-background mb-3">
                Any food allergies?
              </h1>
              <p className="text-on-surface-variant">Step 3 of 3 — Optional. We'll exclude these from your meal plan.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {ALLERGIES.map(a => (
                <button
                  key={a.id}
                  onClick={() => toggleItem(selectedAllergies, setSelectedAllergies, a.id)}
                  className={cn(
                    'flex items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-all text-left',
                    selectedAllergies.includes(a.id)
                      ? 'border-primary bg-primary-container/30 text-primary'
                      : 'border-outline-variant text-on-surface hover:border-primary/40'
                  )}
                >
                  <span className="text-xl">{a.emoji}</span>
                  <span className="text-xs">{a.label}</span>
                  {selectedAllergies.includes(a.id) && <Check className="w-3 h-3 ml-auto flex-shrink-0" />}
                </button>
              ))}
            </div>

            <div className="bg-surface-container-low rounded-2xl p-4 mb-6">
              <h3 className="font-semibold text-on-surface text-sm mb-2">Your Profile Summary:</h3>
              <div className="space-y-1 text-sm text-on-surface-variant">
                <p>🧬 Deficiencies: {selectedDeficiencies.length > 0 ? selectedDeficiencies.join(', ') : 'None selected'}</p>
                <p>🏥 Conditions: {selectedConditions.length > 0 ? selectedConditions.join(', ') : 'None'}</p>
                <p>🚫 Allergies: {selectedAllergies.length > 0 ? selectedAllergies.join(', ') : 'None'}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="btn-ghost" onClick={() => setStep(2)}>Back</button>
              <button
                onClick={handleFinish}
                disabled={saving}
                className="btn-primary flex items-center gap-2 flex-1 justify-center disabled:opacity-50"
              >
                {saving
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                  : <>🎉 Finish Setup</>
                }
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}