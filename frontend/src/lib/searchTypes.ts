/**
 * Shared types for the AI Market Search Engine module.
 */

export type ChartType =
  | "open_interest_distribution"
  | "call_vs_put"
  | "strike_heatmap"
  | "volume_spikes"
  | "oi_by_strike"
  | "volume_by_strike";

export interface StrikeLevel {
  strike: number;
  type: "support" | "resistance" | "atm" | "max_oi" | "max_volume";
  significance: number; // 0-100
  description?: string;
}

export interface ChartData {
  type: ChartType;
  title: string;
  data: Record<string, unknown>; // Plotly-compatible data structure
  layout?: Record<string, unknown>;
}

export interface StrategySuggestion {
  name: string;
  description: string;
  rationale: string;
  keyLevels?: number[];
  riskLevel: "low" | "medium" | "high";
}

export interface SearchResponse {
  query: string;
  explanation: string;
  chart: ChartData;
  keyLevels: StrikeLevel[];
  insights: string[];
  strategy?: StrategySuggestion;
  timestamp: string;
}

export interface SearchRequest {
  query: string;
  expiry?: string;
  symbol?: string;
}

/** Backend (Python FastAPI) search response shape */
export interface BackendSearchResponse {
  answer: string;
  chart_type: "line" | "bar" | "scatter" | null;
  chart_data: Record<string, unknown>;
  insights?: string[];
  sentiment: string;
  support?: number | null;
  resistance?: number | null;
}
