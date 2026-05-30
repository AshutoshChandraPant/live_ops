// Stable hash-based color assignment for tags (program, cohort).
// Same string → same color across the app.

const PALETTE = [
  { bg: 'bg-blue-100',    text: 'text-blue-800',    border: 'border-blue-200' },
  { bg: 'bg-purple-100',  text: 'text-purple-800',  border: 'border-purple-200' },
  { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  { bg: 'bg-amber-100',   text: 'text-amber-800',   border: 'border-amber-200' },
  { bg: 'bg-pink-100',    text: 'text-pink-800',    border: 'border-pink-200' },
  { bg: 'bg-cyan-100',    text: 'text-cyan-800',    border: 'border-cyan-200' },
  { bg: 'bg-orange-100',  text: 'text-orange-800',  border: 'border-orange-200' },
  { bg: 'bg-indigo-100',  text: 'text-indigo-800',  border: 'border-indigo-200' },
  { bg: 'bg-teal-100',    text: 'text-teal-800',    border: 'border-teal-200' },
  { bg: 'bg-rose-100',    text: 'text-rose-800',    border: 'border-rose-200' },
  { bg: 'bg-lime-100',    text: 'text-lime-800',    border: 'border-lime-200' },
  { bg: 'bg-fuchsia-100', text: 'text-fuchsia-800', border: 'border-fuchsia-200' },
]

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function colorForTag(value: string) {
  if (!value) return PALETTE[0]
  return PALETTE[hash(value) % PALETTE.length]
}

export function tagClass(value: string) {
  const c = colorForTag(value)
  return `${c.bg} ${c.text} ${c.border}`
}
