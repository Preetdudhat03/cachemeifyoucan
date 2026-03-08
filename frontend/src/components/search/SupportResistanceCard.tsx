"use client";

interface SupportResistanceCardProps {
  support: number | null | undefined;
  resistance: number | null | undefined;
}

export function SupportResistanceCard({
  support,
  resistance,
}: SupportResistanceCardProps) {
  const hasSupport = support != null && !Number.isNaN(support);
  const hasResistance = resistance != null && !Number.isNaN(resistance);

  if (!hasSupport && !hasResistance) return null;

  return (
    <div className="glass-card" style={{ padding: "2rem" }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem", color: "var(--orange)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        Market Boundaries
      </h3>
      <div className="anomaly-stats-bar">
        {hasSupport && (
          <div className="astat astat-cyan">
            <span className="astat-val">{support?.toLocaleString()}</span>
            <span className="astat-label">Support Zone</span>
          </div>
        )}
        {hasResistance && (
          <div className="astat astat-orange">
            <span className="astat-val">{resistance?.toLocaleString()}</span>
            <span className="astat-label">Resistance Zone</span>
          </div>
        )}
      </div>
    </div>
  );
}
