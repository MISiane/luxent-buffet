import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReservationTable from '../components/ReservationTable.jsx'
import StatusFilter from '../components/StatusFilter.jsx'
import SummaryBar from '../components/SummaryBar.jsx'
import {
  fetchReservations,
  downloadReservationsCsv,
  updateReservationStatus,
} from '../services/admin.js'
import { useAuth } from '../hooks/useAuth.js'

const buttonFocus =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-paper'

export default function AdminDashboardPage() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [filter, setFilter] = useState('')
  const [query, setQuery] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [pendingIds, setPendingIds] = useState(new Set())
  const { logout } = useAuth()
  const navigate = useNavigate()

  // Load everything once; status tabs, counts and search all work on this list.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchReservations()
      .then((data) => {
        if (!cancelled) setReservations(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  useEffect(() => {
    const handler = () => navigate('/admin/login', { replace: true })
    window.addEventListener('auth:logout', handler)
    return () => window.removeEventListener('auth:logout', handler)
  }, [navigate])

  const counts = useMemo(() => {
    const c = { all: reservations.length }
    for (const r of reservations) c[r.status] = (c[r.status] || 0) + 1
    return c
  }, [reservations])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return reservations.filter((r) => {
      if (filter && r.status !== filter) return false
      if (!q) return true
      return [r.full_name, r.email, r.contact_number, String(r.id)]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [reservations, filter, query])

  async function handleExport() {
    setExporting(true)
    setError(null)
    try {
      await downloadReservationsCsv(filter || undefined)
    } catch (err) {
      setError(err.message)
    } finally {
      setExporting(false)
    }
  }

  async function handleStatusChange(id, status) {
    const previous = reservations.find((r) => r.id === id)
    if (!previous || previous.status === status) return

    setPendingIds((s) => new Set(s).add(id))
    setError(null)

    // Optimistic update
    setReservations((rows) =>
      rows.map((r) => (r.id === id ? { ...r, status } : r))
    )

    try {
      const updated = await updateReservationStatus(id, status)
      setReservations((rows) =>
        rows.map((r) => (r.id === id ? updated : r))
      )
    } catch (err) {
      // Rollback
      setReservations((rows) =>
        rows.map((r) => (r.id === id ? previous : r))
      )
      setError(err.message || 'Failed to update status')
    } finally {
      setPendingIds((s) => {
        const next = new Set(s)
        next.delete(id)
        return next
      })
    }
  }

  function handleLogout() {
    logout()
    navigate('/admin/login', { replace: true })
  }

  function clearFilters() {
    setFilter('')
    setQuery('')
  }

  const isFiltered = filter !== '' || query.trim() !== ''

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="font-display text-xl font-semibold">
            Le Monet Hotel{' '}
            <span className="font-sans text-sm font-normal text-muted">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting || loading}
              title={
                filter
                  ? 'Exports only the selected status'
                  : 'Exports all reservations'
              }
              className={`rounded-md border border-line px-3 py-1.5 text-sm font-medium text-ink hover:bg-paper disabled:opacity-50 ${buttonFocus}`}
            >
              {exporting ? 'Exporting…' : 'Export CSV'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className={`rounded-md bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark ${buttonFocus}`}
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold">
              Reservations
            </h1>
            <p className="mt-1 text-sm text-muted">
              Newest first. Change a status right in the list.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            disabled={loading}
            className={`rounded-md border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink hover:bg-paper disabled:opacity-50 ${buttonFocus}`}
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        <div className="mt-6">
          <SummaryBar reservations={reservations} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <StatusFilter value={filter} onChange={setFilter} counts={counts} />
          <div className="relative w-full sm:w-72">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <circle cx="9" cy="9" r="5.5" />
              <path d="m13.5 13.5 3.5 3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search reservations"
              placeholder="Search name, email or number"
              className="w-full rounded-md border border-line bg-white py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <div className="mt-4">
          {loading && reservations.length === 0 ? (
            <div className="rounded-lg border border-line bg-white p-10 text-center text-sm text-muted">
              Loading reservations…
            </div>
          ) : (
            <ReservationTable
              reservations={visible}
              onStatusChange={handleStatusChange}
              pendingIds={pendingIds}
              isFiltered={isFiltered}
              onClearFilters={clearFilters}
            />
          )}
        </div>
      </div>
    </main>
  )
}
