'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { MEALS, type Meal, type UserProfile } from '@/lib/mealData'

type GroceryItem = {
  ingredient: string
  meals: string[]
  checked: boolean
  category: string
}

const CATEGORY_CONFIG = [
  { key: 'vegetables', label: '🥬 Fresh Produce', color: '#e8f5e9', border: '#a5d6a7', text: '#2e7d32',
    keywords: ['spinach', 'methi', 'tomato', 'onion', 'carrot', 'capsicum', 'cauliflower', 'potato', 'beetroot', 'sweet potato', 'cucumber', 'drumstick', 'yam', 'raw banana', 'bathua', 'sarson leaves', 'spring onion', 'celery'] },
  { key: 'lentils', label: '🫘 Lentils & Legumes', color: '#fff3e0', border: '#ffcc80', text: '#e65100',
    keywords: ['toor dal', 'moong dal', 'masoor dal', 'chana dal', 'urad dal', 'rajma', 'chickpeas', 'black chana', 'black dal', 'moong sprouts', 'chana sprouts', 'besan', 'chana'] },
  { key: 'grains', label: '🌾 Grains & Flours', color: '#fce4ec', border: '#f48fb1', text: '#880e4f',
    keywords: ['ragi flour', 'rice', 'brown rice', 'whole wheat flour', 'bajra flour', 'jowar flour', 'makki flour', 'semolina', 'daliya', 'flattened rice', 'oats', 'rolled oats', 'broken wheat'] },
  { key: 'dairy', label: '🥛 Dairy', color: '#e3f2fd', border: '#90caf9', text: '#0d47a1',
    keywords: ['milk', 'curd', 'paneer', 'butter', 'cream', 'ghee', 'almond butter', 'peanut butter'] },
  { key: 'fruits', label: '🍌 Fruits', color: '#fffde7', border: '#fff176', text: '#f57f17',
    keywords: ['banana', 'guava', 'amla', 'lemon', 'orange', 'mango', 'raisins', 'brazil nuts'] },
  { key: 'nuts', label: '🥜 Nuts & Seeds', color: '#f3e5f5', border: '#ce93d8', text: '#6a1b9a',
    keywords: ['almonds', 'walnuts', 'cashews', 'peanuts', 'pumpkin seeds', 'sunflower seeds', 'flaxseeds', 'til', 'sesame', 'chia seeds', 'almond butter', 'peanut butter'] },
  { key: 'spices', label: '🧂 Spices & Condiments', color: '#fbe9e7', border: '#ffab91', text: '#bf360c',
    keywords: ['turmeric', 'cumin', 'mustard seeds', 'curry leaves', 'ginger', 'garlic', 'green chilli', 'coriander', 'ajwain', 'garam masala', 'chaat masala', 'tamarind', 'pepper', 'cardamom', 'black pepper', 'rock salt', 'salt', 'jaggery', 'honey', 'iodized salt'] },
  { key: 'protein', label: '🥚 Protein', color: '#e8eaf6', border: '#9fa8da', text: '#1a237e',
    keywords: ['eggs', 'tofu', 'chicken', 'fish', 'rohu fish', 'pomfret'] },
  { key: 'other', label: '🛒 Other Items', color: '#f5f5f5', border: '#e0e0e0', text: '#424242',
    keywords: [] },
]

function categorize(ingredient: string): string {
  const lower = ingredient.toLowerCase()
  for (const cat of CATEGORY_CONFIG) {
    if (cat.keywords.some(k => lower.includes(k) || k.includes(lower))) return cat.key
  }
  return 'other'
}

