/**
 * Bonding & polarity engine.
 *
 * - Bond character classification from electronegativity difference (ΔEN)
 * - Percent ionic character (Hannay–Smyth approximation)
 * - Bond dipole vectors and molecular dipole (vector sum) from 3D geometry
 * - Intermolecular-force prediction for a species
 * - Hybridization from steric number
 * - Morse potential for bond-energy curves
 */

import { getElement } from "./elements";
import { SpeciesAnalysis, Species } from "./lewis";
import { Vec3 } from "./vsepr";
import { Layout3DResult } from "./layout";

export type BondCharacter = "nonpolar covalent" | "polar covalent" | "ionic";

export interface BondCharacterResult {
  deltaEN: number;
  character: BondCharacter;
  percentIonic: number;
  explanation: string;
}

export function classifyBond(enA: number | null, enB: number | null): BondCharacterResult {
  const a = enA ?? 0;
  const b = enB ?? 0;
  const delta = Math.abs(a - b);
  // Hannay–Smyth: %ionic = 100(1 − e^(−(ΔEN)²/4))
  const percentIonic = 100 * (1 - Math.exp(-(delta * delta) / 4));

  let character: BondCharacter;
  let explanation: string;
  if (delta < 0.4) {
    character = "nonpolar covalent";
    explanation =
      "Electrons are shared essentially equally — the electronegativity difference is too small (< 0.4) to pull the pair toward either atom.";
  } else if (delta < 1.7) {
    character = "polar covalent";
    explanation =
      "The more electronegative atom pulls the shared electrons closer, creating partial charges (δ+/δ−) — but no full electron transfer occurs.";
  } else {
    character = "ionic";
    explanation =
      "The electronegativity difference is large enough (≥ 1.7) that the electron pair is effectively transferred, producing cations and anions held together by electrostatic attraction.";
  }
  return { deltaEN: delta, character, percentIonic, explanation };
}

export function hybridization(stericNumber: number): string {
  switch (stericNumber) {
    case 2: return "sp";
    case 3: return "sp²";
    case 4: return "sp³";
    case 5: return "sp³d";
    case 6: return "sp³d²";
    default: return "—";
  }
}

export interface BondDipole {
  bondId: string;
  from: Vec3; // δ+ end position
  to: Vec3; // δ− end position
  vector: Vec3; // points δ+ → δ−
  magnitude: number; // scaled by ΔEN
  deltaEN: number;
  symbols: [string, string]; // [δ+ element, δ− element]
}

export interface DipoleResult {
  bondDipoles: BondDipole[];
  lonePairContributions: Vec3[];
  netVector: Vec3;
  netMagnitude: number;
  polar: boolean;
  explanation: string;
}

const LONE_PAIR_DIPOLE = 0.55; // schematic magnitude of a lone-pair dipole

/**
 * Compute bond dipoles and the net molecular dipole from a laid-out species.
 * Magnitudes are schematic (proportional to ΔEN), not debyes — this is a
 * vector model for reasoning about cancellation, not a quantum calculation.
 */
export function computeDipole(
  species: Species,
  analysis: SpeciesAnalysis,
  layout: Layout3DResult
): DipoleResult {
  const bondDipoles: BondDipole[] = [];
  let net: Vec3 = [0, 0, 0];

  for (const bond of species.bonds) {
    const a = analysis.byId.get(bond.a);
    const b = analysis.byId.get(bond.b);
    if (!a || !b) continue;
    const pa = layout.positions.get(bond.a)!;
    const pb = layout.positions.get(bond.b)!;
    const enA = a.element.en ?? 0;
    const enB = b.element.en ?? 0;
    const delta = Math.abs(enA - enB);
    if (delta < 0.05) continue; // nonpolar bond, no dipole
    const moreEN = enA >= enB ? a : b;
    const lessEN = enA >= enB ? b : a;
    const from = layout.positions.get(lessEN.id)!;
    const to = layout.positions.get(moreEN.id)!;
    const dir: Vec3 = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];
    const len = Math.hypot(...dir) || 1;
    const unit: Vec3 = [dir[0] / len, dir[1] / len, dir[2] / len];
    const magnitude = delta * bond.order * 0.5;
    const scaled: Vec3 = [unit[0] * magnitude, unit[1] * magnitude, unit[2] * magnitude];
    bondDipoles.push({
      bondId: bond.id,
      from,
      to,
      vector: scaled,
      magnitude,
      deltaEN: delta,
      symbols: [lessEN.element.symbol, moreEN.element.symbol],
    });
    net = [net[0] + scaled[0], net[1] + scaled[1], net[2] + scaled[2]];
  }

  // Lone pairs contribute to the dipole (crucial: NH₃ vs NF₃, H₂O).
  const lonePairContributions: Vec3[] = [];
  for (const lp of layout.lonePairs) {
    const atom = analysis.byId.get(lp.atomId);
    if (!atom || atom.element.symbol === "H") continue;
    const c: Vec3 = [
      lp.dir[0] * LONE_PAIR_DIPOLE,
      lp.dir[1] * LONE_PAIR_DIPOLE,
      lp.dir[2] * LONE_PAIR_DIPOLE,
    ];
    lonePairContributions.push(c);
    net = [net[0] + c[0], net[1] + c[1], net[2] + c[2]];
  }

  const netMagnitude = Math.hypot(...net);
  const polar = netMagnitude > 0.18;

  let explanation: string;
  if (bondDipoles.length === 0 && lonePairContributions.length === 0) {
    explanation =
      "No polar bonds and no lone pairs: electron density is symmetric, so the molecule is nonpolar.";
  } else if (!polar) {
    explanation =
      "The individual bond dipoles are equal in strength and arranged symmetrically, so as vectors they cancel exactly (net dipole ≈ 0). A molecule can have polar bonds and still be nonpolar!";
  } else {
    explanation =
      "The bond dipoles do not cancel — either the bonds differ in polarity or the geometry (often due to lone pairs) is asymmetric. The molecule has a net dipole and is polar.";
  }

  return { bondDipoles, lonePairContributions, netVector: net, netMagnitude, polar, explanation };
}

