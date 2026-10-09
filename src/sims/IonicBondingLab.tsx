/**
 * Ionic Bonding Lab — watch electron transfer build an ionic compound.
 *
 * Choose a metal and a nonmetal; the lab determines the formula unit by
 * charge balance, then lets you transfer electrons one at a time from the
 * metal's valence shell to the nonmetal's. When transfer completes, the ions
 * assemble into a lattice fragment. Panels explain WHY the electrons move
 * (ionization energy vs electron affinity / electronegativity), track the
 * resulting isoelectronic configurations, and compare lattice Coulomb
 * strength via q₁q₂/(r₊+r₋).
 */
import * as React from "react";
import { useMemo, useRef, useState, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getElement, ElementData } from "@/chem/elements";
import { fullConfiguration, cationConfiguration, aufbauFill } from "@/chem/electronConfig";
import { BohrAtom } from "@/three/BohrAtom";
import { SceneCanvas } from "@/three/SceneCanvas";
import { Badge, Panel, Button, Segmented, Callout, Stat } from "@/components/ui";
import { SimLayout, ControlSection, Viewport3D, InfoRow, BigFormula } from "./SimKit";
import type { SimProps } from "./types";

const METALS = ["Li", "Na", "K", "Mg", "Ca", "Al"];
const NONMETALS = ["F", "Cl", "Br", "O", "S", "N"];

const MELTING_POINTS: Record<string, { mp: number; note?: string }> = {
  NaCl: { mp: 801 }, MgO: { mp: 2852 }, LiF: { mp: 845 }, KF: { mp: 858 },
  CaO: { mp: 2572 }, NaF: { mp: 993 }, KBr: { mp: 734 }, MgCl2: { mp: 714 },
  CaCl2: { mp: 772 }, Li2O: { mp: 1560 }, Al2O3: { mp: 2072 }, Na2O: { mp: 1275 },
  MgF2: { mp: 1263 }, CaF2: { mp: 1418 }, MgS: { mp: 2000 }, NaBr: { mp: 747 },
  KCl: { mp: 770 }, LiCl: { mp: 605 }, CaBr2: { mp: 730 }, AlF3: { mp: 1290 },
  K2O: { mp: 350 }, Mg3N2: { mp: 1500 }, CaS: { mp: 2400 }, Na2S: { mp: 1180 },
  AlCl3: { mp: 192, note: "AlCl₃ is substantially covalent — it sublimes at 178 °C!" },
  AlN: { mp: 2200 }, K2S: { mp: 840 }, Li3N: { mp: 813 }, Li2S: { mp: 938 },
  Ca3N2: { mp: 1195 }, Na3N: { mp: 87 }, K3N: { mp: 350 }, CaF2b: { mp: 1418 },
  BeF2: { mp: 555 }, MgBr2: { mp: 711 }, CaCl2b: { mp: 772 }, KFb: { mp: 858 },
};

interface IonicPreset { id: string; label: string; metal: string; nonmetal: string; }

const PRESETS: IonicPreset[] = [
  { id: "nacl", label: "NaCl — table salt (1:1)", metal: "Na", nonmetal: "Cl" },
  { id: "mgo", label: "MgO — huge lattice energy (1:1)", metal: "Mg", nonmetal: "O" },
  { id: "cacl2", label: "CaCl₂ — 1:2 ratio", metal: "Ca", nonmetal: "Cl" },
  { id: "li2o", label: "Li₂O — 2:1 ratio", metal: "Li", nonmetal: "O" },
  { id: "al2o3", label: "Al₂O₃ — 2:3 ratio", metal: "Al", nonmetal: "O" },
  { id: "naf", label: "NaF", metal: "Na", nonmetal: "F" },
];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

interface FormulaPlan {
  metal: ElementData;
  nonmetal: ElementData;
  metalCharge: number; // positive
  nonmetalCharge: number; // negative (magnitude)
  metalCount: number;
  nonmetalCount: number;
  formula: string;
  totalTransfers: number;
}

