import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReservationTable from '../components/ReservationTable.jsx'
import StatusFilter from '../components/StatusFilter.jsx'
import {
  fetchReservations,
  downloadReservationsCsv,
  updateReservationStatus,
} from '../services/admin.js'
import { useAuth } from '../hooks/useAuth.js'

export default function AdminDashboardPage() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [filter, setFilter] = useState('')
  const [pendingIds, setPendingIds] = useState(new Set())
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchReservations(filter || undefined)
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
  }, [filter])

  useEffect(() => {
    const handler = () => navigate('/admin/login', { replace: true })
    window.addEventListener('auth:logout', handler)
    return () => window.removeEventListener('auth:logout', handler)
  }, [navigate])

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

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="text-black font-semibold tracking-wide">
            Luxent Hotel <span className="text-gray-400 font-normal">/ Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting || loading}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50"
            >
              {exporting ? 'Exporting…' : 'Export CSV'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-900"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-black">
              Reservations{' '}
              <span className="text-gray-500 font-normal">
                ({reservations.length})
              </span>
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Newest first. Change status inline. CSV export respects the filter.
            </p>
          </div>
          <StatusFilter value={filter} onChange={setFilter} />
        </div>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="mt-4">
          {loading ? (
            <div className="rounded-md border border-gray-200 bg-white p-8 text-center text-sm text-gray-600">
              Loading…
            </div>
          ) : (
            <ReservationTable
              reservations={reservations}
              onStatusChange={handleStatusChange}
              pendingIds={pendingIds}
            />
          )}
        </div>
      </div>
    </main>
  )
}