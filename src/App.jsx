import { useState, useEffect } from 'react'
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
    const saved = localStorage.getItem('currentUser')
    if (saved) {
      try { setUser(JSON.parse(saved)) } catch {}
    }
    setBooting(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
    setPage('dashboard')
  }

  if (booting) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: G.bg }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>✝</div>
        <p style={{ color: G.textLight, fontSize: 14 }}>Loading...</p>
      </div>
    </div>
  )

  if (!user) return <AuthScreen onAuth={setUser} />

  const pages = {
    dashboard: <Dashboard user={user} />,
    info: <InfoDesk user={user} />,
    lost: <LostFound user={user} />,
    books: <Books user={user} />,
    forms: <DataCollection user={user} />,
    team: <Team user={user} />,
  }

  return (
    <div style={{ minHeight: '100vh', background: G.bg, paddingBottom: 80 }}>
      <div style={{ maxWidth: 540, margin: '0 auto', padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, background: G.primary, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: G.white }}>✝</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: G.text }}>Info Desk</span>
          </div>
          <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: G.textLight, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
            Sign out
          </button>
        </div>
        {pages[page]}
      </div>
      <BottomNav page={page} setPage={setPage} />
    </div>
  )
}
