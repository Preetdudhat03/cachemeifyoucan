"use client";

import { useState, FormEvent } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  isLoading = false,
  placeholder = "Ask about options data... e.g. Show unusual options activity",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && !isLoading) {
      onSearch(trimmed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto" style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(0,0,0,0.4)",
          borderRadius: "999px",
          border: "1px solid var(--border)",
          padding: "0.25rem",
          transition: "border-color 0.3s, box-shadow 0.3s",
          boxShadow: "0 0 20px rgba(0,229,255,0.05)"
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--cyan)";
          e.currentTarget.style.boxShadow = "0 0 30px var(--cyan-glow)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.boxShadow = "0 0 20px rgba(0,229,255,0.05)";
        }}
      >
        <span style={{ paddingLeft: "1.5rem", color: "var(--cyan)", opacity: 0.7 }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text)",
            padding: "1rem 1.25rem",
            fontSize: "1.1rem",
            fontFamily: "var(--font)"
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="btn btn-primary btn-sm"
          style={{
            borderRadius: "999px",
            background: "var(--cyan)",
            color: "#000",
            boxShadow: "0 0 15px var(--cyan-glow)"
          }}
        >
          {isLoading ? "ENGINE RUNNING..." : "ANALYZE"}
        </button>
      </div>
    </form>
  );
}
