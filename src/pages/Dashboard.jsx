import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { G } from '../constants/theme'
import StatCard from '../components/StatCard'
import Button from '../components/Button'
import Card from '../components/Card'
import { fmt } from '../utils/helpers'

export default function Dashboard({ user, onUserUpdate }) {
  const [stats, setStats] = useState({ info: 0, lost: 0, lostUnclaimed: 0, books: 0, forms: 0, checkins: 0 })
  const [checkedIn, setCheckedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [todayAttendees, setTodayAttendees] = useState([])

  const today = new Date().toDateString()

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    const [
      { count: infoCount },
      { count: lostCount },
      { count: lostUnclaimedCount },
      { count: bookCount },
      { count: formCount },
      { data: todayCheckins },
    ] = await Promise.all([
      supabase.from('info_entries').select('*', { count: 'exact', head: true }),
      supabase.from('lost_items').select('*', { count: 'exact', head: true }),
      supabase.from('lost_items').select('*', { count: 'exact', head: true }).eq('status', 'unclaimed'),
      supabase.from('books').select('*', { count: 'exact', head: true }),
      supabase.from('forms').select('*', { count: 'exact', head: true }),
      supabase.from('checkins').select('user_name, user_id').eq('date', today),
    ])
    const alreadyIn = todayCheckins?.some(c => c.user_id === user.id)
    setCheckedIn(alreadyIn)
    setTodayAttendees(todayCheckins || [])
    setStats({ info: infoCount || 0, lost: lostCount || 0, lostUnclaimed: lostUnclaimedCount || 0, books: bookCount || 0, forms: formCount || 0, checkins: todayCheckins?.length || 0 })
  }

  const doCheckIn = async () => {
    setLoading(true)
    const { error } = await supabase.from('checkins').insert({ user_id: user.id, user_name: user.name, date: today })
    if (!error) {
      setCheckedIn(true)
      setStats(p => ({ ...p, checkins: p.checkins + 1 }))
      setTodayAttendees(p => [...p, { user_name: user.name, user_id: user.id }])
    }
    setLoading(false)
  }

  return (
    <div>
      <div style={{ background: G.primary, borderRadius: 16, padding: '20px 20px', marginBottom: 20, color: G.white }}>
        <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>
          Welcome, {user.name.split(' ')[0]} 👋
        </div>
        {!checkedIn ? (
          <Button onClick={doCheckIn} disabled={loading} variant="amber" style={{ background: G.gold, width: '100%', justifyContent: 'center', padding: '12px' }} icon="checkin">
            {loading ? 'Checking in...' : 'Check In for Duty'}
          </Button>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 14px', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            ✓ You are checked in for today
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        <StatCard label="Info Entries" value={stats.info} color={G.primary} />
        <StatCard label="Books" value={stats.books} color={G.green} />
        <StatCard label="Lost Items" value={stats.lost} color={G.red} />
        <StatCard label="Unclaimed" value={stats.lostUnclaimed} color={G.accent} />
      </div>

      <Card>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: G.text }}>
          On Duty Today ({stats.checkins})
        </div>
        {todayAttendees.length === 0 ? (
          <p style={{ color: G.textLight, fontSize: 13 }}>Nobody checked in yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todayAttendees.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: G.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: G.primary }}>
                  {c.user_name?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: 14, fontWeight: c.user_id === user.id ? 700 : 400 }}>
                  {c.user_name} {c.user_id === user.id ? '(you)' : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
