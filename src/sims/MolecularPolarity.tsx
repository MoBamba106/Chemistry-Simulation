/**
 * Molecular Polarity — do the bond dipoles cancel?
 *
 * Loads molecules from the shared library, computes every bond dipole from
 * electronegativity differences, adds lone-pair contributions, and shows the
 * vector sum live in 3-D. Includes head-to-head comparison presets (CO₂ vs
 * H₂O, CH₄ vs CH₃Cl) that drive home the exam's favorite point:
 * POLAR BONDS ≠ POLAR MOLECULE — geometry decides.
 */
import * as React from "react";
import { useMemo, useState, Suspense } from "react";
import { Link } from "react-router-dom";
import { MOLECULE_MAP, moleculeToSpecies, MoleculeDef } from "@/chem/molecules";
import { analyzeSpecies } from "@/chem/lewis";
import { layout3D } from "@/chem/layout";
import { computeDipole, predictIMF } from "@/chem/bonding";
import { SceneCanvas } from "@/three/SceneCanvas";
import { MoleculeView } from "@/three/MoleculeView";
import { LewisDiagram } from "@/components/LewisDiagram";
import { Badge, Panel, Button, Segmented, Callout, Stat } from "@/components/ui";
import { SimLayout, ControlSection, Viewport3D, InfoRow, BigFormula, MoleculePresetSelect } from "./SimKit";
import type { SimProps } from "./types";

interface PolPreset { id: string; label: string; a: string; b: string; point: string; }
const COMPARE_PRESETS: PolPreset[] = [
  {
    id: "co2-vs-h2o", label: "CO₂ vs H₂O", a: "co2", b: "h2o",
    point: "Same number of polar bonds' worth of electronegativity drama — but CO₂'s linear geometry cancels the dipoles while bent H₂O keeps a strong net dipole. That's why CO₂ is a gas and water is a liquid at room temperature.",
  },
  {
    id: "ch4-vs-ch3cl", label: "CH₄ vs CH₃Cl", a: "ch4", b: "ch3cl",
    point: "Swap one H for Cl and tetrahedral symmetry breaks. Four identical C–H dipoles cancel; three C–H plus one strongly polar C–Cl do not. CH₃Cl is polar, CH₄ is not.",
  },
  {
    id: "bf3-vs-nh3", label: "BF₃ vs NH₃", a: "bf3", b: "nh3",
    point: "Both have three polar bonds, but BF₃ is trigonal planar (no lone pair on B) and cancels; NH₃ is pyramidal (lone pair on N) and the dipoles add. Lone pairs wreck symmetry.",
  },
  {
    id: "ccl4-vs-chcl3-analog", label: "CCl₄ vs CHCl₃-style asymmetry", a: "ccl4", b: "ch3cl",
    point: "CCl₄: four identical bonds in a tetrahedron cancel perfectly — nonpolar despite very polar bonds. Any asymmetry (different atoms or lone pairs) leaves a net dipole.",
  },
];

