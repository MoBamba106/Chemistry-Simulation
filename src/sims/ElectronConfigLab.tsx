/**
 * Electron Configuration Lab — build ground-state configurations the way
 * the exam expects:
 *
 *  - aufbau filling order with the n+l rule visualized
 *  - orbital box diagrams with Hund's rule arrows
 *  - full spdf notation and noble-gas shorthand
 *  - 3-D boundary surfaces for s / p / d orbitals
 *  - cation & anion modes (transition metals lose ns before (n−1)d!)
 *  - the Cr / Cu exceptions with a predicted-vs-observed toggle
 *  - "step mode" that adds one electron at a time and explains the rule
 *    (aufbau / Pauli / Hund) that decided where it went
 */
import * as React from "react";
import { useMemo, Suspense, useState } from "react";
import { getElement } from "@/chem/elements";
import {
  aufbauFill,
  cationConfiguration,
  fullConfiguration,
  nobleGasConfiguration,
  orbitalBoxes,
  subshellLabel,
  Subshell,
} from "@/chem/electronConfig";
import { SceneCanvas } from "@/three/SceneCanvas";
import { OrbitalShape, OrbitalKind } from "@/three/OrbitalShape";
import { Badge, Panel, Button, Segmented, Callout, Stat } from "@/components/ui";
import { SimLayout, ControlSection, Viewport3D, InfoRow, BigFormula } from "./SimKit";
import type { SimProps } from "./types";

type IonMode = "neutral" | "cation" | "anion";

interface ECPreset { id: string; label: string; z: number; mode: IonMode; mag: number; }

const PRESETS: ECPreset[] = [
  { id: "oxygen", label: "Oxygen (Z=8) — Hund's rule", z: 8, mode: "neutral", mag: 0 },
  { id: "sodium", label: "Sodium (Z=11) — shorthand", z: 11, mode: "neutral", mag: 0 },
  { id: "iron", label: "Iron (Z=26) — d block", z: 26, mode: "neutral", mag: 0 },
  { id: "fe2+", label: "Fe²⁺ — lose 4s first", z: 26, mode: "cation", mag: 2 },
  { id: "fe3+", label: "Fe³⁺ — half-filled d⁵", z: 26, mode: "cation", mag: 3 },
  { id: "chromium", label: "Chromium (Z=24) — exception", z: 24, mode: "neutral", mag: 0 },
  { id: "copper", label: "Copper (Z=29) — exception", z: 29, mode: "neutral", mag: 0 },
  { id: "cl-", label: "Chloride Cl⁻ — anion", z: 17, mode: "anion", mag: 1 },
];

const ORBITAL_KINDS: Record<string, OrbitalKind[]> = {
  s: ["s"],
  p: ["px", "py", "pz"],
  d: ["dxy", "dyz", "dxz", "dx2y2", "dz2"],
};

