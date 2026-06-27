'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { getDailyMealPlan, getAlternativeMeal, getTodaySpotlight, type Meal, type UserProfile } from '@/lib/mealData'

const MOODS = ['😔', '😐', '🙂', '😄', '🤩']

const FOOD_IMAGES: Record<string, string> = {
  // Breakfast
  'b001': 'https://images.unsplash.com/photo-1630383249896-24c3b53fdbcb?w=400&h=300&fit=crop', // dosa
  'b002': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop', // omelette
  'b003': 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop', // poha
  'b004': 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=300&fit=crop', // cheela
  'b005': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop', // idli
  'b006': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', // paratha
  'b007': 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=400&h=300&fit=crop', // oats porridge
  'b008': 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop', // upma
  'b009': 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=300&fit=crop', // paneer bhurji
  'b010': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', // sprout salad
  'b011': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop', // ragi malt
  'b012': 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=300&fit=crop', // besan cheela
  // Lunch
  'l001': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', // palak dal
  'l002': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', // rajma chawal
  'l003': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', // egg curry
  'l004': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', // chole
  'l005': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop', // fish curry
  'l006': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', // sambhar
  'l007': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', // methi dal
  'l008': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', // kadhi
  'l009': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', // chicken curry
  'l010': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', // khichdi
  'l011': 'https://images.unsplash.com/photo-1631152073227-c4af2b7ad6c7?w=400&h=300&fit=crop', // palak paneer
  'l012': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', // sarson saag
  'l013': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', // bisi bele bath
  // Snacks
  's001': 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&h=300&fit=crop', // banana
  's002': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop', // amla juice
  's003': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop', // makhana
  's004': 'https://images.unsplash.com/photo-1576458088539-8e2e3f2ff625?w=400&h=300&fit=crop', // dry fruits
  's005': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop', // curd banana
  's006': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', // chana chaat
  's007': 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop', // dhokla
  's008': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop', // guava
  's009': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop', // seeds mix
  's010': 'https://images.unsplash.com/photo-1596097635121-14b38c5d7a27?w=400&h=300&fit=crop', // sweet potato
  's011': 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&h=300&fit=crop', // coconut water
  's012': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop', // turmeric milk
  // Dinner
  'd001': 'https://images.unsplash.com/photo-1631152073227-c4af2b7ad6c7?w=400&h=300&fit=crop', // ragi roti palak paneer
  'd002': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', // dal makhani
  'd003': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop', // fish curry
  'd004': 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop', // daliya
  'd005': 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=300&fit=crop', // paneer tikka
  'd006': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', // rasam rice
  'd007': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', // egg fried rice
  'd008': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', // aloo gobi
  'd009': 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=300&fit=crop', // tofu sabzi
  'd010': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', // chicken soup
  'd011': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', // beetroot dal
  'd012': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', // kootu
}

const getMealImage = (meal: Meal) => FOOD_IMAGES[meal.id] || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [meals, setMeals] = useState<{ breakfast: Meal; lunch: Meal; snack: Meal; dinner: Meal } | null>(null)
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [mood, setMood] = useState<number | null>(null)
  const [streak, setStreak] = useState(0)
  const spotlight = getTodaySpotlight()

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const uid = session.user.id
      setUser(session.user)

      const [{ data: defData }, { data: condData }, { data: allergyData }, { data: streakData }] = await Promise.all([
        supabase.from('user_deficiencies').select('deficiency_name').eq('user_id', uid),
        supabase.from('user_conditions').select('condition_name').eq('user_id', uid),
        supabase.from('user_allergies').select('allergy_name').eq('user_id', uid),
        supabase.from('streaks').select('current_streak').eq('user_id', uid).single(),
      ])

      const userProfile: UserProfile = {
        deficiencies: (defData?.map((d: any) => d.deficiency_name) || []) as any,
        conditions: (condData?.map((c: any) => c.condition_name) || []) as any,
        allergies: (allergyData?.map((a: any) => a.allergy_name) || []) as any,
        dietType: 'vegetarian',
      }

      setProfile(userProfile)
      setStreak(streakData?.current_streak || 0)
      setMeals(getDailyMealPlan(userProfile))
      // Add this inside loadData() after setMeals(getDailyMealPlan(userProfile))
