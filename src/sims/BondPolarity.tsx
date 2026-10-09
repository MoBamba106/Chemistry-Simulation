/**
 * Bond Polarity & Electronegativity — what kind of bond is this, and why?
 *
 * Pick any two elements:
 *  - ΔEN classification (nonpolar covalent / polar covalent / ionic)
 *  - percent ionic character gauge (Hannay–Smyth)
 *  - a 3-D bond with the electron cloud visibly shifted toward the more
 *    electronegative atom, with δ+/δ− labels
 *  - the classic potential-energy curve: push the atoms together and watch
 *    attraction vs repulsion find the bond length minimum
 *  - a metallic-bonding "electron sea" view for metal–metal contexts
 */
import * as React from "react";
import { useMemo, useRef, useState, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getElement, isMetal } from "@/chem/elements";
import { classifyBond, morseEnergy, bondMetrics } from "@/chem/bonding";
import { SceneCanvas } from "@/three/SceneCanvas";
import { Arrow } from "@/three/primitives";
import { Badge, Panel, Button, Segmented, Callout, Stat } from "@/components/ui";
import { Html } from "@react-three/drei";
import { SimLayout, ControlSection, Viewport3D, InfoRow } from "./SimKit";
import type { SimProps } from "./types";

const COMMON = ["H", "C", "N", "O", "F", "P", "S", "Cl", "Br", "I", "Na", "Mg", "Al", "K", "Ca", "Fe", "Cu", "Zn", "Li", "Cs", "Si", "B"];

type ViewMode = "bond" | "curve" | "metal";

interface BPPreset { id: string; label: string; a: string; b: string; }
const PRESETS: BPPreset[] = [
  { id: "hcl", label: "H–Cl (polar covalent)", a: "H", b: "Cl" },
  { id: "nacl", label: "Na–Cl (ionic)", a: "Na", b: "Cl" },
  { id: "cl2", label: "Cl–Cl (nonpolar)", a: "Cl", b: "Cl" },
  { id: "hf", label: "H–F (very polar)", a: "H", b: "F" },
  { id: "ch", label: "C–H (nearly nonpolar)", a: "C", b: "H" },
  { id: "co-bond", label: "C–O (polar)", a: "C", b: "O" },
  { id: "mg-o", label: "Mg–O (ionic, 2+)", a: "Mg", b: "O" },
];

