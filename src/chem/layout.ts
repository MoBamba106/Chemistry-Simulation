/**
 * Structure layout engine.
 *
 * Converts a molecular graph (Species) into 3D coordinates using VSEPR
 * direction templates, and into 2D coordinates for Lewis-diagram drawings.
 *
 * The approach is recursive template placement followed by a light
 * relaxation pass:
 *  1. Root the graph at the central atom.
 *  2. For each atom, orient its ideal VSEPR geometry so the bond to its
 *     parent points back at the parent, then place unvisited children in
 *     the remaining direction slots.
 *  3. Relax non-bonded clashes while preserving bond lengths.
 *
 * This produces chemically sensible shapes for the small molecules that
 * dominate AP Chemistry (it is not a full force field — nor does it pretend
 * to be).
 */

import { Species, adjacency, analyzeSpecies } from "./lewis";
import { Vec3, vseprGeometry } from "./vsepr";
import { getElement } from "./elements";

export interface LonePairPlacement {
  atomId: string;
  dir: Vec3; // unit vector from atom toward lone pair
}

export interface Layout3DResult {
  positions: Map<string, Vec3>;
  lonePairs: LonePairPlacement[];
  bondLengths: Map<string, number>; // bondId → length
}

export function bondLength(symA: string, symB: string): number {
  const a = getElement(symA);
  const b = getElement(symB);
  return a.rCov + b.rCov;
}

const DEG = Math.PI / 180;

