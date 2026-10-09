/**
 * Electron configuration engine.
 *
 * Generates ground-state configurations using the Aufbau principle with the
 * standard AP Chemistry exceptions (Cr, Cu, and a few others). Produces:
 *  - full spdf notation ("1s² 2s² 2p⁶ …")
 *  - noble-gas shorthand ("[Ne] 3s² …")
 *  - orbital box data (each orbital with its electron spins) for diagrams
 */

export interface Subshell {
  n: number;
  l: number; // 0=s, 1=p, 2=d, 3=f
  electrons: number;
  capacity: number;
}

export interface OrbitalBox {
  subshell: string; // e.g. "2p"
  orbitalIndex: number; // which orbital within the subshell
  label: string; // e.g. "2px"
  electrons: 0 | 1 | 2;
  spins: Array<"up" | "down">; // up first (Hund's rule)
}

const SUBSHELL_LETTER = ["s", "p", "d", "f"];
const SUBSHELL_CAPACITY = [2, 6, 10, 14];

/** Aufbau filling order by increasing (n + l), then n. */
const AUFBAU_ORDER: Array<[number, number]> = [
  [1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [4, 0], [3, 2], [4, 1],
  [5, 0], [4, 2], [5, 1], [6, 0], [4, 3], [5, 2], [6, 1], [7, 0],
  [5, 3], [6, 2], [7, 1],
];

/**
 * Observed ground-state exceptions taught at the AP level: half-filled and
 * fully-filled d subshells are extra stable, so one s electron is promoted.
 */
const EXCEPTIONS: Record<number, Array<[number, number, number]>> = {
  // z: [n, l, delta electrons] applied to the aufbau result
  24: [[4, 0, -1], [3, 2, 1]], // Cr: [Ar] 4s¹ 3d⁵
  29: [[4, 0, -1], [3, 2, 1]], // Cu: [Ar] 4s¹ 3d¹⁰
  42: [[5, 0, -1], [4, 2, 1]], // Mo
  47: [[5, 0, -1], [4, 2, 1]], // Ag
  79: [[6, 0, -1], [5, 2, 1]], // Au
};

export function subshellLabel(n: number, l: number): string {
  return `${n}${SUBSHELL_LETTER[l]}`;
}

const SUPERSCRIPTS: Record<number, string> = {
  0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹",
};

export function toSuperscript(n: number): string {
  return String(n)
    .split("")
    .map((d) => SUPERSCRIPTS[Number(d)])
    .join("");
}

/**
 * Fill `electronCount` electrons into subshells following Aufbau + Hund.
 * For ions of transition metals, electrons are *removed* from the highest-n
 * s subshell first (e.g. Fe²⁺ loses 4s before 3d) — handled by caller.
 */
export function aufbauFill(z: number, electronCount: number = z): Subshell[] {
  const filled = new Map<string, number>();
  let remaining = electronCount;

  for (const [n, l] of AUFBAU_ORDER) {
    if (remaining <= 0) break;
    const cap = SUBSHELL_CAPACITY[l];
    const put = Math.min(cap, remaining);
    filled.set(subshellLabel(n, l), put);
    remaining -= put;
  }

  // Apply known exceptions for neutral atoms (or near-neutral with full d shells)
  const ex = EXCEPTIONS[z];
  if (ex && electronCount === z) {
    for (const [n, l, delta] of ex) {
      const key = subshellLabel(n, l);
      filled.set(key, (filled.get(key) ?? 0) + delta);
    }
  }

  // Return in shell order (1s, 2s, 2p, 3s, ...) for display
  const result: Subshell[] = [];
  const entries = [...filled.entries()].filter(([, e]) => e > 0);
  entries.sort((a, b) => {
    const pa = parseLabel(a[0]);
    const pb = parseLabel(b[0]);
    return pa.n - pb.n || pa.l - pb.l;
  });
  for (const [label, electrons] of entries) {
    const { n, l } = parseLabel(label);
    result.push({ n, l, electrons, capacity: SUBSHELL_CAPACITY[l] });
  }
  return result;
}

function parseLabel(label: string): { n: number; l: number } {
  const n = Number(label[0]);
  const l = SUBSHELL_LETTER.indexOf(label[1]);
  return { n, l };
}

/** Full configuration string: "1s² 2s² 2p⁶ 3s¹" */
export function fullConfiguration(subshells: Subshell[]): string {
  return subshells
    .map((s) => `${subshellLabel(s.n, s.l)}${toSuperscript(s.electrons)}`)
    .join(" ");
}

const NOBLE_GASES = [
  { z: 2, symbol: "He" },
  { z: 10, symbol: "Ne" },
  { z: 18, symbol: "Ar" },
  { z: 36, symbol: "Kr" },
  { z: 54, symbol: "Xe" },
];

/** Noble-gas shorthand: "[Ne] 3s¹". Falls back to full notation for H/He. */
export function nobleGasConfiguration(
  z: number,
  electronCount: number = z
): string {
  const core = [...NOBLE_GASES].reverse().find((g) => g.z < z && g.z <= electronCount);
  const subs = aufbauFill(z, electronCount);
  if (!core) return fullConfiguration(subs);

  const coreSubs = new Set(
    aufbauFill(core.z, core.z).map((s) => subshellLabel(s.n, s.l))
  );
  const valence = subs.filter(
    (s) => !coreSubs.has(subshellLabel(s.n, s.l)) || s.electrons > 0
  );
  // Remove subshells fully contained in the core
  const outer = subs.filter((s) => {
    const label = subshellLabel(s.n, s.l);
    const coreCount = aufbauFill(core.z, core.z).find(
      (c) => subshellLabel(c.n, c.l) === label
    );
    return !coreCount || coreCount.electrons !== s.electrons;
  });
  void valence;
  return `[${core.symbol}] ${fullConfiguration(outer)}`.trim();
}

/** Orbital boxes for orbital diagrams, filled by Hund's rule. */
export function orbitalBoxes(subshells: Subshell[]): OrbitalBox[] {
  const boxes: OrbitalBox[] = [];
  const pLabels = ["x", "y", "z"];
  for (const s of subshells) {
    const label = subshellLabel(s.n, s.l);
    const orbitals = s.l === 0 ? 1 : s.l === 1 ? 3 : s.l === 2 ? 5 : 7;
    const spins: Array<Array<"up" | "down">> = Array.from(
      { length: orbitals },
      () => []
    );
    let e = s.electrons;
    // First pass: one up electron each (Hund)
    for (let i = 0; i < orbitals && e > 0; i++) {
      spins[i].push("up");
      e--;
    }
    // Second pass: pair with down electrons
    for (let i = 0; i < orbitals && e > 0; i++) {
      spins[i].push("down");
      e--;
    }
    for (let i = 0; i < orbitals; i++) {
      const name =
        s.l === 1 ? `${label}${pLabels[i]}` : `${label}${orbitals > 1 && s.l > 1 ? `(${i + 1})` : ""}`;
      boxes.push({
        subshell: label,
        orbitalIndex: i,
        label: name,
        electrons: spins[i].length as 0 | 1 | 2,
        spins: spins[i],
      });
    }
  }
  return boxes;
}

/**
 * Electrons removed first when forming cations: highest n first (s before d
 * of the previous shell). Returns the configuration of the ion.
 */
export function cationConfiguration(z: number, charge: number): Subshell[] {
  // charge is positive
  const subs = aufbauFill(z, z);
  let toRemove = charge;
  const adjusted = subs.map((s) => ({ ...s }));
  // Remove from highest n; within same n, remove from higher l? No — remove s before d.
  const order = [...adjusted].sort((a, b) => b.n - a.n || (b.l === 0 ? -1 : 1));
  for (const s of order) {
    if (toRemove <= 0) break;
    const remove = Math.min(s.electrons, toRemove);
    s.electrons -= remove;
    toRemove -= remove;
  }
  return adjusted.filter((s) => s.electrons > 0);
}

/** Bohr-model shell occupancies: [2, 8, 8, ...] electrons per principal level. */
export function bohrShells(electronCount: number): number[] {
  const capacities = [2, 8, 18, 32, 32, 18, 8];
  const shells: number[] = [];
  let remaining = electronCount;
  for (const cap of capacities) {
    if (remaining <= 0) break;
    const put = Math.min(cap, remaining);
    shells.push(put);
    remaining -= put;
  }
  return shells;
}

/** Number of valence electrons for main-group elements (by group). */
export function mainGroupValence(z: number): number {
  const el = getGroupForZ(z);
  if (el === 18) return z === 2 ? 2 : 8;
  return el >= 13 ? el - 10 : el;
}

function getGroupForZ(z: number): number {
  // lightweight group lookup consistent with elements.ts
  const groups: Record<number, number> = {};
  // H–He
  groups[1] = 1; groups[2] = 18;
  for (const zz of [3, 11, 19, 37, 55]) groups[zz] = 1;
  for (const zz of [4, 12, 20, 38, 56]) groups[zz] = 2;
  for (let zz = 5; zz <= 10; zz++) groups[zz] = zz + 8; // B..Ne → 13..18
  for (let zz = 13; zz <= 18; zz++) groups[zz] = zz - 0; // Al..Ar → 13..18
  for (let zz = 31; zz <= 36; zz++) groups[zz] = zz - 18; // Ga..Kr → 13..18
  for (let zz = 49; zz <= 54; zz++) groups[zz] = zz - 36; // In..Xe → 13..18
  for (let zz = 21; zz <= 30; zz++) groups[zz] = zz - 18; // Sc..Zn → 3..12
  for (let zz = 39; zz <= 48; zz++) groups[zz] = zz - 36; // Y..Cd → 3..12
  return groups[z] ?? 0;
}
