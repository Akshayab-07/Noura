'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

type Reminder = {
  id: number
  title: string
  reminder_time: string
  type: string
  is_active: boolean
}

const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  supplement: { icon: '💊', color: '#a43947', bg: '#fee9e9' },
  meal:       { icon: '🍽️', color: '#635882', bg: '#f5f0ff' },
  water:      { icon: '💧', color: '#0d47a1', bg: '#e3f2fd' },
  custom:     { icon: '⏰', color: '#e65100', bg: '#fff3e0' },
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
      setUserId(session.user.id)
      const { data } = await supabase.from('reminders').select('*').eq('user_id', session.user.id).order('reminder_time')
      setReminders(data || [])
      setLoading(false)
    }
    load()
  }, [router])

  const addReminder = async () => {
    if (!form.title || !userId) return
    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase.from('reminders').insert({ user_id: userId, ...form, is_active: true }).select().single()
    if (!error && data) {
      setReminders(prev => [...prev, data].sort((a, b) => a.reminder_time.localeCompare(b.reminder_time)))
      setForm({ title: '', reminder_time: '08:00', type: 'supplement' })
      setShowForm(false)
      toast.success('Reminder added!')
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
    toast.success('Reminder removed')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#a43947', fontSize: '18px' }}>
      Loading reminders... ⏰
    </div>
  )

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#231919', fontFamily: 'Plus Jakarta Sans, sans-serif', margin: 0 }}>
            Reminders ⏰
          </h1>
          <p style={{ color: '#897172', fontSize: '14px', marginTop: '4px' }}>Stay consistent with supplements and meals</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '12px 20px', borderRadius: '20px', border: 'none', background: '#a43947', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
          {showForm ? 'Close Form' : '+ Add'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #fee9e9', marginBottom: '24px' }}>
          <h3 style={{ fontWeight: '700', fontSize: '16px', color: '#231919', marginBottom: '16px' }}>New Reminder</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text" placeholder="e.g. Vitamin D Tablet"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="input"
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input type="time" value={form.reminder_time} onChange={e => setForm(p => ({ ...p, reminder_time: e.target.value }))} className="input" />
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="input">
                <option value="supplement">💊 Supplement</option>
                <option value="meal">🍽️ Meal</option>
                <option value="water">💧 Water</option>
                <option value="custom">⏰ Custom</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={addReminder} disabled={saving || !form.title} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#a43947', color: 'white', fontWeight: '700', cursor: 'pointer', opacity: !form.title ? 0.5 : 1 }}>
                {saving ? 'Saving...' : 'Save Reminder'}
              </button>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddc0c0', background: 'transparent', color: '#897172', fontWeight: '600', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {reminders.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '24px', border: '1px solid #fee9e9', marginBottom: '24px' }}>
          <div style={{ fontSize: '80px', marginBottom: '8px', animation: 'float 3s ease-in-out infinite' }}>🔔</div>
          <div style={{ fontWeight: '700', fontSize: '18px', color: '#231919', marginBottom: '8px' }}>No reminders yet</div>
          <div style={{ fontSize: '14px', color: '#897172', marginBottom: '24px', lineHeight: '1.6' }}>
            Add reminders for your supplements, meals and water intake<br />to stay consistent on your nutrition journey
          </div>
          <button onClick={() => setShowForm(true)} style={{ padding: '12px 28px', borderRadius: '20px', border: 'none', background: '#a43947', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
            + Add Your First Reminder
          </button>
        </div>
      )}

      {/* Reminders List */}
      {reminders.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {reminders.map(reminder => {
            const config = TYPE_CONFIG[reminder.type] || TYPE_CONFIG.custom
            return (
              <div key={reminder.id} style={{
                background: 'white', borderRadius: '18px', padding: '16px 20px',
                border: reminder.is_active ? '1px solid #fee9e9' : '1px solid #f0f0f0',
                display: 'flex', alignItems: 'center', gap: '16px',
                opacity: reminder.is_active ? 1 : 0.6, transition: 'all 0.2s'
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '16px', flexShrink: 0,
                  background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px'
                }}>
                  {config.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: '#231919' }}>{reminder.title}</div>
                  <div style={{ fontSize: '13px', color: '#897172', marginTop: '2px', textTransform: 'capitalize' }}>
                    {reminder.reminder_time} · {reminder.type}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button onClick={() => toggleReminder(reminder.id, reminder.is_active)} style={{
                    padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                    background: reminder.is_active ? '#A8E6CF' : '#f0f0f0',
                    color: reminder.is_active ? '#2d7a4f' : '#897172',
                    fontWeight: '700', fontSize: '12px'
                  }}>
                    {reminder.is_active ? 'Active' : 'Paused'}
                  </button>
                  <button onClick={() => deleteReminder(reminder.id)} style={{
                    width: '34px', height: '34px', borderRadius: '50%', border: 'none',
                    background: '#fff0f0', color: '#a43947', cursor: 'pointer',
                    fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>×</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}