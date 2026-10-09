/**
 * Reaction Viewer — particulate-level chemistry + balancing practice.
 *
 * Pick a reaction; the particulate boxes show the actual molecules on each
 * side (rendered with the same 3-D engine as everywhere else). In Balance
 * mode, the coefficients are hidden and you reconstruct them from atom
 * conservation, with a live atom-count table and instant feedback.
 */
import * as React from "react";
import { useMemo, useState, Suspense } from "react";
import { MOLECULE_MAP, moleculeToSpecies, MoleculeDef } from "@/chem/molecules";
import { analyzeSpecies } from "@/chem/lewis";
import { layout3D } from "@/chem/layout";
import { SceneCanvas } from "@/three/SceneCanvas";
import { MoleculeView } from "@/three/MoleculeView";
import { Badge, Panel, Button, Segmented, Callout, ChemFormula } from "@/components/ui";
import { SimLayout, ControlSection, Viewport3D, InfoRow, BigFormula } from "./SimKit";
import type { SimProps } from "./types";

interface ReactionSide {
  molId: string;
  coef: number;
}

interface Reaction {
  id: string;
  name: string;
  type: string;
  reactants: ReactionSide[];
  products: ReactionSide[];
  context: string;
}

const REACTIONS: Reaction[] = [
  {
    id: "water", name: "Formation of water", type: "synthesis / combustion",
    reactants: [{ molId: "h2", coef: 2 }, { molId: "o2", coef: 1 }],
    products: [{ molId: "h2o", coef: 2 }],
    context: "The classic synthesis: two diatomic gases combine explosively. Note that O₂'s coefficient is 1 — you need 2 H₂ to consume both O atoms.",
  },
  {
    id: "methane", name: "Combustion of methane", type: "combustion",
    reactants: [{ molId: "ch4", coef: 1 }, { molId: "o2", coef: 2 }],
    products: [{ molId: "co2", coef: 1 }, { molId: "h2o", coef: 2 }],
    context: "Burning natural gas: every C ends in CO₂, every H ends in H₂O. Combustion of hydrocarbons is always exothermic.",
  },
  {
    id: "haber", name: "Haber process (ammonia)", type: "synthesis / equilibrium",
    reactants: [{ molId: "n2", coef: 1 }, { molId: "h2", coef: 3 }],
    products: [{ molId: "nh3", coef: 2 }],
    context: "N₂'s triple bond is brutally strong, so industry needs high T, high P, and an iron catalyst. This reaction feeds ~half the world via fertilizer (Unit 7's favorite equilibrium).",
  },
  {
    id: "hcl", name: "Hydrogen + chlorine", type: "synthesis",
    reactants: [{ molId: "h2", coef: 1 }, { molId: "cl2", coef: 1 }],
    products: [{ molId: "hcl", coef: 2 }],
    context: "Already balanced 1:1:2 — diatomics make balancing intuitive when you count particles.",
  },
  {
    id: "co-burn", name: "Carbon monoxide combustion", type: "combustion",
    reactants: [{ molId: "co", coef: 2 }, { molId: "o2", coef: 1 }],
    products: [{ molId: "co2", coef: 2 }],
    context: "CO (the toxic, incomplete-combustion product) burns to CO₂.",
  },
  {
    id: "ethene", name: "Ethene combustion", type: "combustion",
    reactants: [{ molId: "c2h4", coef: 1 }, { molId: "o2", coef: 3 }],
    products: [{ molId: "co2", coef: 2 }, { molId: "h2o", coef: 2 }],
    context: "Balancing organics: do C first, then H, then let O₂ absorb whatever oxygen remains.",
  },
  {
    id: "nh3-decomp", name: "Ammonia decomposition", type: "decomposition",
    reactants: [{ molId: "nh3", coef: 2 }],
    products: [{ molId: "n2", coef: 1 }, { molId: "h2", coef: 3 }],
    context: "The reverse of Haber — decomposition reactions often need energy input.",
  },
  {
    id: "water-split", name: "Electrolysis of water", type: "decomposition (electrolysis)",
    reactants: [{ molId: "h2o", coef: 2 }],
    products: [{ molId: "h2", coef: 2 }, { molId: "o2", coef: 1 }],
    context: "Electricity forces water apart: twice as much H₂ as O₂ collects at the electrodes — the coefficients ARE the particle ratio.",
  },
  {
    id: "halogenation", name: "Methane chlorination", type: "organic substitution",
    reactants: [{ molId: "ch4", coef: 1 }, { molId: "cl2", coef: 1 }],
    products: [{ molId: "ch3cl", coef: 1 }, { molId: "hcl", coef: 1 }],
    context: "A C–H bond is swapped for C–Cl (radical mechanism, driven by UV light).",
  },
];

