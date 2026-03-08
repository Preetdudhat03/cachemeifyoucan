"use client";

interface AIResponsePanelProps {
  explanation: string;
  query: string;
}

export function AIResponsePanel({ explanation, query }: AIResponsePanelProps) {
  return (
    <div className="bg-fintech-card rounded-xl border border-slate-600/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-8 h-8 rounded-lg bg-fintech-accent/20 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-fintech-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </span>
        <h3 className="text-lg font-semibold text-white">AI Explanation</h3>
      </div>
      <p className="text-slate-400 text-sm mb-2">Query: &quot;{query}&quot;</p>
      <p className="text-slate-300 leading-relaxed">{explanation}</p>
    </div>
  );
}
