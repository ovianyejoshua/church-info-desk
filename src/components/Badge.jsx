import { G } from '../constants/theme'

const colors = {
  green:  { bg: G.greenLight, text: G.green },
  red:    { bg: G.redLight,   text: G.red },
  amber:  { bg: G.accentLight, text: '#92400e' },
  blue:   { bg: G.primaryLight, text: G.primary },
  gray:   { bg: G.grayLight,  text: G.gray },
}

export default function Badge({ color = 'gray', children }) {
  const c = colors[color] || colors.gray
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 700, background: c.bg, color: c.text,
    }}>
      {children}
    </span>
  )
}
