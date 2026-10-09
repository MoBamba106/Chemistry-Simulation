/**
 * Atom Builder — construct any atom or ion from protons, neutrons, and
 * electrons and see the consequences instantly:
 *
 *   protons  → element identity (change Z and you transmute the element!)
 *   neutrons → isotope & mass number (identity does NOT change)
 *   electrons→ net charge (cations/anions) + valence shell
 *
 * Renders an animated Bohr-model atom next to isotope notation (ᴬZXᶜ),
 * electron configuration, and an explanation of why ions form. A permanent
 * disclaimer distinguishes the Bohr picture from real orbital behavior.
 */
import * as React from "react";
import { useMemo, Suspense } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ELEMENTS, getElement, hasElement } from "@/chem/elements";
import {
  aufbauFill,
  fullConfiguration,
  nobleGasConfiguration,
  cationConfiguration,
} from "@/chem/electronConfig";
import { BohrAtom } from "@/three/BohrAtom";
import { SceneCanvas } from "@/three/SceneCanvas";
import { Badge, Panel, Button, Stepper, Callout, Stat } from "@/components/ui";
import { SimLayout, ControlSection, Viewport3D, InfoRow, BigFormula } from "./SimKit";
import type { SimProps } from "./types";

interface AtomPreset {
  id: string;
  label: string;
  p: number;
  n: number;
  e: number;
}

const PRESETS: AtomPreset[] = [
  { id: "carbon-12", label: "Carbon-12 (standard)", p: 6, n: 6, e: 6 },
  { id: "carbon-14", label: "Carbon-14 (radioisotope)", p: 6, n: 8, e: 6 },
  { id: "hydrogen", label: "Hydrogen-1", p: 1, n: 0, e: 1 },
  { id: "na-neutral", label: "Sodium atom (Na)", p: 11, n: 12, e: 11 },
  { id: "na-ion", label: "Sodium ion (Na⁺)", p: 11, n: 12, e: 10 },
  { id: "cl-neutral", label: "Chlorine atom (Cl)", p: 17, n: 18, e: 17 },
  { id: "cl-ion", label: "Chloride ion (Cl⁻)", p: 17, n: 18, e: 18 },
  { id: "o2-", label: "Oxide ion (O²⁻)", p: 8, n: 8, e: 10 },
  { id: "mg2+", label: "Magnesium ion (Mg²⁺)", p: 12, n: 12, e: 10 },
  { id: "al3+", label: "Aluminum ion (Al³⁺)", p: 13, n: 14, e: 10 },
  { id: "fe2+", label: "Iron(II) — Fe²⁺", p: 26, n: 30, e: 24 },
  { id: "fe3+", label: "Iron(III) — Fe³⁺", p: 26, n: 30, e: 23 },
  { id: "u-235", label: "Uranium-235*", p: 92, n: 143, e: 92 },
];

const MAX_Z = ELEMENTS[ELEMENTS.length - 1].z;

