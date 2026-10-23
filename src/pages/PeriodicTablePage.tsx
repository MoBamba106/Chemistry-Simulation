/**
 * Full interactive periodic-table reference (all 118 named elements).
 * The table shares its renderer with the Trends Explorer simulation.
 */
import * as React from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PERIODIC_ELEMENTS, type PeriodicElementData } from "@/chem/periodicTableData";
import { CATEGORY_COLORS, type ElementCategory } from "@/chem/elements";
import { aufbauFill, nobleGasConfiguration } from "@/chem/electronConfig";
import { PeriodicTable, type PropertyMode, PROPERTY_MODE_LABELS } from "@/components/PeriodicTable";
import { Badge, Button, SearchInput, Segmented } from "@/components/ui";

const MODES: Array<{ value: PropertyMode; label: string }> = [
  { value: "category", label: "Families" },
  { value: "en", label: "Electronegativity" },
  { value: "ie", label: "Ionization energy" },
  { value: "radius", label: "Covalent radius" },
  { value: "valence", label: "Valence electrons" },
  { value: "state", label: "Physical state" },
];

const FAMILY_NAMES: Record<string, string> = {
  "alkali metal": "Alkali metals",
  "alkaline earth metal": "Alkaline earth metals",
  "transition metal": "Transition metals",
  "post-transition metal": "Post-transition metals",
  metalloid: "Metalloids",
  nonmetal: "Other nonmetals",
  halogen: "Halogens",
  "noble gas": "Noble gases",
  lanthanide: "Lanthanides",
  actinide: "Actinides",
};

