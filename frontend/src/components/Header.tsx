"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface HeaderProps {
  loading?: boolean;
  onSync?: () => void;
}

export default function Header({ loading = false, onSync }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-active" : ""}`}>
      <Link href="/" className="header-logo" onClick={closeMenu}>
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

      <button
        className={`mobile-menu-toggle ${menuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`mobile-nav-overlay ${menuOpen ? "active" : ""}`}>
        <Link href="/" className="nav-link" onClick={closeMenu}>Home</Link>
        <Link href="/search" className="nav-link" onClick={closeMenu}>AI Search</Link>
        <a href="/#analytics" className="nav-link" onClick={closeMenu}>Analytics</a>
        <a href="/#radar" className="nav-link" onClick={closeMenu}>Radar</a>
        {onSync && (
          <button
            onClick={() => { onSync(); closeMenu(); }}
            disabled={loading}
            className="nav-link"
            style={{ textAlign: "left", color: "var(--orange)" }}
          >
            {loading ? "Syncing…" : "Sync Data"}
          </button>
        )}
      </div>
    </header>
  );
}
