// Client/src/components/ChatWidget.tsx

import { useEffect } from 'react';
import { useChatStore } from '../store/chatStore.js';
import MessageList from './MessageList.js';
import ChatInput from './ChatInput.js';

export default function ChatWidget() {
  const loadHistory = useChatStore((s) => s.loadHistory);
  const resetSession = useChatStore((s) => s.resetSession);
  const sessionId = useChatStore((s) => s.sessionId);
  const messages = useChatStore((s) => s.messages);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg h-[680px] bg-slate-50 rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="8" width="18" height="12" rx="3" stroke="white" strokeWidth="1.8"/>
                <circle cx="9" cy="14" r="1.5" fill="white"/>
                <circle cx="15" cy="14" r="1.5" fill="white"/>
                <path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>

            <div>
              <h1 className="text-sm font-semibold text-slate-900 leading-none">ShopEasy Support</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-slate-500">Online — typically replies instantly</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Message count badge */}
            {messages.length > 0 && (
              <span className="text-[11px] text-slate-400 font-medium">
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </span>
            )}

            {/* New conversation button */}
            {sessionId && (
              <button
                onClick={resetSession}
                title="Start new conversation"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-150"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Message area */}
        <MessageList />

        {/* Input */}
        <ChatInput />

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 py-2 flex items-center justify-center">
          <span className="text-[10px] text-slate-400 tracking-wide uppercase">
            Powered by ShopEasy AI · support@shopeasy.com
          </span>
        </div>
      </div>
    </div>
  );
}