function planCompound(metalSym: string, nonmetalSym: string): FormulaPlan {
  const metal = getElement(metalSym);
  const nonmetal = getElement(nonmetalSym);
  const metalCharge = Math.abs(metal.commonIons.find((c) => c > 0) ?? 1);
  const nonmetalCharge = Math.abs(nonmetal.commonIons.find((c) => c < 0) ?? -1);
  const g = gcd(metalCharge, nonmetalCharge);
  const metalCount = nonmetalCharge / g;
  const nonmetalCount = metalCharge / g;
  const SUB = "₀₁₂₃₄₅₆₇₈₉";
  const sub = (n: number) => (n > 1 ? String(n).split("").map((d) => SUB[Number(d)]).join("") : "");
  const formula = `${metal.symbol}${sub(metalCount)}${nonmetal.symbol}${sub(nonmetalCount)}`;
  return {
    metal, nonmetal, metalCharge, nonmetalCharge, metalCount, nonmetalCount, formula,
    totalTransfers: metalCharge * metalCount,
  };
}

export default function IonicBondingLab({ presetId, embedded }: SimProps) {
  const preset = useMemo(() => PRESETS.find((p) => p.id === presetId) ?? null, [presetId]);
  const [metalSym, setMetalSym] = useState(preset?.metal ?? "Na");
  const [nonmetalSym, setNonmetalSym] = useState(preset?.nonmetal ?? "Cl");
  const [transferred, setTransferred] = useState(0);
  const [lattice, setLattice] = useState(false);
  const [animating, setAnimating] = useState(false);

  React.useEffect(() => {
    if (preset) {
      setMetalSym(preset.metal);
      setNonmetalSym(preset.nonmetal);
      setTransferred(0);
      setLattice(false);
    }
  }, [preset]);

  const plan = useMemo(() => planCompound(metalSym, nonmetalSym), [metalSym, nonmetalSym]);
  const complete = transferred >= plan.totalTransfers;

  const transferNext = () => {
    if (complete || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setTransferred((t) => t + 1);
      setAnimating(false);
    }, 850);
  };

  const reset = () => {
    setTransferred(0);
    setLattice(false);
  };

  // per-atom electron counts as transfers proceed:
  // electrons move metal → nonmetal round-robin (each nonmetal fills toward octet)
  const distribution = useMemo(() => {
    const metals = Array.from({ length: plan.metalCount }, (_, i) => ({
      id: `M${i}`,
      el: plan.metal,
      electrons: plan.metal.z,
    }));
    const nonmetals = Array.from({ length: plan.nonmetalCount }, (_, i) => ({
      id: `X${i}`,
      el: plan.nonmetal,
      electrons: plan.nonmetal.z,
    }));
    let t = transferred;
    let mi = 0;
    let xi = 0;
    while (t > 0) {
      metals[mi % metals.length].electrons -= 1;
      nonmetals[xi % nonmetals.length].electrons += 1;
      mi += 1;
      // move to next nonmetal once current one has a full octet count
      const cur = nonmetals[xi % nonmetals.length];
      if (cur.electrons - cur.el.z >= plan.nonmetalCharge) xi += 1;
      t -= 1;
    }
    return { metals, nonmetals };
  }, [plan, transferred]);

  const mpEntry = MELTING_POINTS[plan.formula];
  const rCation = plan.metal.rIon ?? plan.metal.rCov * 0.65;
  const rAnion = plan.nonmetal.rIon ?? plan.nonmetal.rCov * 1.3;
  const coulomb = (plan.metalCharge * plan.nonmetalCharge) / (rCation + rAnion);
  const naclCoulomb = (1 * 1) / (1.02 + 1.81);

  const leftPanel = (
    <>
      <ControlSection title="Choose Reactants">
        <div className="ctl-label">Metal (cation former)</div>
        <Segmented
          options={METALS.map((m) => ({ value: m, label: m }))}
          value={metalSym}
          onChange={(m) => { setMetalSym(m); reset(); }}
          style={{ flexWrap: "wrap" }}
        />
        <div className="ctl-label">Nonmetal (anion former)</div>
        <Segmented
          options={NONMETALS.map((m) => ({ value: m, label: m }))}
          value={nonmetalSym}
          onChange={(m) => { setNonmetalSym(m); reset(); }}
          style={{ flexWrap: "wrap" }}
        />
        <div className="tiny muted">
          {plan.metal.name} (EN {plan.metal.en}) + {plan.nonmetal.name} (EN {plan.nonmetal.en}) → ΔEN ={" "}
          {Math.abs((plan.metal.en ?? 0) - (plan.nonmetal.en ?? 0)).toFixed(2)} ≥ 1.7 → ionic.
        </div>
      </ControlSection>

      <ControlSection title="Electron Transfer">
        <Button size="sm" variant="primary" onClick={transferNext} disabled={complete || animating}>
          {animating ? "Transferring…" : complete ? "Transfer complete ✓" : `Transfer electron ${transferred + 1} of ${plan.totalTransfers} →`}
        </Button>
        {complete && !lattice && (
          <Button size="sm" variant="outline" onClick={() => setLattice(true)}>
            🧊 Assemble ionic lattice
          </Button>
        )}
        {lattice && (
          <Button size="sm" variant="ghost" onClick={() => setLattice(false)}>
            Separate ions again
          </Button>
        )}
        <Button size="sm" variant="danger" onClick={reset} disabled={transferred === 0 && !lattice}>
          ↺ Reset
        </Button>
        <div className="tiny muted">
          {transferred}/{plan.totalTransfers} electrons transferred. Each {plan.metal.symbol} loses{" "}
          {plan.metalCharge} e⁻; each {plan.nonmetal.symbol} gains {plan.nonmetalCharge} e⁻.
        </div>
      </ControlSection>

      <ControlSection title="Presets">
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              className={`seg-item ${p.metal === metalSym && p.nonmetal === nonmetalSym ? "active-accent" : ""}`}
              style={{ textAlign: "left", padding: "6px 10px", borderRadius: 8, width: "100%" }}
              onClick={() => { setMetalSym(p.metal); setNonmetalSym(p.nonmetal); reset(); }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </ControlSection>
    </>
  );

  const canvasPanel = (
    <Viewport3D
      style={{ height: "100%", minHeight: embedded ? 320 : 440 }}
      hud={
        <>
          <Badge tone="accent">{plan.formula}</Badge>
          {complete && <Badge tone="good">ions formed</Badge>}
          {lattice && <Badge tone="violet">lattice</Badge>}
        </>
      }
      hint={lattice ? "a tiny fragment of a giant lattice — real crystals contain ~10²³ ions" : undefined}
    >
      <SceneCanvas cameraPosition={[0, lattice ? 3.5 : 1.2, lattice ? 9 : 10]} autoRotate={lattice} autoRotateSpeed={0.5}>
        <Suspense fallback={null}>
          <IonicStage
            plan={plan}
            distribution={distribution}
            transferred={transferred}
            lattice={lattice}
            animating={animating}
            complete={complete}
          />
        </Suspense>
      </SceneCanvas>
    </Viewport3D>
  );

  const rightPanel = (
    <>
      <Panel title="Product">
        <BigFormula sub={mpEntry ? `melting point ≈ ${mpEntry.mp} °C${mpEntry.note ? " · " + mpEntry.note : ""}` : undefined}>
          {plan.formula}
        </BigFormula>
        <div className="stat-grid">
          <Stat label="Cation" value={`${plan.metal.symbol}${sup(plan.metalCharge)}`} sub={`loses ${plan.metalCharge} e⁻`} />
          <Stat label="Anion" value={`${plan.nonmetal.symbol}${sup(-plan.nonmetalCharge)}`} sub={`gains ${plan.nonmetalCharge} e⁻`} />
          <Stat label="Ratio" value={`${plan.metalCount} : ${plan.nonmetalCount}`} sub="charge balance" />
          <Stat
            label="Coulomb strength"
            value={`${(coulomb / naclCoulomb).toFixed(1)}×`}
            sub="vs NaCl"
          />
        </div>
        <div className="tiny muted" style={{ marginTop: 8 }}>
          Formula from charge neutrality: (+{plan.metalCharge})·{plan.metalCount} + (−{plan.nonmetalCharge})·{plan.nonmetalCount} = 0.
          The crossover method: charge magnitude of one ion becomes the subscript of the other.
        </div>
      </Panel>

      <Panel title="Why Do Electrons Move?">
        <div className="tiny" style={{ lineHeight: 1.65, color: "var(--text-1)" }}>
          <p style={{ marginTop: 0 }}>
            {plan.metal.name} has a <b>low ionization energy</b> ({plan.metal.ionizationEnergy.toFixed(0)} kJ/mol for the first
            electron) and low electronegativity ({plan.metal.en}) — holding its valence electron{plan.metalCharge > 1 ? "s" : ""} loosely.
          </p>
          <p>
            {plan.nonmetal.name} has a <b>high electronegativity</b> ({plan.nonmetal.en}) — it strongly attracts electrons, and
            gaining {plan.nonmetalCharge} completes its octet.
          </p>
          <p style={{ marginBottom: 0 }}>
            Transfer alone would cost energy; what makes ionic compounds stable is the{" "}
            <b>lattice energy</b> — the huge Coulombic release when ~10²³ ions assemble, U ∝ (q₊·q₋)/(r₊+r₋).
          </p>
        </div>
      </Panel>

      <Panel title="Electron Configurations">
        <InfoRow label={`${plan.metal.symbol} (atom)`}>
          <span className="mono tiny">{fullConfiguration(aufbauFill(plan.metal.z))}</span>
        </InfoRow>
        <InfoRow label={`${plan.metal.symbol}${sup(plan.metalCharge)} (ion)`}>
          <span className="mono tiny" style={{ color: "var(--good)" }}>
            {fullConfiguration(cationConfiguration(plan.metal.z, plan.metalCharge))}
          </span>
        </InfoRow>
        <InfoRow label={`${plan.nonmetal.symbol}${sup(-plan.nonmetalCharge)} (ion)`}>
          <span className="mono tiny" style={{ color: "var(--good)" }}>
            {fullConfiguration(aufbauFill(plan.nonmetal.z, plan.nonmetal.z + plan.nonmetalCharge))}
          </span>
        </InfoRow>
        <Callout tone="success" title="Isoelectronic with noble gases" style={{ marginTop: 8 }}>
          Both ions now have full valence shells — the driving pattern of main-group ion formation.
          Ionic radii: cations shrink (lose a shell/less shielding), anions swell (more e⁻–e⁻ repulsion).
        </Callout>
      </Panel>
    </>
  );

  return <SimLayout left={leftPanel} canvas={canvasPanel} right={rightPanel} embedded={embedded} />;
}

