"use client"
import React, { useEffect, useState } from 'react';

export default function SentimentGauge() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    fetch(`${API_BASE}/sentiment-index`)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(e => console.error(e));
  }, []);

  if (!data) return <div style={{ height: 200, background: "rgba(0,0,0,0.3)", borderRadius: "var(--radius)" }} />;

  const percentage = ((data.score + 1.0) / 2.0) * 100;
  const barColor = data.score > 0.4 ? "#22c55e" : data.score > 0 ? "#00e5ff" : data.score < -0.4 ? "#ff6b35" : "#b388ff";
  const textColor = data.score > 0 ? "var(--cyan)" : "var(--orange)";

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 250 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--orange)" }}>Extreme Bear</span>
        <span style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--mono)", color: textColor }}>
          {data.label} ({data.score})
        </span>
        <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#22c55e" }}>Extreme Bull</span>
      </div>

      <div style={{ width: "100%", background: "rgba(0,0,0,0.4)", borderRadius: 999, height: 16, position: "relative", overflow: "hidden", border: "1px solid var(--border)" }}>
        {/* Center marker */}
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: "rgba(255,255,255,0.4)", zIndex: 10 }} />
        {/* Progress */}
        <div style={{ height: "100%", borderRadius: 999, transition: "width 1s ease", background: barColor, width: `${percentage}%`, boxShadow: `0 0 15px ${barColor}` }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.5rem" }}>
        <div className="stat-card">
          <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "0.25rem" }}>PCR (Volume)</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "1.5rem", fontWeight: 600, color: "var(--cyan)" }}>{data.pcr_vol}</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "0.25rem" }}>PCR (OI)</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "1.5rem", fontWeight: 600, color: "var(--cyan)" }}>{data.pcr_oi}</div>
        </div>
      </div>
    </div>
  );
}
