export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STYLES = {
  pending: 'bg-amber-50 text-amber-900 border-amber-300',
  contacted: 'bg-sky-50 text-sky-900 border-sky-200',
  confirmed: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
}

const DOTS = {
  pending: 'bg-amber-500',
  contacted: 'bg-sky-500',
  confirmed: 'bg-emerald-600',
  cancelled: 'bg-gray-400',
}

export default function StatusSelect({ id, value, onChange, disabled }) {
  return (
    <span className="relative inline-block">
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-2.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${
          DOTS[value] || 'bg-gray-400'
        }`}
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label={`Status for reservation ${id}`}
        className={`rounded-md border py-1 pl-6 pr-2 text-xs font-medium
          focus:outline-none focus-visible:ring-2 focus-visible:ring-brand
          disabled:opacity-60 disabled:cursor-not-allowed
          ${STYLES[value] || 'bg-white text-ink border-gray-300'}`}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </span>
  )
}
