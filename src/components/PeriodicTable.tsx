/**
 * Shared interactive periodic-table grid.
 *
 * The stand-alone reference page uses all 118 elements and the group/period
 * headings; the periodic-trends simulation passes its AP-focused Z = 1–56
 * data set and keeps the same cell renderer, colors, and selection behavior.
 */
import * as React from "react";
import { CATEGORY_COLORS, type ElementCategory, type ElementData } from "@/chem/elements";
import { PERIODIC_ELEMENTS, type PeriodicElementData } from "@/chem/periodicTableData";

export type PropertyMode = "category" | "en" | "ie" | "radius" | "valence" | "state";

export interface PeriodicTableProps {
  mode?: PropertyMode;
  selectedZ?: number | null;
  compareZ?: number[];
  onSelect?: (el: PeriodicElementData) => void;
  compact?: boolean;
  highlightZ?: number[];
  elements?: PeriodicElementData[];
  showHeaders?: boolean;
}

function propertyValue(el: PeriodicElementData, mode: PropertyMode): number | null {
  switch (mode) {
    case "en": return el.en;
    case "ie": return el.ionizationEnergy;
    case "radius": return el.rCov;
    case "valence": return el.valenceElectrons;
    default: return null;
  }
}

function heatColor(t: number): string {
  // A low-contrast teal → straw → rose scale that remains readable on paper.
  const stops: Array<[number, number, number]> = [
    [203, 225, 217],
    [219, 226, 203],
    [237, 222, 187],
    [226, 191, 165],
    [205, 158, 151],
  ];
  const x = Math.max(0, Math.min(1, t)) * (stops.length - 1);
  const i = Math.min(Math.floor(x), stops.length - 2);
  const f = x - i;
  const c = stops[i].map((v, k) => Math.round(v + (stops[i + 1][k] - v) * f));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

const STATE_COLOR: Record<PeriodicElementData["state"], string> = {
  solid: "#d6e2dc",
  liquid: "#d5e0ec",
  gas: "#e8d8e2",
};

const MODE_LABEL: Record<PropertyMode, string> = {
  category: "Element family",
  en: "Pauling electronegativity",
  ie: "First ionization energy (kJ/mol)",
  radius: "Covalent radius (Å)",
  valence: "Valence electrons",
  state: "State at 25 °C",
};

function displayNumber(value: number | null, mode: PropertyMode): string {
  if (value === null) return "—";
  if (mode === "radius") return value.toFixed(2).replace(/0$/, "");
  if (mode === "en") return value.toFixed(2).replace(/0$/, "");
  if (mode === "ie") return Math.round(value).toString();
  return String(value);
}

function coreRecord(element: ElementData): PeriodicElementData {
  const digits = element.mass < 10 ? 5 : 6;
  return {
    ...element,
    massLabel: Number(element.mass.toPrecision(digits)).toString(),
    tableRow: element.period,
    tableColumn: element.group,
    confidence: "reference",
  };
}

export function PeriodicTable({
  mode = "category",
  selectedZ = null,
  compareZ = [],
  onSelect,
  compact = false,
  highlightZ = [],
  elements = PERIODIC_ELEMENTS,
  showHeaders = false,
}: PeriodicTableProps) {
  // Preserve compatibility for callers passing the chemistry engine's
  // original (richer, but AP-limited) ElementData objects.
  const records = React.useMemo(
    () => elements.map((element) => element.massLabel ? element : coreRecord(element as unknown as ElementData)),
    [elements]
  );
  const ranges = React.useMemo(() => {
    const vals = records.map((el) => propertyValue(el, mode)).filter(
      (v): v is number => v !== null
    );
    return vals.length ? { min: Math.min(...vals), max: Math.max(...vals) } : { min: 0, max: 1 };
  }, [records, mode]);

  const cellSize = compact ? 34 : 54;
  const gridStyle: React.CSSProperties = compact
    ? {
        gridTemplateColumns: `repeat(18, ${cellSize}px)`,
        gridAutoRows: `${cellSize * 1.1}px`,
        gap: 3,
        justifyContent: "center",
      }
    : showHeaders
      ? {
          gridTemplateColumns: "34px repeat(18, minmax(48px, 1fr))",
          gridTemplateRows: "24px repeat(9, minmax(54px, auto))",
          gap: 4,
          minWidth: 1110,
        }
      : {
          gridTemplateColumns: `repeat(18, ${cellSize}px)`,
          gridAutoRows: `${cellSize * 1.12}px`,
          gap: 4,
          justifyContent: "center",
        };

  const tile = (el: PeriodicElementData) => {
    const value = propertyValue(el, mode);
    const baseColor = mode === "category"
      ? CATEGORY_COLORS[el.category as ElementCategory] ?? "#dfd1bc"
      : mode === "state"
        ? STATE_COLOR[el.state]
        : value === null
          ? "#e2d6c3"
          : heatColor((value - ranges.min) / (ranges.max - ranges.min || 1));
    const isSelected = selectedZ === el.z;
    const isCompare = compareZ.includes(el.z);
    const isHighlight = highlightZ.includes(el.z);
    const showProperty = !compact && mode !== "category" && mode !== "state";
    const tileClass = [
      "ptable-cell",
      compact ? "ptable-cell-compact" : "",
      isSelected ? "is-selected" : "",
      isCompare ? "is-compare" : "",
      isHighlight ? "is-highlighted" : "",
    ].filter(Boolean).join(" ");

    return (
      <button
        key={el.z}
        type="button"
        className={tileClass}
        style={{
          gridColumn: (showHeaders ? el.tableColumn + 1 : el.tableColumn),
          gridRow: (showHeaders ? el.tableRow + 1 : el.tableRow),
          ["--element-fill" as string]: baseColor,
        }}
        onClick={() => onSelect?.(el)}
        disabled={!onSelect}
        title={`${el.name} · atomic number ${el.z} · ${el.category}`}
        aria-label={`${el.name}, atomic number ${el.z}, ${el.massLabel} u`}
        aria-pressed={isSelected || isCompare}
      >
        <span className="ptable-cell-number">{el.z}</span>
        <span className="ptable-cell-symbol">{el.symbol}</span>
        {!compact && (
          <span className="ptable-cell-meta">
            {showProperty
              ? displayNumber(value, mode)
              : mode === "category"
                ? el.massLabel
                : el.state}
          </span>
        )}
      </button>
    );
  };

  const hasFBlock = showHeaders && records.some((element) => element.tableRow > 7);

  return (
    <div
      className={`ptable-grid${compact ? " is-compact" : ""}${showHeaders ? " has-headers" : ""}`}
      style={gridStyle}
      role="group"
      aria-label="Periodic table of elements"
    >
      {showHeaders && (
        <>
          <span className="ptable-axis-label" style={{ gridColumn: 1, gridRow: 1 }}>Group</span>
          {Array.from({ length: 18 }, (_, index) => (
            <span className="ptable-group-number" key={`g${index + 1}`} style={{ gridColumn: index + 2, gridRow: 1 }}>
              {index + 1}
            </span>
          ))}
          {Array.from({ length: 7 }, (_, index) => (
            <span className="ptable-period-number" key={`p${index + 1}`} style={{ gridColumn: 1, gridRow: index + 2 }}>
              {index + 1}
            </span>
          ))}
          {hasFBlock && (
            <>
              <span className="ptable-series-label" style={{ gridColumn: "2 / 4", gridRow: 9 }}>Lanthanides</span>
              <span className="ptable-series-label" style={{ gridColumn: "2 / 4", gridRow: 10 }}>Actinides</span>
            </>
          )}
        </>
      )}

      {records.map(tile)}

      {showHeaders && hasFBlock && [
        { z: 57, row: 7, label: "57–71", sub: "Lanthanides" },
        { z: 89, row: 8, label: "89–103", sub: "Actinides" },
      ].map((marker) => {
        const first = records.find((element) => element.z === marker.z);
        return (
          <button
            type="button"
            key={`marker-${marker.z}`}
            className="ptable-series-marker"
            style={{ gridColumn: 4, gridRow: marker.row }}
            onClick={() => first && onSelect?.(first)}
            disabled={!onSelect}
            title={`Jump to ${marker.sub.toLowerCase()}`}
          >
            <b>{marker.label}</b>
            <span>f-block ↓</span>
          </button>
        );
      })}
    </div>
  );
}

export const PROPERTY_MODE_LABELS: Record<PropertyMode, string> = MODE_LABEL;
