import React from 'react';

interface AnomalyData {
  datetime: string;
  strike: number;
  volume_CE: number;
  volume_PE: number;
  oi_CE: number;
  oi_PE: number;
}

interface AnomalyProps {
  data: AnomalyData[];
  loading: boolean;
}

export default function AnomalyAlerts({ data, loading }: AnomalyProps) {
  const getSeverity = (totalVol: number) => {
    if (totalVol >= 50000) return { cls: 'severity-high', label: 'HIGH' };
    if (totalVol >= 20000) return { cls: 'severity-medium', label: 'MED' };
    return { cls: 'severity-low', label: 'LOW' };
  };

  if (loading) {
    return (
      <div className="ticker-wrap" style={{ minHeight: 400 }}>
        <div className="ticker-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="ticker-icon" aria-hidden="true">🚨</span>
            <span className="ticker-title">Unusual Options Activity</span>
          </div>
          <div className="ticker-live-dot">
            <span className="live-ring" />
            <span className="live-dot" />
            <span className="live-label">LIVE</span>
          </div>
        </div>
        <div style={{ padding: "2rem" }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ height: 60, background: "rgba(255,255,255,0.02)", borderRadius: 8, marginBottom: 8, border: "1px solid var(--border)" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="ticker-wrap">
      <div className="ticker-header">
        <div className="ticker-title-row" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="ticker-icon" aria-hidden="true">🚨</span>
          <span className="ticker-title">Unusual Options Activity</span>
        </div>
        <div className="ticker-live-dot">
          <span className="live-ring" />
          <span className="live-dot" />
          <span className="live-label">LIVE</span>
        </div>
      </div>
      <div className="ticker-body">
        <div className="ticker-items">
          {!data || data.length === 0 ? (
            <p className="ticker-empty-msg">
              No anomalies detected in the current dataset. Click &ldquo;Sync Data&rdquo; to refresh.
            </p>
          ) : (
            data.slice(0, 20).map((row, idx) => {
              const totalVol = (row.volume_CE || 0) + (row.volume_PE || 0);
              const sv = getSeverity(totalVol);
              
              return (
                <div key={idx} className={`ticker-item ${totalVol > 50000 ? "volume_spike" : "oi_change"}`}>
                  <span className={`ticker-severity ${sv.cls}`}>{sv.label}</span>
                  <span className="ticker-strike">Strike {row.strike}</span>
                  <span className="ticker-msg">
                    Vol CE: <strong style={{ color: "var(--cyan)" }}>{row.volume_CE?.toLocaleString()}</strong>{" | "}
                    Vol PE: <strong style={{ color: "var(--orange)" }}>{row.volume_PE?.toLocaleString()}</strong>
                  </span>
                  <span className="ticker-meta">
                    Isolation Forest
                    <br />
                    <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>
                      {(() => { try { return new Date(row.datetime).toLocaleTimeString(); } catch { return row.datetime; } })()}
                    </span>
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
