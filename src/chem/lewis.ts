/**
 * Lewis structure engine.
 *
 * A "Species" is a molecular graph: atoms, bonds (with order), and a net
 * charge. From that graph we compute:
 *   - total / bonding / lone valence electrons
 *   - lone pairs and formal charges per atom
 *   - steric numbers and VSEPR geometries
 *   - chemical-validity issues (octet violations, impossible bonds, …)
 *   - the molecular formula and molar mass
 *
 * The electron bookkeeping follows the standard AP approach:
 *   formal charge = valence e⁻ − lone e⁻ − bonding e⁻/2
 * and lone pairs are distributed so every atom reaches an octet (duet for H)
 * when the electron count allows it.
 */

import {
  ElementData,
  canExpandOctet,
  getElement,
  hasElement,
  typicalMaxBonds,
} from "./elements";
import { VSEPRGeometry, vseprGeometry } from "./vsepr";

export interface SpeciesAtom {
  id: string;
  element: string; // symbol
}

export interface SpeciesBond {
  id: string;
  a: string;
  b: string;
  order: 1 | 2 | 3;
}

export interface Species {
  atoms: SpeciesAtom[];
  bonds: SpeciesBond[];
  charge: number;
}

export interface AtomAnalysis {
  id: string;
  element: ElementData;
  bondedIds: string[];
  bondOrders: number;
  loneElectrons: number;
  lonePairs: number;
  unpairedElectron: boolean;
  formalCharge: number;
  stericNumber: number;
  octetStatus: "duet" | "octet" | "incomplete" | "expanded" | "overfilled";
  geometry: VSEPRGeometry | null;
}

export interface ValidationIssue {
  severity: "error" | "warning" | "info";
  message: string;
  atomIds: string[];
}

export interface FormulaPart {
  text: string;
  sub?: number;
  sup?: string;
}

export interface SpeciesAnalysis {
  totalValenceElectrons: number;
  bondingElectrons: number;
  loneElectrons: number;
  atoms: AtomAnalysis[];
  byId: Map<string, AtomAnalysis>;
  netFormalCharge: number;
  issues: ValidationIssue[];
  formula: string; // plain unicode: "H₂O"
  formulaParts: FormulaPart[];
  chargeLabel: string; // "", "+", "2−" …
  molarMass: number;
  centralAtomId: string | null;
  centralGeometry: VSEPRGeometry | null;
  connected: boolean;
  isRadical: boolean;
  bondCount: number;
}

export function emptySpecies(): Species {
  return { atoms: [], bonds: [], charge: 0 };
}

let counter = 0;
export function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

/** Adjacency: atom id → list of { neighborId, bondId, order }. */
export function adjacency(species: Species): Map<string, Array<{ id: string; bondId: string; order: number }>> {
  const adj = new Map<string, Array<{ id: string; bondId: string; order: number }>>();
  for (const a of species.atoms) adj.set(a.id, []);
  for (const b of species.bonds) {
    adj.get(b.a)?.push({ id: b.b, bondId: b.id, order: b.order });
    adj.get(b.b)?.push({ id: b.a, bondId: b.id, order: b.order });
  }
  return adj;
}

