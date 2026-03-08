"use client"
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function VolatilitySurface3D() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/volatility-surface')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => console.error("Error fetching Volatility Surface", e));
  }, []);

  if (loading || !data || !data.z_iv_CE) {
    return (
      <div className="p-4 bg-slate-900 rounded-xl h-[550px] flex items-center justify-center animate-pulse border border-slate-800">
        <p className="text-slate-500 font-medium">Rendering 3D Surface Mathematics...</p>
      </div>
    );
  }

  const plotData = [
    {
      z: data.z_iv_CE,
      x: data.x_strikes,
      y: data.y_expiries,
      type: 'surface',
      colorscale: 'Viridis'
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
            xaxis: { title: 'Strike Price', color: '#818cf8', gridcolor: 'rgba(255,255,255,0.1)', backgroundcolor: 'rgba(0,0,0,0)' },
            yaxis: { title: 'Expiry Date', color: '#818cf8', gridcolor: 'rgba(255,255,255,0.1)', backgroundcolor: 'rgba(0,0,0,0)' },
            zaxis: { title: 'Implied Volatility', color: '#f472b6', gridcolor: 'rgba(255,255,255,0.1)', backgroundcolor: 'rgba(0,0,0,0)' },
            camera: { eye: { x: 1.5, y: -1.5, z: 1.2 } }
          }
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{ responsive: true, displayModeBar: false }}
      />
    </div>
  );
}