export default function AtomBuilder({ presetId, embedded }: SimProps) {
  const preset = useMemo(() => PRESETS.find((p) => p.id === presetId) ?? null, [presetId]);
  const [searchParams] = useSearchParams();
  const elementParam = searchParams.get("element");

  const initial = React.useMemo(() => {
    if (preset) return { p: preset.p, n: preset.n, e: preset.e };
    if (elementParam && hasElement(elementParam)) {
      const el = getElement(elementParam);
      return { p: el.z, n: Math.max(0, Math.round(el.mass) - el.z), e: el.z };
    }
    return { p: 6, n: 6, e: 6 };
  }, [preset, elementParam]);

  const [protons, setProtons] = React.useState(initial.p);
  const [neutrons, setNeutrons] = React.useState(initial.n);
  const [electrons, setElectrons] = React.useState(initial.e);

  React.useEffect(() => {
    setProtons(initial.p);
    setNeutrons(initial.n);
    setElectrons(initial.e);
  }, [initial]);

  const element = protons >= 1 && protons <= MAX_Z ? getElement(protons) : null;
  const charge = protons - electrons;
  const massNumber = protons + neutrons;

  const config = useMemo(() => {
    if (!element || electrons <= 0) return null;
    if (charge > 0) return cationConfiguration(protons, charge);
    return aufbauFill(protons, electrons);
  }, [element, electrons, charge, protons]);

  const valenceShell = config && config.length > 0 ? config[config.length - 1] : null;

  const ionName = useMemo(() => {
    if (!element || charge === 0) return null;
    if (charge > 0) {
      const stock = element.commonIons.includes(charge) ? "" : " (unusual charge)";
      return `${element.name} cation${stock}`;
    }
    const anionNames: Record<string, string> = {
      H: "hydride", F: "fluoride", Cl: "chloride", Br: "bromide", I: "iodide",
      O: "oxide", S: "sulfide", N: "nitride", P: "phosphide", C: "carbide",
      Se: "selenide",
    };
    return anionNames[element.symbol]
      ? `${anionNames[element.symbol]} anion`
      : `${element.name} anion`;
  }, [element, charge]);

  // Isotope stability hint (very rough belt-of-stability heuristic)
  const stabilityHint = useMemo(() => {
    if (!element) return null;
    const ratio = neutrons / Math.max(1, protons);
    if (protons <= 20) {
      if (Math.abs(ratio - 1) <= 0.15) return { tone: "good" as const, text: "n/p ≈ 1 — this isotope sits on the belt of stability for a light element." };
      return { tone: "warn" as const, text: `n/p = ${ratio.toFixed(2)} — far from 1 for a light element, so this isotope would be unstable (radioactive).` };
    }
    if (ratio >= 1.15 && ratio <= 1.6) return { tone: "good" as const, text: `n/p = ${ratio.toFixed(2)} — in the stability band for heavier elements (which need extra neutrons to offset proton repulsion).` };
    return { tone: "warn" as const, text: `n/p = ${ratio.toFixed(2)} — outside the stability band; this isotope would likely be radioactive.` };
  }, [element, neutrons, protons]);

  const leftPanel = (
    <>
      <ControlSection title="Subatomic Particles">
        <Stepper label="Protons (p⁺)" value={protons} min={1} max={MAX_Z} onChange={setProtons} color="#ff8d80" />
        <Stepper label="Neutrons (n⁰)" value={neutrons} min={0} max={Math.round(protons * 1.6) + 4} onChange={setNeutrons} color="#b8c4dd" />
        <Stepper label="Electrons (e⁻)" value={electrons} min={0} max={protons + 4} onChange={setElectrons} color="#7dd8ff" />
        <div className="tiny muted">
          Protons decide <b style={{ color: "#ff8d80" }}>which element</b> this is. Neutrons decide{" "}
          <b style={{ color: "#b8c4dd" }}>which isotope</b>. Electrons decide{" "}
          <b style={{ color: "#7dd8ff" }}>the charge</b>.
        </div>
      </ControlSection>

      <ControlSection title="Quick Presets">
        <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: embedded ? 200 : 320, overflowY: "auto" }}>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              className={`seg-item ${p.p === protons && p.n === neutrons && p.e === electrons ? "active-accent" : ""}`}
              style={{ textAlign: "left", padding: "6px 10px", borderRadius: 8, width: "100%" }}
              onClick={() => {
                setProtons(p.p);
                setNeutrons(p.n);
                setElectrons(p.e);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </ControlSection>

      <Callout tone="violet" title="Model disclaimer">
        This is a <b>Bohr model</b> — a teaching picture. Real electrons do not orbit on
        rings; they occupy <Link to="/concept/orbitals">orbitals</Link>, 3-D probability
        clouds. Shell rings are drawn only to show quantized energy levels and electron counts.
      </Callout>
    </>
  );

  const shellRadius = 0.85 + 0.72 * Math.max(1, (config ?? []).length > 0 ? Math.max(...(config ?? [{ n: 1 }]).map((s) => s.n)) : 1);
  const camDist = Math.max(6.5, shellRadius * 2.3 + 3);

  const canvasPanel = (
    <Viewport3D
      style={{ height: "100%", minHeight: embedded ? 320 : 440 }}
      hud={
        element && (
          <>
            <Badge tone="accent">{element.name}</Badge>
            {charge !== 0 && (
              <Badge tone={charge > 0 ? "bad" : "good"}>
                charge {charge > 0 ? `+${charge}` : `−${Math.abs(charge)}`}
              </Badge>
            )}
          </>
        )
      }
      hint="drag to rotate · scroll to zoom · amber = valence shell"
    >
      <SceneCanvas cameraPosition={[0, camDist * 0.32, camDist]}>
        <Suspense fallback={null}>
          <BohrAtom protons={protons} neutrons={neutrons} electrons={electrons} />
        </Suspense>
      </SceneCanvas>
    </Viewport3D>
  );

  const rightPanel = (
    <>
      <Panel title="Identity">
        <BigFormula
          sub={element ? `${element.name} · ${massNumber - protons} neutrons · avg atomic mass ${element.mass.toFixed(element.mass < 10 ? 3 : 2)} u` : "—"}
        >
          <sup style={{ fontSize: "0.55em" }}>{massNumber}</sup>
          <sub style={{ fontSize: "0.55em" }}>{protons}</sub>
          {element?.symbol ?? "?"}
          {charge !== 0 && (
            <sup style={{ fontSize: "0.5em", color: charge > 0 ? "#ff9d9d" : "#9dc4ff" }}>
              {Math.abs(charge) === 1 ? "" : Math.abs(charge)}{charge > 0 ? "+" : "−"}
            </sup>
          )}
        </BigFormula>
        <div className="stat-grid">
          <Stat label="Net charge" value={charge === 0 ? "0" : charge > 0 ? `+${charge}` : `−${Math.abs(charge)}`} sub={charge === 0 ? "neutral atom" : charge > 0 ? "cation" : "anion"} />
          <Stat label="Mass number (A)" value={massNumber} sub="p⁺ + n⁰" />
          <Stat label="Valence e⁻" value={electrons > 0 ? countValence(config ?? []) : 0} sub={element ? `group ${element.group}` : ""} />
          <Stat label="Atomic number (Z)" value={protons} sub="defines the element" />
        </div>
        {ionName && (
          <div className="tiny" style={{ marginTop: 8, color: "var(--text-1)" }}>
            This is the <b>{ionName}</b>.
          </div>
        )}
      </Panel>

      {element && (
        <Panel title="Electron Configuration">
          <div className="mono" style={{ fontSize: 13.5, color: "var(--text-0)", lineHeight: 1.7 }}>
            {config && config.length > 0 ? fullConfiguration(config) : electrons === 0 ? "(no electrons — bare nucleus)" : "—"}
          </div>
          {electrons > 0 && electrons !== protons && (
            <div className="mono tiny muted" style={{ marginTop: 4 }}>
              shorthand: {nobleGasConfiguration(protons, electrons)}
            </div>
          )}
          {charge !== 0 && (
            <div className="tiny muted" style={{ marginTop: 6 }}>
              {charge > 0
                ? `Cation: ${charge} electron${charge === 1 ? "" : "s"} removed — highest-energy (largest n) electrons go first.`
                : `Anion: ${Math.abs(charge)} electron${charge === -1 ? "" : "s"} added to the partially-filled/next available orbitals.`}
            </div>
          )}
        </Panel>
      )}

      {element && (
        <Panel title="Why This Charge?">
          <div className="tiny" style={{ lineHeight: 1.65, color: "var(--text-1)" }}>
            {charge === 0 ? (
              <p style={{ margin: 0 }}>
                Neutral {element.name}: {protons} protons (+) exactly balance {electrons} electrons (−).
                It has <b>{countValence(config ?? [])} valence electron{countValence(config ?? []) === 1 ? "" : "s"}</b>.
                {valenceAdvice(element.symbol, countValence(config ?? []))}
              </p>
            ) : (
              <p style={{ margin: 0 }}>
                With charge {charge > 0 ? `+${charge}` : `−${Math.abs(charge)}`}, this species{" "}
                {charge > 0 ? "lost" : "gained"} {Math.abs(charge)} electron{Math.abs(charge) === 1 ? "" : "s"}.
                {config && config.length > 0 && (
                  <>
                    {" "}Its configuration is now <span className="mono">{fullConfiguration(config)}</span>
                    {matchesNobleGas(protons, electrons) && (
                      <> — <b style={{ color: "var(--good)" }}>isoelectronic with a noble gas</b>. That full valence shell is exactly why ions form: reaching the stable octet (or duet) lowers the system's energy, and the resulting ion is attracted into ionic lattices by Coulomb forces.</>
                    )}
                  </>
                )}
              </p>
            )}
          </div>
        </Panel>
      )}

      {element && stabilityHint && (
        <Callout tone={stabilityHint.tone === "good" ? "success" : "warning"} title="Nuclear stability">
          {stabilityHint.text}
        </Callout>
      )}

      {!element && (
        <Callout tone="danger" title="Unknown element">
          Z = {protons} is outside the bundled database (Z = 1–{MAX_Z}).
        </Callout>
      )}

      <Panel title="Connections">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link to="/sims/electron-config"><Button size="sm" variant="outline">Electron Configuration Lab →</Button></Link>
          <Link to="/sims/ionic-bonding"><Button size="sm" variant="outline">Form Ionic Bonds →</Button></Link>
          <Link to="/sims/periodic-explorer"><Button size="sm" variant="outline">See it in the Table →</Button></Link>
        </div>
      </Panel>
    </>
  );

  return <SimLayout left={leftPanel} canvas={canvasPanel} right={rightPanel} embedded={embedded} />;
}