export function analyzeSpecies(species: Species): SpeciesAnalysis {
  const adj = adjacency(species);
  const totalValence =
    species.atoms.reduce((s, a) => s + valenceOf(a.element), 0) - species.charge;
  const bondingElectrons = species.bonds.reduce((s, b) => s + b.order * 2, 0);
  let loneBudget = Math.max(0, totalValence - bondingElectrons);

  // First pass: give every atom enough lone electrons to reach duet/octet.
  // Atoms are served in decreasing electronegativity order — the standard
  // Lewis convention (the greediest atom completes its octet first).
  const loneMap = new Map<string, number>();
  const atomsSorted = [...species.atoms].sort(
    (x, y) => (getElement(y.element).en ?? 0) - (getElement(x.element).en ?? 0)
  );
  for (const a of atomsSorted) {
    const el = getElement(a.element);
    const bondOrders = (adj.get(a.id) ?? []).reduce((s, n) => s + n.order, 0);
    // Each bond contributes 2 shared electrons to the atom's octet count.
    const target = el.symbol === "H" ? 2 : 8;
    const needed = Math.max(0, target - 2 * bondOrders);
    const give = Math.min(needed, loneBudget);
    loneMap.set(a.id, give);
    loneBudget -= give;
  }
  // Leftover electrons go to atoms that can expand their octet
  // (lowest electronegativity first — typically the central atom).
  if (loneBudget > 0) {
    const expandable = atomsSorted
      .filter((a) => canExpandOctet(getElement(a.element)))
      .sort(
        (x, y) =>
          (getElement(x.element).en ?? 99) - (getElement(y.element).en ?? 99)
      );
    for (const a of expandable) {
      if (loneBudget <= 0) break;
      const add = Math.min(loneBudget, 4); // up to 2 extra pairs
      loneMap.set(a.id, (loneMap.get(a.id) ?? 0) + add);
      loneBudget -= add;
    }
  }

  const atoms: AtomAnalysis[] = species.atoms.map((a) => {
    const el = getElement(a.element);
    const neighbors = adj.get(a.id) ?? [];
    const bondOrders = neighbors.reduce((s, n) => s + n.order, 0);
    const loneElectrons = loneMap.get(a.id) ?? 0;
    const lonePairs = Math.floor(loneElectrons / 2);
    const unpairedElectron = loneElectrons % 2 === 1;
    const formalCharge = el.valenceElectrons - loneElectrons - bondOrders;
    const lpGroups = lonePairs + (unpairedElectron ? 1 : 0);
    const stericNumber = neighbors.length + lpGroups;
    // Electrons "around" the atom: 2 per bond order (shared) + lone electrons.
    const total = 2 * bondOrders + loneElectrons;
    let octetStatus: AtomAnalysis["octetStatus"];
    if (el.symbol === "H") octetStatus = total >= 2 ? "duet" : "incomplete";
    else if (total === 8) octetStatus = "octet";
    else if (total > 8)
      octetStatus = canExpandOctet(el) ? "expanded" : "overfilled";
    else octetStatus = "incomplete";
    return {
      id: a.id,
      element: el,
      bondedIds: neighbors.map((n) => n.id),
      bondOrders,
      loneElectrons,
      lonePairs,
      unpairedElectron,
      formalCharge,
      stericNumber,
      octetStatus,
      geometry:
        stericNumber >= 1 ? vseprGeometry(Math.min(stericNumber, 6), Math.min(lpGroups, stericNumber - 1)) : null,
    };
  });

  const byId = new Map(atoms.map((a) => [a.id, a]));
  const netFormalCharge = atoms.reduce((s, a) => s + a.formalCharge, 0);
  const loneElectrons = atoms.reduce((s, a) => s + a.loneElectrons, 0);

  // Central atom: most bonds; ties → lowest electronegativity; never H.
  let central: AtomAnalysis | null = null;
  for (const a of atoms) {
    if (a.element.symbol === "H") continue;
    if (
      !central ||
      a.bondedIds.length > central.bondedIds.length ||
      (a.bondedIds.length === central.bondedIds.length &&
        (a.element.en ?? 99) < (central.element.en ?? 99))
    ) {
      central = a;
    }
  }
  if (!central && atoms.length > 0) central = atoms[0];

  const issues = validate(species, atoms, byId, netFormalCharge, loneBudget);
  const { formula, formulaParts, chargeLabel } = buildFormula(species);
  const molarMass = species.atoms.reduce(
    (s, a) => s + getElement(a.element).mass,
    0
  );
  const connected = isConnected(species, adj);
  const isRadical =
    (totalValence % 2 !== 0) || atoms.some((a) => a.unpairedElectron);

  return {
    totalValenceElectrons: totalValence,
    bondingElectrons,
    loneElectrons,
    atoms,
    byId,
    netFormalCharge,
    issues,
    formula,
    formulaParts,
    chargeLabel,
    molarMass,
    centralAtomId: central?.id ?? null,
    centralGeometry: central?.geometry ?? null,
    connected,
    isRadical,
    bondCount: species.bonds.length,
  };
}

