import { G } from '../constants/theme'
import Icon from './Icon'

const variants = {
  primary: { bg: G.primary, color: G.white },
  success: { bg: G.green,   color: G.white },
  danger:  { bg: G.red,     color: G.white },
  amber:   { bg: G.accent,  color: '#1e293b' },
  ghost:   { bg: 'transparent', color: G.textLight },
  light:   { bg: G.grayLight, color: G.text },
}

export default function Button({ variant = 'primary', size = 'md', icon, children, style = {}, ...props }) {
  const v = variants[variant] || variants.primary
  const pad = size === 'sm' ? '7px 12px' : size === 'lg' ? '14px 24px' : '10px 18px'
  const fs = size === 'sm' ? 12 : size === 'lg' ? 16 : 14
  return (
    <button
      {...props}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: pad, borderRadius: 10, border: 'none',
        background: v.bg, color: v.color,
        fontWeight: 600, fontSize: fs, cursor: 'pointer',
        fontFamily: 'inherit', transition: 'opacity 0.15s',
        opacity: props.disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={fs} />}
      {children}
    </button>
  )
}