function getWeekGroceries(profile: UserProfile): GroceryItem[] {
  const userAllergies = profile.allergies.map(a => a.toLowerCase())
  const userConditions = profile.conditions
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  const types: ('breakfast' | 'lunch' | 'snack' | 'dinner')[] = ['breakfast', 'lunch', 'snack', 'dinner']
  const weekMeals: Meal[] = []

  for (let day = 0; day < 7; day++) {
    for (let t = 0; t < types.length; t++) {
      const type = types[t]
      const seed = dayOfYear + day + t
      let filtered = MEALS.filter(m =>
        m.type === type &&
        !m.contains.some(a => userAllergies.includes(a)) &&
        !m.avoidFor.some(c => userConditions.includes(c as any)) &&
        m.dietType !== 'non-vegetarian'
      )
      if (filtered.length === 0) filtered = MEALS.filter(m => m.type === type)
      const scored = filtered.map(m => {
        let score = 0
        m.deficiencies.forEach(d => { if (profile.deficiencies.includes(d as any)) score += 2 })
        return { meal: m, score }
      })
      scored.sort((a, b) => b.score - a.score)
      const top = scored.slice(0, Math.max(3, Math.ceil(scored.length * 0.5)))
      const picked = top[seed % top.length]?.meal || filtered[0]
      if (picked) weekMeals.push(picked)
    }
  }

  const ingredientMap: Record<string, Set<string>> = {}
  weekMeals.forEach(meal => {
    meal.ingredients.forEach(ingredient => {
      const key = ingredient.toLowerCase()
      if (!ingredientMap[key]) ingredientMap[key] = new Set()
      ingredientMap[key].add(meal.name)
    })
  })

  return Object.entries(ingredientMap).map(([ingredient, meals]) => ({
    ingredient: ingredient.charAt(0).toUpperCase() + ingredient.slice(1),
    meals: Array.from(meals),
    checked: false,
    category: categorize(ingredient),
  })).sort((a, b) => a.ingredient.localeCompare(b.ingredient))
}

