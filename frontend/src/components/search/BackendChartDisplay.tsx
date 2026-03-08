"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false }) as any;

const THEME = {
  paper_bgcolor: "rgba(30, 41, 59, 0.5)",
  plot_bgcolor: "rgba(30, 41, 59, 0.3)",
  font: { color: "#94a3b8", family: "Inter, sans-serif" },
  margin: { t: 50, r: 30, b: 50, l: 50 },
};

interface BackendChartDisplayProps {
  chart_type: "line" | "bar" | "scatter" | null;
  chart_data: Record<string, unknown>;
}

export function BackendChartDisplay({
  chart_type,
  chart_data,
}: BackendChartDisplayProps) {
  if (!chart_type || !chart_data) {
    return (
      <div className="bg-fintech-card rounded-xl border border-slate-600/50 p-6 flex items-center justify-center min-h-[300px] text-slate-500">
        No chart data for this response.
      </div>
    );
  }

  const strikes = (chart_data.strikes as number[]) || [];
  const callOi = (chart_data.call_oi as number[]) || [];
  const putOi = (chart_data.put_oi as number[]) || [];
  const callVolume = (chart_data.call_volume as number[]) || [];
  const putVolume = (chart_data.put_volume as number[]) || [];
  const unusualTrades = (chart_data.unusual_trades as Array<{ strike: number; option_type: string; volume: number; z_score: number }>) || [];

  if (chart_type === "line" && strikes.length > 0) {
    const n = strikes.length;
    const callOiArr = callOi.length >= n ? callOi.slice(0, n) : [...callOi, ...new Array(n - callOi.length).fill(0)];
    const putOiArr = putOi.length >= n ? putOi.slice(0, n) : [...putOi, ...new Array(n - putOi.length).fill(0)];
    const x = strikes;
    return (
      <div className="bg-fintech-card rounded-xl border border-slate-600/50 p-6">
        <div className="w-full h-[400px]">
          <Plot
            data={[
              { x, y: callOiArr, type: "scatter", mode: "lines+markers", name: "Call OI", marker: { color: "#06b6d4" }, line: { width: 2 } },
              { x, y: putOiArr, type: "scatter", mode: "lines+markers", name: "Put OI", marker: { color: "#f59e0b" }, line: { width: 2 } },
            ]}
            layout={{
              ...THEME,
              title: { text: "Open Interest by Strike", font: { size: 16 } },
              xaxis: { title: "Strike", gridcolor: "rgba(148, 163, 184, 0.1)" },
              yaxis: { title: "Open Interest", gridcolor: "rgba(148, 163, 184, 0.1)" },
              legend: { x: 1, y: 1, xanchor: "right" },
            }}
            config={{ responsive: true, displayModeBar: true }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    );
  }

  if (chart_type === "bar" && strikes.length > 0) {
    const callVol = callVolume.length === strikes.length ? callVolume : callVolume.length ? callVolume : [];
    const putVol = putVolume.length === strikes.length ? putVolume : putVolume.length ? putVolume : [];
    return (
      <div className="bg-fintech-card rounded-xl border border-slate-600/50 p-6">
        <div className="w-full h-[400px]">
          <Plot
            data={[
              { x: strikes, y: callVol, type: "bar", name: "Call Volume", marker: { color: "#06b6d4" } },
              { x: strikes, y: putVol, type: "bar", name: "Put Volume", marker: { color: "#f59e0b" } },
            ]}
            layout={{
              ...THEME,
              title: { text: "Volume by Strike", font: { size: 16 } },
              barmode: "group",
              xaxis: { title: "Strike", gridcolor: "rgba(148, 163, 184, 0.1)" },
              yaxis: { title: "Volume", gridcolor: "rgba(148, 163, 184, 0.1)" },
              legend: { x: 1, y: 1, xanchor: "right" },
            }}
            config={{ responsive: true, displayModeBar: true }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    );
  }

  if (chart_type === "scatter" && unusualTrades.length > 0) {
    const x = unusualTrades.map((t) => t.strike);
    const y = unusualTrades.map((t) => t.volume);
    const text = unusualTrades.map((t) => `${t.strike} ${t.option_type}<br>Vol: ${t.volume.toLocaleString()}<br>Z: ${t.z_score?.toFixed(1) ?? ""}`);
    return (
      <div className="bg-fintech-card rounded-xl border border-slate-600/50 p-6">
        <div className="w-full h-[400px]">
          <Plot
            data={[
              { x, y, type: "scatter", mode: "markers", name: "Unusual", text, hoverinfo: "text", marker: { size: 12, color: "#06b6d4" } },
            ]}
            layout={{
              ...THEME,
              title: { text: "Unusual Activity", font: { size: 16 } },
              xaxis: { title: "Strike", gridcolor: "rgba(148, 163, 184, 0.1)" },
              yaxis: { title: "Volume", gridcolor: "rgba(148, 163, 184, 0.1)" },
            }}
            config={{ responsive: true, displayModeBar: true }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    );
  }

  if (chart_type === "scatter" && strikes.length > 0 && (callOi.length || putOi.length)) {
    const callOiArr = callOi.length === strikes.length ? callOi : [];
    const putOiArr = putOi.length === strikes.length ? putOi : [];
    return (
      <div className="bg-fintech-card rounded-xl border border-slate-600/50 p-6">
        <div className="w-full h-[400px]">
          <Plot
            data={[
              { x: strikes, y: callOiArr, type: "scatter", mode: "lines+markers", name: "Call OI", marker: { color: "#06b6d4" } },
              { x: strikes, y: putOiArr, type: "scatter", mode: "lines+markers", name: "Put OI", marker: { color: "#f59e0b" } },
            ]}
            layout={{
              ...THEME,
              title: { text: "OI by Strike", font: { size: 16 } },
              xaxis: { title: "Strike" },
              yaxis: { title: "Open Interest" },
              legend: { x: 1, y: 1, xanchor: "right" },
            }}
            config={{ responsive: true, displayModeBar: true }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    );
  }

  // Gamma Exposure bar chart
  const gammaValues = (chart_data.gamma_values as number[]) || [];
  if (chart_type === "bar" && gammaValues.length > 0 && strikes.length > 0) {
    return (
      <div className="bg-fintech-card rounded-xl border border-slate-600/50 p-6">
        <div className="w-full h-[400px]">
          <Plot
            data={[
              { x: strikes, y: gammaValues, type: "bar", name: "Gamma Exposure", marker: { color: "#8b5cf6" } },
            ]}
            layout={{
              ...THEME,
              title: { text: "Estimated Gamma Exposure by Strike", font: { size: 16 } },
              xaxis: { title: "Strike", gridcolor: "rgba(148, 163, 184, 0.1)" },
              yaxis: { title: "Gamma Exposure (OI × Volume)", gridcolor: "rgba(148, 163, 184, 0.1)" },
            }}
            config={{ responsive: true, displayModeBar: true }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-fintech-card rounded-xl border border-slate-600/50 p-6 flex items-center justify-center min-h-[300px] text-slate-500">
      No chart data for this response.
    </div>
  );
}
