import {
  listReservations,
  exportReservations,
  updateReservationStatus,
  ALLOWED_STATUSES,
} from '../services/adminService.js'
import { toCsv } from '../utils/csv.js'

export async function getReservations(req, res, next) {
  try {
    const status = req.query.status
    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status filter.',
      })
    }
    const data = await listReservations(status)
    return res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export async function exportReservationsCsv(req, res, next) {
  try {
    const status = req.query.status
    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status filter.',
      })
    }
    const rows = await exportReservations(status)

    const headers = [
      'id',
      'full_name',
      'contact_number',
      'email',
      'buffet_date',
      'adults',
      'kids',
      'total_amount',
      'status',
      'status_updated_at_manila',
      'created_at_manila',
    ]

    const lines = rows.map((r) => [
      r.id,
      r.full_name,
      r.contact_number,
      r.email,
      r.buffet_date,
      r.adults,
      r.kids,
      r.total_amount,
      r.status,
      r.status_updated_at_manila,
      r.created_at_manila,
    ])

    const csv = toCsv(headers, lines)
    const stamp = new Date().toISOString().slice(0, 10)
    const suffix = status ? `_${status}` : ''

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="reservations${suffix}_${stamp}.csv"`
    )
    return res.send(csv)
  } catch (err) {
    next(err)
  }
}

export async function patchReservationStatus(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reservation id.',
      })
    }

    const { status } = req.body || {}
    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status.',
        field: 'status',
      })
    }

    const updated = await updateReservationStatus(id, status)
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found.',
      })
    }

    return res.json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}