export default function PeriodicTablePage() {
  const [mode, setMode] = useState<PropertyMode>("category");
  const [selectedZ, setSelectedZ] = useState(6);
  const [query, setQuery] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [compareZ, setCompareZ] = useState<number[]>([]);
  const [compareNotice, setCompareNotice] = useState("");

  const selected = PERIODIC_ELEMENTS.find((element) => element.z === selectedZ) ?? PERIODIC_ELEMENTS[5];
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PERIODIC_ELEMENTS.filter((element) =>
      element.name.toLowerCase().includes(q) ||
      element.symbol.toLowerCase().startsWith(q) ||
      String(element.z) === q
    ).slice(0, 6);
  }, [query]);
  const compared = compareZ
    .map((z) => PERIODIC_ELEMENTS.find((element) => element.z === z))
    .filter((element): element is PeriodicElementData => !!element);

  const selectElement = (element: PeriodicElementData) => {
    setSelectedZ(element.z);
    setQuery("");
  };

  const onTableSelect = (element: PeriodicElementData) => {
    setSelectedZ(element.z);
    if (!compareMode) return;
    setCompareNotice("");
    if (compareZ.includes(element.z)) {
      setCompareZ(compareZ.filter((z) => z !== element.z));
    } else if (compareZ.length >= 3) {
      setCompareNotice("Three elements are already selected. Click one of them to remove it before adding another.");
    } else {
      setCompareZ([...compareZ, element.z]);
    }
  };

  return (
    <div className="page periodic-page">
      <header className="page-title-row periodic-page-heading">
        <div>
          <div className="eyebrow">REFERENCE · 118 ELEMENTS</div>
          <h1 className="page-title">Periodic table</h1>
          <p className="page-subtitle">
            Explore element families, compare periodic trends, and open a property card for any element.
          </p>
        </div>
        <div className="periodic-search-wrap">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Find an element, symbol, or atomic number…"
            onKeyDown={(event) => {
              if (event.key === "Enter" && suggestions[0]) selectElement(suggestions[0]);
              if (event.key === "Escape") setQuery("");
            }}
          />
          {query.trim() && (
            <div className="periodic-search-results">
              {suggestions.length ? suggestions.map((element) => (
                <button key={element.z} type="button" onClick={() => selectElement(element)}>
                  <span className="search-result-z">{element.z}</span>
                  <b>{element.symbol}</b>
                  <span>{element.name}</span>
                  <small>{FAMILY_NAMES[element.category]}</small>
                </button>
              )) : (
                <div className="periodic-search-empty">No element matches “{query}”.</div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="periodic-page-layout">
        <section className="periodic-table-panel panel">
          <div className="periodic-toolbar">
            <div>
              <div className="panel-title">Color by property</div>
              <div className="tiny muted" style={{ marginTop: 3 }}>{PROPERTY_MODE_LABELS[mode]}</div>
            </div>
            <Button
              size="sm"
              variant={compareMode ? "primary" : "outline"}
              onClick={() => {
                setCompareMode((value) => !value);
                if (compareMode) {
                  setCompareZ([]);
                  setCompareNotice("");
                }
              }}
              aria-pressed={compareMode}
            >
              {compareMode ? `Comparing · ${compareZ.length}/3` : "Compare elements"}
            </Button>
          </div>
          <div className="periodic-mode-scroll">
            <Segmented
              options={MODES}
              value={mode}
              onChange={setMode}
              accent
            />
          </div>
          <div className="periodic-grid-scroll">
            <PeriodicTable
              elements={PERIODIC_ELEMENTS}
              mode={mode}
              selectedZ={compareMode ? null : selectedZ}
              compareZ={compareZ}
              onSelect={onTableSelect}
              showHeaders
            />
          </div>
          <div className="periodic-table-footer">
            <FamilyLegend mode={mode} />
            {compareMode && (
              <span className="compare-hint" aria-live="polite">{compareNotice || `Choose up to three elements · ${compared.map((element) => element.symbol).join(" · ") || "choose elements"}`}</span>
            )}
          </div>
        </section>

        <aside className="periodic-inspector">
          <ElementInspector element={selected} />
          {compareMode && compared.length > 1 && <CompareTable elements={compared} />}
          {!compareMode && (
            <div className="periodic-inspector-note">
              <span aria-hidden>↗</span>
              <p>Across a period, effective nuclear charge tends to rise. Down a group, added shells increase shielding and atomic size.</p>
            </div>
          )}
        </aside>
      </div>

      <div className="periodic-footnote">
        Table arrangement follows the standard 18-group layout. Data quality is labeled per element: the chemistry simulations use a separate, AP-focused element set (Z = 1–56); values for very heavy elements may be estimated or predicted.
      </div>
    </div>
  );
}

function FamilyLegend({ mode }: { mode: PropertyMode }) {
  if (mode === "category") {
    return (
      <div className="periodic-legend" aria-label="Element families">
        {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
          <span key={category} className="periodic-legend-item">
            <i style={{ background: color }} />
            {FAMILY_NAMES[category] ?? category}
          </span>
        ))}
      </div>
    );
  }

  if (mode === "state") {
    return (
      <div className="periodic-legend" aria-label="States of matter">
        {[
          ["Solid", "#d6e2dc"],
          ["Liquid", "#d5e0ec"],
          ["Gas", "#e8d8e2"],
        ].map(([label, color]) => (
          <span key={label} className="periodic-legend-item"><i style={{ background: color }} />{label}</span>
        ))}
      </div>
    );
  }

  return (
    <div className="periodic-legend periodic-gradient-legend">
      <span>Lower</span>
      <i />
      <span>Higher</span>
      <small>Cells with no reliable value are left neutral.</small>
    </div>
  );
}

function ElementInspector({ element }: { element: PeriodicElementData }) {
  const configuration = useMemo(() => nobleGasConfiguration(element.z), [element.z]);
  const shellCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (const subshell of aufbauFill(element.z)) {
      counts.set(subshell.n, (counts.get(subshell.n) ?? 0) + subshell.electrons);
    }
    return [...counts.values()];
  }, [element.z]);

  const confidence = element.confidence === "reference"
    ? "Reference data"
    : element.confidence === "estimated"
      ? "Rounded reference values"
      : "Predicted / limited data";

  return (
    <section className="periodic-element-card panel" aria-live="polite">
      <div className="periodic-element-card-head">
        <div className="periodic-element-tile" style={{ background: CATEGORY_COLORS[element.category as ElementCategory] }}>
          <span>{element.z}</span>
          <b>{element.symbol}</b>
          <small>{element.massLabel}</small>
        </div>
        <div className="periodic-element-title">
          <span className="eyebrow">ELEMENT {String(element.z).padStart(3, "0")}</span>
          <h2>{element.name}</h2>
          <Badge>{FAMILY_NAMES[element.category] ?? element.category}</Badge>
        </div>
      </div>

      <div className="periodic-quick-facts">
        <Fact label="Atomic number" value={element.z} />
        <Fact label="Atomic mass" value={`${element.massLabel} u`} />
        <Fact label="Group / period" value={element.block === "f" ? `f-block · period ${element.period}` : `${element.group} · ${element.period}`} />
        <Fact label="State at 25 °C" value={element.state} />
        <Fact label="Electronegativity" value={element.en === null ? "—" : `${element.en.toFixed(2)} Pauling`} />
        <Fact label="First ionization" value={element.ionizationEnergy === null ? "—" : `${Math.round(element.ionizationEnergy)} kJ/mol`} />
        <Fact label="Covalent radius" value={element.rCov === null ? "—" : `${element.rCov.toFixed(2)} Å`} />
        <Fact label="Common ions" value={element.commonIons.length ? element.commonIons.map((charge) => formatIon(element.symbol, charge)).join(", ") : "No common monatomic ion"} />
      </div>

      <div className="periodic-config-block">
        <div className="periodic-config-heading">
          <span>Electron configuration</span>
          <span className="mono">Aufbau model</span>
        </div>
        <div className="periodic-shell-strip" aria-label={`Electrons per shell: ${shellCounts.join(", ")}`}>
          {shellCounts.map((count, index) => <span key={index}><small>{index + 1}</small>{count}</span>)}
        </div>
        <code>{configuration}</code>
      </div>

      <div className="periodic-confidence-note">
        <span aria-hidden>ⓘ</span>
        <span>{confidence}{element.z > 56 ? " · properties and configurations beyond the AP data set are approximate." : " · values may be rounded."}</span>
      </div>

      {element.z <= 56 ? (
        <Link className="periodic-build-link" to={`/sims/atom-builder?element=${element.symbol}`}>
          <span>Explore this atom</span><b aria-hidden>→</b>
        </Link>
      ) : (
        <div className="periodic-build-unavailable">Atom Builder presets currently cover Z = 1–56.</div>
      )}
    </section>
  );
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="periodic-fact"><span>{label}</span><b>{value}</b></div>;
}

