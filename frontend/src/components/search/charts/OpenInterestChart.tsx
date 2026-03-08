"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface OpenInterestChartProps {
  strikes: number[];
  oiCe: number[];
  oiPe: number[];
  title?: string;
}

const PLOTLY_THEME = {
  paper_bgcolor: "rgba(30, 41, 59, 0.5)",
  plot_bgcolor: "rgba(30, 41, 59, 0.3)",
  font: { color: "#94a3b8", family: "Inter, sans-serif" },
  margin: { t: 50, r: 30, b: 50, l: 50 },
};

export function OpenInterestChart({
  strikes,
  oiCe,
  oiPe,
  title = "Open Interest Distribution",
}: OpenInterestChartProps) {
  return (
    <div className="w-full h-[400px]">
      <Plot
        data={[
          {
            x: strikes,
            y: oiCe,
            type: "bar",
            name: "Call OI",
            marker: { color: "#06b6d4" },
          },
          {
            x: strikes,
            y: oiPe,
            type: "bar",
            name: "Put OI",
            marker: { color: "#f59e0b" },
          },
        ]}
        layout={{
          ...PLOTLY_THEME,
          title: { text: title, font: { size: 16 } },
          barmode: "group",
          xaxis: { title: "Strike", gridcolor: "rgba(148, 163, 184, 0.1)" },
          yaxis: { title: "Open Interest", gridcolor: "rgba(148, 163, 184, 0.1)" },
          legend: { x: 1, y: 1, xanchor: "right" },
        }}
        config={{ responsive: true, displayModeBar: true }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
