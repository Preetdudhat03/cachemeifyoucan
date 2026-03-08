import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Activity, ShieldAlert, Target } from 'lucide-react';

interface SentimentData {
  spot_price: number;
  pcr: number;
  sentiment: string;
  support: number;
  resistance: number;
}

interface OverviewProps {
  data: SentimentData | null;
  loading: boolean;
}

export default function MarketOverview({ data, loading }: OverviewProps) {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 animate-pulse">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-32 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"></div>
        ))}
      </div>
    );
  }

  const isBearish = data.sentiment === 'bearish';
  const isBullish = data.sentiment === 'bullish';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {/* Spot Price */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden group hover:border-white/20 transition-all hover:-translate-y-1">
        <div className="p-6 flex-1">
          <div className="flex justify-between items-start text-indigo-300/70">
            <span className="text-xs font-bold uppercase tracking-widest block">Spot Price</span>
            <div className="p-2 bg-white/5 rounded-xl border border-white/5 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
              <Activity size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-black text-white tracking-tight">{(data.spot_price || 0).toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-white/5 px-5 py-3 border-t border-white/10 text-xs text-indigo-200/60 font-medium">
          Underlying asset market value
        </div>
      </div>

      {/* PCR */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden group hover:border-white/20 transition-all hover:-translate-y-1">
        <div className="p-6 flex-1">
          <div className="flex justify-between items-start text-indigo-300/70">
            <span className="text-xs font-bold uppercase tracking-widest block">Put Call Ratio</span>
            <div className={`p-2 bg-white/5 rounded-xl border border-white/5 transition-colors ${
              isBearish ? 'group-hover:bg-red-500/20 group-hover:text-red-400' : 
              isBullish ? 'group-hover:bg-emerald-500/20 group-hover:text-emerald-400' : 
              'group-hover:bg-blue-500/20 group-hover:text-blue-400'
            }`}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className={`text-4xl font-black tracking-tight ${
              isBearish ? 'text-red-400' : isBullish ? 'text-emerald-400' : 'text-blue-400'
            }`}>
              {(data.pcr || 0).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="bg-white/5 px-5 py-3 border-t border-white/10 text-xs text-indigo-200/60 font-medium">
          {isBearish ? 'Bearish positioning trend' : isBullish ? 'Bullish accumulation' : 'Neutral volume balance'}
        </div>
      </div>

      {/* Sentiment */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden group hover:border-white/20 transition-all hover:-translate-y-1">
        <div className="p-6 flex-1">
          <div className="flex justify-between items-start text-indigo-300/70">
            <span className="text-xs font-bold uppercase tracking-widest block">AI Sentiment</span>
            <div className={`p-2 bg-white/5 rounded-xl border border-white/5 transition-colors ${
              isBearish ? 'group-hover:bg-red-500/20 bg-red-500/10 text-red-400' : 'group-hover:bg-emerald-500/20 bg-emerald-500/10 text-emerald-400'
            }`}>
              {isBearish ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2 text-white capitalize">
            <span className="text-3xl font-black tracking-tight">{data.sentiment}</span>
          </div>
        </div>
        <div className="bg-white/5 px-5 py-3 border-t border-white/10 text-xs text-indigo-200/60 font-medium">
          Synthesized ML macro outlook
        </div>
      </div>

      {/* Support (Put Wall) */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden group hover:border-emerald-500/30 transition-all hover:-translate-y-1">
        <div className="p-6 flex-1">
          <div className="flex justify-between items-start text-emerald-400/80">
            <span className="text-xs font-bold uppercase tracking-widest block">Highest Put OI</span>
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500/20 text-emerald-400 transition-colors">
              <Target size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-black text-emerald-300 tracking-tight">{(data.support || 0).toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-emerald-500/5 px-5 py-3 border-t border-emerald-500/10 text-xs text-emerald-200/70 font-medium">
          Primary downside support zone
        </div>
      </div>

      {/* Resistance (Call Wall) */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden group hover:border-pink-500/30 transition-all hover:-translate-y-1">
         <div className="p-6 flex-1">
          <div className="flex justify-between items-start text-pink-400/80">
            <span className="text-xs font-bold uppercase tracking-widest block">Highest Call OI</span>
            <div className="p-2 bg-pink-500/10 rounded-xl border border-pink-500/20 group-hover:bg-pink-500/20 text-pink-400 transition-colors">
              <Target size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-black text-pink-300 tracking-tight">{(data.resistance || 0).toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-pink-500/5 px-5 py-3 border-t border-pink-500/10 text-xs text-pink-200/70 font-medium">
          Algorithmic overhead resistance
        </div>
      </div>
    </div>
  );
}
