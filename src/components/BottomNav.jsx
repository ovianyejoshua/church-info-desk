import { G, shadow } from '../constants/theme'
import Icon from './Icon'

const tabs = [
  { id: 'dashboard', label: 'Home',    icon: 'home' },
  { id: 'info',      label: 'Info',    icon: 'info' },
  { id: 'lost',      label: 'Lost',    icon: 'lost' },
  { id: 'books',     label: 'Books',   icon: 'book' },
  { id: 'forms',     label: 'Forms',   icon: 'form' },
  { id: 'team',      label: 'Team',    icon: 'users' },
]

export default function BottomNav({ page, setPage }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: G.white, borderTop: `1px solid ${G.border}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '8px 0 12px', zIndex: 200, boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
    }}>
      {tabs.map(t => {
        const active = page === t.id
        return (
          <button
            key={t.id}
            onClick={() => setPage(t.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer',
              color: active ? G.primary : G.textLight,
              padding: '4px 8px', borderRadius: 10, minWidth: 48,
              transition: 'color 0.15s',
            }}
          >
            <div style={{
              background: active ? G.primaryLight : 'transparent',
              borderRadius: 8, padding: '4px 10px',
              transition: 'background 0.15s',
            }}>
              <Icon name={t.icon} size={20} />
            </div>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{t.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
