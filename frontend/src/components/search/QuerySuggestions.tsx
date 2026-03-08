"use client";

const SUGGESTED_QUERIES = [
  "Show open interest distribution",
  "Where is support and resistance?",
  "Show unusual options activity",
  "What is the market sentiment?",
  "Where are call walls and put walls?",
  "Show gamma exposure by strike",
  "Analyze call vs put volume",
];

interface QuerySuggestionsProps {
  onSelect: (query: string) => void;
  disabled?: boolean;
}

export function QuerySuggestions({ onSelect, disabled }: QuerySuggestionsProps) {
  return (
    <div className="mt-4">
      <p className="text-slate-500 text-sm mb-2">Try these queries:</p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_QUERIES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSelect(q)}
            disabled={disabled}
            className="px-4 py-2 text-sm bg-fintech-card/80 text-slate-300 border border-slate-600/50 rounded-lg hover:border-fintech-accent hover:text-cyan-400 transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