const PARTICLES_PER_COEF = 2;

export default function ReactionViewer({ presetId, embedded }: SimProps) {
  const initial = REACTIONS.find((r) => r.id === presetId) ?? REACTIONS[0];
  const [reaction, setReaction] = useState<Reaction>(initial);
  const [mode, setMode] = useState<"view" | "balance">("view");
  const [userCoefs, setUserCoefs] = useState<number[]>(() => initial.reactants.concat(initial.products).map(() => 1));
  const [revealed, setRevealed] = useState(false);

  React.useEffect(() => {
    if (presetId) {
      const r = REACTIONS.find((x) => x.id === presetId);
      if (r) {
        setReaction(r);
        setUserCoefs(r.reactants.concat(r.products).map(() => 1));
        setRevealed(false);
      }
    }
  }, [presetId]);

  const sides = useMemo(() => [...reaction.reactants, ...reaction.products], [reaction]);
  const trueCoefs = sides.map((s) => s.coef);
  const balanced = userCoefs.every((c, i) => c === trueCoefs[i]);

  const atomCounts = useMemo(() => {
    const count = (list: ReactionSide[], coefs: number[]) => {
      const tally = new Map<string, number>();
      list.forEach((side, i) => {
        const def = MOLECULE_MAP.get(side.molId)!;
        const coef = coefs[i] ?? 1;
        for (const [, el] of def.atoms) {
          tally.set(el, (tally.get(el) ?? 0) + coef);
        }
      });
      return tally;
    };
    const nR = reaction.reactants.length;
    const left = count(reaction.reactants, userCoefs.slice(0, nR));
    const right = count(reaction.products, userCoefs.slice(nR));
    const elements = [...new Set([...left.keys(), ...right.keys()])].sort();
    return { left, right, elements };
  }, [reaction, userCoefs]);

  const selectReaction = (r: Reaction) => {
    setReaction(r);
    setUserCoefs(r.reactants.concat(r.products).map(() => 1));
    setRevealed(false);
  };

  const leftPanel = (
    <>
      <ControlSection title="Reaction Library">
        <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: embedded ? 200 : 340, overflowY: "auto" }}>
          {REACTIONS.map((r) => (
            <button
              key={r.id}
              className={`seg-item ${r.id === reaction.id ? "active-accent" : ""}`}
              style={{ textAlign: "left", padding: "6px 10px", borderRadius: 8, width: "100%" }}
              onClick={() => selectReaction(r)}
            >
              {r.name} <span className="tiny muted">· {r.type}</span>
            </button>
          ))}
        </div>
      </ControlSection>

      <ControlSection title="Mode">
        <Segmented
          options={[
            { value: "view", label: "Particulate view" },
            { value: "balance", label: "Balance practice" },
          ]}
          value={mode}
          onChange={(m) => setMode(m as "view" | "balance")}
          accent
          style={{ width: "100%" }}
        />
        {mode === "balance" && (
          <>
            <div className="tiny muted">
              Set coefficients so every element has the same count on both sides.
              Atoms are neither created nor destroyed — that's the whole game.
            </div>
            <Button size="sm" variant="outline" onClick={() => setRevealed(!revealed)}>
              {revealed ? "Hide answer" : "Reveal answer"}
            </Button>
          </>
        )}
      </ControlSection>

      {mode === "balance" && (
        <ControlSection title="Coefficients">
          {sides.map((side, i) => {
            const def = MOLECULE_MAP.get(side.molId)!;
            const isProduct = i >= reaction.reactants.length;
            return (
              <div key={side.molId + i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span className="tiny" style={{ color: "var(--text-1)", fontWeight: 600 }}>
                  {isProduct ? "→ " : ""}{def.name}
                </span>
                <span className="stepper">
                  <button onClick={() => setUserCoefs((c) => c.map((v, j) => (j === i ? Math.max(1, v - 1) : v)))} aria-label="decrease">−</button>
                  <span className="stepper-value">{revealed ? trueCoefs[i] : userCoefs[i]}</span>
                  <button onClick={() => setUserCoefs((c) => c.map((v, j) => (j === i ? Math.min(9, v + 1) : v)))} aria-label="increase">+</button>
                </span>
              </div>
            );
          })}
        </ControlSection>
      )}
    </>
  );

  const canvasPanel = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%", minHeight: 0 }}>
      <Panel title="Chemical Equation" bodyClassName="">
        <div style={{ textAlign: "center", padding: "14px 8px", fontSize: embedded ? 17 : 21, fontWeight: 700, color: "var(--text-0)" }}>
          {reaction.reactants.map((side, i) => {
            const def = MOLECULE_MAP.get(side.molId)!;
            const sp = analyzeSpecies(moleculeToSpecies(def));
            const coef = mode === "balance" && !revealed ? userCoefs[i] : side.coef;
            return (
              <React.Fragment key={side.molId}>
                {i > 0 && <span style={{ color: "var(--text-3)" }}> + </span>}
                <span style={{ color: coef === 1 ? "var(--text-3)" : "var(--accent)" }}>{coef === 1 ? "" : coef}</span>
                <ChemFormula parts={sp.formulaParts} />
              </React.Fragment>
            );
          })}
          <span style={{ color: "var(--text-2)", margin: "0 12px" }}>→</span>
          {reaction.products.map((side, i) => {
            const def = MOLECULE_MAP.get(side.molId)!;
            const sp = analyzeSpecies(moleculeToSpecies(def));
            const coef = mode === "balance" && !revealed ? userCoefs[reaction.reactants.length + i] : side.coef;
            return (
              <React.Fragment key={side.molId}>
                {i > 0 && <span style={{ color: "var(--text-3)" }}> + </span>}
                <span style={{ color: coef === 1 ? "var(--text-3)" : "var(--accent)" }}>{coef === 1 ? "" : coef}</span>
                <ChemFormula parts={sp.formulaParts} />
              </React.Fragment>
            );
          })}
        </div>
        {mode === "balance" && (
          <div style={{ textAlign: "center", paddingBottom: 10 }}>
            {balanced || revealed ? (
              <Badge tone={balanced ? "good" : "warn"}>{balanced ? "✓ balanced" : "answer shown"}</Badge>
            ) : (
              <Badge tone="bad">not balanced yet</Badge>
            )}
          </div>
        )}
      </Panel>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, minHeight: embedded ? 260 : 380 }}>
        <ParticulateBox
          title="Reactants"
          sides={reaction.reactants}
          coefs={userCoefs.slice(0, reaction.reactants.length)}
          embedded={embedded}
        />
        <div style={{ display: "flex", alignItems: "center", fontSize: 26, color: "var(--text-3)" }}>→</div>
        <ParticulateBox
          title="Products"
          sides={reaction.products}
          coefs={userCoefs.slice(reaction.reactants.length)}
          embedded={embedded}
        />
      </div>
    </div>
  );

  const rightPanel = (
    <>
      {mode === "balance" && (
        <Panel title="Atom Inventory" actions={balanced && !revealed ? <Badge tone="good">conserved ✓</Badge> : undefined}>
          {atomCounts.elements.map((el) => {
            const l = atomCounts.left.get(el) ?? 0;
            const r = atomCounts.right.get(el) ?? 0;
            return (
              <InfoRow key={el} label={el}>
                <span style={{ color: l === r ? "var(--good)" : "var(--bad)", fontWeight: 700 }}>
                  {l} → {r} {l === r ? "✓" : "✗"}
                </span>
              </InfoRow>
            );
          })}
          {balanced && !revealed && (
            <Callout tone="success" title="Balanced!" style={{ marginTop: 10 }}>
              Every element is conserved. The coefficients give the exact particle (and mole) ratios —
              the basis of all stoichiometry.
            </Callout>
          )}
        </Panel>
      )}

      <Panel title="About This Reaction">
        <Badge tone="violet">{reaction.type}</Badge>
        <div className="tiny" style={{ marginTop: 8, lineHeight: 1.65, color: "var(--text-1)" }}>
          {reaction.context}
        </div>
      </Panel>

      <Panel title="Reading the Particulate Boxes">
        <div className="tiny" style={{ lineHeight: 1.65, color: "var(--text-1)" }}>
          Each box shows {PARTICLES_PER_COEF} particles per coefficient unit — coefficients are particle
          ratios, so 2 H₂ + O₂ means every O₂ molecule needs two H₂ partners. In a real sample the
          numbers are ~10²³ times larger, but the ratio is identical. Mass is conserved because atom
          counts are conserved; moles of gas may change (2 + 1 → 2 here: 3 particles become 2).
        </div>
      </Panel>

      <Panel title="Reaction Types (Unit 4.7)">
        <InfoRow label="Synthesis">A + B → AB</InfoRow>
        <InfoRow label="Decomposition">AB → A + B</InfoRow>
        <InfoRow label="Combustion">fuel + O₂ → CO₂ + H₂O</InfoRow>
        <InfoRow label="Single replacement">A + BC → AC + B (redox)</InfoRow>
        <InfoRow label="Double replacement">AB + CD → AD + CB (often precipitation / acid–base)</InfoRow>
      </Panel>
    </>
  );

  return <SimLayout left={leftPanel} canvas={canvasPanel} right={rightPanel} embedded={embedded} />;
}