function sup(n: number): string {
  const S: Record<string, string> = { "1+": "⁺", "2+": "²⁺", "3+": "³⁺", "-1": "⁻", "-2": "²⁻", "-3": "³⁻" };
  return S[String(n)] ?? String(n);
}

/* ---------------------------- 3-D stage ---------------------------- */

interface Particle {
  id: string;
  el: ElementData;
  electrons: number;
  charge: number;
}

function IonicStage({
  plan,
  distribution,
  transferred,
  lattice,
  animating,
  complete,
}: {
  plan: FormulaPlan;
  distribution: {
    metals: Array<{ id: string; el: ElementData; electrons: number }>;
    nonmetals: Array<{ id: string; el: ElementData; electrons: number }>;
  };
  transferred: number;
  lattice: boolean;
  animating: boolean;
  complete: boolean;
}) {
  const total = plan.metalCount + plan.nonmetalCount;
  const spacing = 2.9;

  const separated = useMemo(() => {
    const pos = new Map<string, [number, number, number]>();
    const metals = distribution.metals;
    const nonmetals = distribution.nonmetals;
    const mw = metals.length * spacing;
    const nw = nonmetals.length * spacing;
    // metals as a block on the left, nonmetals on the right
    metals.forEach((m, i) => {
      pos.set(m.id, [-(nw + mw) / 2 + spacing / 2 + i * spacing, 0, 0]);
    });
    nonmetals.forEach((x, i) => {
      pos.set(x.id, [mw / 2 - nw / 2 + spacing / 2 + i * spacing + 0.6, 0, 0]);
    });
    void total;
    return pos;
  }, [distribution, total]);

  const latticePos = useMemo(() => {
    // Alternate cations/anions in a small rock-salt style fragment
    const pos = new Map<string, [number, number, number]>();
    const particles: Array<{ id: string; cation: boolean }> = [
      ...distribution.metals.map((m) => ({ id: m.id, cation: true })),
      ...distribution.nonmetals.map((x) => ({ id: x.id, cation: false })),
    ];
    const d = 2.1;
    const cells: Array<[number, number, number]> = [];
    for (let x = 0; x < 2; x++)
      for (let y = 0; y < 2; y++)
        for (let z = 0; z < 2; z++) cells.push([(x - 0.5) * d, (y - 0.5) * d, (z - 0.5) * d]);
    cells.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
    // sort particles: cations first
    const ordered = [...particles].sort((a, b) => Number(b.cation) - Number(a.cation));
    ordered.forEach((p, i) => {
      const cell = cells[i % cells.length];
      // checkerboard: cations at even parity cells, anions at odd
      const parity = (Math.round((cell[0] + 0.5 * d) / d) + Math.round((cell[1] + 0.5 * d) / d) + Math.round((cell[2] + 0.5 * d) / d)) % 2;
      pos.set(p.id, cell);
      void parity;
    });
    return pos;
  }, [distribution]);

  const groupRefs = useRef(new Map<string, THREE.Group>());
  const lerpT = useRef(0);

  useFrame((_, delta) => {
    lerpT.current += ((lattice ? 1 : 0) - lerpT.current) * Math.min(1, delta * 3);
    const t = lerpT.current;
    for (const [id, group] of groupRefs.current) {
      const a = separated.get(id);
      const b = latticePos.get(id);
      if (!a || !b) continue;
      group.position.set(
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t
      );
      const s = 0.52 - 0.12 * t;
      group.scale.setScalar(s);
    }
  });

  const particles: Particle[] = [
    ...distribution.metals.map((m) => ({
      id: m.id, el: m.el, electrons: m.electrons, charge: m.el.z - m.electrons,
    })),
    ...distribution.nonmetals.map((x) => ({
      id: x.id, el: x.el, electrons: x.electrons, charge: x.el.z - x.electrons,
    })),
  ];

  return (
    <group>
      {particles.map((p) => {
        const pos = separated.get(p.id) ?? [0, 0, 0];
        return (
          <group
            key={p.id}
            ref={(g) => {
              if (g) groupRefs.current.set(p.id, g);
            }}
            position={pos}
            scale={0.52}
          >
            <BohrAtom protons={p.el.z} neutrons={Math.round(p.el.mass) - p.el.z} electrons={p.electrons} />
            {p.charge !== 0 && (
              <group position={[0, 2.6, 0]}>
                <ChargeSprite charge={p.charge} symbol={p.el.symbol} />
              </group>
            )}
          </group>
        );
      })}
      {animating && transferred < plan.totalTransfers && (
        <FlyingElectron
          from={separated.get(distribution.metals[transferred % distribution.metals.length]?.id) ?? [0, 0, 0]}
          to={separated.get(distribution.nonmetals[Math.min(Math.floor(transferred / Math.max(1, plan.nonmetalCharge)), distribution.nonmetals.length - 1)]?.id ?? "") ?? [0, 0, 0]}
        />
      )}
      {complete && !lattice && (
        <AttractionLines
          metals={distribution.metals.map((m) => separated.get(m.id)!)}
          nonmetals={distribution.nonmetals.map((x) => separated.get(x.id)!)}
        />
      )}
    </group>
  );
}