export default function MolecularPolarity({ presetId, embedded }: SimProps) {
  const comparePreset = useMemo(() => COMPARE_PRESETS.find((p) => p.id === presetId) ?? null, [presetId]);
  const [mode, setMode] = useState<"single" | "compare">(comparePreset ? "compare" : "single");
  const [molA, setMolA] = useState(comparePreset?.a ?? (MOLECULE_MAP.has(presetId ?? "") ? presetId! : "h2o"));
  const [molB, setMolB] = useState(comparePreset?.b ?? "co2");
  const [showDipoles, setShowDipoles] = useState(true);
  const [showNet, setShowNet] = useState(true);
  const [showLP, setShowLP] = useState(true);
  const [showLewis, setShowLewis] = useState(false);

  React.useEffect(() => {
    if (comparePreset) {
      setMode("compare");
      setMolA(comparePreset.a);
      setMolB(comparePreset.b);
    } else if (presetId && MOLECULE_MAP.has(presetId)) {
      setMode("single");
      setMolA(presetId);
    }
  }, [comparePreset, presetId]);

  const defA = MOLECULE_MAP.get(molA)!;
  const defB = MOLECULE_MAP.get(molB)!;

  const leftPanel = (
    <>
      <ControlSection title="Mode">
        <Segmented
          options={[
            { value: "single", label: "One molecule" },
            { value: "compare", label: "Compare two" },
          ]}
          value={mode}
          onChange={(m) => setMode(m as "single" | "compare")}
          accent
          style={{ width: "100%" }}
        />
        {mode === "compare" && (
          <>
            <div className="ctl-label">Comparison presets</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {COMPARE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  className={`seg-item ${p.a === molA && p.b === molB ? "active-accent" : ""}`}
                  style={{ textAlign: "left", padding: "6px 10px", borderRadius: 8, width: "100%" }}
                  onClick={() => { setMolA(p.a); setMolB(p.b); }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </>
        )}
      </ControlSection>

      <ControlSection title={mode === "compare" ? "Molecule A" : "Molecule"}>
        <MoleculePresetSelect value={molA} onChange={(d) => setMolA(d.id)} filter={(d) => d.atoms.length >= 2} />
      </ControlSection>

      {mode === "compare" && (
        <ControlSection title="Molecule B">
          <MoleculePresetSelect value={molB} onChange={(d) => setMolB(d.id)} filter={(d) => d.atoms.length >= 2} />
        </ControlSection>
      )}

      <ControlSection title="Vectors">
        <ToggleRow label="Bond dipoles (orange)" checked={showDipoles} onChange={setShowDipoles} />
        <ToggleRow label="Net dipole (pink)" checked={showNet} onChange={setShowNet} />
        <ToggleRow label="Lone pairs" checked={showLP} onChange={setShowLP} />
        <ToggleRow label="Lewis inset" checked={showLewis} onChange={setShowLewis} />
      </ControlSection>
    </>
  );

  const canvasPanel = mode === "compare" ? (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, height: "100%", minHeight: 0 }}>
      <MoleculePane
        def={defA}
        showDipoles={showDipoles}
        showNet={showNet}
        showLP={showLP}
        showLewis={showLewis}
        embedded={embedded}
      />
      <MoleculePane
        def={defB}
        showDipoles={showDipoles}
        showNet={showNet}
        showLP={showLP}
        showLewis={showLewis}
        embedded={embedded}
      />
    </div>
  ) : (
    <MoleculePane def={defA} showDipoles={showDipoles} showNet={showNet} showLP={showLP} showLewis={showLewis} big embedded={embedded} />
  );

  const single = useMemo(() => makeDipoleReport(defA), [defA]);
  const second = useMemo(() => (mode === "compare" ? makeDipoleReport(defB) : null), [mode, defB]);
  const imfA = single.imf;

  const rightPanel = (
    <>
      <Panel title={`${defA.name} — Verdict`}>
        <BigFormula sub={single.analysis.formula}>
          <span style={{ color: single.dipole.polar ? "#ff8fc0" : "#8ec9ff" }}>
            {single.dipole.polar ? "POLAR" : "NONPOLAR"}
          </span>
        </BigFormula>
        <div className="stat-grid">
          <Stat label="Net dipole" value={single.dipole.netMagnitude.toFixed(2)} sub="relative vector sum" />
          <Stat label="Polar bonds" value={single.dipole.bondDipoles.length} sub={`of ${single.species.bonds.length}`} />
        </div>
        <div className="tiny" style={{ marginTop: 8, lineHeight: 1.6, color: "var(--text-1)" }}>
          {single.dipole.explanation}
        </div>
        {single.central && (
          <>
            <div className="divider" />
            <InfoRow label="Shape at {single.central.element.symbol}" >{single.central.geometry?.molecularGeometry ?? "—"}</InfoRow>
            <InfoRow label="Symmetry">{single.dipole.polar ? "asymmetric charge distribution" : "symmetric — dipoles cancel"}</InfoRow>
          </>
        )}
        <div className="divider" />
        <InfoRow label="Dominant IMF">{imfA.dominant}</InfoRow>
        <div className="tiny muted" style={{ marginTop: 4 }}>
          Polarity determines which intermolecular forces act — and those determine boiling point,
          solubility, and phase. <Link to="/sims/imf-lab">Explore IMFs →</Link>
        </div>
      </Panel>

      {second && (
        <Panel title={`${defB.name} — Verdict`}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Badge tone={second.dipole.polar ? "bad" : "good"} style={{ fontSize: 13 }}>
              {second.dipole.polar ? "POLAR" : "NONPOLAR"}
            </Badge>
            <span className="tiny muted">net dipole {second.dipole.netMagnitude.toFixed(2)} · {second.dipole.bondDipoles.length} polar bonds</span>
          </div>
          <div className="tiny" style={{ marginTop: 8, lineHeight: 1.6, color: "var(--text-1)" }}>
            {second.dipole.explanation}
          </div>
        </Panel>
      )}

      {mode === "compare" && (
        <Callout tone="violet" title="The comparison teaches">
          {COMPARE_PRESETS.find((p) => p.a === molA && p.b === molB)?.point ??
            "Look at geometry first, then bond polarity: identical polar bonds in a symmetric arrangement cancel; any asymmetry (different ligands or lone pairs on the central atom) leaves a net dipole."}
        </Callout>
      )}

      <Panel title="Decision Procedure (exam-ready)">
        <ol className="tiny" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.75, color: "var(--text-1)" }}>
          <li>Draw the Lewis structure (get lone pairs right).</li>
          <li>Use VSEPR to get the 3-D shape.</li>
          <li>Mark each bond's dipole toward the more electronegative atom.</li>
          <li>Add the dipoles as <b>vectors</b>. Perfect symmetry (identical ligands, no lone pairs on the central atom) → cancel → nonpolar. Anything asymmetric → polar.</li>
        </ol>
      </Panel>
    </>
  );

  return <SimLayout left={leftPanel} canvas={canvasPanel} right={rightPanel} embedded={embedded} />;
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="track" />
      <span>{label}</span>
    </label>
  );
}

