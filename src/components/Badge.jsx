import { G } from '../constants/theme'

const colors = {
  green:  { bg: G.greenLight,   text: G.green,   dot: G.green },
  red:    { bg: G.redLight,     text: G.red,      dot: G.red },
  amber:  { bg: G.amberLight,   text: G.amber,    dot: G.amber },
  blue:   { bg: G.primaryLight, text: G.primary,  dot: G.primary },
  gold:   { bg: G.accentLight,  text: G.accent,   dot: G.accent },
  gray:   { bg: G.grayLight,    text: G.gray,     dot: G.gray },
}

export default function Badge({ color = 'gray', children, dot = false }) {
  const c = colors[color] || colors.gray
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '4px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 0.3,
      background: c.bg,
      color: c.text,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {dot && (
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: c.dot, flexShrink: 0,
        }} />
      )}
      {children}
    </span>
  )
}
