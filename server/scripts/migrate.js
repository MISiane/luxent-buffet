import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Check server/.env')
  process.exit(1)
}

const MIGRATIONS_DIR = path.resolve(__dirname, '../../db/migrations')
const FILE_REGEX = /^(\d+)_.+\.sql$/

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

function loadMigrations() {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => FILE_REGEX.test(f))
    .sort()
    .map((filename) => {
      const version = parseInt(filename.match(FILE_REGEX)[1], 10)
      return { version, filename, fullPath: path.join(MIGRATIONS_DIR, filename) }
    })
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version     INTEGER PRIMARY KEY,
      filename    TEXT NOT NULL,
      applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
}

async function runMigrations() {
  const client = await pool.connect()
  try {
    await ensureMigrationsTable(client)

    const { rows: appliedRows } = await client.query(
      'SELECT version FROM schema_migrations ORDER BY version'
    )
    const applied = new Set(appliedRows.map((r) => r.version))
    const migrations = loadMigrations()

    if (migrations.length === 0) {
      console.log('No migration files found.')
      return
    }

    // Pre-compute the admin password hash only if the seed migration is pending
    let adminPasswordHash = null
    const needsAdminSeed = migrations.some(
      (m) => m.filename.startsWith('005_') && !applied.has(m.version)
    )
    if (needsAdminSeed) {
      if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        throw new Error(
          'ADMIN_EMAIL and ADMIN_PASSWORD must be set in server/.env to seed admin user.'
        )
      }
      adminPasswordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
    }

    for (const m of migrations) {
      if (applied.has(m.version)) {
        console.log(`skip  ${m.filename} (already applied)`)
        continue
      }

      let sql = fs.readFileSync(m.fullPath, 'utf8')
      sql = sql.replace(/__ADMIN_EMAIL__/g, process.env.ADMIN_EMAIL || '')
      if (adminPasswordHash) {
        sql = sql.replace(/__ADMIN_PASSWORD_HASH__/g, adminPasswordHash)
      }

      console.log(`apply ${m.filename}`)
      await client.query('BEGIN')
      try {
        await client.query(sql)
        await client.query(
          'INSERT INTO schema_migrations (version, filename) VALUES ($1, $2)',
          [m.version, m.filename]
        )
        await client.query('COMMIT')
      } catch (err) {
        await client.query('ROLLBACK')
        console.error(`FAILED: ${m.filename}`)
        throw err
      }
    }

    console.log('Migrations complete.')
  } finally {
    client.release()
    await pool.end()
  }
}

runMigrations().catch((err) => {
  console.error(err)
  process.exit(1)
})