-- Turso / SQLite schema

CREATE TABLE IF NOT EXISTS entries (
  clerk_user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  value INTEGER NOT NULL CHECK (value >= 0 AND value <= 100),
  PRIMARY KEY (clerk_user_id, date)
);