export type IMFType =
  | "London dispersion"
  | "dipole–dipole"
  | "hydrogen bonding"
  | "ion–dipole"
  | "ionic (lattice)";

export interface IMFPrediction {
  forces: Array<{ type: IMFType; strength: "weak" | "moderate" | "strong"; why: string }>;
  dominant: IMFType;
  hasHBondDonor: boolean;
}

/** Predict the intermolecular forces between particles of this species. */
export function predictIMF(
  species: Species,
  analysis: SpeciesAnalysis,
  dipole: DipoleResult
): IMFPrediction {
  const forces: IMFPrediction["forces"] = [];

  // Single ions → ionic lattice context
  if (species.atoms.length === 1 && species.charge !== 0) {
    forces.push({
      type: "ionic (lattice)",
      strength: "strong",
      why: "Isolated ions assemble into lattices held by strong, non-directional electrostatic forces (Coulomb's law).",
    });
    return { forces, dominant: "ionic (lattice)", hasHBondDonor: false };
  }

  // H bonded to N, O, or F?
  const donors = species.bonds.filter((b) => {
    const a = analysis.byId.get(b.a)!;
    const c = analysis.byId.get(b.b)!;
    const pair = [a.element.symbol, c.element.symbol];
    return pair.includes("H") && (pair.includes("N") || pair.includes("O") || pair.includes("F"));
  });
  const hasHBondDonor = donors.length > 0;

  forces.push({
    type: "London dispersion",
    strength: analysis.molarMass > 150 ? "moderate" : "weak",
    why: "All particles have LDFs — instantaneous fluctuations in electron density induce temporary dipoles. Strength grows with molar mass / polarizability.",
  });

  if (dipole.polar) {
    forces.push({
      type: "dipole–dipole",
      strength: "moderate",
      why: `The molecule has a permanent net dipole (relative magnitude ≈ ${dipole.netMagnitude.toFixed(2)}), so positive ends attract negative ends between neighboring molecules.`,
    });
  }

  if (hasHBondDonor) {
    const atoms = species.atoms.map((a) => a.element).join("");
    const acceptor = ["N", "O", "F"].some((s) => atoms.includes(s));
    if (acceptor) {
      forces.push({
        type: "hydrogen bonding",
        strength: "strong",
        why: "H is covalently bonded to N, O, or F, and lone pairs on N/O/F are available on neighbors — the strong, directional dipole–dipole attraction we call hydrogen bonding.",
      });
    }
  }

  const rank: Record<IMFType, number> = {
    "London dispersion": 0,
    "ion–dipole": 1,
    "dipole–dipole": 2,
    "hydrogen bonding": 3,
    "ionic (lattice)": 4,
  };
  const dominant = [...forces].sort((a, b) => rank[b.type] - rank[a.type])[0].type;
  return { forces, dominant, hasHBondDonor };
}

/** Morse potential: bond energy vs internuclear distance (schematic). */
export function morseEnergy(
  r: number,
  re: number,
  De: number,
  a = 1.8
): number {
  const t = 1 - Math.exp(-a * (r - re));
  return De * t * t - De;
}

/** Bond order → relative strength/length messaging for a pair of elements. */
export function bondMetrics(symA: string, symB: string, order: number) {
  const a = getElement(symA);
  const b = getElement(symB);
  const single = a.rCov + b.rCov;
  // Empirical shrink per bond order
  const length = single - (order - 1) * 0.13 * Math.min(a.rCov, b.rCov) * 2;
  const strengthFactor = order === 1 ? 1 : order === 2 ? 1.7 : 2.3;
  return { length, strengthFactor };
}