function makeDipoleReport(def: MoleculeDef) {
  const species = moleculeToSpecies(def);
  const analysis = analyzeSpecies(species);
  const layout = layout3D(species);
  const dipole = computeDipole(species, analysis, layout);
  const imf = predictIMF(species, analysis, dipole);
  const central = analysis.centralAtomId ? analysis.byId.get(analysis.centralAtomId) : null;
  return { species, analysis, layout, dipole, imf, central };
}

function MoleculePane({
  def,
  showDipoles,
  showNet,
  showLP,
  showLewis,
  big,
  embedded,
}: {
  def: MoleculeDef;
  showDipoles: boolean;
  showNet: boolean;
  showLP: boolean;
  showLewis: boolean;
  big?: boolean;
  embedded?: boolean;
}) {
  const report = useMemo(() => makeDipoleReport(def), [def]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
      <Viewport3D
        style={{ flex: 1, minHeight: embedded ? 260 : big ? 420 : 320 }}
        hud={
          <>
            <Badge tone="accent">{def.name}</Badge>
            <Badge tone={report.dipole.polar ? "bad" : "good"}>
              {report.dipole.polar ? "polar" : "nonpolar"}
            </Badge>
          </>
        }
      >
        <SceneCanvas cameraPosition={[0, 1.4, big ? 7 : 6]}>
          <Suspense fallback={null}>
            <MoleculeView
              species={report.species}
              analysis={report.analysis}
              layout={report.layout}
              showLabels
              showLonePairs={showLP}
              showDipoles={showDipoles}
              showNetDipole={showNet}
              interactive={false}
            />
          </Suspense>
        </SceneCanvas>
      </Viewport3D>
      {showLewis && (
        <Panel title="Lewis" bodyClassName="">
          <div style={{ display: "flex", justifyContent: "center", padding: 4 }}>
            <LewisDiagram species={report.species} width={big ? 340 : 260} height={big ? 200 : 160} />
          </div>
        </Panel>
      )}
    </div>
  );
}