export default function ElectronConfigLab({ presetId, embedded }: SimProps) {
  const preset = useMemo(() => PRESETS.find((p) => p.id === presetId) ?? null, [presetId]);

  const [z, setZ] = useState(preset?.z ?? 8);
  const [ionMode, setIonMode] = useState<IonMode>(preset?.mode ?? "neutral");
  const [ionMag, setIonMag] = useState(preset?.mag ?? 0);
  const [showPredicted, setShowPredicted] = useState(false);
  const [selectedSubshell, setSelectedSubshell] = useState<string | null>("2p");
  const [stepMode, setStepMode] = useState(false);
  const [stepCount, setStepCount] = useState<number | null>(null);

  React.useEffect(() => {
    if (preset) {
      setZ(preset.z);
      setIonMode(preset.mode);
      setIonMag(preset.mag);
      setStepCount(null);
    }
  }, [preset]);

  const element = getElement(z);
  const charge = ionMode === "cation" ? ionMag : ionMode === "anion" ? -ionMag : 0;
  const electronCount = Math.max(0, z - charge);

  const isException = [24, 29, 42, 47].includes(z) && ionMode === "neutral";

  const config: Subshell[] = useMemo(() => {
    let c: Subshell[];
    if (ionMode === "cation" && ionMag > 0) {
      c = cationConfiguration(z, ionMag);
    } else {
      c = aufbauFill(z, electronCount);
    }
    if (showPredicted && isException) {
      // pure aufbau without exception correction
      c = aufbauFill(0, electronCount); // z=0 → no exception applied
    }
    return c;
  }, [z, ionMode, ionMag, electronCount, showPredicted, isException]);

  const shown = stepMode && stepCount !== null ? truncateConfig(config, stepCount) : config;
  const shownCount = shown.reduce((s, x) => s + x.electrons, 0);
  const nextElectronInfo = stepMode ? explainNextElectron(config, shownCount) : null;

  const boxes = useMemo(() => orbitalBoxes(shown), [shown]);
  const notation = fullConfiguration(shown);
  const shorthand = stepMode ? notation : nobleGasConfiguration(z, electronCount);

  const selKind = selectedSubshell?.[1] as "s" | "p" | "d" | undefined;
  const selOccupancy = shown.find((s) => subshellLabel(s.n, s.l) === selectedSubshell);

  const leftPanel = (
    <>
      <ControlSection title="Element">
        <div className="slider-row">
          <div className="slider-label">
            <span>Atomic number Z</span>
            <b>{element.symbol} · {z}</b>
          </div>
          <input
            type="range" min={1} max={36} value={z}
            aria-label="Atomic number"
            onChange={(e) => setZ(Number(e.target.value))}
          />
        </div>
        <Segmented
          options={[
            { value: "neutral", label: "Atom" },
            { value: "cation", label: "Cation +" },
            { value: "anion", label: "Anion −" },
          ]}
          value={ionMode}
          onChange={(m) => { setIonMode(m); setIonMag(m === "neutral" ? 0 : Math.max(1, ionMag)); setStepCount(null); }}
          accent
          style={{ width: "100%" }}
        />
        {ionMode !== "neutral" && (
          <Segmented
            options={[1, 2, 3].map((n) => ({ value: String(n), label: `${ionMode === "cation" ? "+" : "−"}${n}` }))}
            value={String(Math.max(1, ionMag))}
            onChange={(v) => { setIonMag(Number(v)); setStepCount(null); }}
            style={{ width: "100%" }}
          />
        )}
      </ControlSection>

      <ControlSection title="Build Mode">
        <Button
          size="sm"
          variant={stepMode ? "primary" : "outline"}
          onClick={() => { setStepMode(!stepMode); setStepCount(stepMode ? null : 0); }}
        >
          {stepMode ? "Exit step mode" : "Add electrons one at a time"}
        </Button>
        {stepMode && (
          <>
            <div style={{ display: "flex", gap: 8 }}>
              <Button size="sm" variant="outline" disabled={shownCount >= electronCount}
                onClick={() => setStepCount(shownCount + 1)}>
                + e⁻
              </Button>
              <Button size="sm" variant="ghost" disabled={shownCount === 0} onClick={() => setStepCount(shownCount - 1)}>
                − e⁻
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setStepCount(0)}>clear</Button>
            </div>
            <div className="tiny muted">
              {shownCount} of {electronCount} electrons placed.
            </div>
            {nextElectronInfo && shownCount < electronCount && (
              <Callout tone="info" title={`Electron #${shownCount + 1} → ${nextElectronInfo.where}`}>
                {nextElectronInfo.why}
              </Callout>
            )}
            {shownCount >= electronCount && (
              <Callout tone="success" title="Ground state complete">
                The configuration matches {notation}.
              </Callout>
            )}
          </>
        )}
      </ControlSection>

      {isException && (
        <ControlSection title="Exception Alert">
          <Callout tone={showPredicted ? "warning" : "violet"} title={showPredicted ? "Predicted (strict aufbau)" : "Observed ground state"}>
            {showPredicted
              ? "Strict aufbau predicts the configuration shown. It is NOT what experiments observe."
              : `${element.name} breaks strict aufbau: a half-filled or fully-filled d subshell is extra stable, so one 4s electron is promoted to 3d.`}
          </Callout>
          <Button size="sm" variant="outline" onClick={() => setShowPredicted(!showPredicted)}>
            {showPredicted ? "Show observed" : "Show predicted"}
          </Button>
        </ControlSection>
      )}

      <ControlSection title="Presets">
        <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: embedded ? 160 : 260, overflowY: "auto" }}>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              className={`seg-item ${p.z === z && p.mode === ionMode && p.mag === ionMag ? "active-accent" : ""}`}
              style={{ textAlign: "left", padding: "6px 10px", borderRadius: 8, width: "100%" }}
              onClick={() => { setZ(p.z); setIonMode(p.mode); setIonMag(p.mag); setStepCount(null); setShowPredicted(false); }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </ControlSection>
    </>
  );

  const canvasPanel = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%", minHeight: 0 }}>
      <Panel title="Orbital Diagram" bodyClassName="">
        <div style={{ overflowX: "auto", padding: "6px 4px 12px" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-end", minWidth: "min-content" }}>
            {boxes.map((box, i) => {
              const key = box.subshell;
              const isFirstOfSubshell = i === 0 || boxes[i - 1].subshell !== key;
              const isSubshellSel = selectedSubshell === key;
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ display: "flex", gap: isFirstOfSubshell ? 0 : 6 }}>
                    <button
                      onClick={() => setSelectedSubshell(key)}
                      title={`View ${key} orbitals in 3-D`}
                      style={{
                        width: 30, height: 30, borderRadius: 6,
                        border: `1.5px ${isSubshellSel ? "solid var(--accent)" : "solid var(--border-strong)"}`,
                        background: isSubshellSel ? "var(--accent-soft)" : "var(--bg-1)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
                        cursor: "pointer", padding: 0, marginLeft: isFirstOfSubshell ? 6 : 0,
                      }}
                      aria-label={`Select subshell ${key}`}
                    >
                      {box.spins.map((s, si) =>
                        s === "up" ? (
                          <span key={si} style={{ color: "#7dd8ff", fontSize: 15, lineHeight: 1, fontWeight: 700 }}>↑</span>
                        ) : (
                          <span key={si} style={{ color: "#ff9db8", fontSize: 15, lineHeight: 1, fontWeight: 700 }}>↓</span>
                        )
                      )}
                    </button>
                  </div>
                  <div className="tiny mono muted" style={{ fontSize: 10.5 }}>{box.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>

      <Viewport3D
        style={{ flex: 1, minHeight: embedded ? 240 : 320 }}
        hud={
          <>
            {selectedSubshell && <Badge tone="accent">{selectedSubshell} orbitals</Badge>}
            {selOccupancy && (
              <Badge tone={selOccupancy.electrons === selOccupancy.capacity ? "good" : "warn"}>
                {selOccupancy.electrons}/{selOccupancy.capacity} e⁻
              </Badge>
            )}
          </>
        }
        hint="boundary surfaces (~90% probability) — not electron paths"
      >
        <SceneCanvas cameraPosition={[0, 0.6, 5.4]} autoRotate autoRotateSpeed={0.6}>
          <Suspense fallback={null}>
            {selKind &&
              ORBITAL_KINDS[selKind]?.map((kind, i) => {
                const n = ORBITAL_KINDS[selKind].length;
                const spread = n === 1 ? 0 : 2.4;
                return (
                  <group key={kind} position={[(i - (n - 1) / 2) * spread, 0, 0]}>
                    <OrbitalShape kind={kind} scale={n > 3 ? 0.85 : 1} />
                  </group>
                );
              })}
            <mesh>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="#ff6b5e" emissive="#7a2b24" />
            </mesh>
          </Suspense>
        </SceneCanvas>
      </Viewport3D>
    </div>
  );

  const rightPanel = (
    <>
      <Panel title="Species">
        <BigFormula
          sub={`${element.name} · ${electronCount} electrons`}
        >
          {element.symbol}
          {charge !== 0 && (
            <sup style={{ fontSize: "0.5em", color: charge > 0 ? "#ff9d9d" : "#9dc4ff" }}>
              {Math.abs(charge) === 1 ? "" : Math.abs(charge)}{charge > 0 ? "+" : "−"}
            </sup>
          )}
        </BigFormula>
        <div className="mono" style={{ fontSize: 13, color: "var(--text-0)", textAlign: "center", padding: "4px 8px", lineHeight: 1.7 }}>
          {notation || "—"}
        </div>
        {!stepMode && shorthand !== notation && (
          <div className="mono tiny" style={{ textAlign: "center", color: "var(--accent)" }}>
            {shorthand}
          </div>
        )}
        <div className="stat-grid" style={{ marginTop: 8 }}>
          <Stat label="Valence e⁻" value={electronCount > 0 ? valenceCount(config, z) : 0} />
          <Stat label="Unpaired e⁻" value={countUnpaired(config)} />
        </div>
      </Panel>

      <Panel title="Rules Being Applied">
        <RuleRow
          name="Aufbau principle"
          text="Electrons fill lowest-energy subshells first (1s → 2s → 2p → 3s → 3p → 4s → 3d…). 4s fills before 3d because its (n+l) value is lower."
        />
        <RuleRow
          name="Pauli exclusion"
          text="An orbital holds at most 2 electrons, and they must have opposite spins (↑↓)."
        />
        <RuleRow
          name="Hund's rule"
          text="Within a subshell, electrons occupy empty orbitals singly (parallel spins) before pairing up."
        />
        {ionMode === "cation" && z >= 21 && z <= 30 && (
          <Callout tone="warning" title="Transition-metal cations">
            When transition metals ionize they lose the <b>highest-n</b> electrons first:
            4s empties BEFORE 3d, even though 4s filled first. Fe: [Ar] 4s² 3d⁶ → Fe²⁺: [Ar] 3d⁶ (not 4s² 3d⁴).
          </Callout>
        )}
      </Panel>

      <Panel title="PES Connection (Unit 1.6)">
        <div className="tiny" style={{ lineHeight: 1.65, color: "var(--text-1)" }}>
          A photoelectron spectrum would show <b>{config.filter((s) => s.electrons > 0).length} peaks</b> — one per
          occupied subshell. Peak <b>height ∝ number of electrons</b> in the subshell; peak{" "}
          <b>position (binding energy)</b> increases with nuclear attraction: lower shells (1s) bind
          hardest. Comparing PES of neighboring elements shows effective nuclear charge (Z<sub>eff</sub>) at work.
        </div>
      </Panel>
    </>
  );

  return <SimLayout left={leftPanel} canvas={canvasPanel} right={rightPanel} embedded={embedded} />;
}

function RuleRow({ name, text }: { name: string; text: string }) {
  return (
    <div style={{ padding: "5px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ fontWeight: 650, fontSize: 13, color: "var(--text-0)" }}>{name}</div>
      <div className="tiny muted" style={{ lineHeight: 1.55 }}>{text}</div>
    </div>
  );
}

function truncateConfig(config: Subshell[], count: number): Subshell[] {
  let remaining = count;
  const out: Subshell[] = [];
  // fill in aufbau order
  const aufbauOrder = [...config]; // config is already shell-ordered; rebuild filling order
  const fillOrder = aufbauOrder
    .map((s) => ({ ...s }))
    .sort((a, b) => (a.n + a.l) - (b.n + b.l) || a.n - b.n);
  const byLabel = new Map<string, number>();
  for (const s of fillOrder) {
    if (remaining <= 0) break;
    const put = Math.min(s.electrons, remaining);
    byLabel.set(subshellLabel(s.n, s.l), put);
    remaining -= put;
  }
  for (const s of config) {
    const e = byLabel.get(subshellLabel(s.n, s.l)) ?? 0;
    if (e > 0) out.push({ ...s, electrons: e });
  }
  return out;
}

function explainNextElectron(config: Subshell[], placed: number): { where: string; why: string } | null {
  // find the subshell + orbital the next electron goes into
  const fillOrder = [...config].sort((a, b) => (a.n + a.l) - (b.n + b.l) || a.n - b.n);
  let remaining = placed;
  for (const s of fillOrder) {
    if (remaining < s.electrons) {
      // next electron goes into this subshell
      const orbitals = s.l === 0 ? 1 : s.l === 1 ? 3 : s.l === 2 ? 5 : 7;
      const perOrbital = Math.floor(remaining / orbitals);
      const singles = remaining % orbitals;
      const label = subshellLabel(s.n, s.l);
      if (perOrbital === 0 && singles > 0) {
        return {
          where: `${label} (empty orbital, spin up)`,
          why: `Hund's rule: the ${label} subshell has ${orbitals} degenerate orbitals; electrons occupy empty ones singly with parallel spins before pairing. Pairing early would cost electrostatic repulsion energy.`,
        };
      }
      if (perOrbital === 1) {
        return {
          where: `${label} (pairing, spin down)`,
          why: `Every ${label} orbital now has one electron, so this electron must pair up with opposite spin — Pauli exclusion forbids two identical spin states in one orbital.`,
        };
      }
      return { where: label, why: "Aufbau principle: this is the lowest-energy subshell that still has room." };
    }
    remaining -= s.electrons;
  }
  // all placed subshells full: next is a brand-new subshell
  const next = fillOrder.find((s) => s.electrons > remaining);
  return next
    ? {
        where: `${subshellLabel(next.n, next.l)} (new subshell)`,
        why: "All lower subshells are full, so aufbau sends the next electron to the next-lowest energy subshell in the filling order.",
      }
    : null;
}

function countUnpaired(config: Subshell[]): number {
  // Hund's rule: one electron per orbital first, then pair up.
  // Unpaired in a subshell = min(e, orbitals) − max(0, e − orbitals).
  let unpaired = 0;
  for (const s of config) {
    const orbitals = s.l === 0 ? 1 : s.l === 1 ? 3 : s.l === 2 ? 5 : 7;
    unpaired += Math.max(0, Math.min(s.electrons, orbitals) - Math.max(0, s.electrons - orbitals));
  }
  return unpaired;
}

function valenceCount(config: Subshell[], z: number): number {
  const el = getElement(z);
  if (el.block === "d") {
    const maxN = Math.max(...config.map((s) => s.n), 0);
    return config
      .filter((s) => s.n === maxN || (s.l === 2 && s.n === maxN - 1))
      .reduce((sum, s) => sum + s.electrons, 0);
  }
  const maxN = Math.max(...config.map((s) => s.n), 0);
  return config.filter((s) => s.n === maxN).reduce((sum, s) => sum + s.electrons, 0);
}
