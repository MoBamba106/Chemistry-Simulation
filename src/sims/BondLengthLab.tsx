/**
 * Bond Length Lab — select several known molecules, inspect every bond's
 * approximate equilibrium distance, and explore the corresponding Morse
 * potential-energy curve by changing internuclear distance.
 */
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MOLECULES, moleculeToSpecies, type MoleculeDef } from "@/chem/molecules";
import { analyzeSpecies } from "@/chem/lewis";
import { layout2D } from "@/chem/layout";
import { bondMetrics, morseEnergy } from "@/chem/bonding";
import { getElement } from "@/chem/elements";
import { Badge, Button, Callout, Panel, SearchInput, Slider, Stat } from "@/components/ui";
import { ControlSection, InfoRow, SimLayout } from "./SimKit";
import type { SimProps } from "./types";

const AVAILABLE = MOLECULES.filter((molecule) => molecule.bonds.length > 0 && !molecule.tags.includes("ionic"));
const DEFAULT_MOLECULE_ID = "c2h4";
const QUICK_STARTS = ["h2o", "co2", "n2", "c2h4", "co3"];
const MAX_MOLECULES = 4;

type BondDetail = {
  id: string;
  a: string;
  b: string;
  symA: string;
  symB: string;
  displayedOrder: number;
  drawnOrder: number;
  length: number;
  energy: number;
  lengthSource: "reference" | "estimated" | "resonance";
};

const REFERENCE_LENGTHS: Record<string, number> = {
  "C-C-1": 1.54, "C-C-2": 1.34, "C-C-3": 1.20,
  "C-H-1": 1.09, "H-H-1": 0.74,
  "C-N-1": 1.47, "C-N-2": 1.29, "C-N-3": 1.16,
  "C-O-1": 1.43, "C-O-2": 1.23, "C-O-3": 1.13,
  "H-N-1": 1.01, "N-N-1": 1.45, "N-N-2": 1.25, "N-N-3": 1.10,
  "H-O-1": 0.96, "O-O-1": 1.48, "O-O-2": 1.21,
  "F-H-1": 0.92, "Cl-H-1": 1.27, "Cl-Cl-1": 1.99, "F-F-1": 1.42,
  "C-Cl-1": 1.77, "C-F-1": 1.35, "B-F-1": 1.30,
  "O-S-1": 1.58, "O-S-2": 1.43, "Cl-P-1": 2.04,
};

const REFERENCE_ENERGIES: Record<string, number> = {
  "C-C-1": 347, "C-C-2": 614, "C-C-3": 839,
  "C-H-1": 413, "H-H-1": 436,
  "C-N-1": 305, "C-N-2": 615, "C-N-3": 891,
  "C-O-1": 358, "C-O-2": 745, "C-O-3": 1072,
  "H-N-1": 391, "N-N-1": 163, "N-N-2": 418, "N-N-3": 941,
  "H-O-1": 463, "O-O-1": 146, "O-O-2": 498,
  "F-H-1": 565, "Cl-H-1": 431, "Cl-Cl-1": 243, "F-F-1": 159,
  "C-Cl-1": 338, "C-F-1": 485, "B-F-1": 613,
  "O-S-1": 363, "O-S-2": 522, "Cl-P-1": 326,
};

function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .replace(/[₀-₉]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0x2080 + 48))
    .replace(/[⁺]/g, "+")
    .replace(/[⁻−]/g, "-")
    .replace(/[^a-z0-9+-]/g, "");
}

function pairKey(symA: string, symB: string, order: number): string {
  const pair = [symA, symB].sort((a, b) => a.localeCompare(b));
  return `${pair[0]}-${pair[1]}-${order}`;
}

function resonanceOrder(def: MoleculeDef, atomA: string, atomB: string, fallback: number, average: boolean): number {
  if (!average || !def.resonance?.length) return fallback;
  const forms = [def.bonds, ...def.resonance];
  const orders = forms.map((form) => {
    const match = form.find(([a, b]) => (a === atomA && b === atomB) || (a === atomB && b === atomA));
    return match?.[2] ?? fallback;
  });
  return orders.reduce((sum, order) => sum + order, 0) / orders.length;
}

