import { G } from '../constants/theme'
import Icon from './Icon'

const variants = {
  primary: {
    background: `linear-gradient(135deg, ${G.primary} 0%, ${G.primaryDark} 100%)`,
    color: '#fffefb',
    border: 'none',
    boxShadow: '0 2px 12px rgba(26,39,68,0.25)',
  },
  gold: {
    background: `linear-gradient(135deg, ${G.accent} 0%, #a97830 100%)`,
    color: '#fff',
    border: 'none',
    boxShadow: '0 2px 12px rgba(201,149,58,0.3)',
  },
  success: {
    background: G.green,
    color: '#fff',
    border: 'none',
    boxShadow: '0 2px 8px rgba(45,122,95,0.25)',
  },
  danger: {
    background: G.red,
    color: '#fff',
    border: 'none',
    boxShadow: '0 2px 8px rgba(192,57,43,0.2)',
  },
  ghost: {
    background: 'transparent',
    color: G.textLight,
    border: `1.5px solid ${G.border}`,
    boxShadow: 'none',
  },
  light: {
    background: G.grayLight,
    color: G.text,
    border: `1px solid ${G.border}`,
    boxShadow: 'none',
  },
  outline: {
    background: 'transparent',
    color: G.primary,
    border: `1.5px solid ${G.primary}`,
    boxShadow: 'none',
  },
}

const sizes = {
  sm: { padding: '7px 14px', fontSize: 12, borderRadius: 9, gap: 5 },
  md: { padding: '10px 20px', fontSize: 14, borderRadius: 11, gap: 6 },
  lg: { padding: '14px 28px', fontSize: 15, borderRadius: 13, gap: 7 },
}

export default function Button({ variant = 'primary', size = 'md', icon, iconRight, children, style = {}, ...props }) {
  const v = variants[variant] || variants.primary
  const s = sizes[size] || sizes.md

  return (
    <button
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        padding: s.padding,
        borderRadius: s.borderRadius,
        fontSize: s.fontSize,
        fontWeight: 600,
        letterSpacing: 0.1,
        cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
        opacity: props.disabled ? 0.45 : 1,
        pointerEvents: props.disabled ? 'none' : 'auto',
        ...v,
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={s.fontSize + 2} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.fontSize + 2} />}
    </button>
  )
}
