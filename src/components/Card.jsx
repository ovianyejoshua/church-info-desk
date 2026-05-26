import { G, shadow } from '../constants/theme'

export default function Card({ children, style = {}, padding = 16 }) {
  return (
    <div style={{
      background: G.white, borderRadius: 14,
      border: `1px solid ${G.border}`,
      padding, boxShadow: shadow.sm,
      ...style,
    }}>
      {children}
    </div>
  )
}
