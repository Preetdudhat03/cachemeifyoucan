"use client";

interface MarketInsightsPanelProps {
  insights: string[];
}

export function MarketInsightsPanel({ insights }: MarketInsightsPanelProps) {
  return (
    <div className="bg-fintech-card rounded-xl border border-slate-600/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-8 h-8 rounded-lg bg-fintech-success/20 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-fintech-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </span>
        <h3 className="text-lg font-semibold text-white">Market Insights</h3>
      </div>
      <ul className="space-y-2">
        {insights.map((insight, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-slate-300 text-sm"
          >
            <span className="text-fintech-accent mt-0.5">•</span>
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
