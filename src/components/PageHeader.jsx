import { G } from '../constants/theme'

export default function PageHeader({ title, subtitle, action, eyebrow }) {
  return (
    <div style={{
      marginBottom: 24,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12,
    }}>
      <div>
        {eyebrow && (
          <p style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            color: G.accent,
            marginBottom: 4,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {eyebrow}
          </p>
        )}
        <h2 style={{
          fontSize: 22,
          fontWeight: 700,
          color: G.text,
          margin: 0,
          lineHeight: 1.2,
          fontFamily: "'Lora', serif",
        }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{
            fontSize: 13,
            color: G.textLight,
            marginTop: 5,
            lineHeight: 1.5,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          {action}
        </div>
      )}
    </div>
  )
}