function valenceOf(symbol: string): number {
  const el = getElement(symbol);
  // For main group, valence electrons. Transition metals use their s+d count.
  return el.valenceElectrons;
}

function isConnected(
  species: Species,
  adj: Map<string, Array<{ id: string; bondId: string; order: number }>>
): boolean {
  if (species.atoms.length <= 1) return true;
  const seen = new Set<string>();
  const stack = [species.atoms[0].id];
  seen.add(species.atoms[0].id);
  while (stack.length) {
    const cur = stack.pop()!;
    for (const n of adj.get(cur) ?? []) {
      if (!seen.has(n.id)) {
        seen.add(n.id);
        stack.push(n.id);
      }
    }
  }
  return seen.size === species.atoms.length;
}

function validate(
  species: Species,
  atoms: AtomAnalysis[],
  _byId: Map<string, AtomAnalysis>,
  netFormalCharge: number,
  leftoverElectrons: number
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (species.atoms.length === 0) return issues;

  if (!isConnected(species, adjacency(species)) && species.atoms.length > 1) {
    issues.push({
      severity: "warning",
      message:
        "Some atoms are not bonded to the rest of the structure. A single chemical species must be connected — separate fragments represent a mixture, not one molecule.",
      atomIds: [],
    });
  }

  for (const a of atoms) {
    const el = a.element;
    if (el.symbol === "H" && a.bondOrders > 1) {
      issues.push({
        severity: "error",
        message: `Hydrogen (${a.id}) has ${a.bondOrders} bonds. Hydrogen has only one electron to share, so it can form exactly one bond (the duet rule).`,
        atomIds: [a.id],
      });
    }
    if (a.bondOrders > typicalMaxBonds(el) && !(el.symbol === "H")) {
      issues.push({
        severity: "error",
        message: `${el.name} has ${a.bondOrders} bonds, more than its typical maximum of ${typicalMaxBonds(el)}. Check the bond orders.`,
        atomIds: [a.id],
      });
    }
    if (a.octetStatus === "overfilled") {
      issues.push({
        severity: "error",
        message: `${el.name} has ${a.bondOrders + a.loneElectrons} electrons around it. Period-2 elements (n = 2) have no d orbitals, so they can never exceed an octet.`,
        atomIds: [a.id],
      });
    }
    if (
      a.octetStatus === "incomplete" &&
      el.symbol !== "H" &&
      a.bondedIds.length > 0
    ) {
      const okDeficient =
        el.symbol === "B" || el.symbol === "Be" || el.symbol === "Al";
      issues.push({
        severity: okDeficient ? "info" : "warning",
        message: okDeficient
          ? `${el.name} has only ${2 * a.bondOrders + a.loneElectrons} valence electrons around it. Boron and beryllium are commonly electron-deficient (e.g. BF₃), so this can be valid — but it makes the atom a strong Lewis acid.`
          : `${el.name} has only ${2 * a.bondOrders + a.loneElectrons} of 8 valence electrons around it. Consider adding bonds or lone pairs, unless this is an intentional electron-deficient structure.`,
        atomIds: [a.id],
      });
    }
    if (a.octetStatus === "expanded") {
      issues.push({
        severity: "info",
        message: `${el.name} has an expanded octet (${2 * a.bondOrders + a.loneElectrons} electrons around it). This is allowed because it is in period ${el.period} or lower, where d orbitals are available for bonding.`,
        atomIds: [a.id],
      });
    }
    if (Math.abs(a.formalCharge) > 1) {
      issues.push({
        severity: "warning",
        message: `${el.name} carries a formal charge of ${formatSigned(a.formalCharge)}. Large formal charges are usually a sign that a multiple bond would give a better structure.`,
        atomIds: [a.id],
      });
    }
    if (el.symbol === "F" && a.bondOrders > 1) {
      issues.push({
        severity: "error",
        message: "Fluorine never forms double bonds in ordinary structures — it is the most electronegative element and holds its electrons too tightly.",
        atomIds: [a.id],
      });
    }
  }

  if (netFormalCharge !== species.charge) {
    issues.push({
      severity: "error",
      message: `The formal charges sum to ${formatSigned(netFormalCharge)} but the species charge is set to ${formatSigned(species.charge)}. These must match — adjust bonds, lone pairs, or the charge.`,
      atomIds: [],
    });
  }
  if (leftoverElectrons > 0) {
    issues.push({
      severity: "warning",
      message: `${leftoverElectrons} valence electron${leftoverElectrons === 1 ? "" : "s"} could not be placed: every atom already has an octet and no atom here can expand beyond one. Remove bonds/electrons or check the charge.`,
      atomIds: [],
    });
  }

  // Adjacent atoms both positive formal charge → suspicious
  const pos = atoms.filter((a) => a.formalCharge > 0);
  if (pos.length > 1) {
    issues.push({
      severity: "warning",
      message: "Multiple atoms carry positive formal charges at once. Good Lewis structures minimize and separate formal charges.",
      atomIds: pos.map((a) => a.id),
    });
  }

  return issues;
}

