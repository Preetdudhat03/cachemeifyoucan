"use client";

interface SentimentBadgeProps {
  sentiment: string;
}

const STYLES: Record<string, string> = {
  bullish: "bg-fintech-success/20 text-fintech-success border-fintech-success/50",
  bearish: "bg-fintech-danger/20 text-fintech-danger border-fintech-danger/50",
  neutral: "bg-slate-600/20 text-slate-400 border-slate-500/50",
};

export function SentimentBadge({ sentiment }: SentimentBadgeProps) {
  const key = (sentiment || "neutral").toLowerCase();
  const style = STYLES[key] ?? STYLES.neutral;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border capitalize ${style}`}
    >
      {sentiment || "neutral"}
    </span>
  );
}
