export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STYLES = {
  pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  contacted: 'bg-blue-50 text-blue-800 border-blue-200',
  confirmed: 'bg-green-50 text-green-800 border-green-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
}

export default function StatusSelect({ id, value, onChange, disabled }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label={`Status for reservation ${id}`}
      className={`rounded-md border px-2 py-1 text-xs font-medium capitalize
        focus:outline-none focus:ring-2 focus:ring-red-700
        disabled:opacity-60 disabled:cursor-not-allowed
        ${STYLES[value] || 'bg-white text-black border-gray-300'}`}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}