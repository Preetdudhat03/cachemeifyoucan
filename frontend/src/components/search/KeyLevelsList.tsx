"use client";

import type { StrikeLevel } from "@/lib/types";

interface KeyLevelsListProps {
  levels: StrikeLevel[];
}

const TYPE_COLORS: Record<StrikeLevel["type"], string> = {
  support: "border-fintech-success text-fintech-success",
  resistance: "border-fintech-danger text-fintech-danger",
  atm: "border-fintech-accent text-fintech-accent",
  max_oi: "border-amber-500 text-amber-500",
  max_volume: "border-purple-400 text-purple-400",
};

export function KeyLevelsList({ levels }: KeyLevelsListProps) {
  if (levels.length === 0) return null;

  return (
    <div className="bg-fintech-card rounded-xl border border-slate-600/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Key Strike Levels
      </h3>
      <div className="flex flex-wrap gap-3">
        {levels.map((level, i) => (
          <div
            key={i}
            className={`px-4 py-2 rounded-lg border ${TYPE_COLORS[level.type]} bg-slate-800/30`}
          >
            <span className="font-semibold">{level.strike.toLocaleString()}</span>
            <span className="ml-2 text-xs opacity-80 capitalize">
              {level.type.replace("_", " ")}
            </span>
            {level.description && (
              <p className="text-xs mt-1 opacity-75">{level.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
