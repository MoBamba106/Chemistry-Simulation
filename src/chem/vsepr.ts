/**
 * VSEPR engine.
 *
 * Maps (steric number, lone pairs) → AXE notation, electron-group geometry,
 * molecular geometry, ideal bond angles, and 3D direction templates used to
 * lay out atoms and lone pairs in space.
 *
 * Lone-pair placement follows the standard rules: in a trigonal bipyramid
 * lone pairs always occupy equatorial positions; in an octahedron the first
 * lone pair goes anywhere and the second goes opposite it.
 */

export type Vec3 = [number, number, number];

export interface VSEPRGeometry {
  /** e.g. "AX2E2" */
  axe: string;
  stericNumber: number;
  bondedAtoms: number;
  lonePairs: number;
  electronGeometry: string;
  molecularGeometry: string;
  /** Common short name, e.g. "bent" or "tetrahedral". */
  shape: string;
  /** Approximate bond angles with labels. */
  angles: Array<{ label: string; value: number }>;
  example: string;
  description: string;
  /** Unit direction vectors for bonded atoms (length = stericNumber - lonePairs). */
  bondedDirs: Vec3[];
  /** Unit direction vectors for lone pairs. */
  lonePairDirs: Vec3[];
}

const SQ3_2 = Math.sqrt(3) / 2;

/** Ideal template directions for each steric number. */
const TEMPLATES: Record<number, Vec3[]> = {
  2: [
    [0, 0, 1],
    [0, 0, -1],
  ],
  3: [
    [1, 0, 0],
    [-0.5, 0, SQ3_2],
    [-0.5, 0, -SQ3_2],
  ],
  4: ([
    [1, 1, 1],
    [-1, -1, 1],
    [-1, 1, -1],
    [1, -1, -1],
  ] as Vec3[]).map(normalize),
  5: [
    // equatorial first (lone pairs prefer these), then axial
    [1, 0, 0],
    [-0.5, 0, SQ3_2],
    [-0.5, 0, -SQ3_2],
    [0, 1, 0],
    [0, -1, 0],
  ],
  6: [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ],
};

function normalize(v: Vec3): Vec3 {
  const m = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / m, v[1] / m, v[2] / m];
}

/** Which template slots lone pairs occupy, in order. */
const LONE_PAIR_SLOTS: Record<number, number[]> = {
  2: [0],
  3: [0],
  4: [0],
  5: [0, 1, 2], // equatorial first
  6: [0, 1], // opposite each other
};

interface GeomMeta {
  electron: string;
  molecular: string;
  shape: string;
  angles: Array<{ label: string; value: number }>;
  example: string;
  description: string;
}

const ELECTRON_GEOMETRY: Record<number, string> = {
  2: "linear",
  3: "trigonal planar",
  4: "tetrahedral",
  5: "trigonal bipyramidal",
  6: "octahedral",
};

