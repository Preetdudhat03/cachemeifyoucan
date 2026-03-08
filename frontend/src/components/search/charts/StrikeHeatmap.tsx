"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface StrikeHeatmapProps {
  strikes: number[];
  oiIntensity: number[];
  volumeIntensity?: number[];
  title?: string;
}

const PLOTLY_THEME = {
  paper_bgcolor: "rgba(30, 41, 59, 0.5)",
  plot_bgcolor: "rgba(30, 41, 59, 0.3)",
  font: { color: "#94a3b8", family: "Inter, sans-serif" },
  margin: { t: 50, r: 30, b: 50, l: 50 },
};

export function StrikeHeatmap({
  strikes,
  oiIntensity,
  volumeIntensity = [],
  title = "Strike Heatmap",
}: StrikeHeatmapProps) {
  const z = volumeIntensity.length > 0
    ? [oiIntensity, volumeIntensity]
    : [oiIntensity];
  const yLabels = volumeIntensity.length > 0 ? ["OI Intensity", "Volume Intensity"] : ["Intensity"];

  return (
    <div className="w-full h-[400px]">
      <Plot
        data={[
          {
            z,
            x: strikes,
            y: yLabels,
            type: "heatmap",
            colorscale: [
              [0, "#0f172a"],
              [0.25, "#1e3a5f"],
              [0.5, "#06b6d4"],
              [0.75, "#22d3ee"],
              [1, "#67e8f9"],
            ],
            showscale: true,
            colorbar: { title: "Intensity" },
          },
        ]}
        layout={{
          ...PLOTLY_THEME,
          title: { text: title, font: { size: 16 } },
          xaxis: { title: "Strike", side: "bottom" },
          yaxis: { title: "" },
        }}
        config={{ responsive: true, displayModeBar: true }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
