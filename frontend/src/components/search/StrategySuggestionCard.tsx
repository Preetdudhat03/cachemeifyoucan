"use client";

import type { StrategySuggestion } from "@/lib/types";

interface StrategySuggestionCardProps {
  strategy: StrategySuggestion;
}

const RISK_COLORS = {
  low: "text-fintech-success",
  medium: "text-fintech-warning",
  high: "text-fintech-danger",
};

export function StrategySuggestionCard({ strategy }: StrategySuggestionCardProps) {
  return (
    <div className="bg-fintech-card rounded-xl border border-slate-600/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-fintech-warning/20 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-fintech-warning"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </span>
          <h3 className="text-lg font-semibold text-white">
            Strategy Suggestion
          </h3>
        </div>
        <span
          className={`text-xs font-medium uppercase ${RISK_COLORS[strategy.riskLevel]}`}
        >
          {strategy.riskLevel} risk
        </span>
      </div>
      <h4 className="text-cyan-400 font-semibold mb-2">{strategy.name}</h4>
      <p className="text-slate-400 text-sm mb-3">{strategy.description}</p>
      <p className="text-slate-500 text-xs italic">{strategy.rationale}</p>
      {strategy.keyLevels && strategy.keyLevels.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {strategy.keyLevels.map((level) => (
            <span
              key={level}
              className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300"
            >
              {level}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
