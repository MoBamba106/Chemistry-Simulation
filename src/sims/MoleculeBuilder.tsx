/**
 * Molecule Builder — the flagship construction sandbox.
 *
 * Add atoms from an element library, connect them with single/double/triple
 * bonds, add or remove electrons (forming ions), and watch four linked
 * representations update in real time:
 *   1. 3-D ball-and-stick model (VSEPR-laid-out)
 *   2. 2-D Lewis dot structure
 *   3. Formula, charge, molar mass, valence-electron bookkeeping
 *   4. Electron-group geometry, molecular shape, bond angles, hybridization
 *
 * Chemically invalid operations are blocked with an explanation of WHY
 * (octet violations, hydrogen with two bonds, fluorine double bonds, …),
 * and every action is logged to the explanation feed.
 */
import * as React from "react";
import { useMemo, useState, useCallback, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  Species,
  analyzeSpecies,
  nextId,
  minimizeFormalCharges,
  emptySpecies,
} from "@/chem/lewis";
import { layout3D } from "@/chem/layout";
import { getElement, hasElement, typicalMaxBonds, ELEMENTS } from "@/chem/elements";
import { hybridization } from "@/chem/bonding";
import { MOLECULE_MAP, moleculeToSpecies, MoleculeDef } from "@/chem/molecules";
import { SceneCanvas } from "@/three/SceneCanvas";
import { MoleculeView } from "@/three/MoleculeView";
import { LewisDiagram } from "@/components/LewisDiagram";
import { PeriodicTable } from "@/components/PeriodicTable";
import {
  Button, Badge, Panel, Modal, Stat, Segmented, Stepper, Toggle,
  ChemFormula, Callout, EmptyState,
} from "@/components/ui";
import {
  SimLayout, ControlSection, Viewport3D, ExplanationFeed,
  useExplanationFeed, MoleculePresetSelect, InfoRow, BigFormula,
} from "./SimKit";
import type { SimProps } from "./types";

const QUICK_ELEMENTS = ["H", "C", "N", "O", "F", "P", "S", "Cl", "Br", "B", "Si", "I", "Xe", "Na", "Mg", "Al"];

type Tool = "select" | "bond";

export function presetToSpecies(presetId?: string | null): Species | null {
  if (!presetId) return null;
  const def = MOLECULE_MAP.get(presetId);
  return def ? moleculeToSpecies(def) : null;
}