export function formatSigned(n: number): string {
  if (n === 0) return "0";
  return n > 0 ? `+${n}` : `−${Math.abs(n)}`;
}

/** Hill-notation formula (C first, then H, then alphabetical). */
export function buildFormula(species: Species): {
  formula: string;
  formulaParts: FormulaPart[];
  chargeLabel: string;
} {
  const counts = new Map<string, number>();
  for (const a of species.atoms) {
    counts.set(a.element, (counts.get(a.element) ?? 0) + 1);
  }
  let symbols = [...counts.keys()];
  if (counts.has("C")) {
    symbols.sort((x, y) => {
      if (x === "C") return -1;
      if (y === "C") return 1;
      if (x === "H") return -1;
      if (y === "H") return 1;
      return x.localeCompare(y);
    });
  } else {
    symbols.sort((x, y) => x.localeCompare(y));
  }

  const SUBS = "₀₁₂₃₄₅₆₇₈₉";
  const toSub = (n: number) =>
    String(n)
      .split("")
      .map((d) => SUBS[Number(d)])
      .join("");

  const parts: FormulaPart[] = symbols.map((s) => ({
    text: s,
    sub: counts.get(s)! > 1 ? counts.get(s)! : undefined,
  }));

  let chargeLabel = "";
  if (species.charge !== 0) {
    const abs = Math.abs(species.charge);
    const sign = species.charge > 0 ? "+" : "−";
    chargeLabel = abs === 1 ? sign : `${abs}${sign}`;
    parts.push({ text: "", sup: chargeLabel });
  }

  const formula =
    symbols
      .map((s) => `${s}${counts.get(s)! > 1 ? toSub(counts.get(s)!) : ""}`)
      .join("") + chargeSup(chargeLabel);

  return { formula, formulaParts: parts, chargeLabel };
}

function chargeSup(label: string): string {
  const map: Record<string, string> = {
    "+": "⁺", "−": "⁻", "2+": "²⁺", "2−": "²⁻", "3+": "³⁺", "3−": "³⁻",
    "4+": "⁴⁺", "4−": "⁴⁻",
  };
  return map[label] ?? label;
}

/**
 * Improve a Lewis structure by converting lone pairs into multiple bonds to
 * minimize formal charges. Returns a new Species (or null if nothing to do).
 *
 * Example: carbonate drawn with three C–O single bonds gives C(+… no: each O
 * would be −1 and C +1); upgrading one bond to C=O leaves O=, two O⁻ and C 0.
 */
