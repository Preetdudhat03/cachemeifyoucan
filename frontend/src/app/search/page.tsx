"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { getApiBaseUrl, safeFetch } from "@/lib/apiConfig";
import { SearchBar } from "@/components/search/SearchBar";
import { QuerySuggestions } from "@/components/search/QuerySuggestions";
import { BackendChartDisplay } from "@/components/search/BackendChartDisplay";
import { SupportResistanceCard } from "@/components/search/SupportResistanceCard";
import { SentimentBadge } from "@/components/search/SentimentBadge";
import type { BackendSearchResponse } from "@/lib/types";

import Header from "@/components/Header";
import ChapterSection from "@/components/ChapterSection";

const ParticleCanvas = dynamic(() => import("@/components/ParticleCanvas"), { ssr: false });
const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });

export default function SearchPage() {
  const [result, setResult] = useState<BackendSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const BASE_URL = getApiBaseUrl();
      const data = await safeFetch(`${BASE_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      setResult(data);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader />
      <ParticleCanvas />
      <Header loading={loading} />

      <main style={{ position: "relative", zIndex: 1, paddingTop: "80px" }}>
        <ChapterSection
          id="search-input"
          chapterNum="AI ENGINE"
          title="Market Search"
          description="Ask natural language questions about options market data, institutional positioning, and volatility anomalies."
        >
          <div className="glass-card" style={{ padding: "3rem 2rem", marginTop: "2rem" }}>
            <SearchBar onSearch={handleSearch} isLoading={loading} />
            <QuerySuggestions onSelect={handleSearch} disabled={loading} />
          </div>
        </ChapterSection>

        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem 5rem" }}>
          {error && (
            <div className="glass-card" style={{ padding: "1.5rem", borderLeft: "4px solid var(--orange)", color: "var(--orange)", marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.5rem" }}>SEARCH ERROR</h3>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-8" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Answer + Sentiment */}
              <div className="glass-card" style={{ padding: "2.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span className="chapter-square" style={{ width: 8, height: 8 }} />
                    <span className="chapter-num" style={{ fontSize: "0.65rem" }}>AI ANALYSIS RESPONSE</span>
                  </div>
                  <SentimentBadge sentiment={result.sentiment} />
                </div>
                <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--text)" }}>{result.answer}</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                {/* Insights */}
                {result.insights && result.insights.length > 0 && (
                  <div className="glass-card" style={{ padding: "2rem" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem", color: "var(--cyan)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      Key Insights
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {result.insights.map((insight: string, i: number) => (
                        <li key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                          <span style={{ color: "var(--cyan)" }}>▸</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Support / Resistance */}
                <SupportResistanceCard
                  support={result.support}
                  resistance={result.resistance}
                />
              </div>

              {/* Chart */}
              <div className="glass-card" style={{ padding: "2rem" }}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.25rem" }}>Data Visualization</h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {result.chart_type?.replace("_", " ")} Representation
                  </p>
                </div>
                <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "var(--radius)", padding: "1rem" }}>
                  <BackendChartDisplay
                    chart_type={result.chart_type}
                    chart_data={result.chart_data}
                  />
                </div>
              </div>
            </div>
          )}

          {!result && !loading && !error && (
            <div style={{ textAlign: "center", paddingTop: "4rem", paddingBottom: "4rem", opacity: 0.5 }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⬡</div>
              <p style={{ fontFamily: "var(--mono)", fontSize: "0.8rem", letterSpacing: "0.1em" }}>ENGINE READY – AWAITING INPUT</p>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-icon">⬡</span>
            <span>OptionSight AI</span>
          </div>
          <p className="footer-copy">© 2025 OptionSight AI – AI Search Module</p>
        </div>
      </footer>
    </>
  );
}
