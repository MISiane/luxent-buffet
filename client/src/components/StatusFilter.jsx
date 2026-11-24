import { STATUS_OPTIONS } from './StatusSelect.jsx'

const TABS = [{ value: '', label: 'All' }, ...STATUS_OPTIONS]

export default function StatusFilter({ value, onChange, counts }) {
  return (
    <div
      role="group"
      aria-label="Filter by status"
      className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1"
    >
      {TABS.map((tab) => {
        const active = value === tab.value
        const count = tab.value === '' ? counts.all : counts[tab.value] ?? 0
        return (
          <button
            key={tab.value || 'all'}
            type="button"
            onClick={() => onChange(tab.value)}
            aria-pressed={active}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium
              focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-paper
              ${
                active
                  ? 'bg-brand text-white'
                  : 'text-ink hover:bg-line/60'
              }`}
          >
            {tab.label}
            <span
              className={`ml-1.5 tabular-nums ${
                active ? 'text-white/80' : 'text-muted'
              }`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
