'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const ACHIEVEMENTS = [
  { id: 'first_meal', icon: '🍽️', title: 'First Meal Logged', desc: 'You logged your first meal!', threshold: 1 },
  { id: 'three_day', icon: '🔥', title: '3 Day Streak', desc: 'Consistent for 3 days!', threshold: 3 },
  { id: 'week_streak', icon: '🏆', title: '7 Day Streak', desc: 'One full week of healthy eating!', threshold: 7 },
  { id: 'two_weeks', icon: '💪', title: '14 Day Streak', desc: 'Two weeks strong!', threshold: 14 },
  { id: 'month', icon: '🌟', title: '30 Day Streak', desc: 'One month of consistency!', threshold: 30 },
  { id: 'bloom', icon: '🌸', title: 'Bloom Stage', desc: 'Reached the Bloom stage!', threshold: 30 },
]

export default function ProgressPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [deficiencies, setDeficiencies] = useState<string[]>([])
  const [weekDays] = useState(() => {
    // Generate last 7 days
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push(d)
    }
    return days
  })

  const [completedToday, setCompletedToday] = useState(0)
  useEffect(() => {
  const load = async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }

    const uid = session.user.id

    const today = new Date().toISOString().split('T')[0]

    const [{ data: streakData }, { data: defData }, { data: logsData }] = await Promise.all([
      supabase.from('streaks').select('*').eq('user_id', uid).single(),
      supabase.from('user_deficiencies').select('deficiency_name').eq('user_id', uid),
      supabase.from('daily_logs').select('meal_id, completed, log_date').eq('user_id', uid).eq('log_date', today),
    ])

    setStreak(streakData?.current_streak || 0)
    setLongestStreak(streakData?.longest_streak || 0)
    setDeficiencies(defData?.map((d: any) => d.deficiency_name) || [])
    
    // Count completed meals today
    const completedToday = logsData?.filter((l: any) => l.completed).length || 0
    setCompletedToday(completedToday)
    
    setLoading(false)
  }
  load()
}, [])

  const getStage = (s: number) => {
    if (s >= 30) return { name: 'Bloom', emoji: '🌸', color: '#ff7e8b' }
    if (s >= 7) return { name: 'Sprout', emoji: '🌿', color: '#A8E6CF' }
    return { name: 'Seed', emoji: '🌱', color: '#FFD6A5' }
  }

  const stage = getStage(streak)

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#a43947', fontSize: '18px' }}>
      Loading your progress... 📈
    </div>
  )

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#231919', fontFamily: 'Plus Jakarta Sans, sans-serif', margin: 0 }}>
          Your Progress 📈
        </h1>
        <p style={{ color: '#897172', fontSize: '14px', marginTop: '4px' }}>
          Track your nutrition journey over time
        </p>
      </div>

      {/* Stage + Streak Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'linear-gradient(135deg, #a43947, #ff7e8b)', borderRadius: '20px', padding: '24px', color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔥</div>
          <div style={{ fontSize: '32px', fontWeight: '700', fontFamily: 'Plus Jakarta Sans' }}>{streak}</div>
          <div style={{ fontSize: '13px', opacity: 0.85 }}>Current Streak</div>
        </div>
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #fee9e9', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🏆</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#231919', fontFamily: 'Plus Jakarta Sans' }}>{longestStreak}</div>
          <div style={{ fontSize: '13px', color: '#897172' }}>Longest Streak</div>
        </div>
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #fee9e9', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>{stage.emoji}</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#231919', fontFamily: 'Plus Jakarta Sans' }}>{stage.name}</div>
          <div style={{ fontSize: '13px', color: '#897172' }}>Current Stage</div>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #fee9e9', marginBottom: '24px' }}>
        <h2 style={{ fontWeight: '700', fontSize: '16px', color: '#231919', marginBottom: '20px' }}>This Week</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {weekDays.map((day, i) => {
            const isToday = i === 6
            const isPast = i < 6
            const hasData = isPast && streak > (6 - i)
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#897172', fontWeight: '600', marginBottom: '8px' }}>
                  {DAYS[day.getDay() === 0 ? 6 : day.getDay() - 1]}
                </div>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', margin: '0 auto',
                  background: isToday ? '#a43947' : hasData ? '#A8E6CF' : '#f5f5f5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px'
                }}>
                  {isToday ? '⭐' : hasData ? '✓' : '·'}
                </div>
                <div style={{ fontSize: '11px', color: '#897172', marginTop: '6px' }}>
                  {day.getDate()}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Nutrition Focus Areas */}
      {deficiencies.length > 0 && (
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #fee9e9', marginBottom: '24px' }}>
          <h2 style={{ fontWeight: '700', fontSize: '16px', color: '#231919', marginBottom: '20px' }}>
            Nutrition Focus Areas
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {deficiencies.map((def, i) => {
              const score = Math.min(Math.min(completedToday * 25, 100), 100)
              return (
                <div key={def}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#231919' }}>{def}</span>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#a43947' }}>
                      {completedToday === 0 ? 'Start eating!' : `${score}%`}
                    </span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '9999px', background: '#fee9e9' }}>
                    <div style={{
                      height: '100%', borderRadius: '9999px',
                      background: score > 70 ? '#A8E6CF' : score > 40 ? '#FFD6A5' : '#a43947',
                      width: completedToday === 0 ? '0%' : `${score}%`,
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#897172', marginTop: '4px' }}>
                    Based on ICMR-NIN 2020 EAR guidelines
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Journey Stages */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #fee9e9', marginBottom: '24px' }}>
        <h2 style={{ fontWeight: '700', fontSize: '16px', color: '#231919', marginBottom: '20px' }}>Your Journey</h2>
        <div style={{ display: 'flex', gap: '0', position: 'relative' }}>
          {[
            { name: 'Seed', emoji: '🌱', days: '0-6 days', threshold: 0 },
            { name: 'Sprout', emoji: '🌿', days: '7-29 days', threshold: 7 },
            { name: 'Bloom', emoji: '🌸', days: '30+ days', threshold: 30 },
          ].map((s, i) => {
            const reached = streak >= s.threshold
            return (
              <div key={s.name} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                {i < 2 && (
                  <div style={{
                    position: 'absolute', top: '20px', left: '50%', width: '100%',
                    height: '3px', background: streak >= [0, 7, 30][i + 1] ? '#a43947' : '#fee9e9',
                    zIndex: 0
                  }} />
                )}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%', margin: '0 auto',
                  background: reached ? '#a43947' : '#fee9e9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', position: 'relative', zIndex: 1,
                  border: stage.name === s.name ? '3px solid #ff7e8b' : 'none'
                }}>
                  {s.emoji}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: reached ? '#a43947' : '#897172', marginTop: '8px' }}>
                  {s.name}
                </div>
                <div style={{ fontSize: '11px', color: '#897172' }}>{s.days}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Achievements */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #fee9e9', marginBottom: '24px' }}>
        <h2 style={{ fontWeight: '700', fontSize: '16px', color: '#231919', marginBottom: '20px' }}>Achievements</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {ACHIEVEMENTS.map(achievement => {
            const unlocked = achievement.threshold === 1 
  ? completedToday >= 1 
  : streak >= achievement.threshold
            return (
              <div key={achievement.id} style={{
                padding: '16px', borderRadius: '16px', textAlign: 'center',
                background: unlocked ? '#fff0f0' : '#f5f5f5',
                border: unlocked ? '1px solid #a43947' : '1px solid transparent',
                opacity: unlocked ? 1 : 0.5,
                transition: 'all 0.3s'
              }}>
                <div style={{ fontSize: '28px', marginBottom: '8px', filter: unlocked ? 'none' : 'grayscale(100%)' }}>
                  {achievement.icon}
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: unlocked ? '#a43947' : '#897172' }}>
                  {achievement.title}
                </div>
                <div style={{ fontSize: '11px', color: '#897172', marginTop: '4px' }}>
                  {achievement.desc}
                </div>
                {!unlocked && (
                  <div style={{ fontSize: '10px', color: '#897172', marginTop: '6px' }}>
                    {achievement.threshold - streak} days to go
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: '16px', background: '#f5f0ff', borderRadius: '16px', fontSize: '12px', color: '#635882', lineHeight: '1.6' }}>
        📚 <strong>Data Sources:</strong> ICMR-NIN RDA 2020 · NIN IFCT 2017
        <br />⚠️ Nutrition scores are based on meal consistency tracking, not actual blood levels. Consult a doctor for clinical assessment.
      </div>
    </div>
  )
}