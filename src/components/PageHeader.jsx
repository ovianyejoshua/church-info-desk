import { G } from '../constants/theme'

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: G.text, margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: G.textLight, marginTop: 3 }}>{subtitle}</p>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  )
}