export default function GroceryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [groceries, setGroceries] = useState<GroceryItem[]>([])
  const [weekRange, setWeekRange] = useState('')

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

      const profile: UserProfile = {
        deficiencies: (defData?.map((d: any) => d.deficiency_name) || []) as any,
        conditions: (condData?.map((c: any) => c.condition_name) || []) as any,
        allergies: (allergyData?.map((a: any) => a.allergy_name) || []) as any,
        dietType: 'vegetarian',
      }

      // Week range label
      const today = new Date()
      const start = new Date(today)
      start.setDate(today.getDate() - today.getDay() + 1)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      const rangeString = `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
      setWeekRange(rangeString)

      // Generate the fresh grocery structural data
      const generatedGroceries = getWeekGroceries(profile)

      // Hydrate checked states from LocalStorage if matched with the current week range key
      try {
        const savedProgress = localStorage.getItem(`grocery_progress_${rangeString}`)
        if (savedProgress) {
          const checkedMap: Record<string, boolean> = JSON.parse(savedProgress)
          generatedGroceries.forEach(item => {
            if (checkedMap[item.ingredient] !== undefined) {
              item.checked = checkedMap[item.ingredient]
            }
          })
        }
      } catch (e) {
        console.error('Error hydrating grocery checklist state:', e)
      }

      setGroceries(generatedGroceries)
      setLoading(false)
    }
    load()
  }, [router])

  // Helper sync to keep localStorage updated whenever the state adjustments shift
  const saveToStorage = (updatedList: GroceryItem[]) => {
    if (!weekRange) return
    const checkedMap = updatedList.reduce((acc, item) => {
      acc[item.ingredient] = item.checked
      return acc;
    }, {} as Record<string, boolean>)
    localStorage.setItem(`grocery_progress_${weekRange}`, JSON.stringify(checkedMap))
  }

  const toggleItem = (ingredient: string) => {
    setGroceries(prev => {
      const next = prev.map(g => g.ingredient === ingredient ? { ...g, checked: !g.checked } : g)
      saveToStorage(next)
      return next
    })
  }

  const checkAllItems = () => {
    setGroceries(prev => {
      const next = prev.map(g => ({ ...g, checked: true }))
      saveToStorage(next)
      return next
    })
  }

  const resetListItems = () => {
    setGroceries(prev => {
      const next = prev.map(g => ({ ...g, checked: false }))
      saveToStorage(next)
      return next
    })
  }

  const checkedCount = groceries.filter(g => g.checked).length
  const totalCount = groceries.length

  const categorized: Record<string, GroceryItem[]> = {}
  groceries.forEach(item => {
    if (!categorized[item.category]) categorized[item.category] = []
    categorized[item.category].push(item)
  })

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#a43947', fontSize: '18px' }}>
      Building your grocery list... 🛒
    </div>
  )

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #fff0f0, #f5f0ff)',
        borderRadius: '24px', padding: '28px 32px',
        marginBottom: '28px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        border: '1px solid #fee9e9'
      }}>
        <div>
          <div style={{ fontSize: '13px', color: '#897172', fontWeight: '600', marginBottom: '4px' }}>
            NOURISH YOUR GROWTH
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#231919', fontFamily: 'Plus Jakarta Sans, sans-serif', margin: 0 }}>
            Your Market List 🛒
          </h1>
          <p style={{ color: '#897172', fontSize: '13px', marginTop: '6px' }}>
            Personalized from your 7-day meal plan
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', color: '#a43947', border: '1px solid #fee9e9', marginBottom: '8px' }}>
            📅 Week of {weekRange}
          </div>
          <div style={{ fontSize: '12px', color: '#897172' }}>
            {checkedCount}/{totalCount} items collected
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ height: '8px', borderRadius: '9999px', background: '#fee9e9', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '9999px',
            background: 'linear-gradient(90deg, #a43947, #ff7e8b)',
            width: totalCount > 0 ? `${(checkedCount / totalCount) * 100}%` : '0%',
            transition: 'width 0.4s ease'
          }} />
        </div>
        {checkedCount === totalCount && totalCount > 0 && (
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', fontWeight: '700', color: '#a43947' }}>
            🎉 All items collected! You\'re ready to cook!
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
        <button
          onClick={checkAllItems}
          style={{ flex: 1, padding: '12px', borderRadius: '14px', border: 'none', background: '#a43947', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
        >
          ✓ Check All
        </button>
        <button
          onClick={resetListItems}
          style={{ flex: 1, padding: '12px', borderRadius: '14px', border: '1px solid #ddc0c0', background: 'white', color: '#897172', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
        >
          ↺ Reset List
        </button>
      </div>

      {/* Categorized Sections */}
      {CATEGORY_CONFIG.map(cat => {
        const items = categorized[cat.key]
        if (!items || items.length === 0) return null
        return (
          <div key={cat.key} style={{ marginBottom: '24px' }}>
            {/* Category Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: cat.color, border: `1px solid ${cat.border}`,
              borderRadius: '14px', padding: '12px 16px', marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{cat.label.split(' ')[0]}</span>
                <span style={{ fontWeight: '700', fontSize: '14px', color: cat.text }}>
                  {cat.label.split(' ').slice(1).join(' ')}
                </span>
              </div>
              <span style={{
                background: cat.border, color: cat.text,
                borderRadius: '20px', padding: '2px 10px',
                fontSize: '12px', fontWeight: '700'
              }}>
                {items.length} items
              </span>
            </div>

            {/* Items Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {items.map(item => (
                <div
                  key={item.ingredient}
                  onClick={() => toggleItem(item.ingredient)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: item.checked ? '#f0fff8' : 'white',
                    border: item.checked ? '1.5px solid #A8E6CF' : '1px solid #fee9e9',
                    borderRadius: '14px', padding: '12px 14px',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                    border: item.checked ? 'none' : '2px solid #ddc0c0',
                    background: item.checked ? '#a43947' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {item.checked && <span style={{ color: 'white', fontSize: '13px' }}>✓</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '13px', fontWeight: '600',
                      color: item.checked ? '#897172' : '#231919',
                      textDecoration: item.checked ? 'line-through' : 'none',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {item.ingredient}
                    </div>
                    <div style={{ fontSize: '11px', color: '#897172', marginTop: '2px' }}>
                      {item.meals.length} meal{item.meals.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Seed to Thrive Benefit Box */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '0', borderRadius: '24px', overflow: 'hidden',
        border: '1px solid #fee9e9', marginBottom: '24px'
      }}>
        <img
          src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop"
          alt="Fresh produce"
          style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ background: 'white', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#635882', letterSpacing: '1px', marginBottom: '10px' }}>
            🌱 THE NOURISH BENEFIT
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#231919', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '10px' }}>
            Your list is rich in nutrients
          </h3>
          <p style={{ fontSize: '13px', color: '#897172', lineHeight: '1.6', marginBottom: '16px' }}>
            This week's ingredients are specifically chosen to target your deficiency profile, helping stabilize your energy and nutrition levels.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['High Fibre', 'Iron Rich', 'Anti-inflammatory'].map(tag => (
              <span key={tag} style={{ padding: '4px 12px', borderRadius: '20px', background: '#fee9e9', color: '#a43947', fontSize: '12px', fontWeight: '600' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: '16px', background: '#f5f0ff', borderRadius: '16px', fontSize: '12px', color: '#635882', lineHeight: '1.6' }}>
        📚 <strong>Data Sources:</strong> ICMR Dietary Guidelines 2024 · NIN IFCT 2017
        <br />⚠️ Grocery list is auto-generated from your personalized meal plan. Quantities are approximate.
      </div>
    </div>
  )
}