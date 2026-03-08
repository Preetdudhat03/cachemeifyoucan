"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface CallVsPutChartProps {
  strikes: number[];
  callVolume: number[];
  putVolume: number[];
  title?: string;
}

const PLOTLY_THEME = {
  paper_bgcolor: "rgba(30, 41, 59, 0.5)",
  plot_bgcolor: "rgba(30, 41, 59, 0.3)",
  font: { color: "#94a3b8", family: "Inter, sans-serif" },
  margin: { t: 50, r: 30, b: 50, l: 50 },
};

export function CallVsPutChart({
  strikes,
  callVolume,
  putVolume,
  title = "Call vs Put Volume",
}: CallVsPutChartProps) {
  return (
    <div className="w-full h-[400px]">
      <Plot
        data={[
          {
            x: strikes,
            y: callVolume,
            type: "bar",
            name: "Call Volume",
            marker: { color: "#06b6d4" },
          },
          {
            x: strikes,
            y: putVolume.map((v) => -v),
            type: "bar",
            name: "Put Volume",
            marker: { color: "#f59e0b" },
          },
        ]}
        layout={{
          ...PLOTLY_THEME,
          title: { text: title, font: { size: 16 } },
          barmode: "relative",
          xaxis: { title: "Strike", gridcolor: "rgba(148, 163, 184, 0.1)" },
          yaxis: {
            title: "Volume (Calls + / Puts -)",
            gridcolor: "rgba(148, 163, 184, 0.1)",
            zeroline: true,
          },
          legend: { x: 1, y: 1, xanchor: "right" },
        }}
        config={{ responsive: true, displayModeBar: true }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
