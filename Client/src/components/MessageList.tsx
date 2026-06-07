// Client/src/components/MessageList.tsx

import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore.js';
import MessageBubble from './MessageBubble.js';
import TypingIndicator from './TypingIndicator.js';

export default function MessageList() {
  const messages = useChatStore((s) => s.messages);
  const isLoading = useChatStore((s) => s.isLoading);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="8" width="18" height="12" rx="3" stroke="#64748b" strokeWidth="1.8"/>
            <circle cx="9" cy="14" r="1.5" fill="#64748b"/>
            <circle cx="15" cy="14" r="1.5" fill="#64748b"/>
            <path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">How can I help you today?</p>
          <p className="text-xs text-slate-400 mt-1">
            Ask me about shipping, returns, orders, or anything ShopEasy.
          </p>
        </div>
        {/* Quick suggestion pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {[
            'What is your return policy?',
            'How long does shipping take?',
            'What payment methods do you accept?',
          ].map((q) => (
            <SuggestionPill key={q} text={q} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3 scroll-smooth">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}

// Small internal component — suggestion pills on empty state
function SuggestionPill({ text }: { text: string }) {
  const send = useChatStore((s) => s.sendMessage);

  return (
    <button
      onClick={() => send(text)}
      className="text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full px-3 py-1.5 transition-colors duration-150 cursor-pointer"
    >
      {text}
    </button>
  );
}