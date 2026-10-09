/**
 * Periodic Trends Explorer — the interactive periodic table.
 *
 * Color the table by category, electronegativity, ionization energy,
 * covalent radius, valence electrons, or state; click any element for a
 * full data card (configuration, EN, IE, radius, common ions); and use
 * Compare mode to put up to three elements side by side with trend
 * reasoning (Z_eff and shielding) generated automatically.
 */
import * as React from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ELEMENTS, ElementData, getElement, CATEGORY_COLORS, isMetal } from "@/chem/elements";
import { fullConfiguration, nobleGasConfiguration, aufbauFill } from "@/chem/electronConfig";
import { PeriodicTable, PropertyMode, PROPERTY_MODE_LABELS } from "@/components/PeriodicTable";
import { Badge, Panel, Button, Segmented, Callout } from "@/components/ui";
import { ControlSection, InfoRow } from "./SimKit";
import type { SimProps } from "./types";

const LEGEND: Array<{ cat: string; color: string }> = Object.entries(CATEGORY_COLORS).map(
  ([cat, color]) => ({ cat, color })
);

export default function PeriodicExplorer({ presetId, embedded }: SimProps) {
  const [mode, setMode] = useState<PropertyMode>(presetId === "trends-en" ? "en" : "category");
  const [selectedZ, setSelectedZ] = useState<number | null>(presetId?.startsWith("z") ? Number(presetId.slice(1)) : 11);
  const [compare, setCompare] = useState<number[]>([]);
  const [compareMode, setCompareMode] = useState(false);

  const selected = selectedZ !== null ? getElement(selectedZ) : null;
  const compareEls = compare.map((z) => getElement(z));

  const toggleCompare = (el: ElementData) => {
    setCompare((prev) =>
      prev.includes(el.z) ? prev.filter((z) => z !== el.z) : prev.length >= 3 ? [...prev.slice(1), el.z] : [...prev, el.z]
    );
  };

  const table = (
    <div style={{ overflowX: "auto", padding: "4px 0 10px" }}>
      <PeriodicTable
        mode={mode}
        selectedZ={compareMode ? null : selectedZ}
        compareZ={compare}
        onSelect={(el) => {
          if (compareMode) toggleCompare(el);
          else setSelectedZ(el.z);
        }}
        compact={embedded}
      />
    </div>
  );

  const legend = (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", padding: "4px 0" }}>
      {mode === "category" ? (
        LEGEND.map((l) => (
          <span key={l.cat} className="badge" style={{ borderColor: l.color + "66" }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: l.color, display: "inline-block" }} />
            {l.cat}
          </span>
        ))
      ) : mode === "state" ? (
        ["solid", "liquid", "gas"].map((s) => (
          <span key={s} className="badge">
            <span
              style={{
                width: 9, height: 9, borderRadius: 3, display: "inline-block",
                background: s === "solid" ? "#9aa4b2" : s === "liquid" ? "#4cc3ff" : "#34d399",
              }}
            />
            {s}
          </span>
        ))
      ) : (
        <span className="badge">
          low <span style={{ display: "inline-block", width: 90, height: 9, borderRadius: 4, background: "linear-gradient(90deg, rgb(30,58,110), rgb(76,195,255), rgb(250,205,110), rgb(255,130,90))" }} /> high
        </span>
      )}
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: embedded ? "minmax(0,1fr)" : "minmax(0,1fr) 340px", gap: 14, height: "100%", minHeight: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
        <Panel
          title="Periodic Table (Z = 1–56)"
          actions={
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Button size="sm" variant={compareMode ? "primary" : "outline"} onClick={() => setCompareMode(!compareMode)}>
                {compareMode ? `Compare (${compare.length}/3)` : "Compare mode"}
              </Button>
            </div>
          }
          bodyClassName=""
        >
          <div style={{ padding: "10px 12px 4px", display: "flex", flexWrap: "wrap", gap: 6 }}>
            <Segmented
              options={(Object.keys(PROPERTY_MODE_LABELS) as PropertyMode[]).map((m) => ({
                value: m,
                label: PROPERTY_MODE_LABELS[m],
              }))}
              value={mode}
              onChange={setMode}
              accent
            />
          </div>
          {table}
          {legend}
          {compareMode && (
            <div className="tiny muted" style={{ textAlign: "center", paddingBottom: 8 }}>
              Click up to 3 elements to compare. {compare.length > 0 && "Selected: " + compareEls.map((e) => e.symbol).join(", ")}
            </div>
          )}
        </Panel>

        {compareMode && compareEls.length >= 2 && <ComparePanel els={compareEls} />}
      </div>

      {!embedded && (
        <div className="sim-panel-scroll">
          {selected ? (
            <ElementCard el={selected} onCompare={compareMode ? undefined : () => toggleCompare(selected)} />
          ) : (
            <Callout tone="info">Select an element to see its data card.</Callout>
          )}
          <ControlSection title="Trend Cheat Sheet">
            <TrendRow
              name="Atomic radius"
              dir="↓ down a group, ← left across a period"
              why="Down: extra shells (n increases). Across: more protons pull the SAME shell in tighter (Z_eff rises, shielding barely changes)."
            />
            <TrendRow
              name="Ionization energy"
              dir="↑ up a group, → right across a period"
              why="Smaller radius + higher Z_eff = valence electron held tighter. Watch the dips at groups 13 (p¹ easy to remove) and 16 (first paired p electron repels)."
            />
            <TrendRow
              name="Electronegativity"
              dir="↑ up, → right (F = 3.98 max)"
              why="Same physics as IE: nuclei that hold their own electrons tightly also attract shared ones."
            />
            <TrendRow
              name="Metallic character"
              dir="↓ down, ← left"
              why="Easy electron loss = metallic. Nonmetals (upper right) hold/gain electrons instead."
            />
          </ControlSection>
        </div>
      )}
    </div>
  );
}