export function minimizeFormalCharges(species: Species): {
  species: Species;
  changed: boolean;
  explanation: string[];
} {
  let current: Species = {
    ...species,
    atoms: species.atoms.map((a) => ({ ...a })),
    bonds: species.bonds.map((b) => ({ ...b })),
  };
  const explanation: string[] = [];
  let changed = false;

  for (let iter = 0; iter < 8; iter++) {
    const analysis = analyzeSpecies(current);
    const positive = analysis.atoms.find(
      (a) => a.formalCharge > 0 && a.element.symbol !== "H"
    );
    if (!positive) break;

    // Find a neighbor with lone pairs that could donate a bond
    const donor = analysis.atoms.find(
      (n) =>
        positive.bondedIds.includes(n.id) &&
        n.lonePairs >= 1 &&
        n.formalCharge <= 0 &&
        n.element.symbol !== "H" &&
        n.element.symbol !== "F"
    );
    if (!donor) break;

    const bond = current.bonds.find(
      (b) =>
        b.order < 3 &&
        ((b.a === positive.id && b.b === donor.id) ||
          (b.a === donor.id && b.b === positive.id))
    );
    if (!bond) break;

    // A positive atom that already has a full octet cannot accept another
    // shared pair unless it can expand its octet (period 3+).
    const posEl = positive.element;
    if (positive.octetStatus === "octet" && !canExpandOctet(posEl)) break;
    if (bond.order >= 3) break;

    current = {
      ...current,
      bonds: current.bonds.map((b) =>
        b.id === bond.id ? { ...b, order: (b.order + 1) as 1 | 2 | 3 } : b
      ),
    };
    changed = true;
    explanation.push(
      `Converted the ${posEl.symbol}–${donor.element.symbol} single bond to a ${
        bond.order + 1 === 2 ? "double" : "triple"
      } bond: a lone pair from ${donor.element.symbol} is shared with the electron-deficient ${posEl.symbol}, reducing formal charges.`
    );
  }

  return { species: current, changed, explanation };
}

/**
 * Build a Species from a preset definition (symbol strings) — used by the
 * molecule library and lesson embeds.
 */
export function speciesFrom(
  atoms: Array<{ id: string; element: string }>,
  bonds: Array<[string, string, number]>,
  charge = 0
): Species {
  return {
    atoms: atoms.map((a) => ({ id: a.id, element: a.element })),
    bonds: bonds.map(([a, b, order]) => ({
      id: `${a}~${b}`,
      a,
      b,
      order: order as 1 | 2 | 3,
    })),
    charge,
  };
}

/** Parse a simple formula like "H2O", "Ca(OH)2", "SO4^2-" into element counts. */
export function parseFormula(input: string): Map<string, number> | null {
  const cleaned = input.replace(/\s/g, "").replace(/−/g, "-");
  const re = /^([A-Z][a-z]?)(\d*)/g;
  const counts = new Map<string, number>();
  // Handle parentheses
  if (/[()]/.test(cleaned)) {
    const parenRe = /\(([^)]+)\)(\d*)/g;
    let s = cleaned;
    s = s.replace(parenRe, (_m, inner: string, mult: string) => {
      const n = mult ? Number(mult) : 1;
      const parts: string[] = [];
      inner.replace(re, (_m2, sym: string, cnt: string) => {
        if (sym) parts.push(`${sym}${(cnt ? Number(cnt) : 1) * n}`);
        return "";
      });
      return parts.join("");
    });
    return parseFormula(s);
  }
  let m: RegExpExecArray | null;
  let consumed = 0;
  const stripped = cleaned.replace(/\^?\d*[+-]$/, "");
  while ((m = re.exec(stripped)) !== null) {
    if (!m[1]) break;
    consumed += m[0].length;
    counts.set(m[1], (counts.get(m[1]) ?? 0) + (m[2] ? Number(m[2]) : 1));
    if (!hasElement(m[1])) return null;
  }
  if (consumed !== stripped.length) return null;
  return counts;
}
