-- CMS content is one JSON document (small, edited by one admin).
CREATE TABLE IF NOT EXISTS docs (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS inquiries_created ON inquiries (created_at DESC);

-- Aggregate analytics counters: kind = views | visitors (key = YYYY-MM-DD) | path | ref | locale.
CREATE TABLE IF NOT EXISTS counters (
  kind TEXT NOT NULL,
  key TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (kind, key)
);
