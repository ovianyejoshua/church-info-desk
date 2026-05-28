import { G, shadow } from '../constants/theme'

export default function StatCard({ label, value, color, icon, trend, trendLabel, variant = 'default' }) {
  const isAccent = variant === 'accent'
  const isGold = variant === 'gold'

  const bgStyle = isAccent
    ? { background: `linear-gradient(135deg, ${G.primary} 0%, ${G.primaryDark} 100%)`, border: 'none', boxShadow: shadow.md }
    : isGold
    ? { background: `linear-gradient(135deg, ${G.accent} 0%, #a97830 100%)`, border: 'none', boxShadow: shadow.gold }
    : { background: G.white, border: `1px solid ${G.border}`, boxShadow: shadow.sm }

  const textColor = (isAccent || isGold) ? 'rgba(255,255,255,0.75)' : G.textLight
  const valueColor = (isAccent || isGold) ? '#fff' : (color || G.primary)

  return (
    <div style={{
      borderRadius: 16,
      padding: '18px 16px',
      flex: 1,
      minWidth: 0,
      ...bgStyle,
    }}>
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        color: textColor,
        textTransform: 'uppercase',
        letterSpacing: 0.9,
        marginBottom: 8,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 30,
        fontWeight: 800,
        color: valueColor,
        lineHeight: 1,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: -0.5,
      }}>
        {value}
      </div>
      {trendLabel && (
        <div style={{
          marginTop: 6,
          fontSize: 11,
          color: textColor,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {trendLabel}
        </div>
      )}
    </div>
  )
}
