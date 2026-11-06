import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../config/db.js'

export async function verifyAdminCredentials(email, password) {
  const { rows } = await pool.query(
    'SELECT id, email, password_hash FROM admin_users WHERE email = $1',
    [email]
  )
  if (rows.length === 0) return null
  const user = rows[0]
  const match = await bcrypt.compare(password, user.password_hash)
  if (!match) return null
  return { id: user.id, email: user.email }
}

export function signAdminToken(admin) {
  return jwt.sign(
    { sub: admin.id, email: admin.email, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  )
}