/** Rotation that maps unit vector u onto unit vector v. */
function rotationBetween(u: Vec3, v: Vec3): (d: Vec3) => Vec3 {
  const dot = clamp(u[0] * v[0] + u[1] * v[1] + u[2] * v[2], -1, 1);
  if (dot > 0.999999) return (d) => [...d] as Vec3;
  if (dot < -0.999999) {
    // 180°: rotate around any perpendicular axis
    const axis: Vec3 = Math.abs(u[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    const perp = normalize(cross(u, axis));
    return (d) => rotateAround(d, perp, Math.PI);
  }
  const axis = normalize(cross(u, v));
  const angle = Math.acos(dot);
  return (d) => rotateAround(d, axis, angle);
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function normalize(a: Vec3): Vec3 {
  const m = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / m, a[1] / m, a[2] / m];
}

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

/** Rodrigues rotation. */
function rotateAround(v: Vec3, axis: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const k = axis;
  const kd = k[0] * v[0] + k[1] * v[1] + k[2] * v[2];
  const kv = cross(k, v);
  return [
    v[0] * c + kv[0] * s + k[0] * kd * (1 - c),
    v[1] * c + kv[1] * s + k[1] * kd * (1 - c),
    v[2] * c + kv[2] * s + k[2] * kd * (1 - c),
  ];
}

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function scale(a: Vec3, s: number): Vec3 {
  return [a[0] * s, a[1] * s, a[2] * s];
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function dist(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

export function layout3D(species: Species): Layout3DResult {
  const analysis = analyzeSpecies(species);
  const adj = adjacency(species);
  const positions = new Map<string, Vec3>();
  const lonePairs: LonePairPlacement[] = [];
  const bondLengths = new Map<string, number>();

  if (species.atoms.length === 0) {
    return { positions, lonePairs, bondLengths };
  }
  if (species.atoms.length === 1) {
    positions.set(species.atoms[0].id, [0, 0, 0]);
    const a = analysis.byId.get(species.atoms[0].id)!;
    const g = vseprGeometry(
      Math.max(2, Math.min(6, a.stericNumber)),
      Math.min(a.lonePairs + (a.unpairedElectron ? 1 : 0), Math.max(0, Math.min(6, a.stericNumber) - 0))
    );
    // Distribute lone pairs evenly around a lone atom
    const n = a.lonePairs;
    for (let i = 0; i < n; i++) {
      const phi = (i / Math.max(1, n)) * Math.PI * 2;
      lonePairs.push({ atomId: a.id, dir: normalize([Math.cos(phi), Math.sin(phi), 0]) });
    }
    void g;
    return { positions, lonePairs, bondLengths };
  }

  const rootId = analysis.centralAtomId ?? species.atoms[0].id;

  // BFS placement
  const visited = new Set<string>([rootId]);
  positions.set(rootId, [0, 0, 0]);
  const queue: Array<{ id: string; parentDir: Vec3 | null }> = [
    { id: rootId, parentDir: null },
  ];

  while (queue.length) {
    const { id, parentDir } = queue.shift()!;
    const atom = analysis.byId.get(id)!;
    const neighbors = adj.get(id) ?? [];
    const lpCount = atom.lonePairs + (atom.unpairedElectron ? 1 : 0);
    const sn = Math.max(neighbors.length + lpCount, neighbors.length);
    const geom = vseprGeometry(Math.min(Math.max(sn, 2), 6), Math.min(lpCount, Math.max(0, Math.min(sn, 6) - neighbors.length)));

    const here = positions.get(id)!;
    const children = neighbors.filter((n) => !visited.has(n.id));
    const parent = neighbors.find((n) => visited.has(n.id) && n.id !== id);

    let bondedDirs: Vec3[] = [];
    let lpDirs: Vec3[] = [];

    if (geom) {
      bondedDirs = geom.bondedDirs.map((d) => [...d] as Vec3);
      lpDirs = geom.lonePairDirs.map((d) => [...d] as Vec3);
    } else {
      bondedDirs = neighbors.map((_, i) => {
        const phi = (i / Math.max(1, neighbors.length)) * Math.PI * 2;
        return normalize([Math.cos(phi), Math.sin(phi), 0]);
      });
      lpDirs = [];
    }

    // If we have a parent, orient: one bonded slot must point toward the parent.
    if (parentDir) {
      // parentDir points from this atom toward its parent
      const toParent = normalize(parentDir);
      // Choose the slot whose direction is closest to toParent
      let best = 0;
      let bestDot = -Infinity;
      bondedDirs.forEach((d, i) => {
        const dot = d[0] * toParent[0] + d[1] * toParent[1] + d[2] * toParent[2];
        if (dot > bestDot) {
          bestDot = dot;
          best = i;
        }
      });
      const R = rotationBetween(bondedDirs[best], toParent);
      bondedDirs = bondedDirs.map((d) => R(d));
      lpDirs = lpDirs.map((d) => R(d));
      // remove the parent slot from child slots
      bondedDirs.splice(best, 1);
    }

    // Assign children to slots greedily (largest angular separation first is
    // automatic because templates are symmetric).
    const childDirs: Array<{ id: string; bondId: string; order: number; dir: Vec3 }> = [];
    children.forEach((c, i) => {
      const dir = bondedDirs[i] ?? fallbackDir(i, children.length, parentDir);
      childDirs.push({ id: c.id, bondId: c.bondId, order: c.order, dir });
    });

    for (const c of childDirs) {
      const childAtom = species.atoms.find((a) => a.id === c.id)!;
      const len = bondLength(atom.element.symbol, childAtom.element) * (c.order >= 2 ? 0.93 : 1);
      bondLengths.set(c.bondId, len);
      positions.set(c.id, add(here, scale(c.dir, len)));
      visited.add(c.id);
      queue.push({ id: c.id, parentDir: scale(c.dir, -1) });
    }

    // Record lone pair directions (world space)
    for (const d of lpDirs) {
      lonePairs.push({ atomId: id, dir: normalize(d) });
    }
    // If geometry slots were fewer than needed LPs (shouldn't happen), skip
    if (!geom && lpCount > 0) {
      for (let i = 0; i < lpCount; i++) {
        lonePairs.push({
          atomId: id,
          dir: fallbackDir(i, lpCount, parentDir ? scale(parentDir, 1) : null),
        });
      }
    }
  }

  // Atoms not reached (disconnected fragments): place them off to the side
  for (const a of species.atoms) {
    if (!positions.has(a.id)) {
      positions.set(a.id, [6 + Math.random(), Math.random() * 2 - 1, 0]);
    }
  }

  relax3D(species, positions, analysis.byId.size > 0);

  return { positions, lonePairs, bondLengths };
}

function fallbackDir(i: number, n: number, avoid: Vec3 | null): Vec3 {
  const phi = (i / Math.max(1, n)) * Math.PI * 2 + 0.6;
  let d = normalize([Math.cos(phi), Math.sin(phi), (i % 2 === 0 ? 0.35 : -0.35)]);
  if (avoid) {
    const dot = d[0] * avoid[0] + d[1] * avoid[1] + d[2] * avoid[2];
    if (dot < 0) d = scale(d, -1);
  }
  return d;
}

/** Light clash relaxation: push apart atoms that are too close, keep bonds. */
function relax3D(
  species: Species,
  positions: Map<string, Vec3>,
  _hasAtoms: boolean
): void {
  const ids = species.atoms.map((a) => a.id);
  const bondedPairs = new Set(
    species.bonds.map((b) => pairKey(b.a, b.b))
  );
  for (let iter = 0; iter < 40; iter++) {
    let moved = false;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = ids[i];
        const b = ids[j];
        if (bondedPairs.has(pairKey(a, b))) continue;
        const pa = positions.get(a)!;
        const pb = positions.get(b)!;
        const d = dist(pa, pb);
        const elA = species.atoms.find((x) => x.id === a)!;
        const elB = species.atoms.find((x) => x.id === b)!;
        const minD =
          (getElement(elA.element).rCov + getElement(elB.element).rCov) * 1.55;
        if (d < minD && d > 1e-6) {
          const push = scale(normalize(sub(pb, pa)), (minD - d) * 0.5);
          positions.set(a, sub(pa, push));
          positions.set(b, add(pb, push));
          moved = true;
        }
      }
    }
    // Re-project bond lengths
    for (const bond of species.bonds) {
      const pa = positions.get(bond.a)!;
      const pb = positions.get(bond.b)!;
      const elA = species.atoms.find((x) => x.id === bond.a)!;
      const elB = species.atoms.find((x) => x.id === bond.b)!;
      const target = bondLength(elA.element, elB.element) * (bond.order >= 2 ? 0.93 : 1);
      const d = dist(pa, pb);
      if (Math.abs(d - target) > 1e-4 && d > 1e-6) {
        const dir = normalize(sub(pb, pa));
        // Move the non-root atom (heuristic: move both halfway, keep center)
        const mid = scale(add(pa, pb), 0.5);
        positions.set(bond.a, sub(mid, scale(dir, target / 2)));
        positions.set(bond.b, add(mid, scale(dir, target / 2)));
        moved = true;
      }
    }
    if (!moved) break;
  }
  // Re-center
  const pts = [...positions.values()];
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  const cz = pts.reduce((s, p) => s + p[2], 0) / pts.length;
  for (const [id, p] of positions) {
    positions.set(id, [p[0] - cx, p[1] - cy, p[2] - cz]);
  }
}

function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/* ------------------------------------------------------------------ */
/* 2D layout for Lewis diagrams                                        */
/* ------------------------------------------------------------------ */

export interface Vec2 {
  x: number;
  y: number;
}

export interface Layout2DResult {
  positions: Map<string, Vec2>;
  /** angle (radians) and atom for each lone pair */
  lonePairs: Array<{ atomId: string; angle: number }>;
  bondLength: number;
}

function sn2spacing(sn: number): number {
  switch (sn) {
    case 2: return 180;
    case 3: return 120;
    case 4: return 92;
    case 5: return 72;
    case 6: return 62;
    default: return 100;
  }
}

export function layout2D(species: Species): Layout2DResult {
  const analysis = analyzeSpecies(species);
  const adj = adjacency(species);
  const positions = new Map<string, Vec2>();
  const lonePairs: Array<{ atomId: string; angle: number }> = [];
  const BL = 1.7; // schematic bond length

  if (species.atoms.length === 0) return { positions, lonePairs, bondLength: BL };
  if (species.atoms.length === 1) {
    const id = species.atoms[0].id;
    positions.set(id, { x: 0, y: 0 });
    const a = analysis.byId.get(id)!;
    const n = a.lonePairs;
    for (let i = 0; i < n; i++) {
      lonePairs.push({ atomId: id, angle: (i / Math.max(1, n)) * Math.PI * 2 });
    }
    return { positions, lonePairs, bondLength: BL };
  }

  const rootId = analysis.centralAtomId ?? species.atoms[0].id;
  const visited = new Set<string>([rootId]);
  positions.set(rootId, { x: 0, y: 0 });
  const queue: Array<{ id: string; parentAngle: number | null }> = [
    { id: rootId, parentAngle: null },
  ];

  while (queue.length) {
    const { id, parentAngle } = queue.shift()!;
    const atom = analysis.byId.get(id)!;
    const here = positions.get(id)!;
    const neighbors = adj.get(id) ?? [];
    const children = neighbors.filter((n) => !visited.has(n.id));
    const lpCount = atom.lonePairs;
    const sn = Math.max(2, Math.min(6, atom.stericNumber));
    const spacing = sn2spacing(sn);

    // Directions available for children + lone pairs.
    // Children cluster on the side away from the parent; LPs on the parent side
    // (classic Lewis rendering: e.g. H₂O has H's below, LPs above).
    const childCount = children.length;
    const baseAngle = parentAngle === null ? -90 : parentAngle + 180; // "away" direction

    const childAngles = children.map((_, i) => {
      const s = parentAngle === null ? spacing : Math.min(spacing, 112);
      return (baseAngle + (i - (childCount - 1) / 2) * s) * DEG;
    });

    // Root special-case: with no parent, spread children + LPs evenly.
    if (parentAngle === null) {
      const totalGroups = childCount + lpCount;
      const s = 360 / Math.max(1, totalGroups);
      // Children centered downward, LPs upward
      for (let i = 0; i < childCount; i++) {
        childAngles[i] =
          (-90 + (i - (childCount - 1) / 2) * s) * DEG;
      }
      for (let i = 0; i < lpCount; i++) {
        lonePairs.push({
          atomId: id,
          angle:
            (90 + (i - (lpCount - 1) / 2) * s) * DEG,
        });
      }
    } else {
      for (let i = 0; i < lpCount; i++) {
        const s = Math.min(spacing, 112);
        lonePairs.push({
          atomId: id,
          angle:
            (parentAngle! + (i - (lpCount - 1) / 2) * s) * DEG,
        });
      }
    }

    children.forEach((c, i) => {
      const angle = childAngles[i];
      const childAtom = species.atoms.find((a) => a.id === c.id)!;
      const len = BL * (getElement(childAtom.element).symbol === "H" ? 0.82 : 1);
      positions.set(c.id, {
        x: here.x + Math.cos(angle) * len,
        y: here.y - Math.sin(angle) * len, // SVG y is down; our angles are math-style
      });
      visited.add(c.id);
      // Angle from child back to parent, in math-style degrees
      const back = (Math.atan2(-(here.y - positions.get(c.id)!.y), here.x - positions.get(c.id)!.x) * 180) / Math.PI;
      queue.push({ id: c.id, parentAngle: back });
    });
  }

  for (const a of species.atoms) {
    if (!positions.has(a.id)) {
      positions.set(a.id, { x: 4 + Math.random(), y: Math.random() });
    }
  }

  relax2D(species, positions, BL);
  return { positions, lonePairs, bondLength: BL };
}

function relax2D(species: Species, positions: Map<string, Vec2>, BL: number): void {
  const ids = species.atoms.map((a) => a.id);
  const bondedPairs = new Set(species.bonds.map((b) => pairKey(b.a, b.b)));
  for (let iter = 0; iter < 30; iter++) {
    let moved = false;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = ids[i];
        const b = ids[j];
        if (bondedPairs.has(pairKey(a, b))) continue;
        const pa = positions.get(a)!;
        const pb = positions.get(b)!;
        const dx = pb.x - pa.x;
        const dy = pb.y - pa.y;
        const d = Math.hypot(dx, dy) || 1e-6;
        const minD = BL * 1.25;
        if (d < minD) {
          const push = ((minD - d) / 2) * 0.6;
          positions.set(a, { x: pa.x - (dx / d) * push, y: pa.y - (dy / d) * push });
          positions.set(b, { x: pb.x + (dx / d) * push, y: pb.y + (dy / d) * push });
          moved = true;
        }
      }
    }
    for (const bond of species.bonds) {
      const pa = positions.get(bond.a)!;
      const pb = positions.get(bond.b)!;
      const dx = pb.x - pa.x;
      const dy = pb.y - pa.y;
      const d = Math.hypot(dx, dy) || 1e-6;
      const target = BL * 0.9;
      const mid = { x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2 };
      const ux = (dx / d) * (target / 2);
      const uy = (dy / d) * (target / 2);
      positions.set(bond.a, { x: mid.x - ux, y: mid.y - uy });
      positions.set(bond.b, { x: mid.x + ux, y: mid.y + uy });
      moved = true;
    }
    if (!moved) break;
  }
}
