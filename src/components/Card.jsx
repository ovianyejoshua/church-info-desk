import { G, shadow } from '../constants/theme'

export default function Card({ children, style = {}, padding = 20, variant = 'default' }) {
  const variants = {
    default: {
      background: G.white,
      border: `1px solid ${G.border}`,
      boxShadow: shadow.sm,
    },
    elevated: {
      background: G.white,
      border: `1px solid ${G.border}`,
      boxShadow: shadow.md,
    },
    accent: {
      background: `linear-gradient(135deg, ${G.primary} 0%, ${G.primaryDark} 100%)`,
      border: 'none',
      boxShadow: shadow.lg,
      color: G.white,
    },
    gold: {
      background: `linear-gradient(135deg, ${G.accent} 0%, #a97830 100%)`,
      border: 'none',
      boxShadow: shadow.gold,
      color: '#fff',
    },
    soft: {
      background: G.grayLight,
      border: `1px solid ${G.border}`,
      boxShadow: 'none',
    },
  }

  const v = variants[variant] || variants.default

  return (
    <div style={{
      borderRadius: 18,
      padding,
      ...v,
      ...style,
    }}>
      {children}
    </div>
  )
}
