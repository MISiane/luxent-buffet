import { STATUS_OPTIONS } from './StatusSelect.jsx'

export default function StatusFilter({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Filter by status"
      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-black
        focus:outline-none focus:ring-2 focus:ring-red-700"
    >
      <option value="">All statuses</option>
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}