'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { getDailyMealPlan, getAlternativeMeal, type Meal, type UserProfile } from '@/lib/mealData'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

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

type DayPlan = {
  breakfast: Meal
  lunch: Meal
  snack: Meal
  dinner: Meal
}

export default function MealPlanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>([])
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const uid = session.user.id
      const [{ data: defData }, { data: condData }, { data: allergyData }] = await Promise.all([
        supabase.from('user_deficiencies').select('deficiency_name').eq('user_id', uid),
        supabase.from('user_conditions').select('condition_name').eq('user_id', uid),
        supabase.from('user_allergies').select('allergy_name').eq('user_id', uid),
      ])

      const userProfile: UserProfile = {
        deficiencies: (defData?.map((d: any) => d.deficiency_name) || []) as any,
        conditions: (condData?.map((c: any) => c.condition_name) || []) as any,
        allergies: (allergyData?.map((a: any) => a.allergy_name) || []) as any,
        dietType: 'vegetarian',
      }

      setProfile(userProfile)

      // Generate 7 days of meals using different seeds
      const plans: DayPlan[] = DAYS.map((_, dayIndex) => {
        const today = new Date()
        const dayOfYear = Math.floor(
          (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
        )
        const seed = dayOfYear + dayIndex

        return {
          breakfast: getMealForDay('breakfast', userProfile, seed),
          lunch: getMealForDay('lunch', userProfile, seed + 1),
          snack: getMealForDay('snack', userProfile, seed + 2),
          dinner: getMealForDay('dinner', userProfile, seed + 3),
        }
      })

      setWeekPlan(plans)
      setLoading(false)
    }
    load()
  }, [])

  const swapMeal = (dayIndex: number, mealType: keyof DayPlan, currentId: string) => {
    if (!profile) return
    const alt = getAlternativeMeal(currentId, mealType, profile)
    setWeekPlan(prev => {
      const updated = [...prev]
      updated[dayIndex] = { ...updated[dayIndex], [mealType]: alt }
      return updated
    })
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#a43947', fontSize: '18px' }}>
      Building your week... 🌱
    </div>
  )

  const todayPlan = weekPlan[selectedDay]

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#231919', fontFamily: 'Plus Jakarta Sans, sans-serif', margin: 0 }}>
          Weekly Meal Plan 🗓️
        </h1>
        <p style={{ color: '#897172', fontSize: '14px', marginTop: '4px' }}>
          Personalized based on your deficiencies · ICMR-NIN 2020 backed
        </p>
      </div>

      {/* Day Selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px' }}>
        {DAYS.map((day, i) => {
          const isToday = i === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
          const isSelected = i === selectedDay
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(i)}
              style={{
                padding: '10px 20px',
                borderRadius: '20px',
                border: 'none',
                background: isSelected ? '#a43947' : isToday ? '#fee9e9' : '#f5f5f5',
                color: isSelected ? 'white' : isToday ? '#a43947' : '#897172',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              {day.slice(0, 3)} {isToday && !isSelected ? '· Today' : ''}
            </button>
          )
        })}
      </div>

      {/* Selected Day Meals */}
      {todayPlan && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map(mealType => {
            const meal = todayPlan[mealType]
            return (
              <div key={mealType} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #fee9e9' }}>
                <div style={{ position: 'relative' }}>
                  <img src={getMealImage(meal)} alt={meal.name} style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.9)', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: '600', color: '#231919' }}>
                    {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#231919', marginBottom: '8px' }}>{meal.name}</div>
                  <div style={{ fontSize: '12px', color: '#897172', marginBottom: '10px', lineHeight: '1.5' }}>{meal.description}</div>

                  {/* Deficiency badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                    {meal.deficiencies.slice(0, 3).map(d => (
                      <span key={d} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: '#fee9e9', color: '#a43947', fontWeight: '600' }}>{d}</span>
                    ))}
                  </div>

                  {/* Ingredients */}
                  <div style={{ fontSize: '11px', color: '#897172', marginBottom: '12px' }}>
                    <span style={{ fontWeight: '600', color: '#564243' }}>Ingredients: </span>
                    {meal.ingredients.join(', ')}
                  </div>

                  {/* ICMR note */}
                  <div style={{ fontSize: '11px', color: '#635882', background: '#f5f0ff', padding: '8px', borderRadius: '10px', marginBottom: '12px', lineHeight: '1.5' }}>
                    📚 {meal.icmrNote.slice(0, 80)}...
                  </div>

                  <button
                    onClick={() => swapMeal(selectedDay, mealType, meal.id)}
                    style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ddc0c0', background: 'transparent', fontSize: '12px', fontWeight: '600', color: '#897172', cursor: 'pointer' }}
                  >
                    ↔ Swap Meal
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Week Overview */}
      <div>
        <h2 style={{ fontWeight: '700', fontSize: '18px', color: '#231919', marginBottom: '16px' }}>Week Overview</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {DAYS.map((day, i) => {
            const plan = weekPlan[i]
            if (!plan) return null
            const isToday = i === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
            const isSelected = i === selectedDay
            return (
              <div
                key={day}
                onClick={() => setSelectedDay(i)}
                style={{
                  background: isSelected ? '#fff0f0' : 'white',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  border: isSelected ? '1.5px solid #a43947' : '1px solid #fee9e9',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: isSelected ? '#a43947' : '#231919', minWidth: '90px' }}>
                    {day} {isToday ? '(Today)' : ''}
                  </div>
                  {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map(mt => (
                    <div key={mt} style={{ flex: 1, minWidth: '120px' }}>
                      <div style={{ fontSize: '10px', color: '#897172', fontWeight: '600', textTransform: 'uppercase' }}>{mt}</div>
                      <div style={{ fontSize: '12px', color: '#231919', fontWeight: '500', marginTop: '2px' }}>{plan[mt].name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ marginTop: '24px', padding: '16px', background: '#f5f0ff', borderRadius: '16px', fontSize: '12px', color: '#635882', lineHeight: '1.6' }}>
        📚 <strong>Data Sources:</strong> ICMR Dietary Guidelines 2024 · NIN IFCT 2017 · ICMR-NIN RDA 2020
        <br />⚠️ Not medical advice. Consult a registered dietitian before making dietary changes.
      </div>
    </div>
  )
}

// Helper to get meal for specific day with different seed
function getMealForDay(type: 'breakfast' | 'lunch' | 'snack' | 'dinner', profile: UserProfile, seed: number): Meal {
  const { getDailyMealPlan } = require('@/lib/mealData')
  
  // Temporarily override date seed by creating offset
  const allMeals = require('@/lib/mealData').MEALS
  const userAllergies = profile.allergies.map((a: string) => a.toLowerCase())
  const userConditions = profile.conditions

  let filtered = allMeals.filter((m: Meal) =>
    m.type === type &&
    !m.contains.some((a: string) => userAllergies.includes(a)) &&
    !m.avoidFor.some((c: string) => userConditions.includes(c)) &&
    m.dietType !== 'non-vegetarian'
  )

  if (filtered.length === 0) filtered = allMeals.filter((m: Meal) => m.type === type)

  const scored = filtered.map((m: Meal) => {
    let score = 0
    m.deficiencies.forEach((d: string) => { if (profile.deficiencies.includes(d as any)) score += 2 })
    m.safeFor.forEach((c: string) => { if (userConditions.includes(c as any)) score += 1 })
    return { meal: m, score }
  })

  scored.sort((a: any, b: any) => b.score - a.score)
  const top = scored.slice(0, Math.max(3, Math.ceil(scored.length * 0.5)))
  return top[seed % top.length]?.meal || filtered[0]
}