/**
 * AppShell — top navigation bar, global search trigger (⌘K / Ctrl+K),
 * route outlet, and footer.
 */
import * as React from "react";
import { useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import SearchPalette from "./SearchPalette";

export default function AppShell({
  searchOpen,
  setSearchOpen,
  children,
}: {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  children: React.ReactNode;
}) {
  // global ⌘K / Ctrl+K opens the palette anywhere
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="topbar-brand" aria-label="ChemLab home">
          <span className="brand-orb" aria-hidden>⚗️</span>
          <span>
            Chem<span style={{ color: "var(--accent)" }}>Lab</span>
          </span>
        </Link>

        <nav className="topbar-nav" aria-label="Main">
          <NavLink to="/sims" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            🧪 <span>Simulations</span>
          </NavLink>
          <NavLink to="/curriculum" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            📚 <span>Curriculum</span>
          </NavLink>
          <NavLink to="/periodic-table" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            ⚛️ <span>Periodic table</span>
          </NavLink>
        </nav>

        <div className="topbar-spacer" />

        <button
          className="topbar-search-btn"
          onClick={() => setSearchOpen(true)}
          aria-label="Open search"
        >
          🔍 <span className="p-label">Search everything…</span> <span className="kbd">⌘K</span>
        </button>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <footer className="app-footer">
        ChemLab · An interactive AP Chemistry workspace — simulations &amp; curriculum share one engine.
        Runs fully offline. Models are simplified for learning; see in-app notes on representation vs. reality.
      </footer>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