function ParticulateBox({
  title,
  sides,
  coefs,
  embedded,
}: {
  title: string;
  sides: ReactionSide[];
  coefs: number[];
  embedded?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
      <Viewport3D
        style={{ flex: 1, minHeight: embedded ? 240 : 320 }}
        hud={<Badge tone="accent">{title}</Badge>}
        hint={null}
      >
        <SceneCanvas cameraPosition={[0, 1, 10.5]} fov={46}>
          <Suspense fallback={null}>
            <BoxContents sides={sides} coefs={coefs} />
          </Suspense>
        </SceneCanvas>
      </Viewport3D>
    </div>
  );
}

function BoxContents({ sides, coefs }: { sides: ReactionSide[]; coefs: number[] }) {
  const placements = useMemo(() => {
    const out: Array<{ def: MoleculeDef; pos: [number, number, number]; rot: [number, number, number]; scale: number }> = [];
    let idx = 0;
    sides.forEach((side, si) => {
      const def = MOLECULE_MAP.get(side.molId)!;
      const coef = coefs[si] ?? 1;
      const n = Math.min(coef * PARTICLES_PER_COEF, 8);
      for (let k = 0; k < n; k++) {
        const golden = 2.399963;
        const angle = (idx * golden) % (Math.PI * 2);
        const radius = 1.3 + ((idx * 7) % 5) * 0.42;
        const y = ((idx * 13) % 7) * 0.5 - 1.5;
        out.push({
          def,
          pos: [Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.55],
          rot: [(idx * 0.7) % 3, (idx * 1.3) % 3, (idx * 0.4) % 3],
          scale: def.atoms.length > 5 ? 0.4 : def.atoms.length > 2 ? 0.52 : 0.62,
        });
        idx++;
      }
    });
    return out;
  }, [sides, coefs]);

  return (
    <group>
      {placements.map((p, i) => {
        const species = moleculeToSpecies(p.def);
        const analysis = analyzeSpecies(species);
        const layout = layout3D(species);
        return (
          <group key={i} position={p.pos} rotation={p.rot} scale={p.scale}>
            <MoleculeView species={species} analysis={analysis} layout={layout} showLabels={false} showLonePairs={false} interactive={false} />
          </group>
        );
      })}
    </group>
  );
}
