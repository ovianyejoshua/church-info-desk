import { G } from '../constants/theme'
import Icon from './Icon'

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,15,30,0.55)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 300,
        padding: 0,
        animation: 'backdropIn 0.2s ease',
      }}
    >
      <style>{`
        @keyframes backdropIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes sheetUp { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
      <div style={{
        background: G.white,
        borderRadius: '22px 22px 0 0',
        padding: '0 0 40px',
        width: '100%',
        maxWidth: 540,
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 -8px 48px rgba(10,15,30,0.18)',
        animation: 'sheetUp 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: G.grayMid }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 22px 18px',
          borderBottom: `1px solid ${G.border}`,
        }}>
          <h3 style={{
            margin: 0,
            fontSize: 17,
            fontWeight: 700,
            color: G.text,
            fontFamily: "'Lora', serif",
          }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: G.grayLight,
              border: 'none',
              borderRadius: 9,
              width: 32,
              height: 32,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: G.gray,
              flexShrink: 0,
            }}
          >
            <Icon name="x" size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 22px 0' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
