/**
 * Lewis Structure Studio — deep analysis of Lewis diagrams.
 *
 * Pick any species from the library and get:
 *  - the 2-D Lewis diagram (with formal charges & lone pairs toggleable)
 *  - a step-by-step valence-electron bookkeeping panel
 *  - a resonance carousel when the species has multiple valid forms,
 *    with an explanation of what the resonance hybrid really means
 *  - the 3-D model beside it so the two representations stay linked
 *  - an octet / validity report
 *
 * Editing happens in the Molecule Builder (same engine) — this studio is
 * for reading and understanding structures.
 */
import * as React from "react";
import { useMemo, useState, Suspense } from "react";
import { Link } from "react-router-dom";
import { MOLECULES, MOLECULE_MAP, moleculeToSpecies, MoleculeDef } from "@/chem/molecules";
import { analyzeSpecies } from "@/chem/lewis";
import { layout3D } from "@/chem/layout";
import { getElement } from "@/chem/elements";
import { hybridization } from "@/chem/bonding";
import { SceneCanvas } from "@/three/SceneCanvas";
import { MoleculeView } from "@/three/MoleculeView";
import { LewisDiagram } from "@/components/LewisDiagram";
import { Badge, Panel, Button, Segmented, Toggle, Callout, ChemFormula } from "@/components/ui";
import { SimLayout, ControlSection, Viewport3D, InfoRow, MoleculePresetSelect } from "./SimKit";
import type { SimProps } from "./types";

const FEATURED = [
  "h2o", "co2", "ch4", "nh3", "bf3", "o3", "so2", "no3", "co3", "so4", "po4",
  "nh4", "h3o", "oh", "cn", "co", "n2", "hcn", "sf6", "pcl5", "xef4", "c2h4", "ch2o",
];

