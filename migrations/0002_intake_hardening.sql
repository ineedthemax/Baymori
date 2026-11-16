-- Forward migration for the existing, empty staging schema. Run through Wrangler migrations.
ALTER TABLE leads ADD COLUMN payload_hash TEXT;
ALTER TABLE leads ADD COLUMN privacy_version TEXT;
ALTER TABLE leads ADD COLUMN notion_page_id TEXT;
ALTER TABLE leads ADD COLUMN next_action TEXT NOT NULL DEFAULT 'Review inquiry and assess fit';
ALTER TABLE notification_outbox RENAME TO notification_outbox_old;
CREATE TABLE notification_outbox (
 id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
 purpose TEXT NOT NULL CHECK(purpose = 'team'), recipient TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','sending','sent','failed','dead')),
 attempts INTEGER NOT NULL DEFAULT 0, last_error TEXT, retry_after TEXT,
 delivered_at TEXT, provider_id TEXT, lease_token TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(lead_id,purpose)
);
INSERT INTO notification_outbox(id,lead_id,purpose,recipient,status,attempts,last_error,retry_after,delivered_at)
 SELECT id,lead_id,purpose,recipient,status,attempts,last_error,retry_after,delivered_at FROM notification_outbox_old WHERE purpose='team';
DROP TABLE notification_outbox_old;
CREATE INDEX idx_outbox_due ON notification_outbox(status,retry_after,created_at);