function integerLength(symA: string, symB: string, order: number): number | null {
  return REFERENCE_LENGTHS[pairKey(symA, symB, order)] ?? null;
}

function estimateLength(symA: string, symB: string, order: number): { length: number; source: BondDetail["lengthSource"] } {
  if (Math.abs(order - Math.round(order)) < 1e-6) {
    const known = integerLength(symA, symB, Math.round(order));
    if (known !== null) return { length: known, source: "reference" };
  }

  // Resonance gives intermediate bond orders. Interpolate against reference
  // lengths when available and covalent-radius estimates otherwise.
  const boundedOrder = Math.min(3, Math.max(1, order));
  const lowerOrder = Math.floor(boundedOrder);
  const upperOrder = Math.ceil(boundedOrder);
  if (lowerOrder !== upperOrder) {
    const lower = integerLength(symA, symB, lowerOrder) ?? bondMetrics(symA, symB, lowerOrder).length;
    const upper = integerLength(symA, symB, upperOrder) ?? bondMetrics(symA, symB, upperOrder).length;
    const fraction = Math.sqrt(boundedOrder - lowerOrder);
    return { length: lower + (upper - lower) * fraction, source: "resonance" };
  }

  return { length: bondMetrics(symA, symB, lowerOrder).length, source: "estimated" };
}

function bondEnergy(symA: string, symB: string, order: number): number {
  const lowerOrder = Math.floor(order);
  const upperOrder = Math.ceil(order);
  const lower = REFERENCE_ENERGIES[pairKey(symA, symB, lowerOrder)] ?? 250 * lowerOrder;
  if (lowerOrder === upperOrder) return lower;
  const upper = REFERENCE_ENERGIES[pairKey(symA, symB, upperOrder)] ?? 250 * upperOrder;
  return lower + (upper - lower) * (order - lowerOrder);
}

function orderName(order: number): string {
  if (Math.abs(order - 1) < 0.02) return "single";
  if (Math.abs(order - 2) < 0.02) return "double";
  if (Math.abs(order - 3) < 0.02) return "triple";
  return `${order.toFixed(2).replace(/0$/, "")} average`;
}

function getBondDetails(def: MoleculeDef, averageResonance: boolean): BondDetail[] {
  const species = moleculeToSpecies(def);
  return species.bonds.map((bond) => {
    const atomA = species.atoms.find((atom) => atom.id === bond.a)!;
    const atomB = species.atoms.find((atom) => atom.id === bond.b)!;
    const displayedOrder = resonanceOrder(def, bond.a, bond.b, bond.order, averageResonance);
    const estimate = estimateLength(atomA.element, atomB.element, displayedOrder);
    return {
      id: bond.id,
      a: bond.a,
      b: bond.b,
      symA: atomA.element,
      symB: atomB.element,
      displayedOrder,
      drawnOrder: bond.order,
      length: estimate.length,
      energy: bondEnergy(atomA.element, atomB.element, displayedOrder),
      lengthSource: def.resonance?.length && averageResonance ? "resonance" : estimate.source,
    };
  });
}

