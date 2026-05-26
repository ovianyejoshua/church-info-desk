import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { G } from '../constants/theme'
import { fmt } from '../utils/helpers'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import Modal from '../components/Modal'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Icon from '../components/Icon'
import { Input, Label, Textarea } from '../components/Input'

export default function LostFound({ user }) {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ description: '', date_found: new Date().toISOString().slice(0, 10), location: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data } = await supabase.from('lost_items').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  const save = async () => {
    if (!form.description) return
    setSaving(true)
    const { data, error } = await supabase.from('lost_items').insert({ ...form, status: 'unclaimed', logged_by: user.name }).select().single()
    if (!error) setItems(p => [data, ...p])
    setForm({ description: '', date_found: new Date().toISOString().slice(0, 10), location: '' })
    setModal(false)
    setSaving(false)
  }

  const claim = async (id) => {
    const { data } = await supabase.from('lost_items').update({ status: 'claimed', claimed_at: new Date().toISOString() }).eq('id', id).select().single()
    if (data) setItems(p => p.map(i => i.id === id ? data : i))
  }

  const del = async (id) => {
    await supabase.from('lost_items').delete().eq('id', id)
    setItems(p => p.filter(i => i.id !== id))
  }

  const total = items.length
  const claimed = items.filter(i => i.status === 'claimed').length
  const unclaimed = items.filter(i => i.status === 'unclaimed').length

  const filtered = items
    .filter(i => filter === 'all' || i.status === filter)
    .filter(i =>
      i.description.toLowerCase().includes(search.toLowerCase()) ||
      (i.location || '').toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div>
      <PageHeader
        title="Lost & Found"
        subtitle="Log and track lost items"
        action={<Button icon="plus" onClick={() => setModal(true)}>Log Item</Button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
        <StatCard label="Total" value={total} color={G.primary} />
        <StatCard label="Unclaimed" value={unclaimed} color={G.red} />
        <StatCard label="Claimed" value={claimed} color={G.green} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
        {['all', 'unclaimed', 'claimed'].map(f => (
          <Button key={f} variant={filter === f ? 'primary' : 'light'} size="sm" onClick={() => setFilter(f)} style={{ textTransform: 'capitalize', flexShrink: 0 }}>{f}</Button>
        ))}
      </div>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: G.gray }}><Icon name="search" /></span>
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." style={{ paddingLeft: 40 }} />
      </div>

      {loading ? (
        <p style={{ color: G.textLight, textAlign: 'center', padding: 32 }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📦</div>
          <p style={{ color: G.textLight }}>{search ? 'No items found.' : 'No items logged yet.'}</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(item => (
            <Card key={item.id} padding={16}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{item.description}</span>
                    <Badge color={item.status === 'claimed' ? 'green' : 'red'}>{item.status}</Badge>
                  </div>
                  <div style={{ fontSize: 12, color: G.textLight }}>
                    Found {fmt(item.date_found)}{item.location ? ` · ${item.location}` : ''} · Logged by {item.logged_by}
                  </div>
                  {item.status === 'unclaimed' && (
                    <Button variant="success" size="sm" icon="check" onClick={() => claim(item.id)} style={{ marginTop: 10 }}>Mark Claimed</Button>
                  )}
                </div>
                {user.role === 'admin' && (
                  <button onClick={() => del(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: G.red, padding: 4 }}>
                    <Icon name="trash" size={15} />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Log Lost Item">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><Label>Description *</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="e.g. Black leather Bible with name tag" /></div>
          <div><Label>Date Found *</Label><Input type="date" value={form.date_found} onChange={e => setForm(p => ({ ...p, date_found: e.target.value }))} /></div>
          <div><Label>Where it was found</Label><Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Main Hall, Row 5" /></div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <Button onClick={save} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>{saving ? 'Saving...' : 'Log Item'}</Button>
            <Button variant="light" onClick={() => setModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
