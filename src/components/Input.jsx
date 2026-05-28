import { G } from '../constants/theme'

export function Label({ children, required }) {
  return (
    <label style={{
      display: 'block',
      fontSize: 11,
      fontWeight: 700,
      color: G.textLight,
      marginBottom: 7,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {children}
      {required && <span style={{ color: G.accent, marginLeft: 3 }}>*</span>}
    </label>
  )
}

const inputBase = {
  width: '100%',
  padding: '11px 15px',
  borderRadius: 11,
  border: `1.5px solid ${G.border}`,
  fontSize: 14,
  outline: 'none',
  background: G.white,
  color: G.text,
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  fontFamily: "'DM Sans', sans-serif",
}

export function Input({ style = {}, ...props }) {
  return (
    <input
      {...props}
      onFocus={e => {
        e.target.style.borderColor = G.accent
        e.target.style.boxShadow = '0 0 0 3px rgba(201,149,58,0.12)'
        props.onFocus?.(e)
      }}
      onBlur={e => {
        e.target.style.borderColor = G.border
        e.target.style.boxShadow = 'none'
        props.onBlur?.(e)
      }}
      style={{ ...inputBase, ...style }}
    />
  )
}

export function Textarea({ style = {}, ...props }) {
  return (
    <textarea
      {...props}
      onFocus={e => {
        e.target.style.borderColor = G.accent
        e.target.style.boxShadow = '0 0 0 3px rgba(201,149,58,0.12)'
        props.onFocus?.(e)
      }}
      onBlur={e => {
        e.target.style.borderColor = G.border
        e.target.style.boxShadow = 'none'
        props.onBlur?.(e)
      }}
      style={{
        ...inputBase,
        resize: 'vertical',
        minHeight: 90,
        lineHeight: 1.6,
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
        ...inputBase,
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </select>
  )
}
