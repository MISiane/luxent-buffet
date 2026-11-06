const MANILA_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Manila',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

// Returns "YYYY-MM-DD HH:mm" in Asia/Manila for a given Date or ISO string.
export function toManilaString(value) {
  const date = value instanceof Date ? value : new Date(value)
  const parts = MANILA_FORMATTER.formatToParts(date)
  const get = (type) => parts.find((p) => p.type === type)?.value
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`
}