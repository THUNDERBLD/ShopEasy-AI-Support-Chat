// Client/src/store/chatStore.ts

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Message } from '../types/chat.js';
import { sendMessage, fetchHistory } from '../services/api.js';

const SESSION_KEY = 'shopeasy_session_id';

interface ChatStore {
  messages: Message[];
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;

  sendMessage: (text: string) => Promise<void>;
  loadHistory: () => Promise<void>;
  clearError: () => void;
  resetSession: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  sessionId: null,
  isLoading: false,
  error: null,

  loadHistory: async () => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return;

    try {
      const { messages } = await fetchHistory(stored);
      set({ messages, sessionId: stored });
    } catch {
      // Session no longer valid — clear it silently
      localStorage.removeItem(SESSION_KEY);
    }
  },

  sendMessage: async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || get().isLoading) return;

    // Optimistic user message
    const optimisticUserMsg: Message = {
      id: uuidv4(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, optimisticUserMsg],
      isLoading: true,
      error: null,
    }));

    try {
      const { reply, sessionId } = await sendMessage(trimmed, get().sessionId);

      // Persist session
      localStorage.setItem(SESSION_KEY, sessionId);

      const aiMsg: Message = {
        id: uuidv4(),
        sender: 'ai',
        text: reply,
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, aiMsg],
        sessionId,
        isLoading: false,
      }));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';

      set({ isLoading: false, error: message });
    }
  },

  clearError: () => set({ error: null }),

  resetSession: () => {
    localStorage.removeItem(SESSION_KEY);
    set({ messages: [], sessionId: null, error: null, isLoading: false });
  },
}));