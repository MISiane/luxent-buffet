const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

// "2026-12-24" -> "Thu, Dec 24". Parsed as a plain calendar date so the
// viewer's time zone can never shift it to the day before or after.
export function formatBuffetDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || '')
  if (!m) return value || ''
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
  return `${DAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${Number(m[3])}`
}

export function formatParty(adults, kids) {
  const a = Number(adults) || 0
  const k = Number(kids) || 0
  const parts = [`${a} adult${a === 1 ? '' : 's'}`]
  if (k > 0) parts.push(`${k} kid${k === 1 ? '' : 's'}`)
  return parts.join(', ')
}
