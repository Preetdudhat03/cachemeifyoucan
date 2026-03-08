"use client";

export default function HeroSection() {
  return (
    <section
      className="hero-section"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "clamp(4rem, 15vh, 8rem) 1.5rem 4rem",
        position: "relative"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 90% 60% at 50% 40%, rgba(0,229,255,0.05) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(255,107,53,0.04) 0%, transparent 55%)",
          pointerEvents: "none"
        }}
      />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", width: "100%" }}>
        <p style={{ marginBottom: "1.5rem" }}>
          <span className="badge badge-blue">CodeForge FinTech Challenge 2025</span>
        </p>
        <h1 style={{ fontSize: "clamp(2.4rem, 8vw, 5.5rem)", fontWeight: 200, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
          <span style={{ display: "block" }}>AI-Powered</span>
          <span
            className="hero-title-main"
            style={{
              display: "inline-block",
              fontWeight: 700,
              background: "linear-gradient(135deg, #00e5ff 0%, #00b4d8 50%, #ff6b35 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              paddingBottom: "0.1em"
            }}
          >
            Options Market
          </span>
          <span style={{ display: "block" }}>Analytics</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)", maxWidth: 520, margin: "0 auto 2.5rem", lineHeight: 1.8 }}>
          Transform raw derivatives data into clear visual insights and intelligent analytics.
          Detect anomalies in real time. Explore strike-wise open interest. Uncover hidden patterns.
        </p>
        <div className="mobile-stack" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          <a href="#overview" className="btn btn-primary">
            Enter Experience
            <span className="btn-dot" />
          </a>
          <a href="#3d-charts" className="btn btn-outline">Explore 3D Charts ↗</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {["Next.js", "FastAPI", "scikit-learn", "Plotly", "Pandas", "SciPy"].map((t, i) => (
            <span key={t} style={{ display: "flex", alignItems: "center" }}>
              <span className="stack-tag" style={{ fontSize: "0.8rem" }}>{t}</span>
              {i < 5 && <span className="stack-divider" style={{ margin: "0 0.4rem", opacity: 0.3 }}>·</span>}
            </span>
          ))}
        </div>
      </div>
      <div className="hero-scroll-indicator" aria-hidden="true">
        <span /><span /><span />
      </div>
    </section>
  );
}
