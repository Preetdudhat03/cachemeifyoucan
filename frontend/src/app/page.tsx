"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import MarketOverview from "@/components/MarketOverview";
import InsightsPanel from "@/components/InsightsPanel";
import AnomalyAlerts from "@/components/AnomalyAlerts";
import SentimentGauge from "@/components/SentimentGauge";
import VolatilitySurface3D from "@/components/VolatilitySurface3D";
import LiquidityLandscape from "@/components/LiquidityLandscape";
import ActivityHeatmapsMatrix from "@/components/ActivityHeatmapsMatrix";
import VolatilitySmileChart from "@/components/VolatilitySmileChart";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ChapterSection from "@/components/ChapterSection";

const ParticleCanvas = dynamic(() => import("@/components/ParticleCanvas"), { ssr: false });
const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<Record<string, any> | null>(null);
  const [insights, setInsights] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [regime, setRegime] = useState<Record<string, any> | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
      const [ovRes, heatRes, insRes, anomRes, regRes] = await Promise.all([
        fetch(`${BASE_URL}/overview`),
        fetch(`${BASE_URL}/heatmaps`),
        fetch(`${BASE_URL}/insights`),
        fetch(`${BASE_URL}/anomalies`),
        fetch(`${BASE_URL}/market-regime`),
      ]);
      setOverview(await ovRes.json());
      const insData = await insRes.json();
      setInsights(insData.insights || []);
      setAnomalies(await anomRes.json());
      setRegime(await regRes.json());
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setLoading(true);
    try {
      const BASE_URL = "http://127.0.0.1:8000/api";
      await fetch(`${BASE_URL}/reload`, { method: "POST" });
      await fetchData();
    } catch (error) {
      console.error("Error triggering ML reload:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ------ TECH STACK DATA ------
  const stackCards = [
    { icon: "⚡", color: "#00e5ff", name: "Next.js + React", desc: "Server-rendered interactive dashboard with WebGL 3D chart integration", badge: "Frontend" },
    { icon: "🔬", color: "#ff6b35", name: "FastAPI + Python", desc: "High-performance async API serving ML models, IV calculations, and market analytics", badge: "Backend" },
    { icon: "🧠", color: "#b388ff", name: "scikit-learn", desc: "Isolation Forest anomaly detection & K-Means market regime clustering", badge: "ML · Python" },
    { icon: "📊", color: "#11a0d9", name: "Plotly.js WebGL", desc: "Interactive 3D surface charts, heatmaps, and polynomial curve fitting visualizations", badge: "Visualization" },
    { icon: "🐼", color: "#ffd700", name: "Pandas + SciPy", desc: "Feature engineering, Black-Scholes IV solving via Brentq, and time-series processing", badge: "Data · Python" },
    { icon: "📈", color: "#22c55e", name: "Black-Scholes Model", desc: "Mathematical implied volatility computation using Newton/Brentq root-finding algorithms", badge: "Quant Finance" },
  ];

  // ------ INSIGHT CHAPTER CARDS ------
  const insightCards = [
    { num: "01", label: "Data Pipeline", title: "Process at Scale", desc: "Ingest and structure large-scale options datasets across strikes, expiries, and time dimensions with automatic feature engineering." },
    { num: "02", label: "Visual Analytics", title: "3D Market Intelligence", desc: "Interactive Liquidity Landscape, IV Surface, Volatility Smile, and OI Heatmaps powered by WebGL rendering.", highlight: false },
    { num: "03", label: "AI Radar", title: "Anomaly Detection", desc: "Isolation Forest–powered anomaly radar for volume spikes, sudden OI changes, and unusual strike activity alerts.", highlight: true },
    { num: "04", label: "Market Regimes", title: "Unsupervised Clustering", desc: "K-Means automatically classifies the market into behavioral regimes: Accumulation, Breakout, Bearish, Neutral.", highlight: false },
  ];

  return (
    <>
      <Loader />
      <ParticleCanvas />
      <Header loading={loading} onSync={handleSync} />

      <main style={{ position: "relative", zIndex: 1 }}>
        <HeroSection />

        <ChapterSection
          id="overview"
          chapterNum="CHAPTER 01"
          title="Market Overview"
          description="Real-time market metrics derived from the options chain. AI-synthesized sentiment, support & resistance zones, and PCR analysis — all automatically computed from your dataset."
          bg2
        >
          {overview && (
            <div className="glass-card" style={{ padding: "1.5rem 2rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <span className="chapter-square-orange" style={{ width: 8, height: 8, display: "inline-block", background: "var(--orange)" }} />
                <span style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "0.15em", color: "var(--orange)", textTransform: "uppercase" }}>Live AI Insight</span>
              </div>
              <p style={{ color: "var(--text)", fontSize: "1.05rem", lineHeight: 1.75 }}>
                Large liquidity concentration at <strong style={{ color: "var(--cyan)" }}>{overview.resistance?.toLocaleString()}</strong> strike suggests an algorithmic resistance zone. Sentiment indicators remain highly <strong style={{ color: "var(--cyan)", textTransform: "uppercase" }}>{overview.sentiment}</strong> with PCR resting at <strong style={{ color: "var(--cyan)" }}>{overview.pcr?.toFixed(2)}</strong>. 
                Downside support established at <strong style={{ color: "var(--cyan)" }}>{overview.support?.toLocaleString()}</strong>.
              </p>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
            <div className="stat-card">
              <div className="stat-val">{overview?.spot_price?.toLocaleString() || "—"}</div>
              <div className="stat-label">Spot Price</div>
            </div>
            <div className="stat-card">
              <div className="stat-val" style={{ color: overview?.sentiment === "bearish" ? "var(--orange)" : "var(--cyan)" }}>{overview?.pcr?.toFixed(2) || "—"}</div>
              <div className="stat-label">Put Call Ratio</div>
            </div>
            <div className="stat-card">
              <div className="stat-val" style={{ color: overview?.sentiment === "bearish" ? "var(--orange)" : "#22c55e", textTransform: "capitalize" }}>{overview?.sentiment || "—"}</div>
              <div className="stat-label">AI Sentiment</div>
            </div>
            <div className="stat-card">
              <div className="stat-val" style={{ color: "#22c55e" }}>{overview?.support?.toLocaleString() || "—"}</div>
              <div className="stat-label">Support Zone</div>
            </div>
            <div className="stat-card">
              <div className="stat-val" style={{ color: "var(--orange)" }}>{overview?.resistance?.toLocaleString() || "—"}</div>
              <div className="stat-label">Resistance Zone</div>
            </div>
          </div>

          {regime && (
            <div className="anomaly-stats-bar">
              <div className="astat astat-cyan">
                <span className="astat-val">{regime.current_regime}</span>
                <span className="astat-label">AI Market Regime</span>
              </div>
              <div className="astat astat-orange">
                <span className="astat-val">{regime.num_clusters || 4}</span>
                <span className="astat-label">K-Means Clusters</span>
              </div>
              <div className="astat astat-purple">
                <span className="astat-val">{Array.isArray(anomalies) ? anomalies.length : 0}</span>
                <span className="astat-label">Anomalies Found</span>
              </div>
            </div>
          )}
        </ChapterSection>

        <ChapterSection
          id="analytics"
          chapterNum="CHAPTER 02"
          title="Visual Analytics"
          description="Interactive exploration of market sentiment, volatility structure, and liquidity positioning through polynomial curve-fitting and aggregated macro gauges."
          orange
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem", marginBottom: "2rem" }}>
            <div className="glass-card" style={{ padding: "2rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Market Sentiment</h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1.5rem", fontFamily: "var(--mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Aggregated macro positioning gauge</p>
              <SentimentGauge />
            </div>
            <div className="glass-card" style={{ padding: "2rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Volatility Smile & Skew</h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem", fontFamily: "var(--mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Polynomial options structure fitting</p>
              <div style={{ minHeight: 350 }}><VolatilitySmileChart /></div>
            </div>
          </div>
        </ChapterSection>

        <ChapterSection
          id="3d-charts"
          chapterNum="CHAPTER 03"
          title="3D Market Intelligence"
          description="WebGL-rendered topological maps of options market structure. Explore institutional positioning and Black-Scholes volatility modeling in three dimensions."
          bg2
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
            <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 40, height: 3, background: "var(--cyan)", borderRadius: 2, opacity: 0.5, marginBottom: "1rem" }} />
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", textAlign: "center" }}>Liquidity Landscape</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center", maxWidth: 400, marginBottom: "1.5rem" }}>Evolution of institutional OI positions mapped across strike width and time depth.</p>
              <div style={{ width: "100%", minHeight: 500, background: "rgba(0,0,0,0.3)", borderRadius: "var(--radius)", overflow: "hidden", padding: 8 }}><LiquidityLandscape /></div>
            </div>
            <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 40, height: 3, background: "var(--orange)", borderRadius: 2, opacity: 0.5, marginBottom: "1rem" }} />
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", textAlign: "center" }}>Implied Volatility Surface</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center", maxWidth: 400, marginBottom: "1.5rem" }}>3D topological map of Black-Scholes theoretical pricing premiums and volatility crush zones.</p>
              <div style={{ width: "100%", minHeight: 500, background: "rgba(0,0,0,0.3)", borderRadius: "var(--radius)", overflow: "hidden", padding: 8 }}><VolatilitySurface3D /></div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
            <div className="glass-card" style={{ padding: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.25rem" }}>Volume Heatmaps</h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Biphasic rendering of Calls vs Puts</p>
                </div>
                <span className="badge badge-blue">Bright zones = Institutional Activity</span>
              </div>
              <div style={{ minHeight: 400, background: "rgba(0,0,0,0.3)", borderRadius: "var(--radius)", overflow: "hidden", padding: 8 }}><ActivityHeatmapsMatrix /></div>
            </div>
            <InsightsPanel insights={insights} loading={loading} />
          </div>
        </ChapterSection>

        <section id="radar" style={{ padding: "5rem 2rem", maxWidth: 1200, margin: "0 auto" }}>
          <div className="glass-card" style={{ padding: "3rem" }}>
            <div className="chapter-label-wrap">
              <span className="chapter-square chapter-square-orange" />
              <span className="chapter-num chapter-num-orange">UNUSUAL ACTIVITY RADAR</span>
            </div>
            <h2 className="section-title">Detect Anomalies in Real Time</h2>
            <p className="section-body">
              The <strong>Isolation Forest</strong> model (scikit-learn) analyzes every row for abnormal
              volume spikes, unusual strike activity, and sudden open interest changes.
            </p>
            <AnomalyAlerts data={anomalies} loading={loading} />
            <p className="radar-footnote">
              Powered by <strong>Isolation Forest</strong> (scikit-learn) · Python backend via FastAPI ·
              Results shared with the Next.js frontend via REST API.
            </p>
          </div>
        </section>

        <ChapterSection
          id="tech-stack"
          chapterNum="CHAPTER 04"
          title="Open-Source Stack"
          description="Every component is FOSS. The FastAPI server handles data processing and orchestrates the Python ML pipeline. Next.js provides rich interactive WebGL charts on port 3000."
          bg2
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
            {stackCards.map(card => (
              <div className="stack-card" key={card.name}>
                <div className="stack-card-icon" style={{ color: card.color }}>{card.icon}</div>
                <div className="stack-card-name">{card.name}</div>
                <div className="stack-card-desc">{card.desc}</div>
                <div className="stack-card-badge">{card.badge}</div>
              </div>
            ))}
          </div>
          <div className="integration-diagram">
            <div className="int-node int-node-user">Browser<br /><small>Port 3000</small></div>
            <div className="int-arrow">⟶</div>
            <div className="int-node int-node-next">Next.js<br /><small>React + Plotly</small></div>
            <div className="int-arrow">⟶</div>
            <div className="int-node int-node-py">FastAPI<br /><small>Python Backend</small></div>
            <div className="int-arrow">⟶</div>
            <div className="int-node int-node-data">Pandas<br /><small>Feature Eng.</small></div>
            <div className="int-arrow">⟶</div>
            <div className="int-node int-node-ml">scikit-learn<br /><small>ML Models</small></div>
          </div>
        </ChapterSection>

        <ChapterSection
          id="insights"
          chapterNum="CHAPTER 05"
          title="Share the Journey"
          description="Explore every dimension of options market analytics with AI. From raw data pipelines to real-time anomaly alerts — build the future of derivatives insight."
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {insightCards.map(card => (
              <article key={card.num} className={`insight-card${card.highlight ? ' insight-card-highlight' : ''}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <span className="insight-label">{card.label}</span>
                  <span className="insight-num">{card.num}</span>
                </div>
                <h3 className="insight-title">{card.title}</h3>
                <p className="insight-desc">{card.desc}</p>
              </article>
            ))}
          </div>
        </ChapterSection>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-icon">⬡</span>
            <span>OptionSight AI</span>
          </div>
          <p className="footer-copy">© 2025 OptionSight AI – AI-Powered Options Market Analytics · FOSS Stack</p>
          <div className="footer-links">
            <a href="#radar">Anomaly Radar</a>
            <a href="#3d-charts">3D Charts</a>
            <a href="#tech-stack">Tech Stack</a>
          </div>
        </div>
      </footer>
    </>
  );
}
