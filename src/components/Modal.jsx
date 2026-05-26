import { G } from '../constants/theme'
import Icon from './Icon'

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 300, padding: '0',
      }}
    >
      <div style={{
        background: G.white, borderRadius: '20px 20px 0 0',
        padding: '24px 20px 36px', width: '100%', maxWidth: 540,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: G.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: G.grayLight, border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex', color: G.gray }}>
            <Icon name="x" size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