function TrendRow({ name, dir, why }: { name: string; dir: string; why: string }) {
  return (
    <div style={{ padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ fontWeight: 650, fontSize: 13, color: "var(--text-0)" }}>{name}</div>
      <div className="mono tiny" style={{ color: "var(--accent)", margin: "2px 0" }}>{dir}</div>
      <div className="tiny muted" style={{ lineHeight: 1.5 }}>{why}</div>
    </div>
  );
}

function ElementCard({ el, onCompare }: { el: ElementData; onCompare?: () => void }) {
  const config = useMemo(() => fullConfiguration(aufbauOf(el.z)), [el.z]);
  const shorthand = useMemo(() => nobleGasConfiguration(el.z), [el.z]);
  return (
    <Panel
      title={
        <span>
          <span style={{ color: el.color, fontSize: 15, fontWeight: 800 }}>{el.symbol}</span> · {el.name}
        </span>
      }
      actions={<Badge>{el.category}</Badge>}
    >
      <div className="stat-grid">
        <Stat2 label="Atomic number" value={el.z} />
        <Stat2 label="Atomic mass" value={el.mass.toFixed(el.mass < 10 ? 3 : 2)} sub="amu" />
        <Stat2 label="Group / Period" value={`${el.group} / ${el.period}`} sub={`${el.block}-block`} />
        <Stat2 label="State (25 °C)" value={el.state} />
        <Stat2 label="Electronegativity" value={el.en ?? "—"} sub="Pauling" />
        <Stat2 label="1st ionization E" value={el.ionizationEnergy.toFixed(0)} sub="kJ/mol" />
        <Stat2 label="Covalent radius" value={el.rCov.toFixed(2)} sub="Å" />
        <Stat2 label="Valence e⁻" value={el.valenceElectrons} />
      </div>
      <div className="divider" />
      <InfoRow label="Electron configuration">
        <span className="mono tiny">{config}</span>
      </InfoRow>
      <InfoRow label="Noble-gas shorthand">
        <span className="mono tiny" style={{ color: "var(--accent)" }}>{shorthand}</span>
      </InfoRow>
      <InfoRow label="Common ions">
        {el.commonIons.length
          ? el.commonIons.map((c) => `${el.symbol}${c > 0 ? `${c === 1 ? "" : c}+` : `${Math.abs(c) === 1 ? "" : Math.abs(c)}−`}`).join(", ")
          : el.category === "noble gas"
            ? "none (full valence shell)"
            : "variable"
        }
      </InfoRow>
      <InfoRow label="Classification">{isMetal(el) ? "metal" : el.category === "metalloid" ? "metalloid" : "nonmetal"}</InfoRow>
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        {onCompare && (
          <Button size="sm" variant="ghost" onClick={onCompare}>
            ⇄ Add to compare
          </Button>
        )}
        <Link to={`/sims/atom-builder?element=${el.symbol}`}>
          <Button size="sm" variant="outline">Build this atom →</Button>
        </Link>
      </div>
    </Panel>
  );
}

