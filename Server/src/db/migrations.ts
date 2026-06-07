// Server/src/db/migrations.ts

import { getDb } from './database.js';

export function runMigrations(): void {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id          TEXT PRIMARY KEY,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id              TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender          TEXT NOT NULL CHECK(sender IN ('user', 'ai')),
      text            TEXT NOT NULL,
      timestamp       TEXT NOT NULL,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
      ON messages(conversation_id);
  `);

  console.log('✅ Database migrations complete');
}