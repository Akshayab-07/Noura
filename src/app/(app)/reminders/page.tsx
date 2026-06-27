'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Reminder = {
  id: number
  title: string
  reminder_time: string
  type: string
  is_active: boolean
}

const REMINDER_TYPES = [
  { value: 'supplement', label: 'Supplement 💊' },
  { value: 'meal', label: 'Meal 🍽️' },
  { value: 'water', label: 'Water 💧' },
  { value: 'custom', label: 'Custom ⏰' },
]

const TYPE_ICONS: Record<string, string> = {
  supplement: '💊',
  meal: '🍽️',
  water: '💧',
  custom: '⏰',
}

export default function RemindersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', reminder_time: '08:00', type: 'supplement' })
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const uid = session.user.id
      setUserId(uid)

      const { data } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', uid)
        .order('reminder_time')

      setReminders(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const addReminder = async () => {
    if (!form.title || !userId) return
    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('reminders')
      .insert({ user_id: userId, ...form, is_active: true })
      .select()
      .single()

    if (!error && data) {
      setReminders(prev => [...prev, data].sort((a, b) => a.reminder_time.localeCompare(b.reminder_time)))
      setForm({ title: '', reminder_time: '08:00', type: 'supplement' })
      setShowForm(false)
    }
    setSaving(false)
  }

  const toggleReminder = async (id: number, current: boolean) => {
    const supabase = createClient()
    await supabase.from('reminders').update({ is_active: !current }).eq('id', id)
    setReminders(prev => prev.map(r => r.id === id ? { ...r, is_active: !current } : r))
  }

  const deleteReminder = async (id: number) => {
    const supabase = createClient()
    await supabase.from('reminders').delete().eq('id', id)
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#a43947', fontSize: '18px' }}>
      Loading reminders... ⏰
    </div>
  )

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#231919', fontFamily: 'Plus Jakarta Sans, sans-serif', margin: 0 }}>
            Reminders ⏰
          </h1>
          <p style={{ color: '#897172', fontSize: '14px', marginTop: '4px' }}>
            Stay consistent with supplements and meals
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '12px 20px', borderRadius: '20px', border: 'none', background: '#a43947', color: 'white', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
        >
          + Add Reminder
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #fee9e9', marginBottom: '24px' }}>
          <h3 style={{ fontWeight: '700', fontSize: '16px', color: '#231919', marginBottom: '16px' }}>New Reminder</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#564243', display: 'block', marginBottom: '6px' }}>Title</label>
              <input
                type="text"
                placeholder="e.g. Vitamin D Tablet"
                value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="input"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#564243', display: 'block', marginBottom: '6px' }}>Time</label>
                <input
                  type="time"
                  value={form.reminder_time}
                  onChange={e => setForm(prev => ({ ...prev, reminder_time: e.target.value }))}
                  className="input"
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#564243', display: 'block', marginBottom: '6px' }}>Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                  className="input"
                >
                  {REMINDER_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={addReminder}
                disabled={saving || !form.title}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#a43947', color: 'white', fontWeight: '600', fontSize: '14px', cursor: 'pointer', opacity: !form.title ? 0.5 : 1 }}
              >
                {saving ? 'Saving...' : 'Save Reminder'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddc0c0', background: 'transparent', color: '#897172', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminders List */}
      {reminders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '20px', border: '1px solid #fee9e9' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏰</div>
          <div style={{ fontWeight: '600', fontSize: '16px', color: '#231919' }}>No reminders yet</div>
          <div style={{ fontSize: '14px', color: '#897172', marginTop: '8px' }}>Add reminders for supplements, meals, and water intake</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reminders.map(reminder => (
            <div key={reminder.id} style={{
              background: 'white', borderRadius: '16px', padding: '16px 20px',
              border: reminder.is_active ? '1px solid #fee9e9' : '1px solid #f0f0f0',
              display: 'flex', alignItems: 'center', gap: '16px',
              opacity: reminder.is_active ? 1 : 0.6, transition: 'all 0.2s'
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                background: reminder.is_active ? '#fee9e9' : '#f0f0f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
              }}>
                {TYPE_ICONS[reminder.type] || '⏰'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#231919' }}>{reminder.title}</div>
                <div style={{ fontSize: '13px', color: '#897172', marginTop: '2px' }}>
                  {reminder.reminder_time} · {reminder.type}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => toggleReminder(reminder.id, reminder.is_active)}
                  style={{
                    padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                    background: reminder.is_active ? '#A8E6CF' : '#f0f0f0',
                    color: reminder.is_active ? '#2d7a4f' : '#897172',
                    fontWeight: '600', fontSize: '12px'
                  }}
                >
                  {reminder.is_active ? 'Active' : 'Paused'}
                </button>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: '#fff0f0', color: '#a43947', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggested reminders */}
      <div style={{ marginTop: '32px', background: '#f5f0ff', borderRadius: '20px', padding: '24px' }}>
        <h3 style={{ fontWeight: '700', fontSize: '15px', color: '#231919', marginBottom: '16px' }}>💡 Suggested Reminders</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { title: 'Vitamin D Supplement', time: '08:00', type: 'supplement' },
            { title: 'Vitamin B12 Supplement', time: '09:00', type: 'supplement' },
            { title: 'Drink Water', time: '12:00', type: 'water' },
            { title: 'Iron Supplement (with Vitamin C)', time: '13:00', type: 'supplement' },
            { title: 'Evening Snack', time: '17:00', type: 'meal' },
          ].map(suggestion => (
            <div key={suggestion.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderRadius: '12px', padding: '12px 16px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#231919' }}>{suggestion.title}</div>
                <div style={{ fontSize: '12px', color: '#897172' }}>{suggestion.time}</div>
              </div>
              <button
                onClick={() => {
                  setForm({ title: suggestion.title, reminder_time: suggestion.time, type: suggestion.type })
                  setShowForm(true)
                }}
                style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', background: '#fee9e9', color: '#a43947', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}