export default function MoleculeBuilder({ presetId, embedded }: SimProps) {
  const [species, setSpecies] = useState<Species>(() => presetToSpecies(presetId) ?? emptySpecies());
  const [tool, setTool] = useState<Tool>("select");
  const [selectedElement, setSelectedElement] = useState("C");
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null);
  const [selectedBondId, setSelectedBondId] = useState<string | null>(null);
  const [pendingBondAtom, setPendingBondAtom] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showLonePairs, setShowLonePairs] = useState(true);
  const [showDipoles, setShowDipoles] = useState(false);
  const [autoBond, setAutoBond] = useState(true);
  const { entries, push, clear } = useExplanationFeed();

  // React to preset changes (lesson embeds / workspace links)
  React.useEffect(() => {
    const sp = presetToSpecies(presetId);
    if (sp) {
      setSpecies(sp);
      setSelectedAtomId(null);
      setSelectedBondId(null);
      clear();
      const def = MOLECULE_MAP.get(presetId!);
      if (def) push("info", def.note, `Loaded ${def.name}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetId]);

  const analysis = useMemo(() => analyzeSpecies(species), [species]);
  const layout = useMemo(() => layout3D(species), [species]);

  const errorAtomIds = useMemo(
    () =>
      analysis.issues
        .filter((i) => i.severity === "error")
        .flatMap((i) => i.atomIds),
    [analysis]
  );

  /* ------------------------- actions ------------------------- */

  const addAtom = useCallback(
    (element: string) => {
      const id = nextId("a");
      const newAtom = { id, element };
      if (autoBond && selectedAtomId && species.atoms.length > 0) {
        // Try to bond to the selected atom
        const target = analysis.byId.get(selectedAtomId);
        if (target) {
          const candidate: Species = {
            ...species,
            atoms: [...species.atoms, newAtom],
            bonds: [...species.bonds, { id: nextId("b"), a: selectedAtomId, b: id, order: 1 }],
          };
          const check = checkBondValidity(species, candidate, selectedAtomId, id);
          if (check.ok) {
            setSpecies(candidate);
            setSelectedAtomId(id);
            push(
              "success",
              `Added ${getElement(element).name} bonded to ${target.element.name}. A single covalent bond shares one electron pair (2 electrons) between the two atoms.`,
              "Atom added + bonded"
            );
            return;
          } else {
            push("danger", check.message!, "Bond not allowed");
            // still add the atom, unbonded
            setSpecies({ ...species, atoms: [...species.atoms, newAtom] });
            setSelectedAtomId(id);
            return;
          }
        }
      }
      setSpecies({ ...species, atoms: [...species.atoms, newAtom] });
      setSelectedAtomId(id);
      push(
        "info",
        `Added a free ${getElement(element).name} atom (${element}, Z = ${getElement(element).z}, ${getElement(element).valenceElectrons} valence electron${getElement(element).valenceElectrons === 1 ? "" : "s"}). Select another atom and use the Connect tool — or turn on auto-bond — to link them.`,
        "Atom added"
      );
    },
    [species, selectedAtomId, autoBond, analysis, push]
  );

  const removeAtom = useCallback(
    (id: string) => {
      const atom = analysis.byId.get(id);
      if (!atom) return;
      setSpecies({
        atoms: species.atoms.filter((a) => a.id !== id),
        bonds: species.bonds.filter((b) => b.a !== id && b.b !== id),
        charge: species.charge,
      });
      setSelectedAtomId(null);
      setSelectedBondId(null);
      push("info", `Removed the ${atom.element.name} atom and every bond attached to it.`, "Atom removed");
    },
    [species, analysis, push]
  );

  const handleAtomClick = useCallback(
    (id: string | null) => {
      if (!id) {
        setSelectedAtomId(null);
        setPendingBondAtom(null);
        return;
      }
      if (tool === "bond") {
        if (!pendingBondAtom) {
          setPendingBondAtom(id);
          setSelectedAtomId(id);
          return;
        }
        if (pendingBondAtom === id) {
          setPendingBondAtom(null);
          return;
        }
        cycleBond(pendingBondAtom, id);
        setPendingBondAtom(null);
        return;
      }
      setSelectedAtomId(id === selectedAtomId ? null : id);
      setSelectedBondId(null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tool, pendingBondAtom, selectedAtomId, species]
  );

  const cycleBond = useCallback(
    (aId: string, bId: string) => {
      const existing = species.bonds.find(
        (b) => (b.a === aId && b.b === bId) || (b.a === bId && b.b === aId)
      );
      const A = analysis.byId.get(aId);
      const B = analysis.byId.get(bId);
      if (!A || !B) return;
      // Cycle: none → single → double → triple → none
      const order = existing ? (existing.order >= 3 ? 0 : existing.order + 1) : 1;

      if (order === 0) {
        setSpecies({ ...species, bonds: species.bonds.filter((b) => b.id !== existing!.id) });
        push(
          "info",
          `Removed the ${A.element.symbol}–${B.element.symbol} bond. The two shared electron pairs went back to being lone pairs on their atoms.`,
          "Bond removed"
        );
        return;
      }

      const candidate: Species = existing
        ? {
            ...species,
            bonds: species.bonds.map((b) => (b.id === existing.id ? { ...b, order: order as 1 | 2 | 3 } : b)),
          }
        : {
            ...species,
            bonds: [...species.bonds, { id: nextId("b"), a: aId, b: bId, order: order as 1 | 2 | 3 }],
          };

      const check = checkBondValidity(species, candidate, aId, bId);
      if (!check.ok) {
        push("danger", check.message!, "Not chemically reasonable");
        return;
      }
      setSpecies(candidate);
      const names = ["", "single", "double", "triple"];
      push(
        "success",
        `Formed a ${names[order]} bond between ${A.element.name} and ${B.element.name}: ${order} shared electron pair${order === 1 ? "" : "s"} (${order * 2} electrons). Shorter and stronger than a ${order === 3 ? "double" : "single"} bond between the same atoms.`,
        `${names[order]} bond`
      );
    },
    [species, analysis, push]
  );

  const changeCharge = useCallback(
    (delta: number) => {
      const nextCharge = species.charge + delta;
      if (nextCharge > 4 || nextCharge < -4) return;
      const candidate = { ...species, charge: nextCharge };
      const nextAnalysis = analyzeSpecies(candidate);
      setSpecies(candidate);
      if (delta === 1) {
        const fcAtom = nextAnalysis.atoms.find((a) => a.formalCharge > 0 && a.loneElectrons % 2 === 1) ??
          nextAnalysis.atoms.find((a) => a.formalCharge > 0);
        push(
          nextAnalysis.totalValenceElectrons % 2 === 1 ? "warning" : "info",
          `Removed one electron → net charge ${formatCharge(nextCharge)}. ${
            fcAtom
              ? `It came off ${fcAtom.element.name}, whose formal charge is now ${fcAtom.formalCharge > 0 ? "+" : ""}${fcAtom.formalCharge}.`
              : ""
          } ${nextAnalysis.isRadical ? "The species now has an odd electron count — it is a radical with an unpaired electron." : "Cations like this form when metals lose electrons to reach a noble-gas configuration."}`,
          "Electron removed (oxidation-like)"
        );
      } else {
        push(
          "info",
          `Added one electron → net charge ${formatCharge(nextCharge)}. Extra electrons go to the atom with room in its valence shell, creating a negative formal charge — this is how anions form.`,
          "Electron added (reduction-like)"
        );
      }
    },
    [species, push]
  );

  const fixFormalCharges = useCallback(() => {
    const result = minimizeFormalCharges(species);
    if (!result.changed) {
      push("success", "Formal charges are already minimized — no improvement possible by adding multiple bonds.", "Structure check");
      return;
    }
    setSpecies(result.species);
    result.explanation.forEach((e) => push("violet", e, "Improved Lewis structure"));
  }, [species, push]);

  const loadMolecule = useCallback(
    (def: MoleculeDef) => {
      setSpecies(moleculeToSpecies(def));
      setSelectedAtomId(null);
      setSelectedBondId(null);
      setPendingBondAtom(null);
      clear();
      push("info", def.note, `Loaded ${def.name}`);
    },
    [push, clear]
  );

  const reset = useCallback(() => {
    setSpecies(emptySpecies());
    setSelectedAtomId(null);
    setSelectedBondId(null);
    setPendingBondAtom(null);
    clear();
  }, [clear]);

  const selectedAtom = selectedAtomId ? analysis.byId.get(selectedAtomId) : null;
  const selectedBond = selectedBondId ? species.bonds.find((b) => b.id === selectedBondId) : null;

  const centralInfo = analysis.centralAtomId ? analysis.byId.get(analysis.centralAtomId) : null;

  /* ------------------------- render ------------------------- */

  const leftPanel = (
    <>
      <ControlSection title="Element Library">
        <div className="element-chip-grid">
          {QUICK_ELEMENTS.map((sym) => {
            const el = getElement(sym);
            return (
              <button
                key={sym}
                className={`element-chip ${selectedElement === sym ? "selected" : ""}`}
                onClick={() => setSelectedElement(sym)}
                title={`${el.name} — ${el.valenceElectrons} valence e⁻, EN ${el.en ?? "—"}`}
                aria-label={el.name}
              >
                <span className="chip-z">{el.z}</span>
                <span className="chip-sym" style={{ color: el.color }}>{sym}</span>
                <span className="chip-name">{el.name}</span>
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button size="sm" variant="primary" onClick={() => addAtom(selectedElement)} style={{ flex: 1 }}>
            + Add {selectedElement}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowTable(true)} title="Browse all 56 elements">
            ⌗ All
          </Button>
        </div>
        <Toggle checked={autoBond} onChange={setAutoBond} label="Auto-bond to selected atom" />
      </ControlSection>

      <ControlSection title="Tools">
        <Segmented
          options={[
            { value: "select", label: "🖐 Select / inspect" },
            { value: "bond", label: "🔗 Connect atoms" },
          ]}
          value={tool}
          onChange={(t) => {
            setTool(t);
            setPendingBondAtom(null);
          }}
          accent
          style={{ width: "100%" }}
        />
        <div className="muted tiny">
          {tool === "bond"
            ? pendingBondAtom
              ? "Now click the second atom. Clicking a bonded pair cycles single → double → triple → remove."
              : "Click the first atom of a new bond."
            : "Click any atom or bond in the 3-D model or Lewis structure to inspect it."}
        </div>
        <div className="divider" />
        <Stepper label="Species charge" value={species.charge} min={-4} max={4} onChange={(c) => changeCharge(c - species.charge)} />
        <div className="tiny muted" style={{ marginTop: -4 }}>
          Charge {formatCharge(species.charge)} — removing electrons makes cations; adding makes anions.
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button size="sm" variant="outline" onClick={fixFormalCharges} disabled={species.atoms.length < 2}>
            ✨ Minimize formal charges
          </Button>
          <Button size="sm" variant="danger" onClick={reset} disabled={species.atoms.length === 0}>
            ↺ Reset
          </Button>
        </div>
      </ControlSection>

      <ControlSection title="Load a Species">
        <MoleculePresetSelect value="" onChange={loadMolecule} />
        <div className="tiny muted">
          40+ curated species: VSEPR classics, resonance ions, organics, expanded octets.
        </div>
      </ControlSection>

      <ControlSection title="Display">
        <Toggle checked={showLabels} onChange={setShowLabels} label="Element labels" />
        <Toggle checked={showLonePairs} onChange={setShowLonePairs} label="Lone pairs" />
        <Toggle checked={showDipoles} onChange={setShowDipoles} label="Bond dipoles" />
      </ControlSection>
    </>
  );

  const canvasPanel = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%", minHeight: 0 }}>
      <Viewport3D
        style={{ flex: embedded ? "1 1 260px" : "1 1 340px", minHeight: embedded ? 260 : 340 }}
        hud={
          <>
            {species.atoms.length > 0 && (
              <Badge tone="accent">
                <ChemFormula parts={analysis.formulaParts} />
              </Badge>
            )}
            {analysis.issues.some((i) => i.severity === "error") && (
              <Badge tone="bad">⚠ invalid structure</Badge>
            )}
            {tool === "bond" && <Badge tone="warn">connect mode</Badge>}
          </>
        }
        hint={
          species.atoms.length === 0
            ? "Add your first atom from the element library →"
            : undefined
        }
      >
        {species.atoms.length === 0 ? (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <EmptyState
              icon="⚛️"
              title="Empty workspace"
              hint={<>Pick an element and press <b>Add</b>, or load a species from the library. Build anything from H₂ to SF₆.</>}
            />
          </div>
        ) : (
          <SceneCanvas cameraPosition={[0, 1.4, 7.5]}>
            <Suspense fallback={null}>
              <MoleculeView
                species={species}
                analysis={analysis}
                layout={layout}
                showLabels={showLabels}
                showLonePairs={showLonePairs}
                showDipoles={showDipoles}
                selectedAtomId={selectedAtomId}
                selectedBondId={selectedBondId}
                highlightAtomIds={pendingBondAtom ? [pendingBondAtom] : []}
                onSelectAtom={handleAtomClick}
                onSelectBond={(id) => {
                  setSelectedBondId(id);
                  if (id) setSelectedAtomId(null);
                }}
              />
            </Suspense>
          </SceneCanvas>
        )}
      </Viewport3D>

      <Panel
        title="Lewis Structure (2-D)"
        actions={
          <span className="tiny muted">
            {analysis.totalValenceElectrons} valence e⁻ · {analysis.bondingElectrons} bonding · {analysis.loneElectrons} lone
          </span>
        }
        bodyClassName=""
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <LewisDiagram
            species={species}
            width={embedded ? 300 : 420}
            height={embedded ? 150 : 190}
            selectedAtomId={selectedAtomId}
            highlightAtomIds={errorAtomIds}
            onSelectAtom={handleAtomClick}
          />
        </div>
      </Panel>
    </div>
  );

  const rightPanel = (
    <>
      {species.atoms.length > 0 && (
        <Panel title="Identity">
          <BigFormula
            sub={`${analysis.molarMass.toFixed(2)} g/mol${analysis.isRadical ? " · radical (odd e⁻)" : ""}`}
          >
            <ChemFormula parts={analysis.formulaParts} />
          </BigFormula>
          <div className="stat-grid" style={{ marginTop: 8 }}>
            <Stat label="Valence e⁻" value={analysis.totalValenceElectrons} />
            <Stat label="Bonding e⁻" value={analysis.bondingElectrons} />
            <Stat label="Lone e⁻" value={analysis.loneElectrons} />
            <Stat label="Bonds" value={analysis.bondCount} />
          </div>
        </Panel>
      )}

      {centralInfo?.geometry && centralInfo.bondedIds.length > 0 && (
        <Panel
          title="Shape at Central Atom"
          actions={<Badge tone="violet">{centralInfo.geometry.axe}</Badge>}
        >
          <InfoRow label="Central atom">
            {centralInfo.element.name} ({centralInfo.element.symbol})
          </InfoRow>
          <InfoRow label="Electron groups">{centralInfo.stericNumber}</InfoRow>
          <InfoRow label="Lone pairs">{centralInfo.lonePairs + (centralInfo.unpairedElectron ? " (+1 e⁻)" : "")}</InfoRow>
          <InfoRow label="Electron geometry">{centralInfo.geometry.electronGeometry}</InfoRow>
          <InfoRow label="Molecular geometry">
            <b style={{ color: "var(--accent)" }}>{centralInfo.geometry.molecularGeometry}</b>
          </InfoRow>
          <InfoRow label="Bond angles">
            {centralInfo.geometry.angles.map((a) => `${a.value}°`).join(", ") || "—"}
          </InfoRow>
          <InfoRow label="Hybridization">{hybridization(centralInfo.stericNumber)}</InfoRow>
          <div className="tiny muted" style={{ marginTop: 6 }}>{centralInfo.geometry.description}</div>
          <Link to="/sims/vsepr-lab" className="tiny" style={{ marginTop: 6, display: "inline-block" }}>
            Explore this geometry in the VSEPR Lab →
          </Link>
        </Panel>
      )}

      {selectedAtom && (
        <Panel
          title={`Selected: ${selectedAtom.element.name}`}
          actions={
            <Button size="sm" variant="danger" onClick={() => removeAtom(selectedAtom.id)}>
              Remove
            </Button>
          }
        >
          <InfoRow label="Symbol / Z">{`${selectedAtom.element.symbol} · ${selectedAtom.element.z}`}</InfoRow>
          <InfoRow label="Electronegativity">{selectedAtom.element.en ?? "—"}</InfoRow>
          <InfoRow label="Valence electrons">{selectedAtom.element.valenceElectrons}</InfoRow>
          <InfoRow label="Bonds">{selectedAtom.bondOrders} (to {selectedAtom.bondedIds.length} atom{selectedAtom.bondedIds.length === 1 ? "" : "s"})</InfoRow>
          <InfoRow label="Lone pairs">{selectedAtom.lonePairs}{selectedAtom.unpairedElectron ? " + 1 unpaired e⁻" : ""}</InfoRow>
          <InfoRow label="Formal charge">
            <span style={{ color: selectedAtom.formalCharge === 0 ? "var(--good)" : selectedAtom.formalCharge > 0 ? "#ff9d9d" : "#9dc4ff" }}>
              {selectedAtom.formalCharge === 0 ? "0" : selectedAtom.formalCharge > 0 ? `+${selectedAtom.formalCharge}` : `−${Math.abs(selectedAtom.formalCharge)}`}
            </span>
          </InfoRow>
          <InfoRow label="Octet">
            <Badge tone={selectedAtom.octetStatus === "octet" || selectedAtom.octetStatus === "duet" ? "good" : selectedAtom.octetStatus === "overfilled" ? "bad" : selectedAtom.octetStatus === "expanded" ? "violet" : "warn"}>
              {selectedAtom.octetStatus}
            </Badge>
          </InfoRow>
          {selectedAtom.geometry && selectedAtom.bondedIds.length > 0 && (
            <InfoRow label="Local geometry">{selectedAtom.geometry.molecularGeometry}</InfoRow>
          )}
        </Panel>
      )}

      {selectedBond && (
        <Panel
          title="Selected Bond"
          actions={
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                setSpecies({ ...species, bonds: species.bonds.filter((b) => b.id !== selectedBond.id) });
                setSelectedBondId(null);
                push("info", "Bond removed — the shared pair returned to the atoms as lone pairs.", "Bond broken");
              }}
            >
              Break
            </Button>
          }
        >
          {(() => {
            const A = analysis.byId.get(selectedBond.a)!;
            const B = analysis.byId.get(selectedBond.b)!;
            return (
              <>
                <InfoRow label="Atoms">{`${A.element.symbol} — ${B.element.symbol}`}</InfoRow>
                <InfoRow label="Order">
                  <Segmented
                    options={[
                      { value: "1", label: "Single" },
                      { value: "2", label: "Double" },
                      { value: "3", label: "Triple" },
                    ]}
                    value={String(selectedBond.order)}
                    onChange={(v) => {
                      const order = Number(v) as 1 | 2 | 3;
                      const candidate: Species = {
                        ...species,
                        bonds: species.bonds.map((b) => (b.id === selectedBond.id ? { ...b, order } : b)),
                      };
                      const check = checkBondValidity(species, candidate, selectedBond.a, selectedBond.b);
                      if (!check.ok) {
                        push("danger", check.message!, "Not chemically reasonable");
                        return;
                      }
                      setSpecies(candidate);
                      setSelectedBondId(null);
                    }}
                    accent
                  />
                </InfoRow>
                <InfoRow label="Shared electrons">{selectedBond.order * 2}</InfoRow>
              </>
            );
          })()}
        </Panel>
      )}

      {analysis.issues.length > 0 && (
        <Panel title={`Structure Check (${analysis.issues.length})`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {analysis.issues.slice(0, 6).map((issue, i) => (
              <Callout
                key={i}
                tone={issue.severity === "error" ? "danger" : issue.severity === "warning" ? "warning" : "info"}
              >
                {issue.message}
              </Callout>
            ))}
          </div>
        </Panel>
      )}

      <ControlSection title="What Happened & Why">
        <ExplanationFeed entries={entries} />
      </ControlSection>
    </>
  );

  return (
    <>
      <SimLayout left={leftPanel} canvas={canvasPanel} right={rightPanel} embedded={embedded} />
      <Modal open={showTable} onClose={() => setShowTable(false)} title="All Elements (Z = 1–56)" wide>
        <PeriodicTable
          onSelect={(el) => {
            setSelectedElement(el.symbol);
            setShowTable(false);
            addAtom(el.symbol);
          }}
        />
        <p className="tiny muted" style={{ marginTop: 12 }}>
          Click an element to select it and add it to the workspace. The library covers Z = 1–56,
          every element that appears in AP Chemistry problems.
        </p>
      </Modal>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Validity checking                                                    */
/* ------------------------------------------------------------------ */

function checkBondValidity(
  before: Species,
  candidate: Species,
  aId: string,
  bId: string
): { ok: boolean; message?: string } {
  const beforeAnalysis = analyzeSpecies(before);
  const afterAnalysis = analyzeSpecies(candidate);
  const A = afterAnalysis.byId.get(aId)!;
  const B = afterAnalysis.byId.get(bId)!;

  // Hard pre-checks
  if (aId === bId) return { ok: false, message: "An atom cannot bond to itself here." };

  const bond = candidate.bonds.find(
    (b) => (b.a === aId && b.b === bId) || (b.a === bId && b.b === aId)
  );
  const order = bond?.order ?? 1;

  for (const atom of [A, B]) {
    const prev = beforeAnalysis.byId.get(atom.id);
    if (atom.element.symbol === "H" && atom.bondOrders > 1) {
      return {
        ok: false,
        message: `Hydrogen can form only ONE bond. It has a single valence electron (1s¹) — sharing a second pair would exceed its duet. (H currently has ${atom.bondOrders} bonds.)`,
      };
    }
    if (atom.element.symbol === "F" && atom.bondOrders > 1) {
      return {
        ok: false,
        message: "Fluorine never forms multiple bonds in normal structures. As the most electronegative element it holds its electrons too tightly to share a second pair.",
      };
    }
    if (atom.bondOrders > typicalMaxBonds(atom.element)) {
      return {
        ok: false,
        message: `${atom.element.name} would have ${atom.bondOrders} bonds — more than its maximum of ${typicalMaxBonds(atom.element)} given its ${atom.element.valenceElectrons} valence electrons.`,
      };
    }
    if (atom.octetStatus === "overfilled" && (prev === undefined || prev.octetStatus !== "overfilled")) {
      return {
        ok: false,
        message: `This would put ${2 * atom.bondOrders + atom.loneElectrons} electrons around ${atom.element.name}, a period-${atom.element.period} element. Atoms in period 2 have only s and p orbitals (n = 2) — the octet can never be exceeded.`,
      };
    }
    void order;
  }

  // New errors introduced anywhere?
  const newErrors = afterAnalysis.issues.filter(
    (i) =>
      i.severity === "error" &&
      !beforeAnalysis.issues.some((j) => j.severity === "error" && j.message === i.message)
  );
  if (newErrors.length > 0) {
    return { ok: false, message: newErrors[0].message };
  }
  return { ok: true };
}

function formatCharge(c: number): string {
  if (c === 0) return "0 (neutral)";
  return c > 0 ? `+${c}` : `−${Math.abs(c)}`;
}
