import { G, shadow } from '../constants/theme'

export default function StatCard({ label, value, color = G.primary, icon }) {
  return (
    <div style={{
      background: G.white, borderRadius: 14, border: `1px solid ${G.border}`,
      padding: '16px', flex: 1, minWidth: 0, boxShadow: shadow.sm,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: G.textLight, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
    </div>
  )
}
