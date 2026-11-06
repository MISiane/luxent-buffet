import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// Return DATE columns (OID 1082) as plain 'YYYY-MM-DD' strings instead of JS Date.
// Keeps the API contract clean and avoids timezone drift on date-only values.
pg.types.setTypeParser(1082, (v) => v)

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

pool.on('error', (err) => {
  console.error('Unexpected idle client error', err)
})