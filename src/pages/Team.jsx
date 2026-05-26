import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { G } from '../constants/theme'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'

export default function Team({ user }) {
  const [users, setUsers] = useState([])
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(true)

  const today = new Date().toDateString()

  useEffect(() => { load() }, [])

  const load = async () => {
    const [{ data: u }, { data: c }] = await Promise.all([
      supabase.from('users').select('*').order('name'),
      supabase.from('checkins').select('user_id').eq('date', today),
    ])
    setUsers(u || [])
    setCheckins(c || [])
    setLoading(false)
  }

  const toggleRole = async (u) => {
    if (u.id === user.id) return
    const newRole = u.role === 'admin' ? 'user' : 'admin'
    const { data } = await supabase.from('users').update({ role: newRole }).eq('id', u.id).select().single()
    if (data) setUsers(p => p.map(x => x.id === u.id ? data : x))
  }

  const checkedInIds = new Set(checkins.map(c => c.user_id))

  return (
    <div>
      <PageHeader title="Team" subtitle="Members and today's duty attendance" />
      {loading ? (
        <p style={{ color: G.textLight, textAlign: 'center', padding: 32 }}>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {users.map(u => (
            <Card key={u.id} padding={14}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: G.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: G.primary, flexShrink: 0 }}>
                  {u.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {u.name} {u.id === user.id && <span style={{ fontSize: 11, color: G.textLight, fontWeight: 400 }}>(you)</span>}
                  </div>
                  <div style={{ fontSize: 12, color: G.textLight, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                  <Badge color={u.role === 'admin' ? 'amber' : 'gray'}>{u.role}</Badge>
                  <Badge color={checkedInIds.has(u.id) ? 'green' : 'gray'}>{checkedInIds.has(u.id) ? 'On duty' : 'Absent'}</Badge>
                </div>
              </div>
              {user.role === 'admin' && u.id !== user.id && (
                <div style={{ marginTop: 10, borderTop: `1px solid ${G.border}`, paddingTop: 10 }}>
                  <Button variant="light" size="sm" onClick={() => toggleRole(u)}>
                    {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
