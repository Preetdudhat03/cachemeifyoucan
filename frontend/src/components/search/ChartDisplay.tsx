"use client";

import type { ChartData } from "@/lib/types";
import { OpenInterestChart } from "./charts/OpenInterestChart";
import { VolumeChart } from "./charts/VolumeChart";
import { StrikeHeatmap } from "./charts/StrikeHeatmap";
import { CallVsPutChart } from "./charts/CallVsPutChart";

interface ChartDisplayProps {
  chart: ChartData;
}

export function ChartDisplay({ chart }: ChartDisplayProps) {
  const { type, title, data } = chart;

  switch (type) {
    case "open_interest_distribution":
      return (
        <div className="bg-fintech-card rounded-xl border border-slate-600/50 p-6">
          <OpenInterestChart
            strikes={(data.strikes as number[]) || []}
            oiCe={(data.oi_ce as number[]) || []}
            oiPe={(data.oi_pe as number[]) || []}
            title={title}
          />
        </div>
      );

    case "call_vs_put":
      return (
        <div className="bg-fintech-card rounded-xl border border-slate-600/50 p-6">
          <CallVsPutChart
            strikes={(data.strikes as number[]) || []}
            callVolume={(data.call_volume as number[]) || (data.volume_ce as number[]) || []}
            putVolume={(data.put_volume as number[]) || (data.volume_pe as number[]) || []}
            title={title}
          />
        </div>
      );

    case "strike_heatmap":
      return (
        <div className="bg-fintech-card rounded-xl border border-slate-600/50 p-6">
          <StrikeHeatmap
            strikes={(data.strikes as number[]) || []}
            oiIntensity={(data.oi_intensity as number[]) || []}
            volumeIntensity={(data.volume_intensity as number[]) || []}
            title={title}
          />
        </div>
      );

    case "volume_spikes":
      return (
        <div className="bg-fintech-card rounded-xl border border-slate-600/50 p-6">
          <VolumeChart
            strikes={(data.strikes as number[]) || []}
            volumeCe={(data.volume_ce as number[]) || []}
            volumePe={(data.volume_pe as number[]) || []}
            title={title}
          />
        </div>
      );

    default:
      return (
        <div className="bg-fintech-card rounded-xl border border-slate-600/50 p-6">
          <OpenInterestChart
            strikes={(data.strikes as number[]) || []}
            oiCe={(data.oi_ce as number[]) || []}
            oiPe={(data.oi_pe as number[]) || []}
            title={title}
          />
        </div>
      );
  }
}
