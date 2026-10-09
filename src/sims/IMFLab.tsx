/**
 * Intermolecular Forces Lab — see IMFs act on a crowd of molecules.
 *
 * A box of real 3-D molecules (from the shared library) jostles under
 * thermal motion while the predicted intermolecular force (LDF,
 * dipole–dipole, hydrogen bonding) pulls them together. Crank the
 * temperature slider and watch clusters form, flow, or fly apart —
 * connecting IMF strength to phase and boiling point. Comparison sets of
 * real boiling-point data show the periodic trends and the famous
 * H-bonding anomalies (H₂O, NH₃, HF).
 */
import * as React from "react";
import { useMemo, useRef, useState, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MOLECULE_MAP, moleculeToSpecies, MoleculeDef } from "@/chem/molecules";
import { analyzeSpecies } from "@/chem/lewis";
import { layout3D } from "@/chem/layout";
import { computeDipole, predictIMF } from "@/chem/bonding";
import { SceneCanvas } from "@/three/SceneCanvas";
import { MoleculeView } from "@/three/MoleculeView";
import { Badge, Panel, Segmented, Callout, Stat } from "@/components/ui";
import { SimLayout, ControlSection, Viewport3D, InfoRow, MoleculePresetSelect } from "./SimKit";
import type { SimProps } from "./types";

/* ---------------- boiling point data ---------------- */

interface Substance {
  id: string;
  name: string;
  formula: string;
  bp: number; // °C
  molarMass: number;
  imf: string;
  molId?: string; // library molecule for the 3-D box
}

const COMPARISON_SETS: Array<{ id: string; label: string; note: string; substances: Substance[] }> = [
  {
    id: "halogens", label: "Halogen elements (LDF trend)",
    note: "All nonpolar — only London dispersion forces. Down the group, electron clouds get bigger and more polarizable, LDFs strengthen, and boiling point climbs by over 370 °C from F₂ to I₂.",
    substances: [
      { id: "f2", name: "Fluorine", formula: "F₂", bp: -188, molarMass: 38, imf: "LDF" },
      { id: "cl2", name: "Chlorine", formula: "Cl₂", bp: -34, molarMass: 71, imf: "LDF", molId: "cl2" },
      { id: "br2", name: "Bromine", formula: "Br₂", bp: 59, molarMass: 160, imf: "LDF" },
      { id: "i2", name: "Iodine", formula: "I₂", bp: 184, molarMass: 254, imf: "LDF" },
    ],
  },
  {
    id: "group16", label: "Group 16 hydrides (H-bond anomaly)",
    note: "Boiling points should rise smoothly with mass (H₂Te > H₂Se > H₂S)… but H₂O is 160 °C above the trend line because oxygen's tiny size and two lone pairs make hydrogen bonding exceptionally strong.",
    substances: [
      { id: "h2o", name: "Water", formula: "H₂O", bp: 100, molarMass: 18, imf: "H-bond", molId: "h2o" },
      { id: "h2s", name: "Hydrogen sulfide", formula: "H₂S", bp: -60, molarMass: 34, imf: "dipole + LDF" },
      { id: "h2se", name: "Hydrogen selenide", formula: "H₂Se", bp: -41, molarMass: 81, imf: "dipole + LDF" },
      { id: "h2te", name: "Hydrogen telluride", formula: "H₂Te", bp: -2, molarMass: 130, imf: "dipole + LDF" },
    ],
  },
  {
    id: "group15", label: "Group 15 hydrides",
    note: "NH₃ hydrogen-bonds (N–H∙∙∙N) and boils far above PH₃ and AsH₃, which follow the mass trend.",
    substances: [
      { id: "nh3", name: "Ammonia", formula: "NH₃", bp: -33, molarMass: 17, imf: "H-bond", molId: "nh3" },
      { id: "ph3", name: "Phosphine", formula: "PH₃", bp: -88, molarMass: 34, imf: "dipole + LDF" },
      { id: "ash3", name: "Arsine", formula: "AsH₃", bp: -62, molarMass: 78, imf: "dipole + LDF" },
    ],
  },
  {
    id: "group17", label: "Hydrogen halides",
    note: "HF hydrogen-bonds strongly (F is small and fiercely electronegative); HCl/HBr/HI only have dipole–dipole + LDF, rising with mass.",
    substances: [
      { id: "hf", name: "Hydrogen fluoride", formula: "HF", bp: 19.5, molarMass: 20, imf: "H-bond", molId: "hf" },
      { id: "hcl", name: "Hydrogen chloride", formula: "HCl", bp: -85, molarMass: 36.5, imf: "dipole + LDF", molId: "hcl" },
      { id: "hbr", name: "Hydrogen bromide", formula: "HBr", bp: -67, molarMass: 81, imf: "dipole + LDF" },
      { id: "hi", name: "Hydrogen iodide", formula: "HI", bp: -35, molarMass: 128, imf: "dipole + LDF" },
    ],
  },
  {
    id: "isomers", label: "Ethanol vs dimethyl ether (same formula!)",
    note: "Both C₂H₆O. Ethanol's O–H group hydrogen-bonds (bp 78 °C, liquid); dimethyl ether can't donate an H-bond (bp −24 °C, gas). IMF type beats molar mass.",
    substances: [
      { id: "etoh", name: "Ethanol", formula: "CH₃CH₂OH", bp: 78, molarMass: 46, imf: "H-bond" },
      { id: "dme", name: "Dimethyl ether", formula: "CH₃OCH₃", bp: -24, molarMass: 46, imf: "dipole + LDF" },
    ],
  },
  {
    id: "alkanes", label: "Alkanes (chain length / LDF)",
    note: "All nonpolar. Longer chains = more electrons and more surface contact = stronger LDFs: methane is a gas, octane a liquid, paraffin wax a solid.",
    substances: [
      { id: "ch4", name: "Methane", formula: "CH₄", bp: -161, molarMass: 16, imf: "LDF", molId: "ch4" },
      { id: "c3h8", name: "Propane", formula: "C₃H₈", bp: -42, molarMass: 44, imf: "LDF" },
      { id: "c6h14", name: "Hexane", formula: "C₆H₁₄", bp: 69, molarMass: 86, imf: "LDF" },
      { id: "c8h18", name: "Octane", formula: "C₈H₁₈", bp: 126, molarMass: 114, imf: "LDF" },
    ],
  },
];

