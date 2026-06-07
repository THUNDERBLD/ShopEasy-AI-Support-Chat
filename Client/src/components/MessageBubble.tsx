// Client/src/components/MessageBubble.tsx

import type { Message } from '../types/chat.js';

interface Props {
  message: Message;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end px-4">
        <div className="max-w-[72%] flex flex-col items-end gap-1">
          <div className="bg-slate-800 text-white text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-br-sm">
            {message.text}
          </div>
          <span className="text-[11px] text-slate-400 pr-0.5">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-3 px-4">
      {/* Bot avatar */}
      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mb-5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="8" width="18" height="12" rx="3" stroke="white" strokeWidth="1.8"/>
          <circle cx="9" cy="14" r="1.5" fill="white"/>
          <circle cx="15" cy="14" r="1.5" fill="white"/>
          <path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="max-w-[72%] flex flex-col items-start gap-1">
        <div className="bg-white border border-slate-200 text-slate-800 text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-sm">
          {message.text}
        </div>
        <span className="text-[11px] text-slate-400 pl-0.5">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}