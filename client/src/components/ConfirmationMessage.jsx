import { formatPeso } from '../utils/formatCurrency.js'

function formatDate(isoDate) {
  // 'YYYY-MM-DD' → 'December 24, 2026'
  const [y, m, d] = isoDate.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export default function ConfirmationMessage({ reservation, onReset }) {
  return (
    <div className="text-center">
      <div
        className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 text-2xl"
        aria-hidden="true"
      >
        ✓
      </div>
      <h2 className="text-xl font-semibold text-black">
        Reservation received
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Thank you, {reservation.full_name}. We'll contact you shortly at{' '}
        <strong>{reservation.contact_number}</strong> to arrange prepayment.
      </p>
      <dl className="mt-6 text-left text-sm bg-gray-50 border border-gray-200 rounded-md p-4 space-y-1.5">
        <div className="flex justify-between">
          <dt className="text-gray-600">Date</dt>
          <dd className="text-black">{formatDate(reservation.buffet_date)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">Adults</dt>
          <dd className="text-black">{reservation.adults}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">Kids</dt>
          <dd className="text-black">{reservation.kids}</dd>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <dt className="text-gray-600">Estimated Total</dt>
          <dd className="text-black font-semibold">
            {formatPeso(reservation.total_amount)}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-gray-500">
        Prepayment is required to confirm your reservation.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 text-sm font-medium text-red-800 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-red-700 rounded"
      >
        Submit another reservation
      </button>
    </div>
  )
}