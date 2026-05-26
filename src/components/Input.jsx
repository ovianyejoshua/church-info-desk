import { G } from '../constants/theme'

export function Label({ children }) {
  return (
    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: G.textLight, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {children}
    </label>
  )
}

export function Input({ style = {}, ...props }) {
  return (
    <input
      {...props}
      style={{
        width: '100%', padding: '11px 14px', borderRadius: 10,
        border: `1.5px solid ${G.border}`, fontSize: 14, outline: 'none',
        background: G.white, color: G.text, boxSizing: 'border-box',
        transition: 'border-color 0.15s',
        ...style,
      }}
    />
  )
}

export function Textarea({ style = {}, ...props }) {
  return (
    <textarea
      {...props}
      style={{
        width: '100%', padding: '11px 14px', borderRadius: 10,
        border: `1.5px solid ${G.border}`, fontSize: 14, outline: 'none',
        background: G.white, color: G.text, boxSizing: 'border-box',
        resize: 'vertical', minHeight: 80, fontFamily: 'inherit',
        ...style,
      }}
    />
  )
}

export function Select({ style = {}, children, ...props }) {
  return (
    <select
      {...props}
      style={{
        width: '100%', padding: '11px 14px', borderRadius: 10,
        border: `1.5px solid ${G.border}`, fontSize: 14, outline: 'none',
        background: G.white, color: G.text, boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </select>
  )
}