function countValence(config: Array<{ n: number; electrons: number }>): number {
  if (config.length === 0) return 0;
  const maxN = Math.max(...config.map((s) => s.n));
  // main-group style: count electrons in the outermost shell
  return config.filter((s) => s.n === maxN).reduce((sum, s) => sum + s.electrons, 0);
}

function matchesNobleGas(z: number, electrons: number): boolean {
  return [2, 10, 18, 36, 54].includes(electrons);
}

function valenceAdvice(symbol: string, valence: number): string {
  if (valence === 8) return " A full octet — this is a noble gas configuration, already maximally stable, which is why noble gases barely react.";
  if (valence === 1 && ["Li", "Na", "K", "Rb", "Cs"].includes(symbol)) return " Alkali metals lose this single electron to form +1 cations with noble-gas configurations.";
  if (valence === 2 && ["Be", "Mg", "Ca", "Sr", "Ba"].includes(symbol)) return " Alkaline earth metals lose both electrons to form +2 cations.";
  if (valence === 7) return " One electron short of an octet — halogens gain one electron to form −1 anions (or share one in a covalent bond).";
  if (valence === 6) return " Two electrons short of an octet — tends to gain two electrons (−2 anion) or share two pairs.";
  if (valence === 5) return " Three short of an octet — typically shares three pairs (three covalent bonds), as in NH₃.";
  if (valence === 4) return " Halfway to an octet — carbon shares four pairs rather than gaining or losing, which is why it builds entire chemical universes.";
  if (valence === 3) return " Boron-family: typically forms three bonds and is often electron-deficient (six electrons).";
  return "";
}
