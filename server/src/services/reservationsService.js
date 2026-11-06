import { pool } from '../config/db.js'
import { computeTotal } from '../utils/pricing.js'

export async function isActiveBuffetDate(dateStr) {
  const { rows } = await pool.query(
    'SELECT 1 FROM buffet_dates WHERE date = $1 AND is_active = TRUE',
    [dateStr]
  )
  return rows.length > 0
}

export async function listActiveBuffetDates() {
  const { rows } = await pool.query(
    `SELECT date, label
       FROM buffet_dates
      WHERE is_active = TRUE
      ORDER BY date ASC`
  )
  return rows
}

export async function createReservation(input) {
  const total_amount = computeTotal(input)
  const { rows } = await pool.query(
    `INSERT INTO reservations
       (full_name, contact_number, email, buffet_date, adults, kids, total_amount)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, full_name, contact_number, email, buffet_date,
               adults, kids, total_amount, created_at`,
    [
      input.full_name,
      input.contact_number,
      input.email,
      input.buffet_date,
      input.adults,
      input.kids,
      total_amount,
    ]
  )
  return rows[0]
}