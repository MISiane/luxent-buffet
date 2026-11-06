INSERT INTO buffet_dates (date, label)
VALUES
  ('2026-12-24', 'December 24, 2026'),
  ('2026-12-25', 'December 25, 2026'),
  ('2026-12-30', 'December 30, 2026'),
  ('2026-12-31', 'December 31, 2026')
ON CONFLICT (date) DO NOTHING;