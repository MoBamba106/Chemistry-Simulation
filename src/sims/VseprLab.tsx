/**
 * VSEPR Geometry Lab — explore how electron groups determine shape.
 *
 * Pick a central atom, the number of bonded atoms (X) and lone pairs (E),
 * and the lab builds the species, computes its AXE notation, electron-group
 * geometry, molecular geometry, bond angles, and hybridization, and renders
 * it in 3-D with lone pairs visible. Presets cover every geometry on the AP
 * exam, each with a real example molecule you can send to the Molecule
 * Builder.
 */
import * as React from "react";
import { useMemo, Suspense } from "react";
import { Link } from "react-router-dom";
import { speciesFrom, analyzeSpecies, Species } from "@/chem/lewis";
import { vseprGeometry, allGeometries } from "@/chem/vsepr";
import { hybridization } from "@/chem/bonding";
import { getElement } from "@/chem/elements";
import { layout3D } from "@/chem/layout";
import { SceneCanvas } from "@/three/SceneCanvas";
import { MoleculeView } from "@/three/MoleculeView";
import { LewisDiagram } from "@/components/LewisDiagram";
import { Badge, Panel, Button, Segmented, Toggle, Callout, Stat } from "@/components/ui";
import {
  SimLayout, ControlSection, Viewport3D, InfoRow, BigFormula,
} from "./SimKit";
import type { SimProps } from "./types";

interface VseprPreset {
  id: string;
  label: string;
  central: string;
  ligand: string;
  bonded: number;
  lonePairs: number;
  example: string;
  exampleMoleculeId?: string;
}

const PRESETS: VseprPreset[] = [
  { id: "linear", label: "Linear AX₂", central: "C", ligand: "O", bonded: 2, lonePairs: 0, example: "CO₂", exampleMoleculeId: "co2" },
  { id: "linear-lp", label: "Linear AX₂E₃", central: "Xe", ligand: "F", bonded: 2, lonePairs: 3, example: "XeF₂", exampleMoleculeId: "xef2" },
  { id: "trigonal-planar", label: "Trigonal planar AX₃", central: "B", ligand: "F", bonded: 3, lonePairs: 0, example: "BF₃", exampleMoleculeId: "bf3" },
  { id: "bent-120", label: "Bent AX₂E₁ (~120°)", central: "S", ligand: "O", bonded: 2, lonePairs: 1, example: "SO₂", exampleMoleculeId: "so2" },
  { id: "tetrahedral", label: "Tetrahedral AX₄", central: "C", ligand: "H", bonded: 4, lonePairs: 0, example: "CH₄", exampleMoleculeId: "ch4" },
  { id: "pyramidal", label: "Trigonal pyramidal AX₃E₁", central: "N", ligand: "H", bonded: 3, lonePairs: 1, example: "NH₃", exampleMoleculeId: "nh3" },
  { id: "bent-109", label: "Bent AX₂E₂ (~109°)", central: "O", ligand: "H", bonded: 2, lonePairs: 2, example: "H₂O", exampleMoleculeId: "h2o" },
  { id: "tbp", label: "Trigonal bipyramidal AX₅", central: "P", ligand: "Cl", bonded: 5, lonePairs: 0, example: "PCl₅", exampleMoleculeId: "pcl5" },
  { id: "seesaw", label: "Seesaw AX₄E₁", central: "S", ligand: "F", bonded: 4, lonePairs: 1, example: "SF₄", exampleMoleculeId: "sf4" },
  { id: "t-shaped", label: "T-shaped AX₃E₂", central: "Cl", ligand: "F", bonded: 3, lonePairs: 2, example: "ClF₃", exampleMoleculeId: "clf3" },
  { id: "octahedral", label: "Octahedral AX₆", central: "S", ligand: "F", bonded: 6, lonePairs: 0, example: "SF₆", exampleMoleculeId: "sf6" },
  { id: "square-pyramidal", label: "Square pyramidal AX₅E₁", central: "Br", ligand: "F", bonded: 5, lonePairs: 1, example: "BrF₅", exampleMoleculeId: "brf5" },
  { id: "square-planar", label: "Square planar AX₄E₂", central: "Xe", ligand: "F", bonded: 4, lonePairs: 2, example: "XeF₄", exampleMoleculeId: "xef4" },
];

