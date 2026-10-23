/**
 * SearchPalette — global ⌘K search overlay.
 * Searches everything (sims, reference pages, units, topics, lessons, concepts)
 * through the shared search engine and navigates on selection. Keyboard-first: arrows,
 * Enter, Escape.
 */
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { search, type ScoredResult } from "@/search/engine";
import { getSim } from "@/sims/registry";
import { TOPIC_INDEX, UNIT_MAP } from "@/curriculum/units";

export function resultHref(r: ScoredResult): string {
  switch (r.kind) {
    case "sim":
      return `/sims/${r.id}`;
    case "unit": {
      // unit docs are indexed by unit number
      const u = UNIT_MAP.get(Number(r.id));
      return u ? `/curriculum?unit=${u.id}` : "/curriculum";
    }
    case "topic":
    case "lesson": {
      const entry = TOPIC_INDEX.get(r.id);
      return entry ? `/curriculum/${entry.unit.id}/${entry.topic.id}` : "/curriculum";
    }
    case "concept":
      return `/concept/${r.id}`;
    case "page":
      return `/${r.id}`;
  }
}

const KIND_ICON: Record<string, string> = {
  sim: "🧪",
  unit: "📚",
  topic: "🗂",
  lesson: "📖",
  concept: "💡",
  page: "⚛️",
};

export default function SearchPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (query.trim().length < 1) return [];
    return search(query, undefined, 18);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      // focus after the overlay paints
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setSelected(0), [query]);

  const go = useCallback(
    (r: ScoredResult) => {
      onClose();
      navigate(resultHref(r));
    },
    [navigate, onClose]
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const r = results[selected];
        if (r) go(r);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, selected, go, onClose]);

  // keep the highlighted row in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${selected}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (!open) return null;

  return (
    <div
      className="palette-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Search everything"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="palette">
        <div className="palette-input-row">
          <span aria-hidden style={{ fontSize: 16, color: "var(--text-3)" }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search simulations, pages, lessons, concepts…"
            aria-label="Search query"
            autoComplete="off"
            spellCheck={false}
          />
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close search">
            Esc
          </button>
        </div>

        <div className="palette-results" ref={listRef}>
          {query.trim().length === 0 && (
            <div className="muted" style={{ padding: "22px 14px", fontSize: 13 }}>
              Type to search across <b style={{ color: "var(--text-1)" }}>simulations</b>,{" "}
              <b style={{ color: "var(--text-1)" }}>reference pages</b>,{" "}
              <b style={{ color: "var(--text-1)" }}>lessons</b>,{" "}
              <b style={{ color: "var(--text-1)" }}>topics</b> and{" "}
              <b style={{ color: "var(--text-1)" }}>concept definitions</b>. Try “VSEPR”,
              “periodic table”, “bond length”, “titration”.
            </div>
          )}
          {query.trim().length > 0 && results.length === 0 && (
            <div className="muted" style={{ padding: "22px 14px", fontSize: 13 }}>
              No matches for “{query}”. Try a synonym — e.g. “intermolecular forces”,
              “electron arrangement”, “oxidation”.
            </div>
          )}
          {results.map((r, i) => {
            const sim = r.kind === "sim" ? getSim(r.id) : undefined;
            return (
              <button
                key={`${r.kind}:${r.id}`}
                data-idx={i}
                className={`palette-item${i === selected ? " selected" : ""}`}
                onClick={() => go(r)}
                onMouseEnter={() => setSelected(i)}
              >
                <span className="p-icon" aria-hidden>
                  {sim?.icon ?? KIND_ICON[r.kind] ?? "🔎"}
                </span>
                <span className="p-main">
                  <span className="p-title">{r.title}</span>
                  <span className="p-sub">
                    {r.breadcrumb.length > 0 ? r.breadcrumb.join(" › ") + " — " : ""}
                    {r.subtitle}
                  </span>
                </span>
                <span className={`palette-kind ${r.kind}`}>{r.kind}</span>
              </button>
            );
          })}
        </div>

        <div className="palette-footer">
          <span><span className="kbd">↑</span><span className="kbd">↓</span> navigate</span>
          <span><span className="kbd">↵</span> open</span>
          <span><span className="kbd">esc</span> close</span>
        </div>
      </div>
    </div>
  );
}
