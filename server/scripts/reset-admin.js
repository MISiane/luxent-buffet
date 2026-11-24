// Create or update the admin account in an existing database.
//
// The seed migration only runs once, so changing ADMIN_EMAIL / ADMIN_PASSWORD
// afterwards has no effect. Run this script to apply new credentials.
//
// Usage (from the server/ folder, values come from the environment, never from
// command-line arguments, so the password stays out of shell history):
//
//   DATABASE_URL="<Render external connection string>" \
//   ADMIN_EMAIL="admin@example.com" \
//   ADMIN_PASSWORD="your-new-password" \
//   npm run reset-admin
//
// Add --remove-others to delete every other admin account, leaving only the one
// above (the app is designed around a single admin user).

import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Does not override variables already set in the shell.
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
const removeOthers = process.argv.includes('--remove-others')

if (!DATABASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    'DATABASE_URL, ADMIN_EMAIL and ADMIN_PASSWORD must all be set (shell or server/.env).'
  )
  process.exit(1)
}

const email = ADMIN_EMAIL.trim()
if (!email) {
  console.error('ADMIN_EMAIL is empty.')
  process.exit(1)
}

// Render's external database connections require SSL; local ones do not.
const isLocal = /@(localhost|127\.0\.0\.1)(:|\/)/.test(DATABASE_URL)
const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
})

async function main() {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    await client.query(
      `INSERT INTO admin_users (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [email, hash]
    )
    console.log(`Admin set: ${email}`)

    const { rows: others } = await client.query(
      'SELECT email FROM admin_users WHERE email <> $1 ORDER BY id',
      [email]
    )

    if (removeOthers && others.length > 0) {
      await client.query('DELETE FROM admin_users WHERE email <> $1', [email])
      console.log(`Removed ${others.length} other admin(s):`)
      others.forEach((r) => console.log(`  - ${r.email}`))
    } else if (others.length > 0) {
      console.log('Other admin accounts still exist (old logins still work):')
      others.forEach((r) => console.log(`  - ${r.email}`))
      console.log('Re-run with --remove-others to delete them.')
    }

    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error('Failed:', err.message)
  process.exit(1)
})
