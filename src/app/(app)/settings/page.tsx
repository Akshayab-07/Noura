'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const DEFICIENCY_OPTIONS = [
  'Vitamin B12', 'Vitamin D', 'Vitamin A', 'Vitamin C', 'Vitamin E', 'Vitamin K',
  'Vitamin B6', 'Iron', 'Calcium', 'Folate', 'Magnesium', 'Zinc', 'Omega 3',
  'Iodine', 'Potassium', 'Selenium', 'Biotin', 'Phosphorus'
]

const CONDITION_OPTIONS = [
  'High Cholesterol', 'Gut Issues', 'Anaemia', 'PCOS', 'Thyroid', 'Diabetes',
  'General Weakness', 'Hypertension', 'Arthritis', 'Osteoporosis', 'Kidney Issues',
  'Liver Issues', 'Migraine', 'Skin Issues'
]

const ALLERGY_OPTIONS = [
  'lactose', 'gluten', 'nuts', 'eggs', 'soy', 'shellfish', 'fish', 'coconut', 'mustard', 'sesame'
]

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [deficiencies, setDeficiencies] = useState<string[]>([])
  const [conditions, setConditions] = useState<string[]>([])
  const [allergies, setAllergies] = useState<string[]>([])

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const uid = session.user.id
      setUser(session.user)

      const [{ data: defData }, { data: condData }, { data: allergyData }] = await Promise.all([
        supabase.from('user_deficiencies').select('deficiency_name').eq('user_id', uid),
        supabase.from('user_conditions').select('condition_name').eq('user_id', uid),
        supabase.from('user_allergies').select('allergy_name').eq('user_id', uid),
      ])

      setDeficiencies(defData?.map((d: any) => d.deficiency_name) || [])
      setConditions(condData?.map((c: any) => c.condition_name) || [])
      setAllergies(allergyData?.map((a: any) => a.allergy_name) || [])
      setLoading(false)
    }
    load()
  }, [])

  const toggle = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter(x => x !== item) : [...list, item])
  }

  const saveChanges = async () => {
    setSaving(true)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const uid = session.user.id

    try {
      // Save deficiencies
      await supabase.from('user_deficiencies').delete().eq('user_id', uid)
      if (deficiencies.length > 0) {
        for (const d of deficiencies) {
          await supabase.from('user_deficiencies').upsert(
            { user_id: uid, deficiency_name: d },
            { onConflict: 'user_id,deficiency_name' }
          )
        }
      }

      // Save conditions
      await supabase.from('user_conditions').delete().eq('user_id', uid)
      if (conditions.length > 0) {
        for (const c of conditions) {
          await supabase.from('user_conditions').upsert(
            { user_id: uid, condition_name: c },
            { onConflict: 'user_id,condition_name' }
          )
        }
      }

      // Save allergies
      await supabase.from('user_allergies').delete().eq('user_id', uid)
      if (allergies.length > 0) {
        for (const a of allergies) {
          await supabase.from('user_allergies').upsert(
            { user_id: uid, allergy_name: a },
            { onConflict: 'user_id,allergy_name' }
          )
        }
      }

      toast.success('Settings saved! Refresh dashboard to see changes.')
    } catch (e) {
      toast.error('Could not save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#a43947', fontSize: '18px' }}>
      Loading settings... ⚙️
    </div>
  )

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#231919', fontFamily: 'Plus Jakarta Sans, sans-serif', margin: 0 }}>
          Settings ⚙️
        </h1>
        <p style={{ color: '#897172', fontSize: '14px', marginTop: '4px' }}>
          Update your health profile anytime
        </p>
      </div>

      {/* Profile Info */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #fee9e9', marginBottom: '20px' }}>
        <h3 style={{ fontWeight: '700', fontSize: '15px', color: '#231919', marginBottom: '12px' }}>👤 Account</h3>
        <div style={{ fontSize: '14px', color: '#897172' }}>
          <span style={{ fontWeight: '600', color: '#231919' }}>Email: </span>{user?.email}
        </div>
      </div>

      {/* Deficiencies */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #fee9e9', marginBottom: '20px' }}>
        <h3 style={{ fontWeight: '700', fontSize: '15px', color: '#231919', marginBottom: '16px' }}>🧬 My Deficiencies</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {DEFICIENCY_OPTIONS.map(d => (
            <button
              key={d}
              onClick={() => toggle(deficiencies, setDeficiencies, d)}
              style={{
                padding: '6px 14px', borderRadius: '20px', border: '1.5px solid',
                borderColor: deficiencies.includes(d) ? '#a43947' : '#ddc0c0',
                background: deficiencies.includes(d) ? '#fee9e9' : 'transparent',
                color: deficiencies.includes(d) ? '#a43947' : '#897172',
                fontWeight: '600', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {deficiencies.includes(d) ? '✓ ' : ''}{d}
            </button>
          ))}
        </div>
      </div>

      {/* Conditions */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #fee9e9', marginBottom: '20px' }}>
        <h3 style={{ fontWeight: '700', fontSize: '15px', color: '#231919', marginBottom: '16px' }}>🏥 My Conditions</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CONDITION_OPTIONS.map(c => (
            <button
              key={c}
              onClick={() => toggle(conditions, setConditions, c)}
              style={{
                padding: '6px 14px', borderRadius: '20px', border: '1.5px solid',
                borderColor: conditions.includes(c) ? '#635882' : '#ddc0c0',
                background: conditions.includes(c) ? '#f5f0ff' : 'transparent',
                color: conditions.includes(c) ? '#635882' : '#897172',
                fontWeight: '600', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {conditions.includes(c) ? '✓ ' : ''}{c}
            </button>
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #fee9e9', marginBottom: '20px' }}>
        <h3 style={{ fontWeight: '700', fontSize: '15px', color: '#231919', marginBottom: '16px' }}>🚫 My Allergies</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {ALLERGY_OPTIONS.map(a => (
            <button
              key={a}
              onClick={() => toggle(allergies, setAllergies, a)}
              style={{
                padding: '6px 14px', borderRadius: '20px', border: '1.5px solid',
                borderColor: allergies.includes(a) ? '#775933' : '#ddc0c0',
                background: allergies.includes(a) ? '#fff8f0' : 'transparent',
                color: allergies.includes(a) ? '#775933' : '#897172',
                fontWeight: '600', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
            >
              {allergies.includes(a) ? '✓ ' : ''}{a}
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={saveChanges}
        disabled={saving}
        style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', background: '#a43947', color: 'white', fontWeight: '700', fontSize: '16px', cursor: 'pointer', marginBottom: '12px', opacity: saving ? 0.7 : 1 }}
      >
        {saving ? 'Saving...' : '💾 Save Changes'}
      </button>

      <button
        onClick={handleLogout}
        style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #ddc0c0', background: 'transparent', color: '#897172', fontWeight: '600', fontSize: '14px', cursor: 'pointer', marginBottom: '24px' }}
      >
        🚪 Log Out
      </button>

      {/* Disclaimer */}
      <div style={{ padding: '16px', background: '#f5f0ff', borderRadius: '16px', fontSize: '12px', color: '#635882', lineHeight: '1.6' }}>
        📚 <strong>Data Sources:</strong> ICMR Dietary Guidelines 2024 · NIN IFCT 2017 · ICMR-NIN RDA 2020
        <br />⚠️ This app provides general nutrition guidance only. Always consult a registered dietitian or doctor.
      </div>
    </div>
  )
}