"use client"
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any;

export default function LiquidityLandscape() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    fetch(`${API_BASE}/liquidity-landscape`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading || !data || !data.z_oi) {
    return (
      <div className="p-4 bg-slate-900 rounded-xl h-[550px] flex items-center justify-center animate-pulse border border-slate-800">
        <p className="text-slate-500 font-medium">Mapping Institutional Liquidity...</p>
      </div>
    );
  }

  const plotData = [
    {
      z: data.z_oi,
      x: data.x_strikes,
      y: data.y_times,
      type: 'surface',
      colorscale: 'Inferno',
      name: 'Open Interest',
      hovertemplate:
        "<b>Time:</b> %{y}<br>" +
        "<b>Strike:</b> %{x}<br>" +
        "<b>Total Liquidity (OI):</b> %{z:,.0f}<br>" +
        "<extra>Liquidity Mountains show where market makers are trapped</extra>"
    }
  ];

  return (
    <div className="w-full h-full min-h-[500px]">
      <Plot
        data={plotData as any}
        layout={{
          autosize: true,
          margin: { l: 0, r: 0, b: 0, t: 0 },
          paper_bgcolor: 'transparent',
          scene: {
            xaxis: { title: 'Strike Price', color: '#22d3ee', gridcolor: 'rgba(255,255,255,0.1)', backgroundcolor: 'rgba(0,0,0,0)' },
            yaxis: { title: 'Time (HH:MM)', color: '#22d3ee', gridcolor: 'rgba(255,255,255,0.1)', backgroundcolor: 'rgba(0,0,0,0)' },
            zaxis: { title: 'Total Open Interest', color: '#e2e8f0', gridcolor: 'rgba(255,255,255,0.1)', backgroundcolor: 'rgba(0,0,0,0)' },
            camera: { eye: { x: -1.8, y: -1.2, z: 0.8 } }
          }
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{ responsive: true, displayModeBar: false }}
      />
    </div>
  );
}