function Stat2({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ fontSize: 13.5 }}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function ComparePanel({ els }: { els: ElementData[] }) {
  const rows: Array<{ label: string; get: (el: ElementData) => React.ReactNode; raw?: (el: ElementData) => number | null; higherBetter?: string }> = [
    { label: "Atomic radius (Å)", get: (el) => el.rCov.toFixed(2), raw: (el) => el.rCov, higherBetter: "smaller = holds e⁻ tighter" },
    { label: "Electronegativity", get: (el) => el.en ?? "—", raw: (el) => el.en },
    { label: "1st IE (kJ/mol)", get: (el) => el.ionizationEnergy.toFixed(0), raw: (el) => el.ionizationEnergy },
    { label: "Valence e⁻", get: (el) => el.valenceElectrons, raw: (el) => el.valenceElectrons },
    { label: "Period", get: (el) => el.period, raw: (el) => el.period },
  ];
  return (
    <Panel title={`Comparing ${els.map((e) => e.symbol).join(" vs ")}`}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "5px 8px", color: "var(--text-3)", fontSize: 11, textTransform: "uppercase" }}>Property</th>
            {els.map((el) => (
              <th key={el.z} style={{ padding: "5px 8px", color: el.color, fontWeight: 800 }}>{el.symbol}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const values = els.map((el) => row.raw?.(el) ?? null);
            const max = Math.max(...values.filter((v): v is number => v !== null));
            return (
              <tr key={row.label} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "5px 8px" }} className="muted">{row.label}</td>
                {els.map((el, i) => (
                  <td
                    key={el.z}
                    style={{
                      padding: "5px 8px", textAlign: "center", fontWeight: 700,
                      color: values[i] === max && values.filter((v) => v === max).length === 1 ? "var(--accent)" : "var(--text-0)",
                    }}
                  >
                    {row.get(el)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <CompareExplanation els={els} />
    </Panel>
  );
}

function CompareExplanation({ els }: { els: ElementData[] }) {
  const sortedByZ = [...els].sort((a, b) => a.z - b.z);
  const samePeriod = els.every((e) => e.period === els[0].period);
  const sameGroup = els.every((e) => e.group === els[0].group);
  const smallest = [...els].sort((a, b) => a.rCov - b.rCov)[0];
  const highestEN = [...els].filter((e) => e.en !== null).sort((a, b) => (b.en ?? 0) - (a.en ?? 0))[0];

  let text: string;
  if (samePeriod) {
    text = `All in period ${els[0].period}: the same valence shell is pulled by increasing nuclear charge left → right (Z_eff rises; inner shielding stays constant). So ${smallest.symbol} is smallest and ${highestEN?.symbol ?? "?"} is most electronegative.`;
  } else if (sameGroup) {
    text = `All in group ${els[0].group}: same valence configuration, but shells are added going down. Distance + shielding beat the extra protons, so radius grows downward and ionization energy falls — ${sortedByZ[sortedByZ.length - 1].symbol} loses its valence electron most easily.`;
  } else {
    text = `Compare via Z_eff and shell count: ${smallest.symbol} holds electrons tightest (smallest radius); ${highestEN?.symbol ?? "?"} attracts bonding electrons most strongly. Diagonal proximity in the table means similar properties.`;
  }
  return (
    <Callout tone="info" title="Trend reasoning" style={{ marginTop: 10 }}>
      {text}
    </Callout>
  );
}

function aufbauOf(z: number) {
  return aufbauFill(z);
}
