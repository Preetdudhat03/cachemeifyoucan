"use client"
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any;

export default function ActivityHeatmapsMatrix() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    fetch(`${API_BASE}/heatmaps`)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(e => console.error("Error fetching Heatmaps", e));
  }, []);

  if (!data || !data.z_oi_CE) {
    return (
      <div className="p-4 bg-slate-900 rounded-xl h-[450px] flex items-center justify-center animate-pulse border border-slate-800">
        <p className="text-slate-500 font-medium">Loading Heatmap Matrix...</p>
      </div>
    );
  }

  const plotData = [
    {
      z: data.z_oi_CE,
      x: data.x_strikes,
      y: data.y_expiries,
      type: 'heatmap',
      colorscale: 'YlOrRd',
      hoverongaps: false,
      hovertemplate:
        "<b>Strike:</b> %{x}<br>" +
        "<b>Expiry:</b> %{y}<br>" +
        "<b>Call Open Interest:</b> %{z:,.0f}<br>" +
        "<extra>High OI acts as resistance walls</extra>"
    }
  ];

  return (
    <div className="w-full h-[380px]">
      {(Plot as any) && (
        <Plot
          data={plotData as any}
          layout={{
            autosize: true,
            margin: { l: 80, r: 20, b: 40, t: 20 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            xaxis: {
              title: { text: 'Strike Price', font: { color: '#818cf8' } },
              tickfont: { color: '#818cf8' },
              gridcolor: 'rgba(255,255,255,0.05)'
            },
            yaxis: {
              title: { text: 'Expiry Date', font: { color: '#818cf8' } },
              tickfont: { color: '#818cf8' },
              gridcolor: 'rgba(255,255,255,0.05)'
            }
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          config={{ responsive: true, displayModeBar: false }}
        />
      )}
    </div>
  );
}
