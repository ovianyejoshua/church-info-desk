export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2)

export const fmt = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

export const fmtTime = (d) =>
  new Date(d).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

export const fmtCurrency = (n) => `₦${Number(n).toLocaleString()}`
