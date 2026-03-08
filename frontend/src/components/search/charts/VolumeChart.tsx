"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface VolumeChartProps {
  strikes: number[];
  volumeCe?: number[];
  volumePe?: number[];
  volume?: number[];
  title?: string;
}

const PLOTLY_THEME = {
  paper_bgcolor: "rgba(30, 41, 59, 0.5)",
  plot_bgcolor: "rgba(30, 41, 59, 0.3)",
  font: { color: "#94a3b8", family: "Inter, sans-serif" },
  margin: { t: 50, r: 30, b: 50, l: 50 },
};

export function VolumeChart({
  strikes,
  volumeCe = [],
  volumePe = [],
  volume = [],
  title = "Volume by Strike",
}: VolumeChartProps) {
  const hasSplit = volumeCe.length > 0 && volumePe.length > 0;

  const data = hasSplit
    ? [
        {
          x: strikes,
          y: volumeCe,
          type: "bar" as const,
          name: "Call Volume",
          marker: { color: "#06b6d4" },
        },
        {
          x: strikes,
          y: volumePe,
          type: "bar" as const,
          name: "Put Volume",
          marker: { color: "#f59e0b" },
        },
      ]
    : [
        {
          x: strikes,
          y: volume,
          type: "bar" as const,
          name: "Volume",
          marker: { color: "#06b6d4" },
        },
      ];

  return (
    <div className="w-full h-[400px]">
      <Plot
        data={data}
        layout={{
          ...PLOTLY_THEME,
          title: { text: title, font: { size: 16 } },
          barmode: hasSplit ? "group" : "relative",
          xaxis: { title: "Strike", gridcolor: "rgba(148, 163, 184, 0.1)" },
          yaxis: { title: "Volume", gridcolor: "rgba(148, 163, 184, 0.1)" },
          legend: { x: 1, y: 1, xanchor: "right" },
        }}
        config={{ responsive: true, displayModeBar: true }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
