import React from 'react';

interface InsightsProps {
  insights: string[];
  loading: boolean;
}

export default function InsightsPanel({ insights, loading }: InsightsProps) {
  if (loading) {
    return (
      <div className="glass-card" style={{ padding: "2rem", minHeight: 400 }}>
        <div style={{ height: 24, width: 200, background: "var(--cyan-dim)", borderRadius: 8, marginBottom: 24 }} />
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: 60, background: "rgba(255,255,255,0.03)", borderRadius: 12, marginBottom: 12 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "1.25rem" }}>💡</span>
        <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>AI Market Insights</h3>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {insights.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", marginTop: "3rem" }}>No insights generated.</p>
        ) : (
          insights.map((insight, idx) => {
            const isAlert = insight.toLowerCase().includes('unusual') || insight.toLowerCase().includes('anomaly');
            return (
              <div 
                key={idx} 
                style={{
                  display: "flex", gap: "0.75rem",
                  padding: "1rem", borderRadius: "var(--radius)",
                  marginBottom: "0.75rem",
                  border: `1px solid ${isAlert ? "rgba(255,107,53,0.3)" : "var(--border)"}`,
                  background: isAlert ? "var(--orange-dim)" : "rgba(255,255,255,0.02)",
                  transition: "background 0.2s",
                  lineHeight: 1.6
                }}
              >
                <span style={{ fontSize: "1rem", flexShrink: 0 }}>{isAlert ? "⚠️" : "✓"}</span>
                <p style={{ fontSize: "0.85rem", color: isAlert ? "var(--orange)" : "var(--text)", fontWeight: 500 }}>{insight}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
