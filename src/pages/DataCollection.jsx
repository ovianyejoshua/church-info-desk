import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { G } from '../constants/theme'
import { fmtTime } from '../utils/helpers'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Modal from '../components/Modal'
import Button from '../components/Button'
import Icon from '../components/Icon'
import { Input, Label, Textarea, Select } from '../components/Input'

export default function DataCollection({ user }) {
  const [forms, setForms] = useState([])
  const [activeForm, setActiveForm] = useState(null)
  const [responses, setResponses] = useState([])
  const [modal, setModal] = useState(false)
  const [fillModal, setFillModal] = useState(null)
  const [draft, setDraft] = useState({ name: '', fields: [] })
  const [fillData, setFillData] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [view, setView] = useState('list')

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data } = await supabase.from('forms').select('*').order('created_at', { ascending: false })
    setForms(data || [])
    setLoading(false)
  }

  const loadResponses = async (formId) => {
    const { data } = await supabase.from('form_responses').select('*').eq('form_id', formId).order('created_at', { ascending: false })
    setResponses(data || [])
  }

  const openForm = (form) => { setActiveForm(form); loadResponses(form.id); setView('detail') }

  const addField = () => setDraft(p => ({ ...p, fields: [...p.fields, { id: Date.now().toString(), label: '', type: 'text' }] }))
  const updateField = (id, k, v) => setDraft(p => ({ ...p, fields: p.fields.map(f => f.id === id ? { ...f, [k]: v } : f) }))
  const removeField = (id) => setDraft(p => ({ ...p, fields: p.fields.filter(f => f.id !== id) }))

  const saveForm = async () => {
    if (!draft.name || draft.fields.length === 0) return
    setSaving(true)
    const { data, error } = await supabase.from('forms').insert({ name: draft.name, fields: draft.fields, created_by: user.name }).select().single()
    if (!error) setForms(p => [data, ...p])
    setDraft({ name: '', fields: [] })
    setModal(false)
    setSaving(false)
  }

  const submitResponse = async () => {
    if (!fillModal) return
    setSaving(true)
    const { data, error } = await supabase.from('form_responses').insert({ form_id: fillModal.id, data: fillData }).select().single()
    if (!error && activeForm?.id === fillModal.id) setResponses(p => [data, ...p])
    setFillData({})
    setFillModal(null)
    setSaving(false)
  }

  const exportxlsx = () => {
    if (!activeForm || responses.length === 0) return
    const headers = activeForm.fields.map(f => f.label).join(',')
    const rows = responses.map(r => activeForm.fields.map(f => `"${(r.data[f.id] || '').replace(/"/g, '""')}"`).join(','))
    const xlsx = ['Submitted At,' + headers, ...responses.map((r, i) => `"${fmtTime(r.created_at)}",` + rows[i])].join('\n')
    const blob = new Blob([xlsx], { type: 'text/xlsx' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${activeForm.name}-responses.xlsx`
    a.click()
  }

  const delForm = async (id) => {
    await supabase.from('forms').delete().eq('id', id)
    setForms(p => p.filter(f => f.id !== id))
    if (activeForm?.id === id) { setActiveForm(null); setView('list') }
  }

  if (view === 'detail' && activeForm) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => setView('list')} style={{ background: G.grayLight, border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: G.text }}>← Back</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{activeForm.name}</h2>
            <p style={{ fontSize: 12, color: G.textLight, margin: 0 }}>{responses.length} response{responses.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Button icon="plus" onClick={() => setFillModal(activeForm)}>Add Response</Button>
          <Button variant="light" icon="download" onClick={exportxlsx} disabled={responses.length === 0}>Export xlsx</Button>
        </div>
        {responses.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: 48 }}><div style={{ fontSize: 36, marginBottom: 10 }}>📝</div><p style={{ color: G.textLight }}>No responses yet.</p></Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {responses.map((r, i) => (
              <Card key={r.id} padding={14}>
                <div style={{ fontSize: 11, color: G.textLight, marginBottom: 8 }}>#{responses.length - i} · {fmtTime(r.created_at)}</div>
                {activeForm.fields.map(f => (
                  <div key={f.id} style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: G.textLight, textTransform: 'uppercase' }}>{f.label}: </span>
                    <span style={{ fontSize: 14 }}>{r.data[f.id] || '—'}</span>
                  </div>
                ))}
              </Card>
            ))}
          </div>
        )}

        <Modal open={!!fillModal} onClose={() => { setFillModal(null); setFillData({}) }} title={`Fill: ${fillModal?.name || ''}`}>
          {fillModal && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {fillModal.fields.map(f => (
                <div key={f.id}>
                  <Label>{f.label}</Label>
                  {f.type === 'textarea' ? (
                    <Textarea value={fillData[f.id] || ''} onChange={e => setFillData(p => ({ ...p, [f.id]: e.target.value }))} />
                  ) : (
                    <Input type={f.type} value={fillData[f.id] || ''} onChange={e => setFillData(p => ({ ...p, [f.id]: e.target.value }))} />
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10 }}>
                <Button onClick={submitResponse} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>{saving ? 'Submitting...' : 'Submit'}</Button>
                <Button variant="light" onClick={() => { setFillModal(null); setFillData({}) }} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Data Collection"
        subtitle="Create forms and collect responses"
        action={<Button icon="plus" onClick={() => setModal(true)}>New Form</Button>}
      />
      {loading ? (
        <p style={{ color: G.textLight, textAlign: 'center', padding: 32 }}>Loading...</p>
      ) : forms.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 48 }}><div style={{ fontSize: 36, marginBottom: 10 }}>📋</div><p style={{ color: G.textLight }}>No forms yet.</p></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {forms.map(form => (
            <Card key={form.id} padding={16} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div onClick={() => openForm(form)} style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{form.name}</div>
                  <div style={{ fontSize: 12, color: G.textLight, marginTop: 3 }}>{form.fields.length} fields · by {form.created_by}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Button variant="light" size="sm" onClick={() => openForm(form)}>View</Button>
                  {user.role === 'admin' && (
                    <button onClick={() => delForm(form.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: G.red }}><Icon name="trash" size={14} /></button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Create New Form">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><Label>Form Name *</Label><Input value={draft.name} onChange={e => setDraft(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Volunteer Signup" /></div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Label>Fields</Label>
              <Button size="sm" icon="plus" onClick={addField}>Add Field</Button>
            </div>
            {draft.fields.map(f => (
              <div key={f.id} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <Input value={f.label} onChange={e => updateField(f.id, 'label', e.target.value)} placeholder="Field label" style={{ flex: 2 }} />
                <Select value={f.type} onChange={e => updateField(f.id, 'type', e.target.value)} style={{ flex: 1 }}>
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="email">Email</option>
                  <option value="tel">Phone</option>
                  <option value="textarea">Long text</option>
                </Select>
                <button onClick={() => removeField(f.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: G.red }}><Icon name="x" size={15} /></button>
              </div>
            ))}
            {draft.fields.length === 0 && <p style={{ fontSize: 13, color: G.textLight }}>Add at least one field.</p>}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button onClick={saveForm} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>{saving ? 'Creating...' : 'Create Form'}</Button>
            <Button variant="light" onClick={() => setModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