export default function LewisStudio({ presetId, embedded }: SimProps) {
  const initial = MOLECULE_MAP.has(presetId ?? "") ? presetId! : "no3";
  const [molId, setMolId] = useState(initial);
  const [resonanceIndex, setResonanceIndex] = useState(0);
  const [showLP, setShowLP] = useState(true);
  const [showFC, setShowFC] = useState(true);
  const [view, setView] = useState<"both" | "lewis" | "3d">("both");

  React.useEffect(() => {
    if (presetId && MOLECULE_MAP.has(presetId)) {
      setMolId(presetId);
      setResonanceIndex(0);
    }
  }, [presetId]);

  const def: MoleculeDef = MOLECULE_MAP.get(molId) ?? MOLECULES[0];
  const species = useMemo(() => moleculeToSpecies(def, resonanceIndex), [def, resonanceIndex]);
  const analysis = useMemo(() => analyzeSpecies(species), [species]);
  const layout = useMemo(() => layout3D(species), [species]);

  const numForms = 1 + (def.resonance?.length ?? 0);
  const central = analysis.centralAtomId ? analysis.byId.get(analysis.centralAtomId) : null;

  const loadMol = (d: MoleculeDef) => {
    setMolId(d.id);
    setResonanceIndex(0);
  };

  const leftPanel = (
    <>
      <ControlSection title="Species Library">
        <MoleculePresetSelect value={molId} onChange={loadMol} />
        <div className="tiny muted">Featured for Lewis analysis:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {FEATURED.map((id) => {
            const m = MOLECULE_MAP.get(id);
            if (!m) return null;
            return (
              <button
                key={id}
                className={`seg-item ${molId === id ? "active-accent" : ""}`}
                style={{ padding: "4px 9px", borderRadius: 7 }}
                onClick={() => loadMol(m)}
              >
                {id === molId ? m.name : m.name.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </ControlSection>

      {numForms > 1 && (
        <ControlSection
          title="Resonance Forms"
          actions={<Badge tone="violet">{resonanceIndex + 1} / {numForms}</Badge>}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <Button size="sm" variant="outline" disabled={resonanceIndex === 0}
              onClick={() => setResonanceIndex((i) => i - 1)}>
              ← Prev
            </Button>
            <Button size="sm" variant="outline" disabled={resonanceIndex >= numForms - 1}
              onClick={() => setResonanceIndex((i) => i + 1)}>
              Next →
            </Button>
          </div>
          <Callout tone="violet" title="Resonance ≠ flipping">
            The real molecule does NOT oscillate between these drawings. It is a single
            structure — a <b>resonance hybrid</b> — with electron density delocalized
            (spread out) over all the atoms involved. Each form is our best
            two-electron-bond approximation of part of the truth.
          </Callout>
        </ControlSection>
      )}

      <ControlSection title="Display">
        <Segmented
          options={[
            { value: "both", label: "Both" },
            { value: "lewis", label: "Lewis only" },
            { value: "3d", label: "3-D only" },
          ]}
          value={view}
          onChange={setView}
          accent
        />
        <Toggle checked={showLP} onChange={setShowLP} label="Lone pairs (dots)" />
        <Toggle checked={showFC} onChange={setShowFC} label="Formal charges" />
      </ControlSection>

      <Panel title="About This Species">
        <div className="tiny" style={{ lineHeight: 1.6, color: "var(--text-1)" }}>{def.note}</div>
        <Link to={`/sims/molecule-builder?preset=${def.id}`}>
          <Button size="sm" variant="outline" style={{ marginTop: 8 }}>
            Edit in Molecule Builder →
          </Button>
        </Link>
      </Panel>
    </>
  );

  const lewisCard = (
    <Panel
      title="Lewis Diagram"
      actions={<ChemFormula parts={analysis.formulaParts} style={{ fontWeight: 700, fontSize: 15, color: "var(--text-0)" }} />}
      style={{ flex: view === "both" ? "1 1 55%" : "1 1 100%", minHeight: 0, display: "flex", flexDirection: "column" }}
      bodyClassName=""
    >
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: embedded ? 220 : 300 }}>
        <LewisDiagram
          species={species}
          width={embedded ? 320 : 440}
          height={embedded ? 220 : 300}
          showLonePairs={showLP}
          showFormalCharges={showFC}
        />
      </div>
    </Panel>
  );

  const threeDCard = (
    <div style={{ flex: view === "both" ? "1 1 45%" : "1 1 100%", minHeight: embedded ? 240 : 300, position: "relative" }}>
      <Viewport3D style={{ height: "100%" }} hud={<Badge tone="accent">3-D · VSEPR shape</Badge>}>
        <SceneCanvas cameraPosition={[0, 1.2, 6.5]}>
          <Suspense fallback={null}>
            <MoleculeView
              species={species}
              analysis={analysis}
              layout={layout}
              showLabels={false}
              showLonePairs={showLP}
              interactive={false}
            />
          </Suspense>
        </SceneCanvas>
      </Viewport3D>
    </div>
  );

  const canvasPanel = (
    <div style={{ display: "flex", flexDirection: view === "both" ? "row" : "column", gap: 12, height: "100%", minHeight: 0 }}>
      {view !== "3d" && lewisCard}
      {view !== "lewis" && threeDCard}
    </div>
  );

  const rightPanel = (
    <>
      <Panel title="Electron Bookkeeping">
        <InfoRow label="Σ valence e⁻ of atoms">
          {species.atoms.reduce((s, a) => s + getElement(a.element).valenceElectrons, 0)}
        </InfoRow>
        {def.charge !== 0 && (
          <InfoRow label={`Charge adjustment (${def.charge > 0 ? "lose" : "gain"} ${Math.abs(def.charge)} e⁻)`}>
            {def.charge > 0 ? `− ${def.charge}` : `+ ${Math.abs(def.charge)}`}
          </InfoRow>
        )}
        <InfoRow label="Total valence e⁻">
          <b style={{ color: "var(--accent)" }}>{analysis.totalValenceElectrons}</b>
        </InfoRow>
        <InfoRow label="In bonds (shared)">
          {analysis.bondingElectrons} ({analysis.bondCount} bond{analysis.bondCount === 1 ? "" : "s"})
        </InfoRow>
        <InfoRow label="Lone pairs (dots)">{analysis.loneElectrons}</InfoRow>
        <div className="divider" />
        <InfoRow label="Check">{analysis.bondingElectrons + analysis.loneElectrons} = {analysis.totalValenceElectrons} ✓</InfoRow>
      </Panel>

      <Panel title="Formal Charges">
        <div className="tiny muted" style={{ marginBottom: 6 }}>
          FC = valence e⁻ − lone e⁻ − ½(shared e⁻). Good structures put negative FC on the
          more electronegative atom and keep magnitudes small.
        </div>
        {analysis.atoms.map((a) => (
          <InfoRow key={a.id} label={`${a.element.symbol} (${a.id})`}>
            <span style={{ color: a.formalCharge === 0 ? "var(--good)" : a.formalCharge > 0 ? "#ff9d9d" : "#9dc4ff", fontWeight: 700 }}>
              {a.formalCharge === 0 ? "0" : a.formalCharge > 0 ? `+${a.formalCharge}` : `−${Math.abs(a.formalCharge)}`}
            </span>
            <span className="tiny muted" style={{ marginLeft: 6 }}>
              = {a.element.valenceElectrons} − {a.loneElectrons} − {a.bondOrders}
            </span>
          </InfoRow>
        ))}
        <InfoRow label="Sum">
          {analysis.netFormalCharge === 0 ? "0 (neutral)" : analysis.netFormalCharge > 0 ? `+${analysis.netFormalCharge}` : `−${Math.abs(analysis.netFormalCharge)}`}
        </InfoRow>
      </Panel>

      {central && central.geometry && central.bondedIds.length > 0 && (
        <Panel title="Geometry" actions={<Badge tone="violet">{central.geometry.axe}</Badge>}>
          <InfoRow label="Shape">{central.geometry.molecularGeometry}</InfoRow>
          <InfoRow label="Angles">{central.geometry.angles.map((a) => `${a.value}°`).join(", ")}</InfoRow>
          <InfoRow label="Hybridization (central)">{hybridization(central.stericNumber)}</InfoRow>
        </Panel>
      )}

      {analysis.issues.filter((i) => i.severity !== "info").length > 0 && (
        <Panel title="Structure Notes">
          {analysis.issues
            .filter((i) => i.severity !== "info")
            .map((issue, i) => (
              <Callout key={i} tone={issue.severity === "error" ? "danger" : "warning"}>
                {issue.message}
              </Callout>
            ))}
        </Panel>
      )}
    </>
  );

  return <SimLayout left={leftPanel} canvas={canvasPanel} right={rightPanel} embedded={embedded} />;
}
