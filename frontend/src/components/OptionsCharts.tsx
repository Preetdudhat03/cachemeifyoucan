"use client";

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart, Line
} from 'recharts';

interface HeatmapData {
  strikes: number[];
  oi_CE: number[];
  oi_PE: number[];
  volume_CE: number[];
  volume_PE: number[];
}

interface HeatmapProps {
  data: HeatmapData | null;
  loading: boolean;
}

export default function OptionsCharts({ data, loading }: HeatmapProps) {
  if (loading || !data) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg h-[400px] animate-pulse flex items-center justify-center">
        <span className="text-slate-600 font-medium">Loading Visualizations...</span>
      </div>
    );
  }

  // Transform matrix data into array of objects for Recharts safely
  const strikes = data?.strikes || [];
  const chartData = strikes.map((strike, i) => ({
    name: strike.toString(),
    strike: strike,
    CallOI: data?.oi_CE?.[i] || 0,
    PutOI: data?.oi_PE?.[i] || 0,
    CallVol: data?.volume_CE?.[i] || 0,
    PutVol: data?.volume_PE?.[i] || 0,
  }));

  // Custom generic tooltip for dark mode
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl text-sm">
          <p className="text-white font-bold mb-2">Strike: {label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-4 mb-1">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="text-slate-200 font-medium">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg h-full">
      <h2 className="text-xl font-bold text-white mb-6">Strike vs Volume & Open Interest</h2>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              tick={{fill: '#94a3b8', fontSize: 12}} 
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              yAxisId="left"
              stroke="#94a3b8" 
              tick={{fill: '#94a3b8', fontSize: 12}} 
              tickFormatter={(value) => value > 1000 ? `${(value/1000).toFixed(0)}k` : value}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#94a3b8" 
              tick={{fill: '#94a3b8', fontSize: 12}}
              tickFormatter={(value) => value > 1000 ? `${(value/1000).toFixed(0)}k` : value}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {/* Volume as Bars */}
            <Bar yAxisId="left" dataKey="CallVol" name="Call Volume" fill="#3b82f6" opacity={0.8} radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="PutVol" name="Put Volume" fill="#f97316" opacity={0.8} radius={[4, 4, 0, 0]} />
            
            {/* Open Interest as Lines to show structure S/R */}
            <Line yAxisId="right" type="monotone" dataKey="CallOI" name="Call OI" stroke="#60a5fa" strokeWidth={3} dot={{r: 4}} />
            <Line yAxisId="right" type="monotone" dataKey="PutOI" name="Put OI" stroke="#fb923c" strokeWidth={3} dot={{r: 4}} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
