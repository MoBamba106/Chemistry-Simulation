/**
 * PeriodicTable — interactive table of elements (Z = 1–56).
 *
 * Color modes: category (default) or a property heatmap (electronegativity,
 * ionization energy, atomic radius proxy, valence electrons). Used by the
 * Periodic Trends simulation and as the element picker in the Molecule
 * Builder.
 */
import * as React from "react";
import { ELEMENTS, ElementCategory, ElementData, CATEGORY_COLORS } from "@/chem/elements";

export type PropertyMode = "category" | "en" | "ie" | "radius" | "valence" | "state";

export interface PeriodicTableProps {
  mode?: PropertyMode;
  selectedZ?: number | null;
  compareZ?: number[];
  onSelect?: (el: ElementData) => void;
  compact?: boolean;
  highlightZ?: number[];
}

function propertyValue(el: ElementData, mode: PropertyMode): number | null {
  switch (mode) {
    case "en": return el.en;
    case "ie": return el.ionizationEnergy;
    case "radius": return el.rCov;
    case "valence": return el.valenceElectrons;
    default: return null;
  }
}

function heatColor(t: number): string {
  // 0 → deep blue, 1 → hot gold/red
  const stops: Array<[number, number, number]> = [
    [30, 58, 110],
    [46, 121, 175],
    [76, 195, 255],
    [120, 220, 170],
    [250, 205, 110],
    [255, 130, 90],
  ];
  const x = Math.max(0, Math.min(1, t)) * (stops.length - 1);
  const i = Math.min(Math.floor(x), stops.length - 2);
  const f = x - i;
  const c = stops[i].map((v, k) => Math.round(v + (stops[i + 1][k] - v) * f));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

const STATE_COLOR: Record<string, string> = {
  solid: "#9aa4b2",
  liquid: "#4cc3ff",
  gas: "#34d399",
};

export function PeriodicTable({
  mode = "category",
  selectedZ = null,
  compareZ = [],
  onSelect,
  compact = false,
  highlightZ = [],
}: PeriodicTableProps) {
  // property ranges for heatmap
  const ranges = React.useMemo(() => {
    const vals = ELEMENTS.map((el) => propertyValue(el, mode)).filter(
      (v): v is number => v !== null
    );
    return vals.length ? { min: Math.min(...vals), max: Math.max(...vals) } : { min: 0, max: 1 };
  }, [mode]);

  const cellSize = compact ? 34 : 44;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(18, ${cellSize}px)`,
        gridAutoRows: `${cellSize * (compact ? 1.05 : 1.12)}px`,
        gap: compact ? 2 : 3,
        justifyContent: "center",
      }}
      role="group"
      aria-label="Periodic table of elements"
    >
      {ELEMENTS.map((el) => {
        const pv = propertyValue(el, mode);
        let bg: string;
        if (mode === "category") bg = CATEGORY_COLORS[el.category as ElementCategory] ?? "#888";
        else if (mode === "state") bg = STATE_COLOR[el.state];
        else if (pv === null) bg = "#2a3348";
        else bg = heatColor((pv - ranges.min) / (ranges.max - ranges.min || 1));

        const isSelected = selectedZ === el.z;
        const isCompare = compareZ.includes(el.z);
        const isHighlight = highlightZ.includes(el.z);
        const dim = mode !== "category" && pv === null;

        return (
          <button
            key={el.z}
            onClick={() => onSelect?.(el)}
            title={`${el.name} — click for details`}
            aria-label={`${el.name}, atomic number ${el.z}`}
            style={{
              gridColumn: el.group,
              gridRow: el.period,
              position: "relative",
              border: isSelected
                ? "2px solid #fff"
                : isCompare
                  ? "2px solid var(--accent)"
                  : isHighlight
                    ? "2px solid var(--warn)"
                    : "1px solid rgba(0,0,0,0.35)",
              borderRadius: compact ? 5 : 7,
              background: `linear-gradient(160deg, ${bg}, ${shade(bg, -18)})`,
              cursor: onSelect ? "pointer" : "default",
              opacity: dim ? 0.32 : 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              transition: "transform 0.1s, box-shadow 0.12s",
              boxShadow: isSelected ? "0 0 12px rgba(255,255,255,0.35)" : "none",
              color: readableOn(bg),
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.12)";
              (e.currentTarget as HTMLElement).style.zIndex = "5";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLElement).style.zIndex = "";
            }}
          >
            <span style={{ fontSize: compact ? 6.5 : 8, opacity: 0.85, position: "absolute", top: 2, left: 4 }}>
              {el.z}
            </span>
            <span style={{ fontSize: compact ? 12 : 15, fontWeight: 800, lineHeight: 1 }}>
              {el.symbol}
            </span>
            {!compact && (
              <span style={{ fontSize: 7.5, opacity: 0.8, maxWidth: "95%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {el.name}
              </span>
            )}
            {!compact && mode !== "category" && pv !== null && (
              <span style={{ fontSize: 7.5, fontWeight: 700, opacity: 0.95 }}>
                {pv < 10 ? pv.toFixed(2).replace(/0$/, "") : Math.round(pv)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function shade(color: string, percent: number): string {
  const m = color.match(/\d+/g);
  if (!m) return color;
  const [r, g, b] = m.map(Number);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * (1 + percent / 100))));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

function readableOn(color: string): string {
  const m = color.match(/\d+/g);
  if (!m) return "#fff";
  const [r, g, b] = m.map(Number);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.55 ? "#141a28" : "#f5f8ff";
}

export const PROPERTY_MODE_LABELS: Record<PropertyMode, string> = {
  category: "Category",
  en: "Electronegativity",
  ie: "1st Ionization Energy",
  radius: "Covalent Radius",
  valence: "Valence Electrons",
  state: "State (25 °C)",
};
