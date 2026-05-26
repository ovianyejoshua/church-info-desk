import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { G } from '../constants/theme'
import { Input, Label } from '../components/Input'
import Button from '../components/Button'

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async () => {
    setErr('')
    setLoading(true)
    try {
      if (mode === 'register') {
        if (!form.name || !form.email || !form.password) { setErr('All fields are required.'); setLoading(false); return }
        const { data: existing } = await supabase.from('users').select('id').eq('email', form.email).maybeSingle()
        if (existing) { setErr('Email already registered.'); setLoading(false); return }
        const { count } = await supabase.from('users').select('*', { count: 'exact', head: true })
        const role = count === 0 ? 'admin' : 'user'
        const { data: user, error } = await supabase.from('users').insert({ name: form.name, email: form.email, password: form.password, phone: form.phone, role }).select().single()
        if (error) throw error
        // Save to both localStorage (fast boot) and Supabase sessions table
        await supabase.from('sessions').insert({ user_id: user.id, device: navigator.userAgent.slice(0, 100) })
        localStorage.setItem('currentUser', JSON.stringify(user))
        onAuth(user)
      } else {
        if (!form.email || !form.password) { setErr('Enter email and password.'); setLoading(false); return }
        const { data: user, error } = await supabase.from('users').select('*').eq('email', form.email).eq('password', form.password).maybeSingle()
        if (error || !user) { setErr('Invalid email or password.'); setLoading(false); return }
        localStorage.setItem('currentUser', JSON.stringify(user))
        onAuth(user)
      }
    } catch (e) {
      setErr('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: G.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: G.primary, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 26 }}>✝</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: G.text, margin: 0 }}>Information Desk</h1>
          <p style={{ color: G.textLight, marginTop: 6, fontSize: 14 }}>Church Operations Tool</p>
        </div>
        <div style={{ background: G.white, borderRadius: 20, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: `1px solid ${G.border}` }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 24, background: G.grayLight, borderRadius: 12, padding: 4 }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setErr('') }} style={{
                flex: 1, padding: '9px', border: 'none', borderRadius: 10, cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: 700, fontSize: 13,
                background: mode === m ? G.white : 'transparent',
                color: mode === m ? G.primary : G.textLight,
                boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'register' && <>
              <div><Label>Full Name</Label><Input value={form.name} onChange={f('name')} placeholder="Your full name" /></div>
              <div><Label>Phone (optional)</Label><Input value={form.phone} onChange={f('phone')} placeholder="+234..." type="tel" /></div>
            </>}
            <div><Label>Email</Label><Input value={form.email} onChange={f('email')} placeholder="you@email.com" type="email" /></div>
            <div><Label>Password</Label><Input value={form.password} onChange={f('password')} placeholder="Password" type="password" onKeyDown={e => e.key === 'Enter' && submit()} /></div>
          </div>
          {err && <p style={{ color: G.red, fontSize: 13, marginTop: 12 }}>{err}</p>}
          <Button onClick={submit} disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 20, padding: '13px' }} variant="primary">
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </div>
      </div>
    </div>
  )
}
