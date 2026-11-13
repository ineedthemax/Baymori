-- Baymori lead-flow staging schema. Do not store passwords or payment data.
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK(kind IN ('project','transfer')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  business TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL,
  details TEXT NOT NULL,
  consent INTEGER NOT NULL CHECK(consent = 1),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

CREATE TABLE IF NOT EXISTS notification_outbox (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL CHECK(purpose IN ('team','prospect')),
  recipient TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','sent','failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  retry_after TEXT,
  delivered_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(lead_id, purpose)
);
CREATE INDEX IF NOT EXISTS idx_outbox_pending ON notification_outbox(status, retry_after, created_at);
