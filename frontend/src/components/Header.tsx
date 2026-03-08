"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface HeaderProps {
  loading?: boolean;
  onSync?: () => void;
}

export default function Header({ loading = false, onSync }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <Link href="/" className="header-logo">
        <span className="logo-icon">⬡</span>
        <span>OptionSight AI</span>
      </Link>
      <nav className="header-nav">
        <Link href="/" className="nav-link">Home</Link>
        <Link href="/search" className="nav-link">AI Search</Link>
        <a href="/#analytics" className="nav-link">Analytics</a>
        <a href="/#radar" className="nav-link">Radar</a>
        {onSync && (
          <button 
            onClick={onSync} 
            disabled={loading} 
            className="nav-link nav-cta"
          >
            <span className="dot dot-orange" /> {loading ? "Syncing…" : "Sync Data"}
          </button>
        )}
      </nav>
    </header>
  );
}