const CENTRAL_CHOICES = ["Be", "B", "C", "N", "O", "F", "Si", "P", "S", "Cl", "Br", "I", "Xe"];
const LIGAND_CHOICES = ["H", "F", "Cl", "Br", "O", "S", "N"];

function buildSpecies(central: string, ligand: string, bonded: number, lonePairs: number): Species {
  const atoms: Array<{ id: string; element: string }> = [{ id: "C", element: central }];
  const bonds: Array<[string, string, number]> = [];
  for (let i = 1; i <= bonded; i++) {
    atoms.push({ id: `X${i}`, element: ligand });
    bonds.push(["C", `X${i}`, 1]);
  }
  const cEl = getElement(central);
  // species charge = formal charge of central atom = V − 2·LP − bonds
  const charge = cEl.valenceElectrons - 2 * lonePairs - bonded;
  return speciesFrom(atoms, bonds, charge);
}

export default function VseprLab({ presetId, embedded }: SimProps) {
  const preset = useMemo(
    () => PRESETS.find((p) => p.id === presetId) ?? null,
    [presetId]
  );

  const [central, setCentral] = React.useState(preset?.central ?? "O");
  const [ligand, setLigand] = React.useState(preset?.ligand ?? "H");
  const [bonded, setBonded] = React.useState(preset?.bonded ?? 2);
  const [lonePairs, setLonePairs] = React.useState(preset?.lonePairs ?? 2);
  const [showLonePairs, setShowLonePairs] = React.useState(true);
  const [showElectronGeometry, setShowElectronGeometry] = React.useState(false);
  const [view, setView] = React.useState<"3d" | "lewis" | "table">("3d");

  React.useEffect(() => {
    if (preset) {
      setCentral(preset.central);
      setLigand(preset.ligand);
      setBonded(preset.bonded);
      setLonePairs(preset.lonePairs);
    }
  }, [preset]);

  const species = useMemo(
    () => buildSpecies(central, ligand, bonded, lonePairs),
    [central, ligand, bonded, lonePairs]
  );
  const analysis = useMemo(() => analyzeSpecies(species), [species]);
  const layout = useMemo(() => layout3D(species), [species]);

  const centralEl = getElement(central);
  const derivedLP = analysis.byId.get("C")?.lonePairs ?? lonePairs;
  const steric = bonded + derivedLP;
  const geometry = vseprGeometry(Math.min(steric, 6), Math.min(derivedLP, Math.max(0, steric - 1)));

  const mismatch = derivedLP !== lonePairs;
  const impossible = bonded + lonePairs > 6 || bonded > 6;

  const allGeom = useMemo(() => allGeometries(), []);

  const leftPanel = (
    <>
      <ControlSection title="Presets — every AP geometry">
        <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: embedded ? 180 : 300, overflowY: "auto" }}>
          {PRESETS.map((p) => {
            const active = p.central === central && p.ligand === ligand && p.bonded === bonded && p.lonePairs === lonePairs;
            return (
              <button
                key={p.id}
                className={`seg-item ${active ? "active-accent" : ""}`}
                style={{ textAlign: "left", padding: "6px 10px", borderRadius: 8, width: "100%" }}
                onClick={() => {
                  setCentral(p.central);
                  setLigand(p.ligand);
                  setBonded(p.bonded);
                  setLonePairs(p.lonePairs);
                }}
              >
                {p.label} <span className="tiny muted">· {p.example}</span>
              </button>
            );
          })}
        </div>
      </ControlSection>

      <ControlSection title="Build Your Own">
        <div className="ctl-label">Central atom (A)</div>
        <Segmented
          options={CENTRAL_CHOICES.map((c) => ({ value: c, label: c }))}
          value={central}
          onChange={setCentral}
          style={{ flexWrap: "wrap" }}
        />
        <div className="ctl-label">Bonded atoms (X)</div>
        <Segmented
          options={LIGAND_CHOICES.map((c) => ({ value: c, label: c }))}
          value={ligand}
          onChange={setLigand}
          style={{ flexWrap: "wrap" }}
        />
        <NumberSlider label={`X — bonded atoms: ${bonded}`} value={bonded} min={1} max={6} onChange={setBonded} />
        <NumberSlider label={`E — lone pairs on central atom: ${lonePairs}`} value={lonePairs} min={0} max={3} onChange={setLonePairs} />
      </ControlSection>

      <ControlSection title="Display">
        <Segmented
          options={[
            { value: "3d", label: "3-D model" },
            { value: "lewis", label: "Lewis" },
            { value: "table", label: "All shapes" },
          ]}
          value={view}
          onChange={setView}
          accent
        />
        <Toggle checked={showLonePairs} onChange={setShowLonePairs} label="Show lone pairs" />
      </ControlSection>
    </>
  );

  const canvasPanel =
    view === "table" ? (
      <Panel title="Every VSEPR Geometry (steric number 2–6)">
        <div style={{ maxHeight: embedded ? 380 : 560, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ color: "var(--text-3)", textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <th style={{ padding: "6px 8px" }}>AXE</th>
                <th style={{ padding: "6px 8px" }}>Electron geometry</th>
                <th style={{ padding: "6px 8px" }}>Molecular geometry</th>
                <th style={{ padding: "6px 8px" }}>Angles</th>
                <th style={{ padding: "6px 8px" }}>Example</th>
                <th style={{ padding: "6px 8px" }}></th>
              </tr>
            </thead>
            <tbody>
              {allGeom.map((g) => (
                <tr key={g.axe} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "6px 8px" }}><Badge tone="violet">{g.axe}</Badge></td>
                  <td style={{ padding: "6px 8px" }} className="muted">{g.electronGeometry}</td>
                  <td style={{ padding: "6px 8px", fontWeight: 650, color: "var(--text-0)" }}>{g.molecularGeometry}</td>
                  <td style={{ padding: "6px 8px" }}>{g.angles.map((a) => `${a.value}°`).join(", ")}</td>
                  <td style={{ padding: "6px 8px" }} className="muted">{g.example}</td>
                  <td style={{ padding: "6px 8px" }}>
                    {(() => {
                      const p = PRESETS.find((pp) => pp.label.toLowerCase().includes(g.molecularGeometry.toLowerCase()));
                      return p ? (
                        <Button size="sm" variant="ghost" onClick={() => {
                          setCentral(p.central); setLigand(p.ligand); setBonded(p.bonded); setLonePairs(p.lonePairs); setView("3d");
                        }}>
                          View
                        </Button>
                      ) : null;
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    ) : view === "lewis" ? (
      <Panel title="Lewis Structure">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <LewisDiagram species={species} width={embedded ? 320 : 460} height={embedded ? 240 : 330} />
        </div>
        <div className="tiny muted" style={{ textAlign: "center" }}>
          Dots = lone pairs. The central {centralEl.name} has {derivedLP} lone pair{derivedLP === 1 ? "" : "s"} and {bonded} bonding group{bonded === 1 ? "" : "s"}.
        </div>
      </Panel>
    ) : (
      <Viewport3D
        style={{ height: "100%", minHeight: embedded ? 300 : 420 }}
        hud={
          geometry && (
            <>
              <Badge tone="violet">{geometry.axe}</Badge>
              <Badge tone="accent">{geometry.molecularGeometry}</Badge>
            </>
          )
        }
      >
        {impossible || !geometry ? (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <Callout tone="warning" title="That combination doesn't exist">
              A steric number above 6 exceeds the VSEPR geometries covered in AP Chemistry. Reduce X or E.
            </Callout>
          </div>
        ) : (
          <SceneCanvas cameraPosition={[0, 1.6, 7.5]}>
            <Suspense fallback={null}>
              <MoleculeView
                species={species}
                analysis={analysis}
                layout={layout}
                showLabels
                showLonePairs={showLonePairs}
                interactive={false}
              />
            </Suspense>
          </SceneCanvas>
        )}
      </Viewport3D>
    );

  const rightPanel = (
    <>
      <Panel title="This Species">
        <BigFormula sub={mismatch ? "Adjusted to a valid electron count — see note" : undefined}>
          {centralEl.symbol}
          {ligand}
          <sub>{bonded}</sub>
          {analysis.chargeLabel && (
            <sup style={{ color: "#c4b0ff", fontWeight: 800 }}> {analysis.chargeLabel}</sup>
          )}
        </BigFormula>
        {geometry && (
          <>
            <div className="stat-grid" style={{ marginTop: 6 }}>
              <Stat label="AXE" value={geometry.axe} />
              <Stat label="Steric #" value={steric} sub="electron groups" />
              <Stat label="Lone pairs" value={derivedLP} />
              <Stat label="Hybridization" value={hybridization(steric)} />
            </div>
            <div className="divider" />
            <InfoRow label="Electron geometry">{geometry.electronGeometry}</InfoRow>
            <InfoRow label="Molecular geometry">
              <b style={{ color: "var(--accent)" }}>{geometry.molecularGeometry}</b>
            </InfoRow>
            {geometry.angles.map((a) => (
              <InfoRow key={a.label} label={`${a.label} angle`}>{a.value}°</InfoRow>
            ))}
            <InfoRow label="Example">{geometry.example}</InfoRow>
            <div className="tiny muted" style={{ marginTop: 8 }}>{geometry.description}</div>
          </>
        )}
      </Panel>

      {mismatch && (
        <Callout tone="warning" title="Electron count adjusted">
          A neutral {centralEl.name} with {bonded} bond{bonded === 1 ? "" : "s"} can only hold {derivedLP} lone pair{derivedLP === 1 ? "" : "s"} given its {centralEl.valenceElectrons} valence electrons.
          The app set the species charge to {analysis.chargeLabel || "0"} so the structure is electronically consistent. Try the presets for classic combinations.
        </Callout>
      )}

      <Panel title="Why This Shape?">
        <div className="tiny" style={{ lineHeight: 1.6, color: "var(--text-1)" }}>
          <p style={{ marginTop: 0 }}>
            <b>VSEPR</b> = Valence Shell Electron Pair Repulsion. Electron groups
            (bonds — single, double, or triple each count as ONE group — and lone pairs)
            are all negatively charged, so they arrange themselves as far apart as
            possible around the central atom.
          </p>
          <p>
            Repulsion strength is ordered: <b>LP–LP &gt; LP–BP &gt; BP–BP</b>.
            Lone pairs are held by only one nucleus, so their charge cloud is fatter
            and they squeeze bonding pairs together — that's why NH₃ is 107° and H₂O
            is 104.5°, both below the tetrahedral 109.5°.
          </p>
          {derivedLP > 0 && steric === 5 && (
            <p>
              In a trigonal bipyramid, lone pairs ALWAYS go equatorial: an equatorial
              LP has only two 90° interactions, while an axial LP would have three.
            </p>
          )}
        </div>
        {preset?.exampleMoleculeId && (
          <Link to={`/sims/molecule-builder?preset=${preset.exampleMoleculeId}`}>
            <Button size="sm" variant="outline" style={{ marginTop: 4 }}>
              Open {preset.example} in Molecule Builder →
            </Button>
          </Link>
        )}
      </Panel>
    </>
  );

  return <SimLayout left={leftPanel} canvas={canvasPanel} right={rightPanel} embedded={embedded} />;
}

function NumberSlider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="slider-row">
      <div className="slider-label">
        <span>{label.split(":")[0]}</span>
        <b>{value}</b>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