const BOX_MOLECULES = ["ch4", "cl2", "h2o", "nh3", "hf", "hcl", "co2", "c2h4", "ch3oh", "ccl4", "h2", "o2", "n2"];

/* ---------------- component ---------------- */

export default function IMFLab({ presetId, embedded }: SimProps) {
  const initialMol = MOLECULE_MAP.has(presetId ?? "") ? presetId! : "h2o";
  const [molId, setMolId] = useState(initialMol);
  const [temp, setTemp] = useState(40); // 0-100 schematic temperature
  const [setId, setSetId] = useState("group16");

  React.useEffect(() => {
    if (presetId) {
      if (MOLECULE_MAP.has(presetId)) setMolId(presetId);
      const s = COMPARISON_SETS.find((cs) => cs.id === presetId);
      if (s) setSetId(s.id);
    }
  }, [presetId]);

  const def = MOLECULE_MAP.get(molId) ?? MOLECULE_MAP.get("h2o")!;
  const report = useMemo(() => {
    const species = moleculeToSpecies(def);
    const analysis = analyzeSpecies(species);
    const layout = layout3D(species);
    const dipole = computeDipole(species, analysis, layout);
    const imf = predictIMF(species, analysis, dipole);
    return { species, analysis, layout, dipole, imf };
  }, [def]);

  const set = COMPARISON_SETS.find((s) => s.id === setId) ?? COMPARISON_SETS[0];

  // Strength of attraction for the swarm, from dominant IMF
  const attraction =
    report.imf.dominant === "hydrogen bonding" ? 1.0 :
    report.imf.dominant === "dipole–dipole" ? 0.62 :
    report.imf.dominant === "ionic (lattice)" ? 1.5 :
    0.3 + Math.min(0.35, report.analysis.molarMass / 700);

  const leftPanel = (
    <>
      <ControlSection title="Substance in the Box">
        <MoleculePresetSelect
          value={molId}
          onChange={(d) => setMolId(d.id)}
          filter={(d) => BOX_MOLECULES.includes(d.id)}
        />
        <div className="tiny muted">{def.note}</div>
      </ControlSection>

      <ControlSection title="Thermal Energy">
        <div className="slider-row">
          <div className="slider-label">
            <span>Temperature (schematic)</span>
            <b>{temp < 33 ? "cold" : temp < 66 ? "warm" : "hot"}</b>
          </div>
          <input
            type="range" min={0} max={100} value={temp}
            aria-label="Temperature"
            onChange={(e) => setTemp(Number(e.target.value))}
          />
        </div>
        <div className="tiny muted">
          Temperature = average kinetic energy of the particles. Phase depends on the
          tug-of-war between thermal motion and IMF attraction.
        </div>
      </ControlSection>

      <ControlSection title="Boiling Point Data">
        <Segmented
          options={COMPARISON_SETS.map((s) => ({ value: s.id, label: s.label.split(" (")[0] }))}
          value={setId}
          onChange={setSetId}
          style={{ flexWrap: "wrap", width: "100%" }}
        />
      </ControlSection>
    </>
  );

  const canvasPanel = (
    <Viewport3D
      style={{ height: "100%", minHeight: embedded ? 320 : 440 }}
      hud={
        <>
          <Badge tone="accent">{def.name}</Badge>
          <Badge tone={report.imf.dominant === "hydrogen bonding" ? "bad" : report.imf.dominant === "dipole–dipole" ? "warn" : "good"}>
            dominant: {report.imf.dominant}
          </Badge>
          <PhaseBadge attraction={attraction} temp={temp} />
        </>
      }
      hint="drag to rotate · molecules attract per predicted IMF strength"
    >
      <SceneCanvas cameraPosition={[0, 1.5, 11]} maxDistance={22} minDistance={4}>
        <Suspense fallback={null}>
          <ParticleSwarm
            def={def}
            species={report.species}
            analysis={report.analysis}
            layout={report.layout}
            attraction={attraction}
            temp={temp}
            count={def.id === "ccl4" || def.id === "ch3oh" ? 5 : 7}
          />
          <BoxFrame />
        </Suspense>
      </SceneCanvas>
    </Viewport3D>
  );

  const rightPanel = (
    <>
      <Panel title="Forces Present">
        {report.imf.forces.map((f) => (
          <div key={f.type} style={{ padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Badge tone={f.type === "hydrogen bonding" ? "bad" : f.type === "dipole–dipole" ? "warn" : f.type === "ionic (lattice)" ? "violet" : "good"}>
                {f.type}
              </Badge>
              <span className="tiny muted">{f.strength}</span>
            </div>
            <div className="tiny muted" style={{ marginTop: 3, lineHeight: 1.5 }}>{f.why}</div>
          </div>
        ))}
        <div className="tiny muted" style={{ marginTop: 8 }}>
          Net dipole: {report.dipole.netMagnitude.toFixed(2)} (relative) · molar mass {report.analysis.molarMass.toFixed(1)} g/mol
          (polarizability grows with size).
        </div>
      </Panel>

      <Panel title={`${set.label} — Boiling Points`}>
        <BPChart substances={set.substances} />
        <div className="tiny muted" style={{ marginTop: 8, lineHeight: 1.55 }}>{set.note}</div>
      </Panel>

      <Callout tone="info" title="Hydrogen bonding is NOT a bond">
        Despite the name, hydrogen bonding is an <b>intermolecular</b> force — an unusually
        strong dipole–dipole attraction between an H (bonded to N, O, or F) on one molecule
        and a lone pair on N/O/F of a <b>neighbor</b>. Covalent O–H bonds hold the molecule
        together; H-bonds hold molecules to each other. Boiling water breaks H-bonds, not
        O–H bonds.
      </Callout>
    </>
  );

  return <SimLayout left={leftPanel} canvas={canvasPanel} right={rightPanel} embedded={embedded} />;
}

function PhaseBadge({ attraction, temp }: { attraction: number; temp: number }) {
  const energy = temp / 100;
  const phase = energy > attraction * 0.85 ? "gas-like" : energy > attraction * 0.35 ? "liquid-like" : "solid-like";
  const tone = phase === "gas-like" ? "bad" : phase === "liquid-like" ? "warn" : "good";
  return <Badge tone={tone}>{phase}</Badge>;
}

function BPChart({ substances }: { substances: Substance[] }) {
  const min = Math.min(...substances.map((s) => s.bp));
  const max = Math.max(...substances.map((s) => s.bp));
  const range = Math.max(1, max - min);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {substances.map((s) => {
        const frac = (s.bp - min) / range;
        return (
          <div key={s.id} style={{ display: "grid", gridTemplateColumns: "88px 1fr 62px", alignItems: "center", gap: 8 }}>
            <span className="tiny" style={{ color: "var(--text-1)", fontWeight: 600 }}>{s.formula}</span>
            <div style={{ height: 12, background: "var(--bg-1)", borderRadius: 6, overflow: "hidden", border: "1px solid var(--border)" }}>
              <div
                style={{
                  height: "100%",
                  width: `${8 + frac * 92}%`,
                  borderRadius: 6,
                  background: s.imf === "H-bond" ? "linear-gradient(90deg,#f87171,#ff9db8)" : s.imf.startsWith("dipole") ? "linear-gradient(90deg,#fbbf24,#ffd97a)" : "linear-gradient(90deg,#34d399,#7ee8c0)",
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <span className="tiny mono" style={{ color: "var(--text-0)", textAlign: "right", fontWeight: 700 }}>{s.bp} °C</span>
          </div>
        );
      })}
      <div className="tiny muted" style={{ display: "flex", gap: 10, marginTop: 2 }}>
        <span><span style={{ color: "#f87171" }}>■</span> H-bond</span>
        <span><span style={{ color: "#fbbf24" }}>■</span> dipole–dipole</span>
        <span><span style={{ color: "#34d399" }}>■</span> LDF only</span>
      </div>
    </div>
  );
}

/* ---------------- particle swarm ---------------- */

interface ParticleState {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Euler;
  spin: THREE.Vector3;
}

function ParticleSwarm({
  def,
  species,
  analysis,
  layout,
  attraction,
  temp,
  count,
}: {
  def: MoleculeDef;
  species: ReturnType<typeof moleculeToSpecies>;
  analysis: ReturnType<typeof analyzeSpecies>;
  layout: ReturnType<typeof layout3D>;
  attraction: number;
  temp: number;
  count: number;
}) {
  const groups = useRef<Array<THREE.Group | null>>([]);
  const linkRef = useRef<THREE.Group>(null);

  const particles = useMemo<ParticleState[]>(() => {
    const out: ParticleState[] = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 1.6 + (i % 3) * 1.1;
      out.push({
        pos: new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 1.7) * r * 0.6, Math.sin(a) * r),
        vel: new THREE.Vector3(),
        rot: new THREE.Euler(Math.random() * 3, Math.random() * 3, Math.random() * 3),
        spin: new THREE.Vector3((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6),
      });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, def.id]);

  const scale = def.atoms.length > 4 ? 0.42 : 0.55;
  const R = 4.2; // box half-size
  const isHBond = attraction >= 1.0;

  const tmpVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const energy = 0.4 + (temp / 100) * 3.2;
    const attractK = attraction * 2.4;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      // thermal noise
      p.vel.x += (Math.random() - 0.5) * energy * delta * 3;
      p.vel.y += (Math.random() - 0.5) * energy * delta * 3;
      p.vel.z += (Math.random() - 0.5) * energy * delta * 3;

      // attraction to neighbors within range
      for (let j = 0; j < particles.length; j++) {
        if (i === j) continue;
        const q = particles[j];
        tmpVec.copy(q.pos).sub(p.pos);
        const d = tmpVec.length();
        if (d < 3.6 && d > 1.3) {
          tmpVec.normalize().multiplyScalar((attractK * delta) / Math.max(0.6, d * 0.8));
          p.vel.add(tmpVec);
        } else if (d <= 1.3) {
          // hard repulsion so molecules don't overlap
          tmpVec.normalize().multiplyScalar(delta * 4);
          p.vel.sub(tmpVec);
        }
      }

      // damping — heavier when cold
      const damping = Math.pow(0.02 + temp / 130, delta * 3);
      p.vel.multiplyScalar(Math.min(0.999, damping));
      // speed cap
      const speed = p.vel.length();
      const cap = 1.2 + energy;
      if (speed > cap) p.vel.multiplyScalar(cap / speed);

      p.pos.addScaledVector(p.vel, delta);

      // bounce off box walls
      (["x", "y", "z"] as const).forEach((axis) => {
        if (p.pos[axis] > R) { p.pos[axis] = R; p.vel[axis] *= -0.6; }
        if (p.pos[axis] < -R) { p.pos[axis] = -R; p.vel[axis] *= -0.6; }
      });

      const g = groups.current[i];
      if (g) {
        g.position.copy(p.pos);
        p.rot.x += p.spin.x * delta * (0.3 + temp / 140);
        p.rot.y += p.spin.y * delta * (0.3 + temp / 140);
        g.rotation.copy(p.rot);
      }
    }

    // H-bond link lines
    if (linkRef.current) {
      linkRef.current.clear();
      if (isHBond && temp < 80) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const d = particles[i].pos.distanceTo(particles[j].pos);
            if (d < 2.6) {
              const mid = particles[i].pos.clone().add(particles[j].pos).multiplyScalar(0.5);
              const dir = particles[j].pos.clone().sub(particles[i].pos);
              const len = dir.length() - 1.0;
              if (len <= 0.05) continue;
              const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
              const cyl = new THREE.Mesh(
                new THREE.CylinderGeometry(0.025, 0.025, len, 5),
                new THREE.MeshBasicMaterial({ color: "#ff9db8", transparent: true, opacity: 0.55 })
              );
              cyl.position.copy(mid);
              cyl.quaternion.copy(quat);
              linkRef.current.add(cyl);
            }
          }
        }
      }
    }
  });

  return (
    <group>
      {particles.map((p, i) => (
        <group
          key={i}
          ref={(g) => {
            groups.current[i] = g;
          }}
          position={p.pos}
          scale={scale}
        >
          <MoleculeView species={species} analysis={analysis} layout={layout} showLabels={false} showLonePairs={false} interactive={false} />
        </group>
      ))}
      <group ref={linkRef} />
    </group>
  );
}

function BoxFrame() {
  const R = 4.2;
  const edges = useMemo(() => {
    const pts: Array<[number, number, number]> = [];
    for (const x of [-R, R])
      for (const y of [-R, R])
        for (const z of [-R, R]) pts.push([x, y, z]);
    return pts;
  }, []);
  const lines: Array<[[number, number, number], [number, number, number]]> = [];
  for (let i = 0; i < edges.length; i++) {
    for (let j = i + 1; j < edges.length; j++) {
      const a = edges[i];
      const b = edges[j];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      if (Math.abs(d - 2 * R) < 0.001) lines.push([a, b]);
    }
  }
  return (
    <group>
      {lines.map(([a, b], i) => {
        const mid: [number, number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
        const dir = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
        const len = dir.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
        return (
          <mesh key={i} position={mid} quaternion={quat}>
            <cylinderGeometry args={[0.018, 0.018, len, 5]} />
            <meshBasicMaterial color="#3d4d74" transparent opacity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}