export default function BondPolarity({ presetId, embedded }: SimProps) {
  const preset = useMemo(() => PRESETS.find((p) => p.id === presetId) ?? null, [presetId]);
  const [symA, setSymA] = useState(preset?.a ?? "H");
  const [symB, setSymB] = useState(preset?.b ?? "Cl");
  const [order, setOrder] = useState(1);
  const [view, setView] = useState<ViewMode>("bond");
  const [distance, setDistance] = useState<number | null>(null); // null = equilibrium

  React.useEffect(() => {
    if (preset) {
      setSymA(preset.a);
      setSymB(preset.b);
      setDistance(null);
    }
  }, [preset]);

  const A = getElement(symA);
  const B = getElement(symB);
  const bond = classifyBond(A.en, B.en);
  const metrics = bondMetrics(symA, symB, order);
  const bothMetals = isMetal(A) && isMetal(B);

  const rEq = metrics.length;
  const De = 220 * metrics.strengthFactor * (bothMetals ? 0.6 : bond.character === "ionic" ? 1.7 : bond.character === "polar covalent" ? 1.15 : 1);
  const currentR = distance ?? rEq;
  const energy = morseEnergy(currentR, rEq, De);

  const leftPanel = (
    <>
      <ControlSection title="Atom A">
        <ElementGrid value={symA} onChange={setSymA} />
      </ControlSection>
      <ControlSection title="Atom B">
        <ElementGrid value={symB} onChange={setSymB} />
      </ControlSection>
      <ControlSection title="View">
        <Segmented
          options={[
            { value: "bond", label: "3-D bond" },
            { value: "curve", label: "PE curve" },
            { value: "metal", label: "Metallic" },
          ]}
          value={view}
          onChange={(v) => setView(v as ViewMode)}
          accent
          style={{ width: "100%" }}
        />
        {view === "bond" && (
          <Segmented
            options={[
              { value: "1", label: "Single" },
              { value: "2", label: "Double" },
              { value: "3", label: "Triple" },
            ]}
            value={String(order)}
            onChange={(v) => setOrder(Number(v))}
            style={{ width: "100%" }}
          />
        )}
        {view === "curve" && (
          <>
            <div className="slider-row">
              <div className="slider-label">
                <span>Internuclear distance</span>
                <b>{currentR.toFixed(2)} Å</b>
              </div>
              <input
                type="range"
                min={rEq * 0.6}
                max={rEq * 2.4}
                step={0.01}
                value={currentR}
                aria-label="Internuclear distance"
                onChange={(e) => setDistance(Number(e.target.value))}
              />
            </div>
            <Button size="sm" variant="ghost" onClick={() => setDistance(null)}>Snap to bond length</Button>
          </>
        )}
        {view === "metal" && !bothMetals && (
          <Callout tone="warning">
            Metallic bonding is shown for metal pairs — try Na+Na, Cu+Zn, or Mg+Al. (The sea-of-electrons
            view works with any pair, but the physics applies to metals.)
          </Callout>
        )}
      </ControlSection>
      <ControlSection title="Presets">
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              className={`seg-item ${p.a === symA && p.b === symB ? "active-accent" : ""}`}
              style={{ textAlign: "left", padding: "6px 10px", borderRadius: 8, width: "100%" }}
              onClick={() => { setSymA(p.a); setSymB(p.b); setDistance(null); }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </ControlSection>
    </>
  );

  const canvasPanel =
    view === "curve" ? (
      <Panel title="Potential Energy vs Internuclear Distance" style={{ height: "100%", display: "flex", flexDirection: "column" }} bodyClassName="">
        <div style={{ flex: 1, minHeight: embedded ? 280 : 380, padding: 10 }}>
          <PECurve rEq={rEq} De={De} currentR={currentR} energy={energy} a={A.symbol} b={B.symbol} />
        </div>
      </Panel>
    ) : view === "metal" ? (
      <Viewport3D
        style={{ height: "100%", minHeight: embedded ? 300 : 420 }}
        hud={<Badge tone="accent">sea of delocalized electrons</Badge>}
        hint="cations in a lattice; valence electrons roam freely → conductivity & malleability"
      >
        <SceneCanvas cameraPosition={[0, 3.5, 9]}>
          <Suspense fallback={null}>
            <ElectronSea colorA={A.color} colorB={B.color} />
          </Suspense>
        </SceneCanvas>
      </Viewport3D>
    ) : (
      <Viewport3D
        style={{ height: "100%", minHeight: embedded ? 300 : 420 }}
        hud={
          <>
            <Badge tone={bond.character === "ionic" ? "bad" : bond.character === "polar covalent" ? "warn" : "good"}>
              {bond.character}
            </Badge>
            <Badge tone="violet">ΔEN = {bond.deltaEN.toFixed(2)}</Badge>
          </>
        }
      >
        <SceneCanvas cameraPosition={[0, 1.1, 6.8]}>
          <Suspense fallback={null}>
            <BondScene
              symA={symA}
              symB={symB}
              order={order}
              rEq={rEq}
              deltaEN={bond.deltaEN}
              character={bond.character}
            />
          </Suspense>
        </SceneCanvas>
      </Viewport3D>
    );

  const rightPanel = (
    <>
      <Panel title="Classification">
        <div style={{ textAlign: "center", padding: "4px 0 10px" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-0)" }}>
            {A.symbol}–{B.symbol}
          </div>
          <Badge tone={bond.character === "ionic" ? "bad" : bond.character === "polar covalent" ? "warn" : "good"}>
            {bond.character.toUpperCase()}
          </Badge>
        </div>
        <InfoRow label={`EN of ${A.symbol}`}>{A.en ?? "—"}</InfoRow>
        <InfoRow label={`EN of ${B.symbol}`}>{B.en ?? "—"}</InfoRow>
        <InfoRow label="ΔEN">{bond.deltaEN.toFixed(2)}</InfoRow>
        <InfoRow label="% ionic character">{bond.percentIonic.toFixed(0)}%</InfoRow>
        <div className="divider" />
        <div className="tiny" style={{ color: "var(--text-1)", lineHeight: 1.6 }}>{bond.explanation}</div>
        <div className="tiny muted" style={{ marginTop: 8 }}>
          AP rule of thumb: ΔEN &lt; 0.4 nonpolar covalent · 0.4–1.7 polar covalent · &gt; 1.7 ionic.
          Real bonding is a continuum — percent ionic character shows there are no perfectly ionic bonds.
        </div>
      </Panel>

      <Panel title="Bond Metrics">
        <InfoRow label="Bond order">{["", "single (1 pair)", "double (2 pairs)", "triple (3 pairs)"][order]}</InfoRow>
        <InfoRow label="Bond length (model)">{rEq.toFixed(2)} Å</InfoRow>
        <InfoRow label="Bond energy (model)">~{De.toFixed(0)} kJ/mol</InfoRow>
        <Callout tone="info" style={{ marginTop: 8 }}>
          Shorter bond = stronger bond (for the same pair of atoms): triple &lt; double &lt; single in length,
          the reverse in energy. The PE curve's minimum IS the bond length; its depth IS the bond energy.
        </Callout>
      </Panel>

      {view === "curve" && (
        <Panel title="Reading the Curve">
          <div className="stat-grid">
            <Stat label="Current PE" value={`${energy.toFixed(0)}`} sub="kJ/mol (relative)" />
            <Stat label="r vs r₀" value={`${(currentR / rEq).toFixed(2)}×`} sub={currentR < rEq ? "too close — repulsion" : currentR > rEq * 1.5 ? "far — attraction ~0" : "near minimum"} />
          </div>
          <div className="tiny" style={{ marginTop: 8, lineHeight: 1.6, color: "var(--text-1)" }}>
            {currentR < rEq * 0.92
              ? "Inside the minimum, nuclear–nuclear and core-electron repulsions dominate — energy spikes upward. Atoms can't be pushed much closer."
              : currentR > rEq * 1.6
                ? "Far apart, the atoms barely feel each other; PE approaches 0. Bringing them closer releases energy as attraction takes over."
                : "Near the minimum: attraction (nucleus ↔ shared electrons) balances repulsion (nucleus ↔ nucleus, e⁻ ↔ e⁻). This is the bond length — the most stable arrangement. Breaking the bond requires +De (endothermic); forming it releases the same."}
          </div>
        </Panel>
      )}

      {bothMetals && view !== "metal" && (
        <Callout tone="violet" title="Both metals?">
          Metal–metal pairs don't form localized two-atom bonds in bulk — they form{" "}
          <b>metallic bonds</b>: cations in a sea of delocalized valence electrons. Switch to the
          Metallic view.
        </Callout>
      )}
    </>
  );

  return <SimLayout left={leftPanel} canvas={canvasPanel} right={rightPanel} embedded={embedded} />;
}

/* ------------------------- element grid ------------------------- */

function ElementGrid({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  return (
    <div className="element-chip-grid">
      {COMMON.map((sym) => {
        const el = getElement(sym);
        return (
          <button
            key={sym}
            className={`element-chip ${value === sym ? "selected" : ""}`}
            onClick={() => onChange(sym)}
            title={`${el.name} · EN ${el.en ?? "—"}`}
            aria-label={el.name}
          >
            <span className="chip-z">{el.z}</span>
            <span className="chip-sym" style={{ color: el.color }}>{sym}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------- 3-D bond scene ------------------------- */

function BondScene({
  symA,
  symB,
  order,
  rEq,
  deltaEN,
  character,
}: {
  symA: string;
  symB: string;
  order: number;
  rEq: number;
  deltaEN: number;
  character: string;
}) {
  const A = getElement(symA);
  const B = getElement(symB);
  const rA = 0.3 + A.rCov * 0.55;
  const rB = 0.3 + B.rCov * 0.55;
  const half = rEq * 1.5; // exaggerated for visibility
  const aPos: [number, number, number] = [-half, 0, 0];
  const bPos: [number, number, number] = [half, 0, 0];

  // electron cloud: sphere(s) shifted toward more EN atom
  const moreENIsB = (B.en ?? 0) >= (A.en ?? 0);
  const shift = Math.min(0.55, deltaEN * 0.16) * (character === "nonpolar covalent" ? 0.3 : 1);
  const cloudX = shift * (moreENIsB ? 1 : -1) * 0.9;

  const cloudRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (cloudRef.current) {
      const t = clock.elapsedTime;
      cloudRef.current.position.x = cloudX + Math.sin(t * 1.3) * 0.03;
      cloudRef.current.scale.setScalar(1 + Math.sin(t * 2.1) * 0.02);
    }
  });

  const gap = 0.22;
  const offsets = order === 1 ? [0] : order === 2 ? [gap / 2, -gap / 2] : [0, gap, -gap];
  const ionic = character === "ionic";

  return (
    <group>
      {/* atoms */}
      <AtomBall position={aPos} radius={rA} color={A.color} label={A.symbol} delta={ionic ? (A.en ?? 0) < (B.en ?? 0) ? "+full" : "" : deltaEN >= 0.4 ? ((A.en ?? 0) > (B.en ?? 0) ? "δ−" : "δ+") : ""} />
      <AtomBall position={bPos} radius={rB} color={B.color} label={B.symbol} delta={ionic ? (B.en ?? 0) < (A.en ?? 0) ? "+full" : "" : deltaEN >= 0.4 ? ((B.en ?? 0) > (A.en ?? 0) ? "δ−" : "δ+") : ""} />

      {/* shared electron cloud between them */}
      {!ionic && (
        <mesh ref={cloudRef} position={[cloudX, 0, 0]}>
          <capsuleGeometry args={[0.24, half * 1.15, 8, 20]} />
          <meshStandardMaterial
            color="#8ec9ff"
            transparent
            opacity={0.3}
            roughness={0.2}
            emissive="#2a5a8f"
            emissiveIntensity={0.4}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* bond sticks */}
      {!ionic &&
        offsets.map((off, i) => (
          <mesh key={i} position={[(aPos[0] + bPos[0]) / 2, off, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[order === 1 ? 0.075 : 0.055, order === 1 ? 0.075 : 0.055, half * 2 - rA - rB + 0.1, 12]} />
            <meshStandardMaterial color="#9fb0d0" roughness={0.35} />
          </mesh>
        ))}

      {/* ionic: show full electron transfer arrow */}
      {ionic && (
        <Arrow
          from={[moreENIsB ? aPos[0] + rA + 0.25 : bPos[0] - rB - 0.25, 0.75, 0]}
          to={[moreENIsB ? bPos[0] - rB - 0.25 : aPos[0] + rA + 0.25, 0.75, 0]}
          color="#ff5fa2"
          radius={0.045}
        />
      )}
      {ionic && (
        <Html position={[0, 1.15, 0]} center distanceFactor={9} style={{ pointerEvents: "none" }}>
          <div style={{ color: "#ff8fc0", fontSize: 12, fontWeight: 700, textShadow: "0 1px 4px #000" }}>
            e⁻ transferred (ΔEN = {deltaEN.toFixed(2)})
          </div>
        </Html>
      )}
    </group>
  );
}

function AtomBall({
  position,
  radius,
  color,
  label,
  delta,
}: {
  position: [number, number, number];
  radius: number;
  color: string;
  label: string;
  delta: string;
}) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
      <Html center distanceFactor={9} style={{ pointerEvents: "none" }}>
        <div style={{ transform: `translateY(${-(radius * 40 + 14)}px)`, textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, textShadow: "0 1px 4px #000" }}>{label}</div>
          {delta && (
            <div style={{ color: delta.startsWith("δ−") || delta.includes("full") ? "#9dc4ff" : "#ff9d9d", fontWeight: 800, fontSize: 13, textShadow: "0 1px 4px #000" }}>
              {delta === "+full" ? "ion" : delta}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

/* ------------------------- electron sea ------------------------- */

function ElectronSea({ colorA, colorB }: { colorA: string; colorB: string }) {
  const electronsRef = useRef<THREE.InstancedMesh>(null);
  const N_CATIONS = 27; // 3x3x3
  const N_ELECTRONS = 40;

  const cations = useMemo(() => {
    const out: Array<[number, number, number]> = [];
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) out.push([x * 2.1, y * 2.1, z * 2.1]);
    return out;
  }, []);

  const seeds = useMemo(
    () =>
      Array.from({ length: N_ELECTRONS }, (_, i) => ({
        phase: (i * 1.37) % (Math.PI * 2),
        speed: 0.4 + ((i * 7) % 11) / 14,
        radius: 0.8 + ((i * 13) % 7) / 6,
        tilt: (i * 0.9) % Math.PI,
      })),
    []
  );

  useFrame(({ clock }) => {
    const mesh = electronsRef.current;
    if (!mesh) return;
    const t = clock.elapsedTime;
    const m = new THREE.Matrix4();
    seeds.forEach((s, i) => {
      const a = s.phase + t * s.speed;
      const x = Math.cos(a) * s.radius * 3;
      const y = Math.sin(a * 1.3 + s.tilt) * 2.6;
      const z = Math.sin(a) * s.radius * 3;
      m.setPosition(x, y, z);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {cations.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshStandardMaterial color={i % 2 === 0 ? colorA : colorB} roughness={0.3} metalness={0.35} />
        </mesh>
      ))}
      <instancedMesh ref={electronsRef} args={[undefined, undefined, N_ELECTRONS]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshBasicMaterial color="#7dd8ff" toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

/* ------------------------- PE curve (SVG) ------------------------- */

function PECurve({
  rEq,
  De,
  currentR,
  energy,
  a,
  b,
}: {
  rEq: number;
  De: number;
  currentR: number;
  energy: number;
  a: string;
  b: string;
}) {
  const W = 760;
  const H = 420;
  const padL = 64;
  const padB = 48;
  const padT = 20;
  const padR = 20;
  const rMin = rEq * 0.55;
  const rMax = rEq * 2.5;
  const eMin = -De * 1.35;
  const eMax = De * 1.2;

  const sx = (r: number) => padL + ((r - rMin) / (rMax - rMin)) * (W - padL - padR);
  const sy = (e: number) => padT + ((eMax - e) / (eMax - eMin)) * (H - padT - padB);

  const path = useMemo(() => {
    let d = "";
    for (let i = 0; i <= 220; i++) {
      const r = rMin + ((rMax - rMin) * i) / 220;
      const e = morseEnergy(r, rEq, De);
      const x = sx(r);
      const y = sy(Math.max(e, eMin));
      d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
    }
    return d;
  }, [rEq, De, rMin, rMax]);

  const cx = sx(currentR);
  const cy = sy(Math.max(energy, eMin));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }} role="img" aria-label="Potential energy curve">
      {/* zero energy line */}
      <line x1={padL} y1={sy(0)} x2={W - padR} y2={sy(0)} stroke="#3a4a6e" strokeDasharray="5 5" strokeWidth={1.2} />
      <text x={padL + 6} y={sy(0) - 6} fill="#8b98b8" fontSize={12}>PE = 0 (separated atoms)</text>
      {/* axes */}
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#3a4a6e" strokeWidth={1.5} />
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#3a4a6e" strokeWidth={1.5} />
      <text x={W / 2} y={H - 10} fill="#c3cde4" fontSize={13} textAnchor="middle">internuclear distance r (Å)</text>
      <text x={16} y={H / 2} fill="#c3cde4" fontSize={13} textAnchor="middle" transform={`rotate(-90 16 ${H / 2})`}>potential energy</text>
      {/* curve */}
      <path d={path} fill="none" stroke="url(#grad)" strokeWidth={3} strokeLinecap="round" />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="45%" stopColor="#4cc3ff" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      {/* minimum marker */}
      <line x1={sx(rEq)} y1={sy(-De)} x2={sx(rEq)} y2={H - padB} stroke="#34d399" strokeDasharray="4 4" strokeWidth={1.2} />
      <circle cx={sx(rEq)} cy={sy(-De)} r={5.5} fill="#34d399" />
      <text x={sx(rEq) + 9} y={sy(-De) + 18} fill="#34d399" fontSize={12.5} fontWeight={700}>
        bond length {rEq.toFixed(2)} Å · bond energy {De.toFixed(0)} kJ/mol
      </text>
      {/* current position */}
      <circle cx={cx} cy={cy} r={8} fill="#fff" opacity={0.16} />
      <circle cx={cx} cy={cy} r={4.5} fill="#fff" />
      <text x={cx} y={cy - 14} fill="#fff" fontSize={12} textAnchor="middle" fontWeight={700}>
        {a}–{b} here
      </text>
      {/* repulsion / attraction annotations */}
      <text x={sx(rMin) + 8} y={padT + 34} fill="#f87171" fontSize={12} fontWeight={600}>r &lt; r₀: repulsion dominates</text>
      <text x={sx(rMax) - 14} y={padT + 34} fill="#a78bfa" fontSize={12} fontWeight={600} textAnchor="end">r ≫ r₀: atoms separate (bond breaks)</text>
    </svg>
  );
}
