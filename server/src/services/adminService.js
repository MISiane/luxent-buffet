import { pool } from '../config/db.js'
import { toManilaString } from '../utils/datetime.js'

const SELECT_COLUMNS = `
  id, full_name, contact_number, email, buffet_date,
  adults, kids, total_amount, status, status_updated_at, created_at
`

export const ALLOWED_STATUSES = ['pending', 'contacted', 'confirmed', 'cancelled']

function decorate(row) {
  return {
    ...row,
    created_at_manila: toManilaString(row.created_at),
    status_updated_at_manila: row.status_updated_at
      ? toManilaString(row.status_updated_at)
      : null,
  }
}

export async function listReservations(status) {
  const params = []
  let where = ''
  if (status) {
    params.push(status)
    where = ` WHERE status = $1`
  }
  const { rows } = await pool.query(
    `SELECT ${SELECT_COLUMNS}
       FROM reservations${where}
      ORDER BY created_at DESC`,
    params
  )
  return rows.map(decorate)
}

export async function exportReservations(status) {
  const params = []
  let where = ''
  if (status) {
    params.push(status)
    where = ` WHERE status = $1`
  }
  const { rows } = await pool.query(
    `SELECT ${SELECT_COLUMNS}
       FROM reservations${where}
      ORDER BY created_at DESC`,
    params
  )
  return rows.map(decorate)
}

export async function updateReservationStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE reservations
        SET status = $1,
            status_updated_at = NOW()
      WHERE id = $2
      RETURNING ${SELECT_COLUMNS}`,
    [status, id]
  )
  if (rows.length === 0) return null
  return decorate(rows[0])
}