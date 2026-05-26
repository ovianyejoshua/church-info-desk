import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { supabase } from '../lib/supabase'
import { G } from '../constants/theme'
import { fmt } from '../utils/helpers'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Modal from '../components/Modal'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Icon from '../components/Icon'
import { Input, Label, Textarea } from '../components/Input'

const emptyForm = { title: '', content: '', category: '', link: '' }

export default function InfoDesk({ user }) {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [qrItem, setQrItem] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data } = await supabase.from('info_entries').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setModal(true) }

  const openEdit = (item) => {
    setEditItem(item)
    setForm({ title: item.title, content: item.content, category: item.category || '', link: item.link || '' })
    setModal(true)
  }

  const save = async () => {
    if (!form.title || !form.content) return
    setSaving(true)
    if (editItem) {
      const { data, error } = await supabase.from('info_entries').update({ ...form }).eq('id', editItem.id).select().single()
      if (!error) setItems(p => p.map(i => i.id === editItem.id ? data : i))
    } else {
      const { data, error } = await supabase.from('info_entries').insert({ ...form, created_by: user.name }).select().single()
      if (!error) setItems(p => [data, ...p])
    }
    setForm(emptyForm)
    setEditItem(null)
    setModal(false)
    setSaving(false)
  }

  const del = async (id) => {
    await supabase.from('info_entries').delete().eq('id', id)
    setItems(p => p.filter(i => i.id !== id))
  }

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.content.toLowerCase().includes(search.toLowerCase()) ||
    (i.category || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader
        title="Information Desk"
        subtitle="Searchable knowledge base"
        action={<Button icon="plus" onClick={openAdd}>Add Entry</Button>}
      />

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: G.gray }}>
          <Icon name="search" />
        </span>
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search information..." style={{ paddingLeft: 40 }} />
      </div>

      {loading ? (
        <p style={{ color: G.textLight, textAlign: 'center', padding: 32 }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
          <p style={{ color: G.textLight }}>{search ? 'No results found.' : 'No entries yet.'}</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(item => (
            <Card key={item.id} padding={16}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{item.title}</span>
                    {item.category && <Badge color="blue">{item.category}</Badge>}
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: G.textLight, lineHeight: 1.6 }}>{item.content}</p>
                  {item.link && (
                    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <a href={item.link} target="_blank" rel="noreferrer" style={{ color: G.blue, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon name="link" size={13} /> {item.link.length > 40 ? item.link.slice(0, 40) + '...' : item.link}
                      </a>
                      <Button variant="light" size="sm" icon="qr" onClick={() => setQrItem(item)}>QR Code</Button>
                    </div>
                  )}
                  <div style={{ marginTop: 8, fontSize: 11, color: G.textLight }}>
                    Added by {item.created_by} · {fmt(item.created_at)}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => openEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: G.primary, padding: 4 }}>
                    <Icon name="edit" size={15} />
                  </button>
                  {user.role === 'admin' && (
                    <button onClick={() => del(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: G.red, padding: 4 }}>
                      <Icon name="trash" size={15} />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => { setModal(false); setEditItem(null); setForm(emptyForm) }} title={editItem ? 'Edit Entry' : 'Add Information Entry'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Sunday Service Time" /></div>
          <div><Label>Category</Label><Input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Services, Events, Departments" /></div>
          <div><Label>Content *</Label><Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="The information..." /></div>
          <div><Label>Link (optional — generates QR code)</Label><Input value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} placeholder="https://..." /></div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <Button onClick={save} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>{saving ? 'Saving...' : editItem ? 'Save Changes' : 'Save Entry'}</Button>
            <Button variant="light" onClick={() => { setModal(false); setEditItem(null); setForm(emptyForm) }} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!qrItem} onClose={() => setQrItem(null)} title="QR Code">
        {qrItem && (
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ marginBottom: 4, fontSize: 16 }}>{qrItem.title}</h4>
            <p style={{ fontSize: 12, color: G.textLight, marginBottom: 20, wordBreak: 'break-all' }}>{qrItem.link}</p>
            <div style={{ display: 'flex', justifyContent: 'center', padding: 16, background: G.white, borderRadius: 12, border: `1px solid ${G.border}`, display: 'inline-block' }}>
              <QRCodeSVG value={qrItem.link} size={200} />
            </div>
            <p style={{ fontSize: 12, color: G.textLight, marginTop: 16 }}>Scan to open the link</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
