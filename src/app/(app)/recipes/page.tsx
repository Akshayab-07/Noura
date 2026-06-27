'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { MEALS, type Meal, type UserProfile, type Deficiency, type MealType } from '@/lib/mealData'

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

export default function RecipesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [selectedDeficiency, setSelectedDeficiency] = useState<string>('All')
  const [selectedMealType, setSelectedMealType] = useState<string>('All')
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)

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

      setProfile({
        deficiencies: (defData?.map((d: any) => d.deficiency_name) || []) as any,
        conditions: (condData?.map((c: any) => c.condition_name) || []) as any,
        allergies: (allergyData?.map((a: any) => a.allergy_name) || []) as any,
        dietType: 'vegetarian',
      })
      setLoading(false)
    }
    load()
  }, [])

  // Filter meals
  const filteredMeals = MEALS.filter(m => {
    if (m.dietType === 'non-vegetarian') return false
    if (profile?.allergies.some(a => m.contains.includes(a as any))) return false
    if (selectedMealType !== 'All' && m.type !== selectedMealType.toLowerCase()) return false
    if (selectedDeficiency !== 'All' && !m.deficiencies.includes(selectedDeficiency as Deficiency)) return false
    return true
  })

  // Get unique deficiencies from user's profile for filter
  const userDeficiencies = profile?.deficiencies || []

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#a43947', fontSize: '18px' }}>
      Loading recipes... 🍳
    </div>
  )

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#231919', fontFamily: 'Plus Jakarta Sans, sans-serif', margin: 0 }}>
          Recipe Library 🍲
        </h1>
        <p style={{ color: '#897172', fontSize: '14px', marginTop: '4px' }}>
          {filteredMeals.length} recipes · Filtered for your deficiencies and allergies
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {/* Deficiency filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', ...userDeficiencies].map(def => (
            <button
              key={def}
              onClick={() => setSelectedDeficiency(def)}
              style={{
                padding: '8px 16px', borderRadius: '20px', border: 'none',
                background: selectedDeficiency === def ? '#a43947' : '#fee9e9',
                color: selectedDeficiency === def ? 'white' : '#a43947',
                fontWeight: '600', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {def === 'All' ? '🍽️ All' : def}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', background: '#fee9e9' }} />

        {/* Meal type filter */}
        {['All', 'Breakfast', 'Lunch', 'Snack', 'Dinner'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedMealType(type)}
            style={{
              padding: '8px 16px', borderRadius: '20px', border: 'none',
              background: selectedMealType === type ? '#635882' : '#f5f0ff',
              color: selectedMealType === type ? 'white' : '#635882',
              fontWeight: '600', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Recipe Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {filteredMeals.map(meal => (
          <div
            key={meal.id}
            onClick={() => setSelectedMeal(meal)}
            style={{
              background: 'white', borderRadius: '20px', overflow: 'hidden',
              border: '1px solid #fee9e9', cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(164,57,71,0.06)'
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <img
              src={getMealImage(meal)}
              alt={meal.name}
              style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: '#897172', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px' }}>
                {meal.type} · {meal.prepTime} mins
              </div>
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#231919', marginBottom: '8px', lineHeight: '1.4' }}>
                {meal.name}
              </div>
              <div style={{ fontSize: '12px', color: '#897172', marginBottom: '10px', lineHeight: '1.5' }}>
                {meal.description}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {meal.deficiencies.slice(0, 3).map(d => (
                  <span key={d} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: '#fee9e9', color: '#a43947', fontWeight: '600' }}>
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMeals.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#897172' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍽️</div>
          <div style={{ fontWeight: '600', fontSize: '16px', color: '#231919' }}>No recipes found</div>
          <div style={{ fontSize: '14px', marginTop: '8px' }}>Try changing the filters above</div>
        </div>
      )}

      {/* Recipe Modal */}
      {selectedMeal && (
        <div
          onClick={() => setSelectedMeal(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, padding: '20px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: '24px', maxWidth: '600px',
              width: '100%', maxHeight: '85vh', overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
            }}
          >
            <img
              src={FOOD_IMAGES[selectedMeal.type]}
              alt={selectedMeal.name}
              style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '24px 24px 0 0', display: 'block' }}
            />
            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#897172', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {selectedMeal.type} · {selectedMeal.prepTime} mins · {selectedMeal.dietType}
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#231919', fontFamily: 'Plus Jakarta Sans, sans-serif', margin: 0 }}>
                    {selectedMeal.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedMeal(null)}
                  style={{ background: '#fee9e9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer', flexShrink: 0 }}
                >
                  ×
                </button>
              </div>

              <p style={{ fontSize: '14px', color: '#897172', lineHeight: '1.6', marginBottom: '20px' }}>
                {selectedMeal.description}
              </p>

              {/* Deficiency badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                {selectedMeal.deficiencies.map(d => (
                  <span key={d} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: '#fee9e9', color: '#a43947', fontWeight: '600' }}>
                    {d}
                  </span>
                ))}
              </div>

              {/* Ingredients */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#231919', marginBottom: '12px' }}>🛒 Ingredients</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedMeal.ingredients.map(ing => (
                    <span key={ing} style={{ fontSize: '13px', padding: '6px 12px', borderRadius: '10px', background: '#f5f5f5', color: '#564243' }}>
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Safe for conditions */}
              {selectedMeal.safeFor.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#231919', marginBottom: '12px' }}>✅ Safe For</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedMeal.safeFor.map(c => (
                      <span key={c} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: '#f0fff8', color: '#2d7a4f', fontWeight: '600' }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ICMR Note */}
              <div style={{ padding: '16px', background: '#f5f0ff', borderRadius: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#635882', marginBottom: '6px' }}>📚 ICMR-NIN RESEARCH NOTE</div>
                <div style={{ fontSize: '13px', color: '#635882', lineHeight: '1.6' }}>{selectedMeal.icmrNote}</div>
              </div>

              {/* Allergens */}
              {selectedMeal.contains.length > 0 && (
                <div style={{ padding: '12px 16px', background: '#fff8f0', borderRadius: '12px', fontSize: '12px', color: '#775933' }}>
                  ⚠️ <strong>Contains:</strong> {selectedMeal.contains.join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ padding: '16px', background: '#f5f0ff', borderRadius: '16px', fontSize: '12px', color: '#635882', lineHeight: '1.6' }}>
        📚 <strong>Data Sources:</strong> ICMR Dietary Guidelines 2024 · NIN IFCT 2017 · ICMR-NIN RDA 2020
        <br />⚠️ Not medical advice. Consult a registered dietitian before making dietary changes.
      </div>
    </div>
  )
}