export default function BondLengthLab({ presetId, embedded = false }: SimProps) {
  const initialId = AVAILABLE.some((molecule) => molecule.id === presetId)
    ? presetId!
    : DEFAULT_MOLECULE_ID;
  const [moleculeIds, setMoleculeIds] = useState<string[]>([initialId]);
  const [activeId, setActiveId] = useState(initialId);
  const [query, setQuery] = useState("");
  const [selectedBondId, setSelectedBondId] = useState("");
  const [distance, setDistance] = useState(1.35);
  const [averageResonance, setAverageResonance] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!AVAILABLE.some((molecule) => molecule.id === presetId)) return;
    setMoleculeIds([presetId!]);
    setActiveId(presetId!);
    setSelectedBondId("");
    setNotice("");
  }, [presetId]);

  const matches = useMemo(() => {
    const normalized = normalizeSearch(query.trim());
    if (!normalized) return [];
    return AVAILABLE.map((def) => {
      const species = moleculeToSpecies(def);
      const analysis = analyzeSpecies(species);
      const formula = normalizeSearch(`${analysis.formula}${analysis.chargeLabel}`);
      const text = normalizeSearch(`${def.name} ${def.id} ${formula} ${def.tags.join(" ")}`);
      return { def, formula, text };
    })
      .filter(({ text, formula }) => text.includes(normalized) || formula.startsWith(normalized))
      .slice(0, 7);
  }, [query]);

  const activeDef = AVAILABLE.find((molecule) => molecule.id === activeId) ?? AVAILABLE[0];
  const species = useMemo(() => moleculeToSpecies(activeDef), [activeDef]);
  const analysis = useMemo(() => analyzeSpecies(species), [species]);
  const bondDetails = useMemo(() => getBondDetails(activeDef, averageResonance), [activeDef, averageResonance]);

  const selectedBond = bondDetails.find((bond) => bond.id === selectedBondId) ?? bondDetails[0];
  useEffect(() => {
    if (selectedBond) setDistance(selectedBond.length);
  }, [selectedBond?.id, selectedBond?.length]);

  const currentEnergy = selectedBond ? morseEnergy(distance, selectedBond.length, selectedBond.energy) : 0;
  const selectedMolecules = moleculeIds
    .map((id) => AVAILABLE.find((molecule) => molecule.id === id))
    .filter((molecule): molecule is MoleculeDef => !!molecule);

  const addMolecule = (def: MoleculeDef) => {
    setNotice("");
    if (!moleculeIds.includes(def.id) && moleculeIds.length >= MAX_MOLECULES) {
      setNotice(`You can compare up to ${MAX_MOLECULES} molecules at a time. Remove one before adding another.`);
      return;
    }
    setMoleculeIds((previous) => previous.includes(def.id) ? previous : [...previous, def.id]);
    setActiveId(def.id);
    setSelectedBondId("");
    setQuery("");
  };

  const removeMolecule = (id: string) => {
    const remaining = moleculeIds.filter((moleculeId) => moleculeId !== id);
    if (!remaining.length) {
      setNotice("Keep at least one molecule selected so the bond diagram has something to show.");
      return;
    }
    setMoleculeIds(remaining);
    if (activeId === id) setActiveId(remaining[0]);
    setSelectedBondId("");
  };

  const chooseFromQuery = () => {
    const exactFormulaMatches = matches.filter(({ formula }) => normalizeSearch(formula) === normalizeSearch(query.trim()));
    if (exactFormulaMatches.length > 1) {
      setNotice(`That formula matches multiple built-in structures (${exactFormulaMatches.map(({ def }) => def.name).join(", ")}). Choose a named structure from the list; a formula alone does not determine connectivity.`);
    } else if (matches[0]) {
      addMolecule(matches[0].def);
    } else {
      setNotice("No matching molecule in the built-in structure library. A formula alone cannot specify connectivity or distinguish isomers; open the Molecule Builder to create a custom structure.");
    }
  };

  const leftPanel = (
    <>
      <ControlSection title="Molecule input">
        <div className="bond-input-label">Search the structure library</div>
        <div className="bond-search-wrap">
          <SearchInput
            value={query}
            onChange={(value) => { setQuery(value); setNotice(""); }}
            placeholder="Name, formula, or symbol…"
            onKeyDown={(event) => {
              if (event.key === "Enter") { event.preventDefault(); chooseFromQuery(); }
              if (event.key === "Escape") setQuery("");
            }}
          />
          {query.trim() && (
            <div className="bond-search-results">
              {matches.length ? matches.map(({ def, formula }) => (
                <button key={def.id} type="button" onClick={() => addMolecule(def)}>
                  <b>{formula}</b><span>{def.name}</span>
                </button>
              )) : (
                <div className="bond-no-match">No match. Press Enter for a structure/connectivity note.</div>
              )}
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={chooseFromQuery} disabled={!query.trim()}>
          Add molecule
        </Button>

        <div className="bond-input-note">Offline structure library only. A formula does not specify connectivity or distinguish isomers; ionic solids do not have one molecular bond length. Use the Ionic Bonding Lab for lattice models.</div>
        <div className="bond-quick-label">Quick starts</div>
        <div className="bond-quick-starts">
          {QUICK_STARTS.map((id) => {
            const def = AVAILABLE.find((molecule) => molecule.id === id)!;
            const formula = analyzeSpecies(moleculeToSpecies(def)).formula;
            return <button key={id} type="button" onClick={() => addMolecule(def)}>{formula}</button>;
          })}
        </div>

        <div className="bond-molecule-list" aria-label="Selected molecules">
          {selectedMolecules.map((def) => {
            const formula = analyzeSpecies(moleculeToSpecies(def)).formula;
            return (
              <div className={`bond-molecule-choice${activeId === def.id ? " is-active" : ""}`} key={def.id}>
                <button type="button" className="bond-molecule-select" onClick={() => { setActiveId(def.id); setSelectedBondId(""); }}>
                  <b>{formula}</b><span>{def.name}</span>
                </button>
                {moleculeIds.length > 1 && (
                  <button type="button" className="bond-molecule-remove" aria-label={`Remove ${def.name}`} onClick={() => removeMolecule(def.id)}>×</button>
                )}
              </div>
            );
          })}
        </div>
        <div className="bond-small-note">Add up to four molecules to compare their bond lengths.</div>
        {notice && <Callout tone="warning">{notice}</Callout>}
      </ControlSection>

      <ControlSection title="Structure model">
        <label className="bond-checkbox-row">
          <input type="checkbox" checked={averageResonance} onChange={(event) => setAverageResonance(event.target.checked)} />
          <span>Show resonance-averaged bond lengths</span>
        </label>
        {activeDef.resonance?.length && averageResonance ? (
          <Callout tone="info" title="Resonance hybrid">
            The diagram is one Lewis contributor, but the measurements average bond order across its resonance forms. The molecule does not switch between these drawings.
          </Callout>
        ) : activeDef.resonance?.length ? (
          <Callout tone="warning" title="One resonance contributor">
            Measurements now follow the displayed Lewis contributor. The real species has delocalized, equivalent bonds; turn on averaging to represent the resonance hybrid.
          </Callout>
        ) : (
          <div className="bond-small-note">Bond-length values are reference averages or covalent-radius estimates—not a quantum calculation for this specific environment.</div>
        )}
        <Link to="/sims/molecule-builder" className="bond-builder-link">Build a custom structure →</Link>
      </ControlSection>
    </>
  );

  const centerPanel = (
    <div className="bond-length-center">
      <div className="bond-center-heading">
        <div>
          <span className="eyebrow">STRUCTURE · BOND LENGTHS</span>
          <h2>{analysis.formula}{analysis.chargeLabel && <sup>{analysis.chargeLabel}</sup>}</h2>
          <p>{activeDef.name} · {analysis.bondCount} bond{analysis.bondCount === 1 ? "" : "s"} · rotate not required</p>
        </div>
        <Badge tone={activeDef.resonance?.length && averageResonance ? "violet" : "accent"}>
          {activeDef.resonance?.length && averageResonance ? "Resonance average" : "Reference diagram"}
        </Badge>
      </div>
      <div className="bond-diagram-card">
        <div className="bond-diagram-head"><span>Bond map</span><span>Click a bond to inspect its potential curve</span></div>
        <BondDiagram species={species} bonds={bondDetails} selectedBondId={selectedBond?.id ?? null} onSelectBond={setSelectedBondId} />
      </div>
      {selectedMolecules.length > 1 && (
        <div className="bond-comparison-card">
          <div className="bond-diagram-head"><span>Comparison set</span><span>Choose a molecule to open its annotated diagram</span></div>
          <div className="bond-comparison-grid">
            {selectedMolecules.map((def) => {
              const details = getBondDetails(def, averageResonance);
              const uniqueBonds = Array.from(new Map(details.map((bond) => [
                `${pairKey(bond.symA, bond.symB, bond.displayedOrder)}:${bond.displayedOrder.toFixed(2)}`,
                bond,
              ])).values());
              const formula = analyzeSpecies(moleculeToSpecies(def)).formula;
              return (
                <button key={def.id} type="button" className={`bond-comparison-item${activeId === def.id ? " is-active" : ""}`} onClick={() => { setActiveId(def.id); setSelectedBondId(""); }}>
                  <b>{formula}</b>
                  <span>{uniqueBonds.length ? uniqueBonds.map((bond) => `${bond.symA}–${bond.symB} ${bond.length.toFixed(2)} Å`).join(" · ") : "No covalent bonds to label"}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="bond-curve-card">
        <div className="bond-diagram-head">
          <span>Potential energy vs. internuclear distance</span>
          {selectedBond && <span>{selectedBond.symA}–{selectedBond.symB} · {distance.toFixed(2)} Å · {currentEnergy.toFixed(0)} kJ/mol</span>}
        </div>
        {selectedBond ? (
          <BondPotentialGraph
            bond={selectedBond}
            distance={distance}
            energy={currentEnergy}
          />
        ) : (
          <div className="bond-empty-graph">Select a bond to see its potential-energy curve.</div>
        )}
      </div>
      <div className="bond-model-note">
        <span aria-hidden>ⓘ</span>
        Bond lengths are shown in Å. The potential well is a Morse-model teaching curve; its depth uses average gas-phase bond enthalpies when available.
      </div>
    </div>
  );

  const rightPanel = (
    <>
      {selectedBond ? (
        <ControlSection title="Selected bond" actions={<Badge tone="accent">{orderName(selectedBond.displayedOrder)}</Badge>}>
          <div className="bond-focus-title">
            <strong>{selectedBond.symA}–{selectedBond.symB}</strong>
            <span>{selectedBond.a} to {selectedBond.b}</span>
          </div>
          <div className="bond-metrics-grid">
            <Stat label="Equilibrium distance" value={`${selectedBond.length.toFixed(2)} Å`} sub={`${Math.round(selectedBond.length * 100)} pm · ${selectedBond.lengthSource} value`} />
            <Stat label="Bond energy" value={`${Math.round(selectedBond.energy)} kJ/mol`} sub="approximate well depth" />
          </div>
          <div className="bond-slider-block">
            <Slider
              label="Internuclear distance r"
              value={distance}
              min={Math.max(0.35, selectedBond.length * 0.55)}
              max={selectedBond.length * 2.5}
              step={0.01}
              onChange={setDistance}
              format={(value) => `${value.toFixed(2)} Å`}
            />
          </div>
          <Callout tone={distance < selectedBond.length * 0.88 ? "warning" : distance > selectedBond.length * 1.7 ? "info" : "success"} title={distance < selectedBond.length * 0.88 ? "Repulsion dominates" : distance > selectedBond.length * 1.7 ? "Bond is dissociating" : "Near the stable region"}>
            {distance < selectedBond.length * 0.88
              ? "At very short distances, nucleus–nucleus and electron–electron repulsions drive the energy sharply upward."
              : distance > selectedBond.length * 1.7
                ? "As the atoms separate, the interaction approaches zero energy and the bond is effectively broken."
                : "The minimum of this curve is the equilibrium bond length, where attraction and repulsion balance."}
          </Callout>
          <div className="bond-distance-readout">
            <span>r − r₀</span><b>{distance - selectedBond.length >= 0 ? "+" : ""}{(distance - selectedBond.length).toFixed(2)} Å</b>
            <span>Potential energy</span><b>{currentEnergy.toFixed(1)} kJ/mol</b>
          </div>
        </ControlSection>
      ) : <Panel title="Selected bond"><div className="muted tiny">This species has no bonds to measure.</div></Panel>}

      <ControlSection title="Bonds in this molecule">
        <div className="bond-list">
          {bondDetails.map((bond) => (
            <button
              key={bond.id}
              type="button"
              className={`bond-list-row${selectedBond?.id === bond.id ? " is-active" : ""}`}
              onClick={() => setSelectedBondId(bond.id)}
            >
              <span className="bond-list-pair">{bond.symA}–{bond.symB}</span>
              <span className="bond-list-order">{orderName(bond.displayedOrder)}</span>
              <b>{bond.length.toFixed(2)} Å</b>
            </button>
          ))}
        </div>
      </ControlSection>
    </>
  );

  return <SimLayout left={leftPanel} canvas={centerPanel} right={rightPanel} embedded={embedded} />;
}

function BondDiagram({
  species,
  bonds,
  selectedBondId,
  onSelectBond,
}: {
  species: ReturnType<typeof moleculeToSpecies>;
  bonds: BondDetail[];
  selectedBondId: string | null;
  onSelectBond: (id: string) => void;
}) {
  const width = 560;
  const height = 310;
  const layout = useMemo(() => layout2D(species), [species]);
  const positions = [...layout.positions.values()];
  const minX = Math.min(...positions.map((position) => position.x), 0);
  const maxX = Math.max(...positions.map((position) => position.x), 0);
  const minY = Math.min(...positions.map((position) => position.y), 0);
  const maxY = Math.max(...positions.map((position) => position.y), 0);
  const spanX = Math.max(maxX - minX, 1.4);
  const spanY = Math.max(maxY - minY, 1.4);
  const scale = Math.min((width - 130) / spanX, (height - 110) / spanY, 95);
  const tx = (x: number) => width / 2 + (x - (minX + maxX) / 2) * scale;
  const ty = (y: number) => height / 2 + (y - (minY + maxY) / 2) * scale;
  const atomRadius = Math.min(21, Math.max(14, scale * 0.21));

  return (
    <svg className="bond-structure-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Molecular diagram annotated with estimated bond lengths">
      {species.bonds.map((bond, index) => {
        const pA = layout.positions.get(bond.a);
        const pB = layout.positions.get(bond.b);
        const metric = bonds.find((candidate) => candidate.id === bond.id);
        if (!pA || !pB || !metric) return null;
        const x1 = tx(pA.x), y1 = ty(pA.y), x2 = tx(pB.x), y2 = ty(pB.y);
        const dx = x2 - x1, dy = y2 - y1;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len, uy = dy / len;
        const px = -uy, py = ux;
        const startX = x1 + ux * (atomRadius + 2), startY = y1 + uy * (atomRadius + 2);
        const endX = x2 - ux * (atomRadius + 2), endY = y2 - uy * (atomRadius + 2);
        const gap = 4;
        const offsets = bond.order === 1 ? [0] : bond.order === 2 ? [-gap / 2, gap / 2] : [-gap, 0, gap];
        const active = selectedBondId === bond.id;
        const centerX = (x1 + x2) / 2 + px * (index % 2 ? -14 : 14);
        const centerY = (y1 + y2) / 2 + py * (index % 2 ? -14 : 14);
        const labelWidth = 48;
        return (
          <g
            key={bond.id}
            className="bond-diagram-bond"
            onClick={() => onSelectBond(bond.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectBond(bond.id);
              }
            }}
            role="button"
            tabIndex={0}
            aria-pressed={active}
            aria-label={`${metric.symA} to ${metric.symB}, estimated ${metric.length.toFixed(2)} angstroms`}
          >
            {offsets.map((offset, lineIndex) => (
              <line
                key={lineIndex}
                x1={startX + px * offset}
                y1={startY + py * offset}
                x2={endX + px * offset}
                y2={endY + py * offset}
                className={active ? "is-active" : ""}
              />
            ))}
            <rect x={centerX - labelWidth / 2} y={centerY - 11} width={labelWidth} height={20} rx={4} className={`bond-length-label-bg${active ? " is-active" : ""}`} />
            <text x={centerX} y={centerY + 3} textAnchor="middle" className={`bond-length-label${active ? " is-active" : ""}`}>{metric.length.toFixed(2)} Å</text>
          </g>
        );
      })}
      {species.atoms.map((atom) => {
        const position = layout.positions.get(atom.id);
        if (!position) return null;
        const x = tx(position.x), y = ty(position.y);
        const element = getElement(atom.element);
        const fill = soften(element.color);
        return (
          <g key={atom.id} className="bond-diagram-atom">
            <circle cx={x} cy={y} r={atomRadius} fill={fill} />
            <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central">{atom.element}</text>
          </g>
        );
      })}
      {species.charge !== 0 && (
        <text x={width - 28} y={30} textAnchor="end" className="bond-diagram-charge">{analysisSpeciesCharge(species.charge)}</text>
      )}
    </svg>
  );
}

function soften(color: string): string {
  const match = color.match(/^#([\da-f]{6})$/i);
  if (!match) return "#efe6d8";
  const number = parseInt(match[1], 16);
  const channels = [(number >> 16) & 255, (number >> 8) & 255, number & 255];
  return `rgb(${channels.map((channel) => Math.round(channel * 0.2 + 244 * 0.8)).join(",")})`;
}

function analysisSpeciesCharge(charge: number): string {
  return charge === 1 ? "+" : charge === -1 ? "−" : charge > 0 ? `${charge}+` : `${Math.abs(charge)}−`;
}

function BondPotentialGraph({ bond, distance, energy }: { bond: BondDetail; distance: number; energy: number }) {
  const width = 680;
  const height = 284;
  const pad = { left: 55, right: 20, top: 22, bottom: 42 };
  const rMin = Math.max(0.35, bond.length * 0.52);
  const rMax = bond.length * 2.35;
  const eMin = -bond.energy * 1.28;
  const eMax = bond.energy * 0.48;
  const sx = (r: number) => pad.left + (r - rMin) / (rMax - rMin) * (width - pad.left - pad.right);
  const sy = (e: number) => pad.top + (eMax - e) / (eMax - eMin) * (height - pad.top - pad.bottom);

  const path = useMemo(() => {
    let d = "";
    for (let index = 0; index <= 180; index++) {
      const r = rMin + (rMax - rMin) * index / 180;
      const y = sy(Math.max(eMin, morseEnergy(r, bond.length, bond.energy)));
      d += `${index === 0 ? "M" : "L"}${sx(r).toFixed(1)} ${y.toFixed(1)} `;
    }
    return d;
  }, [bond.length, bond.energy, rMin, rMax, eMin, eMax]);
  const currentX = sx(distance);
  const currentY = sy(Math.max(eMin, energy));
  const baseline = sy(0);
  const tickValues = [0, -bond.energy * 0.4, -bond.energy * 0.8, -bond.energy * 1.2];

  return (
    <svg className="bond-potential-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Morse potential energy curve for ${bond.symA}–${bond.symB}`}>
      {tickValues.map((value) => (
        <g key={value}>
          <line x1={pad.left} x2={width - pad.right} y1={sy(value)} y2={sy(value)} className="bond-chart-grid" />
          <text x={pad.left - 8} y={sy(value) + 3} textAnchor="end" className="bond-chart-tick">{Math.round(value)}</text>
        </g>
      ))}
      <line x1={pad.left} x2={width - pad.right} y1={baseline} y2={baseline} className="bond-chart-zero" />
      <line x1={pad.left} x2={pad.left} y1={pad.top} y2={height - pad.bottom} className="bond-chart-axis" />
      <line x1={pad.left} x2={width - pad.right} y1={height - pad.bottom} y2={height - pad.bottom} className="bond-chart-axis" />
      <path d={path} className="bond-chart-curve" />
      <line x1={sx(bond.length)} x2={sx(bond.length)} y1={sy(-bond.energy)} y2={height - pad.bottom} className="bond-chart-r0" />
      <circle cx={sx(bond.length)} cy={sy(-bond.energy)} r={4} className="bond-chart-minimum" />
      <circle cx={currentX} cy={currentY} r={7} className="bond-chart-halo" />
      <circle cx={currentX} cy={currentY} r={4} className="bond-chart-current" />
      <text x={Math.min(width - 150, Math.max(pad.left + 6, sx(bond.length) + 8))} y={Math.max(pad.top + 14, sy(-bond.energy) - 8)} className="bond-chart-r0-label">r₀ = {bond.length.toFixed(2)} Å</text>
      <text x={currentX} y={Math.max(pad.top + 14, currentY - 12)} textAnchor="middle" className="bond-chart-current-label">r = {distance.toFixed(2)} Å</text>
      <text x={width / 2} y={height - 9} textAnchor="middle" className="bond-chart-axis-label">Internuclear distance r (Å)</text>
      <text x={16} y={height / 2} textAnchor="middle" transform={`rotate(-90 16 ${height / 2})`} className="bond-chart-axis-label">Potential energy (kJ mol⁻¹)</text>
    </svg>
  );
}
