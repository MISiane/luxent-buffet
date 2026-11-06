import { apiRequest, getToken } from './api.js'

export async function fetchReservations(status) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : ''
  const res = await apiRequest(`/api/admin/reservations${qs}`, { auth: true })
  return res.data
}

export async function updateReservationStatus(id, status) {
  const res = await apiRequest(`/api/admin/reservations/${id}/status`, {
    method: 'PATCH',
    body: { status },
    auth: true,
  })
  return res.data
}

// CSV is not JSON — bypass apiRequest and use fetch directly.
export async function downloadReservationsCsv(status) {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const qs = status ? `?status=${encodeURIComponent(status)}` : ''
  const res = await fetch(`${base}/api/admin/reservations/export${qs}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })

  if (res.status === 401) {
    window.dispatchEvent(new Event('auth:logout'))
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    throw new Error(`Export failed (${res.status})`)
  }

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const disposition = res.headers.get('Content-Disposition') || ''
  const match = disposition.match(/filename="([^"]+)"/)
  const filename = match ? match[1] : 'reservations.csv'

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}