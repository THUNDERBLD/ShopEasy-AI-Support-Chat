// Client/src/services/api.ts

import axios from 'axios';
import type { SendMessageResponse, HistoryResponse } from '../types/chat.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30s — LLM calls can be slow
});

export async function sendMessage(
  message: string,
  sessionId: string | null
): Promise<SendMessageResponse> {
  const { data } = await api.post<SendMessageResponse>('/chat/message', {
    message,
    ...(sessionId ? { sessionId } : {}),
  });
  return data;
}

export async function fetchHistory(sessionId: string): Promise<HistoryResponse> {
  const { data } = await api.get<HistoryResponse>(`/chat/history/${sessionId}`);
  return data;
}