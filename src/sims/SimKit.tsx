/**
 * SimKit — shared building blocks that every simulation composes:
 * the 3-column layout, control sections, the "what happened & why"
 * explanation feed, preset selectors, and the 3-D viewport frame.
 */
import * as React from "react";
import { MOLECULES, MOLECULE_GROUPS, MoleculeDef } from "@/chem/molecules";
import { Callout } from "@/components/ui";

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

export function SimLayout({
  left,
  canvas,
  right,
  embedded = false,
}: {
  left: React.ReactNode;
  canvas: React.ReactNode;
  right?: React.ReactNode;
  embedded?: boolean;
}) {
  return (
    <div className={`sim-layout ${embedded ? "embedded" : ""} ${right ? "" : "no-right"}`}>
      <div className="sim-panel-scroll">{left}</div>
      <div style={{ minHeight: 0 }}>{canvas}</div>
      {right && <div className="sim-panel-scroll sim-right">{right}</div>}
    </div>
  );
}

export function ControlSection({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">{title}</div>
        {actions}
      </div>
      <div className="panel-body ctl-group">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3-D viewport frame                                                  */
/* ------------------------------------------------------------------ */

export function Viewport3D({
  children,
  hud,
  hint = "drag to rotate · scroll to zoom",
  style,
}: {
  children: React.ReactNode;
  hud?: React.ReactNode;
  hint?: string | null;
  style?: React.CSSProperties;
}) {
  return (
    <div className="sim-canvas-wrap" style={{ height: "100%", minHeight: 340, ...style }}>
      {hud && <div className="canvas-hud">{hud}</div>}
      {children}
      {hint && <div className="canvas-hint">{hint}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Explanation feed — "what happened and why"                          */
/* ------------------------------------------------------------------ */

export interface FeedEntry {
  id: number;
  tone: "info" | "success" | "warning" | "danger" | "violet";
  title?: string;
  text: string;
  time: number;
}

let feedCounter = 0;

export function useExplanationFeed(max = 14) {
  const [entries, setEntries] = React.useState<FeedEntry[]>([]);
  const push = React.useCallback(
    (tone: FeedEntry["tone"], text: string, title?: string) => {
      feedCounter += 1;
      const entry: FeedEntry = { id: feedCounter, tone, text, title, time: Date.now() };
      setEntries((prev) => [entry, ...prev].slice(0, max));
    },
    [max]
  );
  const clear = React.useCallback(() => setEntries([]), []);
  return { entries, push, clear };
}

export function ExplanationFeed({ entries }: { entries: FeedEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="muted tiny" style={{ padding: "6px 2px" }}>
        Actions you take will be explained here — what changed, and why it matters chemically.
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {entries.map((e) => (
        <div key={e.id} className="anim-fade-up">
          <Callout tone={e.tone} title={e.title}>
            {e.text}
          </Callout>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Molecule preset selector                                            */
/* ------------------------------------------------------------------ */

export function MoleculePresetSelect({
  value,
  onChange,
  filter,
  placeholder = "Choose a species…",
}: {
  value: string;
  onChange: (def: MoleculeDef) => void;
  filter?: (def: MoleculeDef) => boolean;
  placeholder?: string;
}) {
  return (
    <select
      className="sel"
      value={value}
      onChange={(e) => {
        const def = MOLECULES.find((m) => m.id === e.target.value);
        if (def) onChange(def);
      }}
      aria-label={placeholder}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {MOLECULE_GROUPS.map((group) => {
        const ids = group.ids.filter((id) => {
          const def = MOLECULES.find((m) => m.id === id);
          return def && (!filter || filter(def));
        });
        if (ids.length === 0) return null;
        return (
          <optgroup key={group.label} label={group.label}>
            {ids.map((id) => {
              const def = MOLECULES.find((m) => m.id === id)!;
              return (
                <option key={id} value={id}>
                  {def.name}
                  {def.charge !== 0 ? ` (${def.charge > 0 ? "+" : "−"}${Math.abs(def.charge) > 1 ? Math.abs(def.charge) : ""})` : ""}
                </option>
              );
            })}
          </optgroup>
        );
      })}
    </select>
  );
}

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

export function InfoRow({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13, padding: "3.5px 0" }}>
      <span className="muted">{label}</span>
      <span style={{ color: "var(--text-0)", fontWeight: 600, textAlign: "right" }}>{children}</span>
    </div>
  );
}

export function BigFormula({ children, sub }: { children: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div style={{ textAlign: "center", padding: "10px 6px 4px" }}>
      <div style={{ fontSize: 30, fontWeight: 800, color: "var(--text-0)", letterSpacing: "0.01em", fontFamily: "var(--font-sans)" }}>
        {children}
      </div>
      {sub && <div className="muted" style={{ fontSize: 12.5, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}
