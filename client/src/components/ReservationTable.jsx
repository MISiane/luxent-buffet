import { formatPeso } from '../utils/formatCurrency.js'
import StatusSelect from './StatusSelect.jsx'

export default function ReservationTable({
  reservations,
  onStatusChange,
  pendingIds,
}) {
  if (reservations.length === 0) {
    return (
      <div className="rounded-md border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-600">
        No reservations match this filter.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-700">
          <tr>
            <th className="px-3 py-2 font-medium">#</th>
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">Contact</th>
            <th className="px-3 py-2 font-medium">Email</th>
            <th className="px-3 py-2 font-medium">Date</th>
            <th className="px-3 py-2 font-medium text-right">Adults</th>
            <th className="px-3 py-2 font-medium text-right">Kids</th>
            <th className="px-3 py-2 font-medium text-right">Total</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">Submitted</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {reservations.map((r) => (
            <tr key={r.id} className="text-black">
              <td className="px-3 py-2 text-gray-500">{r.id}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.full_name}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.contact_number}</td>
              <td className="px-3 py-2">{r.email}</td>
              <td className="px-3 py-2 whitespace-nowrap">{r.buffet_date}</td>
              <td className="px-3 py-2 text-right">{r.adults}</td>
              <td className="px-3 py-2 text-right">{r.kids}</td>
              <td className="px-3 py-2 text-right whitespace-nowrap">
                {formatPeso(r.total_amount)}
              </td>
              <td className="px-3 py-2">
                <StatusSelect
                  id={r.id}
                  value={r.status}
                  onChange={(v) => onStatusChange(r.id, v)}
                  disabled={pendingIds.has(r.id)}
                />
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                {r.created_at_manila}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}