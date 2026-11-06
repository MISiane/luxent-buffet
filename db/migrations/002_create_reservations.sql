CREATE TABLE IF NOT EXISTS reservations (
  id              SERIAL PRIMARY KEY,
  full_name       TEXT NOT NULL,
  contact_number  TEXT NOT NULL,
  email           TEXT NOT NULL,
  buffet_date     DATE NOT NULL REFERENCES buffet_dates(date),
  adults          INTEGER NOT NULL CHECK (adults >= 1),
  kids            INTEGER NOT NULL CHECK (kids >= 0),
  total_amount    INTEGER NOT NULL CHECK (total_amount >= 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_created_at
  ON reservations (created_at DESC);