function ChargeSprite({ charge, symbol }: { charge: number; symbol: string }) {
  // Use canvas texture for crisp charge labels
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.font = "bold 40px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = charge > 0 ? "#ff9d9d" : "#9dc4ff";
    const label = `${symbol}${Math.abs(charge) === 1 ? "" : Math.abs(charge)}${charge > 0 ? "+" : "−"}`;
    ctx.fillText(label, 64, 32);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [charge, symbol]);

  return (
    <sprite scale={[2.2, 1.1, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

function FlyingElectron({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const t0 = useRef<number | null>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    if (t0.current === null) t0.current = clock.elapsedTime;
    const t = Math.min(1, (clock.elapsedTime - t0.current) / 0.85);
    const x = from[0] + (to[0] - from[0]) * t;
    const z = from[2] + (to[2] - from[2]) * t;
    const y = from[1] + (to[1] - from[1]) * t + Math.sin(t * Math.PI) * 1.6;
    ref.current.position.set(x, y, z);
    ref.current.scale.setScalar(0.6 + Math.sin(t * Math.PI) * 0.5);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.16, 14, 14]} />
      <meshBasicMaterial color="#7dd8ff" toneMapped={false} />
    </mesh>
  );
}

function AttractionLines({
  metals,
  nonmetals,
}: {
  metals: Array<[number, number, number]>;
  nonmetals: Array<[number, number, number]>;
}) {
  const lines = useMemo(() => {
    const out: Array<[THREE.Vector3, THREE.Vector3]> = [];
    for (const m of metals)
      for (const x of nonmetals) {
        const d = Math.hypot(m[0] - x[0], m[1] - x[1], m[2] - x[2]);
        if (d < 6) out.push([new THREE.Vector3(...m), new THREE.Vector3(...x)]);
      }
    return out;
  }, [metals, nonmetals]);

  return (
    <group>
      {lines.map(([, to], i) => {
        const from = lines[i][0];
        const dir = to.clone().sub(from);
        const len = dir.length();
        const mid = from.clone().add(to).multiplyScalar(0.5);
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
        return (
          <mesh key={i} position={mid} quaternion={quat}>
            <cylinderGeometry args={[0.02, 0.02, len, 6]} />
            <meshBasicMaterial color="#8ea6ff" transparent opacity={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}
