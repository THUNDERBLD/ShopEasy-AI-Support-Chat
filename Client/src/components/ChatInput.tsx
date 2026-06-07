// Client/src/components/ChatInput.tsx

import { useState } from 'react';
import { useChatStore } from '../store/chatStore.js';

export default function ChatInput() {
  const [value, setValue] = useState('');
  const isLoading = useChatStore((s) => s.isLoading);
  const send = useChatStore((s) => s.sendMessage);
  const error = useChatStore((s) => s.error);
  const clearError = useChatStore((s) => s.clearError);

  const MAX = 5000;
  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && trimmed.length <= MAX && !isLoading;
  const isNearLimit = value.length > MAX * 0.85;

  function handleSend() {
    if (!canSend) return;
    send(value);
    setValue('');
    if (error) clearError();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="border-t border-slate-200 bg-white px-4 py-3 flex flex-col gap-2">
      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <span className="text-xs text-red-600">{error}</span>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-600 ml-2 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Type a message…"
          maxLength={MAX + 100} // let them type a bit over so we can warn
          className="flex-1 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
        />

        <button
          onClick={handleSend}
          disabled={!canSend}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex-shrink-0"
        >
          {isLoading ? (
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Character counter — only shown near limit */}
      {isNearLimit && (
        <p className={`text-[11px] text-right ${value.length > MAX ? 'text-red-500' : 'text-slate-400'}`}>
          {value.length}/{MAX}
        </p>
      )}
    </div>
  );
}