/** molecularGeometry metadata keyed "SN-LP". */
const META: Record<string, GeomMeta> = {
  "2-0": {
    electron: "linear", molecular: "linear", shape: "linear",
    angles: [{ label: "X–A–X", value: 180 }], example: "CO₂, BeH₂",
    description: "Two bonding groups sit on opposite sides of the central atom — as far apart as possible.",
  },
  "2-1": {
    electron: "linear", molecular: "linear", shape: "linear",
    angles: [{ label: "X–A–X", value: 180 }], example: "no lone pairs possible on H",
    description: "A steric number of 2 with one lone pair is rare; the species is still linear.",
  },
  "3-0": {
    electron: "trigonal planar", molecular: "trigonal planar", shape: "trigonal planar",
    angles: [{ label: "X–A–X", value: 120 }], example: "BF₃, SO₃",
    description: "Three bonding groups spread evenly in one plane at 120°.",
  },
  "3-1": {
    electron: "trigonal planar", molecular: "bent", shape: "bent",
    angles: [{ label: "X–A–X", value: 117.5 }], example: "SO₂, O₃",
    description: "The lone pair repels the bonding pairs slightly inward, so the angle is a bit under 120°.",
  },
  "4-0": {
    electron: "tetrahedral", molecular: "tetrahedral", shape: "tetrahedral",
    angles: [{ label: "X–A–X", value: 109.5 }], example: "CH₄, CCl₄",
    description: "Four bonding groups point to the corners of a tetrahedron — the 3-D arrangement that maximizes separation.",
  },
  "4-1": {
    electron: "tetrahedral", molecular: "trigonal pyramidal", shape: "trigonal pyramidal",
    angles: [{ label: "X–A–X", value: 107 }], example: "NH₃, PCl₃",
    description: "The lone pair pushes the three bonds down into a pyramid; angles shrink from 109.5° to about 107°.",
  },
  "4-2": {
    electron: "tetrahedral", molecular: "bent", shape: "bent",
    angles: [{ label: "X–A–X", value: 104.5 }], example: "H₂O, H₂S",
    description: "Two lone pairs compress the bond angle further, to about 104.5°.",
  },
  "5-0": {
    electron: "trigonal bipyramidal", molecular: "trigonal bipyramidal", shape: "trigonal bipyramidal",
    angles: [
      { label: "equatorial–equatorial", value: 120 },
      { label: "axial–equatorial", value: 90 },
      { label: "axial–axial", value: 180 },
    ],
    example: "PCl₅, PF₅",
    description: "Three equatorial bonds in a plane (120° apart) plus two axial bonds above and below (90°).",
  },
  "5-1": {
    electron: "trigonal bipyramidal", molecular: "seesaw", shape: "seesaw",
    angles: [
      { label: "axial–equatorial", value: 90 },
      { label: "eq–eq", value: 120 },
    ],
    example: "SF₄",
    description: "The lone pair takes an equatorial position (only 90° interactions with two bonds instead of three), giving a seesaw shape.",
  },
  "5-2": {
    electron: "trigonal bipyramidal", molecular: "T-shaped", shape: "T-shaped",
    angles: [{ label: "X–A–X", value: 90 }], example: "ClF₃, BrF₃",
    description: "Two equatorial lone pairs leave three bonds in a T.",
  },
  "5-3": {
    electron: "trigonal bipyramidal", molecular: "linear", shape: "linear",
    angles: [{ label: "X–A–X", value: 180 }], example: "XeF₂, I₃⁻",
    description: "All three equatorial positions hold lone pairs; only the two axial bonds remain, 180° apart.",
  },
  "6-0": {
    electron: "octahedral", molecular: "octahedral", shape: "octahedral",
    angles: [{ label: "X–A–X", value: 90 }], example: "SF₆",
    description: "Six bonds point to the corners of an octahedron; every position is equivalent (all 90°).",
  },
  "6-1": {
    electron: "octahedral", molecular: "square pyramidal", shape: "square pyramidal",
    angles: [{ label: "X–A–X", value: 90 }], example: "BrF₅",
    description: "One lone pair leaves five bonds forming a square pyramid.",
  },
  "6-2": {
    electron: "octahedral", molecular: "square planar", shape: "square planar",
    angles: [{ label: "X–A–X", value: 90 }], example: "XeF₄",
    description: "The two lone pairs sit opposite each other, leaving four bonds in a plane.",
  },
};

export function vseprGeometry(stericNumber: number, lonePairs: number): VSEPRGeometry | null {
  const bonded = stericNumber - lonePairs;
  if (stericNumber < 2 || stericNumber > 6 || bonded < 1 || lonePairs < 0) {
    if (stericNumber === 1) {
      // Diatomic — trivially linear
      return {
        axe: "AX", stericNumber: 1, bondedAtoms: 1, lonePairs: 0,
        electronGeometry: "linear", molecularGeometry: "linear", shape: "linear",
        angles: [], example: "HCl, O₂",
        description: "A terminal atom with a single bond — two points always define a line.",
        bondedDirs: [[0, 0, 1]], lonePairDirs: [],
      };
    }
    return null;
  }
  const meta = META[`${stericNumber}-${lonePairs}`];
  if (!meta) return null;

  const template = TEMPLATES[stericNumber].map((v) => [...v] as Vec3);
  const lpSlots = LONE_PAIR_SLOTS[stericNumber].slice(0, lonePairs);
  const lonePairDirs = lpSlots.map((i) => template[i]);
  const bondSlots = template
    .map((_, i) => i)
    .filter((i) => !lpSlots.includes(i));

  // For geometries with lone pairs, nudge bonded directions slightly away
  // from lone pairs so the rendered angles reflect LP–BP repulsion.
  const bondedDirs = bondSlots.map((i) => {
    let v = [...template[i]] as Vec3;
    for (const lp of lonePairDirs) {
      v = [
        v[0] + 0.14 * (v[0] - lp[0]),
        v[1] + 0.14 * (v[1] - lp[1]),
        v[2] + 0.14 * (v[2] - lp[2]),
      ];
    }
    return normalize(v);
  });

  const axe =
    "AX" + (bonded > 1 ? String(bonded) : "") + (lonePairs > 0 ? "E" + (lonePairs > 1 ? String(lonePairs) : "") : "");

  return {
    axe,
    stericNumber,
    bondedAtoms: bonded,
    lonePairs,
    electronGeometry: ELECTRON_GEOMETRY[stericNumber],
    molecularGeometry: meta.molecular,
    shape: meta.shape,
    angles: meta.angles,
    example: meta.example,
    description: meta.description,
    bondedDirs,
    lonePairDirs,
  };
}

/** All geometries, for reference tables. */
export function allGeometries(): VSEPRGeometry[] {
  const out: VSEPRGeometry[] = [];
  for (let sn = 2; sn <= 6; sn++) {
    for (let lp = 0; lp <= sn - 1 && lp <= 3; lp++) {
      const g = vseprGeometry(sn, lp);
      if (g) out.push(g);
    }
  }
  return out;
}
