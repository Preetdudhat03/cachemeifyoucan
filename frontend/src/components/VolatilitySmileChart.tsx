"use client"
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false }) as any;

export default function VolatilitySmileChart() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    fetch(`${API_BASE}/volatility-smile`)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(e => console.error("Error fetching Volatility Smile", e));
  }, []);

  if (!data || !data.strikes) {
    return (
      <div className="p-4 bg-slate-900 rounded-xl h-[450px] flex items-center justify-center animate-pulse border border-slate-800">
        <p className="text-slate-500 font-medium">Calculating Polynomial Curves...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[350px] flex flex-col pt-2">
      <div className="flex justify-end mb-4 w-full px-2">
        <span className="px-5 py-2 bg-gradient-to-r from-violet-600/20 to-pink-600/20 text-pink-300 rounded-full text-xs font-black tracking-widest border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.15)] uppercase">
          AI Detection: {data.pattern}
        </span>
      </div>

      <div className="w-full flex-1">
        <Plot
          data={[
            {
              x: data.strikes,
              y: data.iv_ce,
              mode: 'markers',
              type: 'scatter',
              name: 'Raw Call IV',
              marker: { color: '#06b6d4', size: 6 } // cyan-500
            },
            {
              x: data.strikes,
              y: data.curve_ce,
              mode: 'lines',
              type: 'scatter',
              name: 'Polynomial Best Fit',
              line: { color: '#ec4899', width: 4, shape: 'spline' } // pink-500
            }
          ]}
          layout={{
            autosize: true,
            margin: { l: 50, r: 20, b: 40, t: 0 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            xaxis: { title: 'Strike Price', gridcolor: 'rgba(255,255,255,0.05)', tickfont: { color: '#818cf8' }, titlefont: { color: '#818cf8' } },
            yaxis: { title: 'Implied Volatility', gridcolor: 'rgba(255,255,255,0.05)', tickfont: { color: '#818cf8' }, titlefont: { color: '#818cf8' } },
            legend: { font: { color: '#e2e8f0' }, orientation: "h", y: -0.2 }
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          config={{ responsive: true, displayModeBar: false }}
        />
      </div>
    </div>
  );
}
