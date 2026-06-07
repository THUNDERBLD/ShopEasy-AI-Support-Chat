// Server/src/services/chatService.ts

import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/database.js';
import { MAX_HISTORY_MESSAGES } from '../config/constants.js';

export interface Message {
  id: string;
  conversation_id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
}

// Create a new conversation and return its id
export function createConversation(): string {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO conversations (id, created_at, updated_at)
    VALUES (?, ?, ?)
  `).run(id, now, now);

  return id;
}

// Check if a conversation exists
export function conversationExists(sessionId: string): boolean {
  const db = getDb();
  const row = db.prepare(
    'SELECT id FROM conversations WHERE id = ?'
  ).get(sessionId);
  return !!row;
}

// Save a single message
export function saveMessage(
  conversationId: string,
  sender: 'user' | 'ai',
  text: string
): Message {
  const db = getDb();
  const id = uuidv4();
  const timestamp = new Date().toISOString();

  db.prepare(`
    INSERT INTO messages (id, conversation_id, sender, text, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, conversationId, sender, text, timestamp);

  // Update conversation updated_at
  db.prepare(`
    UPDATE conversations SET updated_at = ? WHERE id = ?
  `).run(timestamp, conversationId);

  return { id, conversation_id: conversationId, sender, text, timestamp };
}

// Fetch recent messages for LLM context (last N messages)
export function getRecentMessages(conversationId: string): Message[] {
  const db = getDb();

  const rows = db.prepare(`
    SELECT * FROM messages
    WHERE conversation_id = ?
    ORDER BY timestamp DESC
    LIMIT ?
  `).all(conversationId, MAX_HISTORY_MESSAGES) as Message[];

  // Reverse so oldest → newest for LLM context
  return rows.reverse();
}

// Fetch full history for a session (for UI restore on reload)
export function getFullHistory(conversationId: string): Message[] {
  const db = getDb();

  return db.prepare(`
    SELECT * FROM messages
    WHERE conversation_id = ?
    ORDER BY timestamp ASC
  `).all(conversationId) as Message[];
}