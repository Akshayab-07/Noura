'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { MEALS, type UserProfile, type Meal } from '@/lib/mealData'

type GroceryItem = {
  ingredient: string
  meals: string[]
  checked: boolean
}

function getWeekGroceries(profile: UserProfile): GroceryItem[] {
  const userAllergies = profile.allergies.map(a => a.toLowerCase())
  const userConditions = profile.conditions

  // Get filtered meals for the week (7 days x 4 meals)
  const weekMeals: Meal[] = []
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  )

  const types: ('breakfast' | 'lunch' | 'snack' | 'dinner')[] = ['breakfast', 'lunch', 'snack', 'dinner']

  for (let day = 0; day < 7; day++) {
    for (let t = 0; t < types.length; t++) {
      const type = types[t]
      const seed = dayOfYear + day + t

      let filtered = MEALS.filter(m =>
        m.type === type &&
        !m.contains.some(a => userAllergies.includes(a)) &&
        !m.avoidFor.some(c => userConditions.includes(c)) &&
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

  // Collect all ingredients and which meals they appear in
  const ingredientMap: Record<string, Set<string>> = {}

  weekMeals.forEach(meal => {
    meal.ingredients.forEach(ingredient => {
      const key = ingredient.toLowerCase()
      if (!ingredientMap[key]) ingredientMap[key] = new Set()
      ingredientMap[key].add(meal.name)
    })
  })

  // Convert to grocery list
  return Object.entries(ingredientMap)
    .map(([ingredient, meals]) => ({
      ingredient: ingredient.charAt(0).toUpperCase() + ingredient.slice(1),
      meals: Array.from(meals),
      checked: false,
    }))
    .sort((a, b) => a.ingredient.localeCompare(b.ingredient))
}

const CATEGORIES: Record<string, string[]> = {
  '🥬 Vegetables & Greens': ['spinach', 'methi leaves', 'methi', 'palak', 'tomato', 'onion', 'carrot', 'capsicum', 'cauliflower', 'potato', 'beetroot', 'sweet potato', 'cucumber', 'drumstick', 'yam', 'raw banana', 'bathua', 'sarson leaves'],
  '🫘 Lentils & Legumes': ['toor dal', 'moong dal', 'masoor dal', 'chana dal', 'urad dal', 'rajma', 'chickpeas', 'black chana', 'black dal', 'moong sprouts', 'chana sprouts'],
  '🌾 Grains & Flours': ['ragi flour', 'rice', 'brown rice', 'whole wheat flour', 'bajra flour', 'jowar flour', 'makki flour', 'semolina', 'daliya', 'flattened rice', 'oats', 'rolled oats', 'besan', 'broken wheat'],
  '🥛 Dairy': ['milk', 'curd', 'paneer', 'butter', 'cream', 'ghee'],
  '🥚 Eggs': ['eggs'],
  '🐟 Fish & Seafood': ['rohu fish', 'pomfret or tilapia', 'fish'],
  '🌰 Nuts & Seeds': ['almonds', 'walnuts', 'cashews', 'peanuts', 'pumpkin seeds', 'sunflower seeds', 'flaxseeds', 'til', 'sesame', 'chia seeds'],
  '🍌 Fruits': ['banana', 'guava', 'amla', 'lemon', 'orange', 'mango', 'raisins'],
  '🧂 Spices & Condiments': ['turmeric', 'cumin', 'mustard seeds', 'curry leaves', 'ginger', 'garlic', 'green chilli', 'coriander', 'ajwain', 'garam masala', 'chaat masala', 'tamarind', 'pepper', 'cardamom', 'black pepper', 'rock salt', 'salt', 'jaggery', 'honey'],
  '🛢️ Oils & Others': ['oil', 'mustard oil', 'coconut', 'coconut milk', 'soy sauce', 'tofu', 'spring onion', 'celery', 'peanut butter'],
}

function categorizeIngredient(ingredient: string): string {
  const lower = ingredient.toLowerCase()
  for (const [category, items] of Object.entries(CATEGORIES)) {
    if (items.some(item => lower.includes(item) || item.includes(lower))) {
      return category
    }
  }
  return '🛒 Other Items'
}

export default function GroceryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [groceries, setGroceries] = useState<GroceryItem[]>([])
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null)

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

      setGroceries(getWeekGroceries(profile))
      setLoading(false)
    }
    load()
  }, [])

  const toggleItem = (ingredient: string) => {
    setGroceries(prev =>
      prev.map(g => g.ingredient === ingredient ? { ...g, checked: !g.checked } : g)
    )
  }

  const checkedCount = groceries.filter(g => g.checked).length
  const totalCount = groceries.length

  // Group by category
  const categorized: Record<string, GroceryItem[]> = {}
  groceries.forEach(item => {
    const cat = categorizeIngredient(item.ingredient)
    if (!categorized[cat]) categorized[cat] = []
    categorized[cat].push(item)
  })

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#a43947', fontSize: '18px' }}>
      Building your grocery list... 🛒
    </div>
  )

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#231919', fontFamily: 'Plus Jakarta Sans, sans-serif', margin: 0 }}>
          Weekly Grocery List 🛒
        </h1>
        <p style={{ color: '#897172', fontSize: '14px', marginTop: '4px' }}>
          Auto-generated from your 7-day meal plan
        </p>
      </div>

      {/* Progress */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid #fee9e9', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontWeight: '700', fontSize: '16px', color: '#231919' }}>
            Shopping Progress
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#a43947' }}>
            {checkedCount} / {totalCount} items
          </div>
        </div>
        <div style={{ height: '8px', borderRadius: '9999px', background: '#fee9e9' }}>
          <div style={{
            height: '100%', borderRadius: '9999px', background: '#a43947',
            width: totalCount > 0 ? `${(checkedCount / totalCount) * 100}%` : '0%',
            transition: 'width 0.3s ease'
          }} />
        </div>
        {checkedCount === totalCount && totalCount > 0 && (
          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '14px', fontWeight: '600', color: '#a43947' }}>
            🎉 All items collected! You're ready to cook!
          </div>
        )}
      </div>

      {/* Clear all / Check all buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setGroceries(prev => prev.map(g => ({ ...g, checked: true })))}
          style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: '#a43947', color: 'white', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
        >
          ✓ Check All
        </button>
        <button
          onClick={() => setGroceries(prev => prev.map(g => ({ ...g, checked: false })))}
          style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #ddc0c0', background: 'transparent', color: '#897172', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
        >
          ↺ Reset
        </button>
      </div>

      {/* Categorized Grocery List */}
      {Object.entries(categorized).map(([category, items]) => (
        <div key={category} style={{ marginBottom: '20px' }}>
          <div style={{ fontWeight: '700', fontSize: '14px', color: '#564243', marginBottom: '10px', padding: '8px 12px', background: '#fff0f0', borderRadius: '10px' }}>
            {category} ({items.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items.map(item => (
              <div
                key={item.ingredient}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: 'white', borderRadius: '14px', padding: '14px 16px',
                  border: item.checked ? '1px solid #A8E6CF' : '1px solid #fee9e9',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
                onClick={() => toggleItem(item.ingredient)}
              >
                {/* Checkbox */}
                <div style={{
                  width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                  border: item.checked ? 'none' : '2px solid #ddc0c0',
                  background: item.checked ? '#a43947' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s'
                }}>
                  {item.checked && <span style={{ color: 'white', fontSize: '14px' }}>✓</span>}
                </div>

                {/* Ingredient */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px', fontWeight: '600',
                    color: item.checked ? '#897172' : '#231919',
                    textDecoration: item.checked ? 'line-through' : 'none',
                    transition: 'all 0.2s'
                  }}>
                    {item.ingredient}
                  </div>
                  <div style={{ fontSize: '11px', color: '#897172', marginTop: '2px' }}>
                    Used in {item.meals.length} meal{item.meals.length > 1 ? 's' : ''}
                    {item.meals.length <= 2 && ` · ${item.meals.join(', ')}`}
                  </div>
                </div>

                {/* Expand meals */}
                {item.meals.length > 2 && (
                  <button
                    onClick={e => { e.stopPropagation(); setExpandedMeal(expandedMeal === item.ingredient ? null : item.ingredient) }}
                    style={{ fontSize: '11px', color: '#a43947', background: '#fee9e9', border: 'none', borderRadius: '8px', padding: '4px 8px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    {expandedMeal === item.ingredient ? 'Less' : `+${item.meals.length} meals`}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Disclaimer */}
      <div style={{ marginTop: '24px', padding: '16px', background: '#f5f0ff', borderRadius: '16px', fontSize: '12px', color: '#635882', lineHeight: '1.6' }}>
        📚 <strong>Data Sources:</strong> ICMR Dietary Guidelines 2024 · NIN IFCT 2017
        <br />⚠️ Grocery list is auto-generated from your personalized meal plan. Quantities are approximate.
      </div>
    </div>
  )
}