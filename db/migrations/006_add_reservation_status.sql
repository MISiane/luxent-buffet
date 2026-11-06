ALTER TABLE reservations
  ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'contacted', 'confirmed', 'cancelled'));

ALTER TABLE reservations
  ADD COLUMN status_updated_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_reservations_status
  ON reservations (status);