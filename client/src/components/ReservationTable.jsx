import { formatPeso } from '../utils/formatCurrency.js'
import { formatBuffetDate, formatParty } from '../utils/formatDate.js'
import StatusSelect from './StatusSelect.jsx'

const linkClass =
  'text-muted hover:text-brand hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm'

function GuestDetails({ r }) {
  return (
    <div>
      <div className="font-medium text-ink">
        <span className="mr-1.5 font-normal text-muted tabular-nums">#{r.id}</span>
        {r.full_name}
      </div>
      <div className="mt-0.5 text-sm">
        <a href={`mailto:${r.email}`} className={linkClass}>
          {r.email}
        </a>
      </div>
      <div className="text-sm">
        <a href={`tel:${r.contact_number}`} className={linkClass}>
          {r.contact_number}
        </a>
      </div>
    </div>
  )
}

export default function ReservationTable({
  reservations,
  onStatusChange,
  pendingIds,
  isFiltered,
  onClearFilters,
}) {
  if (reservations.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-white p-10 text-center">
        <p className="font-display text-xl font-semibold text-ink">
          {isFiltered ? 'No reservations match' : 'No reservations yet'}
        </p>
        <p className="mt-1 text-sm text-muted">
          {isFiltered
            ? 'Try a different search or status.'
            : 'New bookings appear here as guests submit the form.'}
        </p>
        {isFiltered && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 rounded-md border border-line px-3 py-1.5 text-sm font-medium text-ink hover:bg-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Clear filters
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Phones: one card per reservation */}
      <ul className="space-y-3 md:hidden">
        {reservations.map((r) => (
          <li
            key={r.id}
            className="rounded-lg border border-line bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <GuestDetails r={r} />
              <StatusSelect
                id={r.id}
                value={r.status}
                onChange={(v) => onStatusChange(r.id, v)}
                disabled={pendingIds.has(r.id)}
              />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3 text-sm">
              <div>
                <dt className="text-muted">Buffet date</dt>
                <dd className="font-medium text-ink">
                  {formatBuffetDate(r.buffet_date)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Total</dt>
                <dd className="font-medium text-ink tabular-nums">
                  {formatPeso(r.total_amount)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Party</dt>
                <dd className="text-ink">{formatParty(r.adults, r.kids)}</dd>
              </div>
              <div>
                <dt className="text-muted">Submitted</dt>
                <dd className="text-ink">{r.created_at_manila}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      {/* Tablets and up: table */}
      <div className="hidden overflow-x-auto rounded-lg border border-line bg-white md:block">
        <table className="min-w-full text-sm">
          <thead className="border-b border-line bg-paper text-left text-muted">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Guest</th>
              <th scope="col" className="px-4 py-3 font-medium">Buffet date</th>
              <th scope="col" className="px-4 py-3 font-medium">Party</th>
              <th scope="col" className="px-4 py-3 font-medium text-right">Total</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
              <th scope="col" className="px-4 py-3 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {reservations.map((r) => (
              <tr key={r.id} className="align-top hover:bg-paper/60">
                <td className="px-4 py-3">
                  <GuestDetails r={r} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-ink">
                  {formatBuffetDate(r.buffet_date)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-ink">
                  {formatParty(r.adults, r.kids)}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap font-medium text-ink tabular-nums">
                  {formatPeso(r.total_amount)}
                </td>
                <td className="px-4 py-3">
                  <StatusSelect
                    id={r.id}
                    value={r.status}
                    onChange={(v) => onStatusChange(r.id, v)}
                    disabled={pendingIds.has(r.id)}
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted">
                  {r.created_at_manila}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