const today = new Date().toISOString().split('T')[0]
const { data: logsData } = await supabase
  .from('daily_logs')
  .select('meal_id, completed')
  .eq('user_id', uid)
  .eq('log_date', today)

if (logsData && logsData.length > 0) {
  const savedCompleted: Record<string, boolean> = {}
  logsData.forEach((log: any) => {
    savedCompleted[log.meal_id] = log.completed
  })
  setCompleted(savedCompleted)
}
      setLoading(false)
    }
    loadData()
  }, [])
const toggleComplete = async (mealId: string) => {
  const newVal = !completed[mealId]
  setCompleted(prev => ({ ...prev, [mealId]: newVal }))

  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return

  const uid = session.user.id
  const today = new Date().toISOString().split('T')[0]

  // Save log
  await supabase.from('daily_logs').upsert({
    user_id: uid,
    meal_id: mealId,
    log_date: today,
    completed: newVal,
    completed_at: newVal ? new Date().toISOString() : null
  }, { onConflict: 'user_id,meal_id,log_date' })

  // Update streak if completing a meal
  if (newVal) {
    const { data: streakData } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', uid)
      .single()

    const lastActive = streakData?.last_active_date
    const currentStreak = streakData?.current_streak || 0
    const longestStreak = streakData?.longest_streak || 0

    const newStreak = lastActive === today ? currentStreak : currentStreak + 1
    const newLongest = Math.max(newStreak, longestStreak)

    await supabase.from('streaks').upsert({
      user_id: uid,
      current_streak: newStreak,
      longest_streak: newLongest,
      last_active_date: today
    }, { onConflict: 'user_id' })

    setStreak(newStreak)
  }
}

  const swapMeal = (mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner', currentId: string) => {
    if (!profile || !meals) return
    const alt = getAlternativeMeal(currentId, mealType, profile)
    setMeals(prev => prev ? { ...prev, [mealType]: alt } : prev)
  }

  const mealList = meals ? [
    { key: 'breakfast', meal: meals.breakfast },
    { key: 'lunch', meal: meals.lunch },
    { key: 'snack', meal: meals.snack },
    { key: 'dinner', meal: meals.dinner },
  ] : []

  const completedCount = mealList.filter(m => completed[m.meal.id]).length
  const progressPct = mealList.length > 0 ? Math.round((completedCount / mealList.length) * 100) : 0

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', fontSize: '18px', color: '#a43947' }}>
      Loading your plan... 🌱
    </div>
  )

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '13px', color: '#897172', marginBottom: '4px', fontWeight: '500' }}>TODAY'S REFLECTION</div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#231919', fontFamily: 'Plus Jakarta Sans, sans-serif', margin: 0 }}>
            {getGreeting()}, {user?.email?.split('@')[0]} ☀️
          </h1>
          <p style={{ color: '#897172', fontSize: '14px', marginTop: '4px' }}>
            {streak > 0 ? `Day ${streak} of your journey` : 'Day 1 of your journey'} &nbsp;·&nbsp; <em>"Patience is a seed of strength."</em>
          </p>
        </div>
        <div style={{ background: '#fee9e9', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', color: '#a43947', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🌿 {streak >= 30 ? 'Bloom' : streak >= 7 ? 'Sprout' : 'Seed'} Stage
        </div>
      </div>

      {/* Deficiency Tags */}
      {profile && profile.deficiencies.length > 0 && (
        <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#897172' }}>Your focus:</span>
          {profile.deficiencies.map(d => (
            <span key={d} style={{ padding: '4px 12px', borderRadius: '20px', background: '#fee9e9', color: '#a43947', fontSize: '12px', fontWeight: '600' }}>
              {d}
            </span>
          ))}
          {profile.conditions.length > 0 && profile.conditions.map(c => (
            <span key={c} style={{ padding: '4px 12px', borderRadius: '20px', background: '#f5f0ff', color: '#635882', fontSize: '12px', fontWeight: '600' }}>
              {c}
            </span>
          ))}
        </div>
      )}

      {/* Top Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', marginBottom: '24px' }}>

        {/* Journey Progress */}
        <div style={{ background: 'linear-gradient(135deg, #f5f0ff, #fff0f8)', borderRadius: '24px', padding: '28px', border: '1px solid #e8e0ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px', color: '#231919' }}>Today's Progress</div>
              <div style={{ fontSize: '13px', color: '#897172', marginTop: '2px' }}>
                {completedCount === 0 ? 'Start your first meal today!' : `${completedCount} of ${mealList.length} meals done`}
              </div>
            </div>
            <span style={{ fontSize: '20px' }}>🎯</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <div style={{ position: 'relative', width: '140px', height: '140px' }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" fill="none" stroke="#e8e0ff" strokeWidth="10" />
                <circle cx="70" cy="70" r="60" fill="none" stroke="#a43947" strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 60}`}
                  strokeDashoffset={`${2 * Math.PI * 60 * (1 - progressPct / 100)}`}
                  strokeLinecap="round" transform="rotate(-90 70 70)" />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px' }}>🌿</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#a43947', marginTop: '2px' }}>{progressPct}%</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: '#a43947', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '16px' }}>🌱</span>
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '13px', color: '#231919' }}>
                {mealList.length - completedCount} more meals to complete
              </div>
              <div style={{ fontSize: '12px', color: '#897172' }}>Meals based on your ICMR-NIN profile</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid #fee9e9', flex: 1 }}>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#231919', marginBottom: '10px' }}>⚡ Your Focus This Week</div>
            <p style={{ fontSize: '13px', color: '#897172', lineHeight: '1.6' }}>
              {profile && profile.deficiencies.length > 0
                ? `Meals are targeting your ${profile.deficiencies.slice(0, 2).join(' and ')} deficiency based on ICMR-NIN 2020 guidelines.`
                : 'Complete onboarding to get personalized meal recommendations.'
              }
            </p>
            {profile && profile.allergies.length > 0 && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#635882', background: '#f5f0ff', padding: '8px 12px', borderRadius: '10px' }}>
                🚫 Excluding: {profile.allergies.join(', ')}
              </div>
            )}
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid #fee9e9' }}>
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#231919', marginBottom: '14px', textAlign: 'center' }}>How's your mood?</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {MOODS.map((m, i) => (
                <button key={i} onClick={() => setMood(i)} style={{
                  fontSize: '24px', background: mood === i ? '#fee9e9' : 'transparent',
                  border: mood === i ? '2px solid #a43947' : '2px solid transparent',
                  borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                }}>{m}</button>
              ))}
            </div>
            {mood !== null && (
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#897172', marginTop: '10px' }}>Noura is listening 💗</div>
            )}
          </div>
        </div>
      </div>

      {/* Today's Meals */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontWeight: '700', fontSize: '18px', color: '#231919' }}>
            Today's Kitchen 🌿
          </span>
          <span style={{ fontSize: '12px', color: '#897172' }}>
            Based on ICMR-NIN 2020 · NIN IFCT 2017
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {mealList.map(({ key, meal }) => (
            <div key={meal.id} style={{
              background: 'white', borderRadius: '20px', overflow: 'hidden',
              border: '1px solid #fee9e9', opacity: completed[meal.id] ? 0.75 : 1, transition: 'all 0.3s'
            }}>
              <div style={{ position: 'relative' }}>
                <img
                src={getMealImage(meal)}
                  alt={meal.name}
                  style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.9)', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: '600', color: '#231919' }}>
                  {meal.label}
                </div>
                {completed[meal.id] && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(164,57,71,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>✅</div>
                )}
              </div>
              <div style={{ padding: '14px' }}>
                <div style={{ fontWeight: '600', fontSize: '13px', color: '#231919', marginBottom: '6px', lineHeight: '1.4' }}>
                  {meal.name}
                </div>
                <div style={{ fontSize: '11px', color: '#897172', marginBottom: '8px', lineHeight: '1.4' }}>
                  {meal.icmrNote.slice(0, 60)}...
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                  {meal.deficiencies.slice(0, 2).map(d => (
                    <span key={d} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: '#fee9e9', color: '#a43947', fontWeight: '600' }}>
                      {d}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => swapMeal(key as any, meal.id)}
                    style={{ flex: 1, padding: '8px', borderRadius: '12px', border: '1px solid #ddc0c0', background: 'transparent', fontSize: '12px', fontWeight: '600', color: '#897172', cursor: 'pointer' }}>
                    ↔ Swap
                  </button>
                  <button
                    onClick={() => toggleComplete(meal.id)}
                    style={{ flex: 1, padding: '8px', borderRadius: '12px', border: 'none', background: completed[meal.id] ? '#ddc0c0' : '#a43947', fontSize: '12px', fontWeight: '600', color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {completed[meal.id] ? 'Done ✓' : 'Complete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deficiency Scores */}
      {profile && profile.deficiencies.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontWeight: '700', fontSize: '18px', color: '#231919', marginBottom: '16px' }}>Nutrition Focus Areas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(profile.deficiencies.length, 4)}, 1fr)`, gap: '16px' }}>
            {profile.deficiencies.map(d => (
              <div key={d} style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid #fee9e9', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>
                  {d.includes('B12') ? '💊' : d.includes('Iron') ? '🩸' : d.includes('Vitamin D') ? '☀️' :
                   d.includes('Calcium') ? '🦴' : d.includes('Folate') ? '🥬' : d.includes('Magnesium') ? '⚡' :
                   d.includes('Zinc') ? '🔬' : d.includes('Vitamin C') ? '🍊' : d.includes('Omega') ? '🐟' :
                   d.includes('Vitamin A') ? '🥕' : d.includes('Vitamin E') ? '🌻' : d.includes('Potassium') ? '🍌' : '💊'}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#231919', marginBottom: '8px' }}>{d}</div>
                <div style={{ fontSize: '12px', color: '#a43947', fontWeight: '600', marginBottom: '8px' }}>
                  {completedCount > 0 ? `${Math.min(completedCount * 25, 100)}%` : 'Start eating!'}
                </div>
                <div style={{ height: '6px', borderRadius: '9999px', background: '#fee9e9' }}>
                  <div style={{ height: '100%', borderRadius: '9999px', background: '#a43947', width: completedCount > 0 ? `${Math.min(completedCount * 25, 100)}%` : '0%', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ingredient Spotlight */}
      <div style={{ borderRadius: '24px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid #fee9e9', marginBottom: '28px' }}>
        <img src={spotlight.image} alt={spotlight.name} style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }} />
        <div style={{ background: 'white', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', color: '#897172', marginBottom: '12px' }}>🌿 INGREDIENT SPOTLIGHT</div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#231919', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '12px' }}>
            {spotlight.emoji} {spotlight.name}
          </h2>
          <p style={{ fontSize: '14px', color: '#897172', lineHeight: '1.7', marginBottom: '16px' }}>{spotlight.description}</p>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#564243', marginBottom: '8px' }}>SUPPORTS</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {spotlight.supports.map(tag => (
                <span key={tag} style={{ padding: '4px 12px', borderRadius: '20px', background: '#fee9e9', color: '#a43947', fontSize: '12px', fontWeight: '600' }}>{tag}</span>
              ))}
            </div>
          </div>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#564243', marginBottom: '8px' }}>WAYS TO ENJOY</div>
          {spotlight.ways.map(way => (
            <div key={way} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#897172', marginBottom: '6px' }}>
              <span style={{ color: '#a43947' }}>✓</span> {way}
            </div>
          ))}
          <div style={{ marginTop: '12px', fontSize: '11px', color: '#897172', fontStyle: 'italic' }}>
            📚 {spotlight.icmrNote}
          </div>
        </div>
      </div>

      {/* Streak Banner */}
      <div style={{ background: 'linear-gradient(135deg, #a43947, #ff7e8b)', borderRadius: '24px', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
        <div>
          <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'Plus Jakarta Sans' }}>
            {streak > 0 ? `🔥 ${streak} Day Streak!` : '🌱 Start Your Streak Today!'}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.85, marginTop: '4px' }}>
            {streak > 0 ? `Keep it up — you're doing amazing!` : 'Log your first meal to begin your streak!'}
          </div>
        </div>
        <div style={{ fontSize: '48px' }}>{streak >= 7 ? '🏆' : '🌟'}</div>
      </div>

      {/* ICMR Disclaimer */}
      <div style={{ marginTop: '24px', padding: '16px', background: '#f5f0ff', borderRadius: '16px', fontSize: '12px', color: '#635882', lineHeight: '1.6' }}>
        <strong>📚 Data Sources:</strong> Meal recommendations are based on ICMR Dietary Guidelines for Indians 2024, NIN Indian Food Composition Tables (IFCT) 2017, and ICMR-NIN Recommended Dietary Allowances 2020.
        <br />⚠️ This app provides general nutrition guidance only and is not a substitute for medical advice. Always consult a registered dietitian or doctor before making dietary changes.
      </div>

    </div>
  )
}