function CompareTable({ elements }: { elements: PeriodicElementData[] }) {
  const rows: Array<{ label: string; value: (element: PeriodicElementData) => string; numeric?: (element: PeriodicElementData) => number | null }> = [
    { label: "Atomic radius", value: (e) => e.rCov === null ? "—" : `${e.rCov.toFixed(2)} Å`, numeric: (e) => e.rCov },
    { label: "Electronegativity", value: (e) => e.en === null ? "—" : e.en.toFixed(2), numeric: (e) => e.en },
    { label: "First ionization", value: (e) => e.ionizationEnergy === null ? "—" : `${Math.round(e.ionizationEnergy)}`, numeric: (e) => e.ionizationEnergy },
    { label: "Valence electrons", value: (e) => e.valenceElectrons === null ? "—" : String(e.valenceElectrons), numeric: (e) => e.valenceElectrons },
  ];
  return (
    <section className="periodic-compare-card panel">
      <div className="panel-header"><span className="panel-title">Compare elements</span></div>
      <div className="periodic-compare-table-wrap">
        <table>
          <thead>
            <tr><th>Property</th>{elements.map((element) => <th key={element.z}>{element.symbol}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row) => <tr key={row.label}>
              <th>{row.label}</th>
              {elements.map((element) => <td key={element.z}>{row.value(element)}</td>)}
            </tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatIon(symbol: string, charge: number): string {
  const superscriptDigits: Record<string, string> = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  const magnitude = Math.abs(charge);
  const chargeNumber = magnitude === 1 ? "" : String(magnitude).split("").map((digit) => superscriptDigits[digit]).join("");
  return `${symbol}${chargeNumber}${charge < 0 ? "⁻" : "⁺"}`;
}
