import { G } from '../constants/theme'
import Icon from './Icon'

const tabs = [
  { id: 'dashboard', label: 'Home',  icon: 'home' },
  { id: 'info',      label: 'Info',  icon: 'info' },
  { id: 'lost',      label: 'Lost',  icon: 'lost' },
  { id: 'books',     label: 'Books', icon: 'book' },
  { id: 'forms',     label: 'Forms', icon: 'form' },
  { id: 'team',      label: 'Team',  icon: 'users' },
]

export default function BottomNav({ page, setPage }) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(255,254,251,0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: `1px solid ${G.border}`,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 0 14px',
      zIndex: 200,
      boxShadow: '0 -2px 20px rgba(26,39,68,0.07)',
    }}>
      {tabs.map(t => {
        const active = page === t.id
        return (
          <button
            key={t.id}
            onClick={() => setPage(t.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: active ? G.primary : G.gray,
              padding: '2px 10px',
              borderRadius: 12,
              minWidth: 46,
              position: 'relative',
              transition: 'color 0.15s',
            }}
          >
            {/* Active pill indicator */}
            <div style={{
              position: 'relative',
              padding: '5px 10px',
              borderRadius: 10,
              background: active ? G.primaryLight : 'transparent',
              transition: 'background 0.2s',
            }}>
              {/* Gold dot for active */}
              {active && (
                <div style={{
                  position: 'absolute',
                  top: 3,
                  right: 8,
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: G.accent,
                  boxShadow: '0 0 4px rgba(201,149,58,0.5)',
                }} />
              )}
              <Icon name={t.icon} size={20} />
            </div>
            <span style={{
              fontSize: 10,
              fontWeight: active ? 700 : 500,
              letterSpacing: 0.2,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {t.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
