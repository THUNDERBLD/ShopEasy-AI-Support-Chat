// Client/src/types/chat.ts

export type Sender = 'user' | 'ai';

export interface Message {
  id: string;
  conversation_id?: string;
  sender: Sender;
  text: string;
  timestamp: string;
}

export interface SendMessageResponse {
  reply: string;
  sessionId: string;
}

export interface HistoryResponse {
  messages: Message[];
}

export interface ApiError {
  error: string;
}