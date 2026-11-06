CREATE TABLE IF NOT EXISTS buffet_dates (
  date        DATE PRIMARY KEY,
  label       TEXT NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);