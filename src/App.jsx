import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { G } from './constants/theme'
import AuthScreen from './pages/AuthScreen'
import Dashboard from './pages/Dashboard'
import InfoDesk from './pages/InfoDesk'
import LostFound from './pages/LostFound'
import Books from './pages/Books'
import DataCollection from './pages/DataCollection'
import Team from './pages/Team'
import BottomNav from './components/BottomNav'

export default function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('dashboard')
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    (async () => {
      const saved = localStorage.getItem('currentUser')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          const { data } = await supabase.from('users').select('*').eq('id', parsed.id).single()
          if (data) {
            localStorage.setItem('currentUser', JSON.stringify(data))
            setUser(data)
          } else {
            localStorage.removeItem('currentUser')
          }
        } catch {
          localStorage.removeItem('currentUser')
        }
      }
      setBooting(false)
    })()
  }, [])

  const handleAuth = (user) => {
    setUser(user)
    setPage('dashboard')
  }

  const logout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
    setPage('dashboard')
  }

  if (booting) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: G.bg,
    }}>
      <div style={{ textAlign: 'center' }}>
        {/* Cross mark with warm glow */}
        <div style={{
          width: 56,
          height: 56,
          background: `linear-gradient(135deg, ${G.primary} 0%, ${G.primaryDark} 100%)`,
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          color: G.white,
          margin: '0 auto 14px',
          boxShadow: '0 8px 24px rgba(26,39,68,0.2)',
        }}>
          ✝
        </div>
        <p style={{
          color: G.textLight,
          fontSize: 13,
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: 0.3,
        }}>
          Loading…
        </p>
      </div>
    </div>
  )

  if (!user) return <AuthScreen onAuth={handleAuth} />

  const pages = {
    dashboard: <Dashboard user={user} />,
    info:      <InfoDesk user={user} />,
    lost:      <LostFound user={user} />,
    books:     <Books user={user} />,
    forms:     <DataCollection user={user} />,
    team:      <Team user={user} />,
  }

  return (
    <div style={{ minHeight: '100vh', background: G.bg, paddingBottom: 88 }}>
      <div style={{ maxWidth: 540, margin: '0 auto', padding: '20px 16px 0' }}>

        {/* Top bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}>
          {/* Logo mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              background: `linear-gradient(135deg, ${G.primary} 0%, ${G.primaryDark} 100%)`,
              borderRadius: 11,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 17,
              color: G.white,
              boxShadow: '0 3px 10px rgba(26,39,68,0.2)',
              flexShrink: 0,
            }}>
              ✝
            </div>
            <div>
              <div style={{
                fontWeight: 800,
                fontSize: 15,
                color: G.text,
                fontFamily: "'Lora', serif",
                lineHeight: 1.1,
              }}>
                Info Desk
              </div>
              {user?.name && (
                <div style={{
                  fontSize: 11,
                  color: G.textLight,
                  fontFamily: "'DM Sans', sans-serif",
                  marginTop: 1,
                }}>
                  Welcome, {user.name.split(' ')[0]}
                </div>
              )}
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={logout}
            style={{
              background: G.grayLight,
              border: `1px solid ${G.border}`,
              cursor: 'pointer',
              fontSize: 12,
              color: G.textLight,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            Sign out
          </button>
        </div>

        {/* Page content */}
        {pages[page]}
      </div>

      <BottomNav page={page} setPage={setPage} />
    </div>
  )
}
