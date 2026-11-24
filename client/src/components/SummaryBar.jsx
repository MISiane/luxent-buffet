import { formatPeso } from '../utils/formatCurrency.js'

// One ruled panel instead of a row of cards. Pending leads because following
// up on pending bookings is the staff's main job.
export default function SummaryBar({ reservations }) {
  let pending = 0
  let confirmed = 0
  let adults = 0
  let kids = 0
  let revenue = 0

  for (const r of reservations) {
    if (r.status === 'pending') pending += 1
    if (r.status === 'confirmed') confirmed += 1
    if (r.status !== 'cancelled') {
      adults += Number(r.adults) || 0
      kids += Number(r.kids) || 0
      revenue += Number(r.total_amount) || 0
    }
  }

  return (
    <section
      aria-label="Reservation summary"
      className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr]"
    >
      <div className="bg-white p-5 border-l-4 border-brand">
        <p className="text-sm font-medium text-ink">Pending</p>
        <p className="mt-1 font-display text-5xl font-semibold leading-none text-brand tabular-nums">
          {pending}
        </p>
        <p className="mt-2 text-sm text-muted">Not contacted yet</p>
      </div>

      <div className="bg-white p-5">
        <p className="text-sm font-medium text-ink">Confirmed</p>
        <p className="mt-1 font-display text-3xl font-semibold leading-none text-ink tabular-nums">
          {confirmed}
        </p>
        <p className="mt-2 text-sm text-muted">
          of {reservations.length} reservation
          {reservations.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="bg-white p-5">
        <p className="text-sm font-medium text-ink">Guests</p>
        <p className="mt-1 font-display text-3xl font-semibold leading-none text-ink tabular-nums">
          {adults + kids}
        </p>
        <p className="mt-2 text-sm text-muted">
          {adults} adults, {kids} kids
        </p>
      </div>

      <div className="bg-white p-5">
        <p className="text-sm font-medium text-ink">Expected revenue</p>
        <p className="mt-1 font-display text-3xl font-semibold leading-none text-ink tabular-nums">
          {formatPeso(revenue)}
        </p>
        <p className="mt-2 text-sm text-muted">Cancelled excluded</p>
      </div>
    </section>
  )
}
