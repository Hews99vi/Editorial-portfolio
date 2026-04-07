-- Migration: add ordering columns for home sections
-- Date: 2026-03-09

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS home_featured_order INTEGER,
  ADD COLUMN IF NOT EXISTS home_recent_order INTEGER,
  ADD COLUMN IF NOT EXISTS home_best_order INTEGER;

-- Optional: initialize ordering based on recency within each section
-- Uncomment if you want deterministic ordering immediately.
-- WITH ranked AS (
--   SELECT
--     id,
--     CASE WHEN home_featured THEN ROW_NUMBER() OVER (PARTITION BY home_featured ORDER BY created_at DESC) END AS featured_rank,
--     CASE WHEN home_recent THEN ROW_NUMBER() OVER (PARTITION BY home_recent ORDER BY created_at DESC) END AS recent_rank,
--     CASE WHEN home_best THEN ROW_NUMBER() OVER (PARTITION BY home_best ORDER BY created_at DESC) END AS best_rank
--   FROM projects
-- )
-- UPDATE projects p
-- SET
--   home_featured_order = ranked.featured_rank,
--   home_recent_order = ranked.recent_rank,
--   home_best_order = ranked.best_rank
-- FROM ranked
-- WHERE p.id = ranked.id;
