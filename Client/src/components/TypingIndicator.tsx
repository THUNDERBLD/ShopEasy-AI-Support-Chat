// Client/src/components/TypingIndicator.tsx

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 px-4">
      {/* Bot avatar */}
      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mb-0.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="8" width="18" height="12" rx="3" stroke="white" strokeWidth="1.8"/>
          <circle cx="9" cy="14" r="1.5" fill="white"/>
          <circle cx="15" cy="14" r="1.5" fill="white"/>
          <path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Dots bubble */}
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}