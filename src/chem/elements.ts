/**
 * Element database for AP Chemistry (Z = 1–56).
 *
 * Data sources: IUPAC 2021 atomic weights, Pauling electronegativities,
 * Cordero et al. (2008) covalent radii. Values are the standard ones used
 * in AP Chemistry reference tables.
 *
 * `valenceElectrons` is the main-group valence electron count (group number
 * mod 10). For transition metals we store the s+d count, flagged via block.
 */

export type ElementCategory =
  | "alkali metal"
  | "alkaline earth metal"
  | "transition metal"
  | "post-transition metal"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble gas"
  | "lanthanide";

export interface ElementData {
  z: number;
  symbol: string;
  name: string;
  /** Standard atomic weight (u). For radioactive elements, mass number of most stable isotope. */
  mass: number;
  /** 1–18 group number (lanthanides/actinides use 3). */
  group: number;
  period: number;
  block: "s" | "p" | "d" | "f";
  category: ElementCategory;
  /** Pauling electronegativity, null when not commonly defined. */
  en: number | null;
  /** Covalent radius in Å. */
  rCov: number;
  /** Ionic radius in Å for the common ion, when it forms one. */
  rIon?: number;
  /** Common monatomic ion charges (e.g. Na: [+1], O: [-2], Fe: [+2,+3]). */
  commonIons: number[];
  /** Main-group valence electrons (transition metals: outer s+d electrons). */
  valenceElectrons: number;
  /** First ionization energy in kJ/mol. */
  ionizationEnergy: number;
  /** Display color for 3D models (CPK / Jmol palette, tuned for dark UI). */
  color: string;
  /** State at room temperature. */
  state: "solid" | "liquid" | "gas";
}

/* prettier-ignore */
const RAW: Array<[
  number, string, string, number, number, number, ElementData["block"], ElementCategory,
  number | null, number, number[], number, number, string, ElementData["state"], number?
]> = [
  [ 1, "H",  "Hydrogen",    1.008,  1, 1, "s", "nonmetal",             2.20, 0.31, [ 1,-1],  1, 1312.0, "#e8edf5", "gas" ],
  [ 2, "He", "Helium",      4.0026, 18, 1, "s", "noble gas",           null, 0.28, [     ],  2, 2372.3, "#7dd8ff", "gas" ],
  [ 3, "Li", "Lithium",     6.94,    1, 2, "s", "alkali metal",        0.98, 1.28, [ 1   ],  1,  520.2, "#cc80ff", "solid" ],
  [ 4, "Be", "Beryllium",   9.0122,  2, 2, "s", "alkaline earth metal",1.57, 0.96, [ 2   ],  2,  899.5, "#c2ff00", "solid" ],
  [ 5, "B",  "Boron",      10.81,   13, 2, "p", "metalloid",           2.04, 0.84, [ 3   ],  3,  800.6, "#ffb5b5", "solid" ],
  [ 6, "C",  "Carbon",     12.011,  14, 2, "p", "nonmetal",            2.55, 0.76, [ 4,-4],  4, 1086.5, "#9aa4b2", "solid" ],
  [ 7, "N",  "Nitrogen",   14.007,  15, 2, "p", "nonmetal",            3.04, 0.71, [-3   ],  5, 1402.3, "#4a7dff", "gas" ],
  [ 8, "O",  "Oxygen",     15.999,  16, 2, "p", "nonmetal",            3.44, 0.66, [-2   ],  6, 1313.9, "#ff3b30", "gas" ],
  [ 9, "F",  "Fluorine",   18.998,  17, 2, "p", "halogen",             3.98, 0.57, [-1   ],  7, 1681.0, "#7ce87c", "gas" ],
  [10, "Ne", "Neon",       20.180,  18, 2, "p", "noble gas",           null, 0.58, [     ],  8, 2080.7, "#b3e3f5", "gas" ],
  [11, "Na", "Sodium",     22.990,   1, 3, "s", "alkali metal",        0.93, 1.66, [ 1   ],  1,  495.8, "#ab5cf2", "solid", 1.02 ],
  [12, "Mg", "Magnesium",  24.305,   2, 3, "s", "alkaline earth metal",1.31, 1.41, [ 2   ],  2,  737.7, "#8aff00", "solid", 0.72 ],
  [13, "Al", "Aluminium",  26.982,  13, 3, "p", "post-transition metal",1.61, 1.21, [ 3  ],  3,  577.5, "#bfa6a6", "solid", 0.535 ],
  [14, "Si", "Silicon",    28.085,  14, 3, "p", "metalloid",           1.90, 1.11, [ 4,-4],  4,  786.5, "#f0c8a0", "solid" ],
  [15, "P",  "Phosphorus", 30.974,  15, 3, "p", "nonmetal",            2.19, 1.07, [-3   ],  5, 1011.8, "#ff9132", "solid" ],
  [16, "S",  "Sulfur",     32.06,   16, 3, "p", "nonmetal",            2.58, 1.05, [-2   ],  6,  999.6, "#ffe135", "solid" ],
  [17, "Cl", "Chlorine",   35.45,   17, 3, "p", "halogen",             3.16, 1.02, [-1   ],  7, 1251.2, "#3ddc3d", "gas", 1.81 ],
  [18, "Ar", "Argon",      39.95,   18, 3, "p", "noble gas",           null, 1.06, [     ],  8, 1520.6, "#80d1e3", "gas" ],
  [19, "K",  "Potassium",  39.098,   1, 4, "s", "alkali metal",        0.82, 2.03, [ 1   ],  1,  418.8, "#8f40d4", "solid", 1.38 ],
  [20, "Ca", "Calcium",    40.078,   2, 4, "s", "alkaline earth metal",1.00, 1.76, [ 2   ],  2,  589.8, "#3dff00", "solid", 1.00 ],
  [21, "Sc", "Scandium",   44.956,   3, 4, "d", "transition metal",    1.36, 1.70, [ 3   ],  3,  633.1, "#e6e6e6", "solid" ],
  [22, "Ti", "Titanium",   47.867,   4, 4, "d", "transition metal",    1.54, 1.60, [ 4, 3, 2], 4, 658.8, "#bfc2c7", "solid" ],
  [23, "V",  "Vanadium",   50.942,   5, 4, "d", "transition metal",    1.63, 1.53, [ 5, 4, 3, 2], 5, 650.9, "#a6a6ab", "solid" ],
  [24, "Cr", "Chromium",   51.996,   6, 4, "d", "transition metal",    1.66, 1.39, [ 3, 6, 2], 6, 652.9, "#8a99c7", "solid" ],
  [25, "Mn", "Manganese",  54.938,   7, 4, "d", "transition metal",    1.55, 1.39, [ 2, 4, 7], 7, 717.3, "#9c7ac7", "solid" ],
  [26, "Fe", "Iron",       55.845,   8, 4, "d", "transition metal",    1.83, 1.32, [ 2, 3 ], 8,  762.5, "#e06633", "solid", 0.78 ],
  [27, "Co", "Cobalt",     58.933,   9, 4, "d", "transition metal",    1.88, 1.26, [ 2, 3 ], 9,  760.4, "#f090a0", "solid" ],
  [28, "Ni", "Nickel",     58.693,  10, 4, "d", "transition metal",    1.91, 1.24, [ 2    ], 10,  737.1, "#50d050", "solid" ],
  [29, "Cu", "Copper",     63.546,  11, 4, "d", "transition metal",    1.90, 1.32, [ 2, 1 ], 11,  745.5, "#c88033", "solid" ],
  [30, "Zn", "Zinc",       65.38,   12, 4, "d", "transition metal",    1.65, 1.22, [ 2    ], 12,  906.4, "#7d80b0", "solid" ],
  [31, "Ga", "Gallium",    69.723,  13, 4, "p", "post-transition metal",1.81, 1.22, [ 3   ],  3,  578.8, "#c28f8f", "solid" ],
  [32, "Ge", "Germanium",  72.630,  14, 4, "p", "metalloid",           2.01, 1.20, [ 4, 2 ],  4,  762.2, "#668f8f", "solid" ],
  [33, "As", "Arsenic",    74.922,  15, 4, "p", "metalloid",           2.18, 1.19, [-3, 3 ],  5,  947.0, "#bd80e3", "solid" ],
  [34, "Se", "Selenium",   78.971,  16, 4, "p", "nonmetal",            2.55, 1.20, [-2    ],  6,  941.0, "#ffa100", "solid" ],
  [35, "Br", "Bromine",    79.904,  17, 4, "p", "halogen",             2.96, 1.20, [-1    ],  7, 1139.9, "#a62929", "liquid", 1.96 ],
  [36, "Kr", "Krypton",    83.798,  18, 4, "p", "noble gas",           3.00, 1.16, [      ],  8, 1350.8, "#5cb8d1", "gas" ],
  [37, "Rb", "Rubidium",   85.468,   1, 5, "s", "alkali metal",        0.82, 2.20, [ 1    ],  1,  403.0, "#702eb0", "solid" ],
  [38, "Sr", "Strontium",  87.62,    2, 5, "s", "alkaline earth metal",0.95, 1.95, [ 2    ],  2,  549.5, "#00ff00", "solid" ],
  [39, "Y",  "Yttrium",    88.906,   3, 5, "d", "transition metal",    1.22, 1.90, [ 3    ],  3,  600.0, "#94ffff", "solid" ],
  [40, "Zr", "Zirconium",  91.224,   4, 5, "d", "transition metal",    1.33, 1.75, [ 4    ],  4,  640.1, "#94e0e0", "solid" ],
  [41, "Nb", "Niobium",    92.906,   5, 5, "d", "transition metal",    1.60, 1.64, [ 5, 3 ],  5,  652.1, "#73c2c9", "solid" ],
  [42, "Mo", "Molybdenum", 95.95,    6, 5, "d", "transition metal",    2.16, 1.54, [ 6, 4, 2 ], 6, 684.3, "#54b5b5", "solid" ],
  [43, "Tc", "Technetium", 98.0,     7, 5, "d", "transition metal",    1.90, 1.47, [ 7, 4 ],  7,  702.0, "#3b9e9e", "solid" ],
  [44, "Ru", "Ruthenium", 101.07,    8, 5, "d", "transition metal",    2.20, 1.46, [ 3, 4 ],  8,  710.2, "#248f8f", "solid" ],
  [45, "Rh", "Rhodium",   102.91,    9, 5, "d", "transition metal",    2.28, 1.42, [ 3    ],  9,  719.7, "#0a7d8c", "solid" ],
  [46, "Pd", "Palladium", 106.42,   10, 5, "d", "transition metal",    2.20, 1.39, [ 2, 4 ], 10,  804.4, "#006985", "solid" ],
  [47, "Ag", "Silver",    107.87,   11, 5, "d", "transition metal",    1.93, 1.45, [ 1    ], 11,  731.0, "#c0c0c0", "solid" ],
  [48, "Cd", "Cadmium",   112.41,   12, 5, "d", "transition metal",    1.69, 1.44, [ 2    ], 12,  867.8, "#ffd98f", "solid" ],
  [49, "In", "Indium",    114.82,   13, 5, "p", "post-transition metal",1.78, 1.42, [ 3   ],  3,  558.3, "#a67573", "solid" ],
  [50, "Sn", "Tin",       118.71,   14, 5, "p", "post-transition metal",1.96, 1.39, [ 2, 4 ],  4,  708.6, "#668080", "solid" ],
  [51, "Sb", "Antimony",  121.76,   15, 5, "p", "metalloid",           2.05, 1.39, [-3, 3 ],  5,  834.0, "#9e63b5", "solid" ],
  [52, "Te", "Tellurium", 127.60,   16, 5, "p", "metalloid",           2.10, 1.38, [-2    ],  6,  869.3, "#d47a00", "solid" ],
  [53, "I",  "Iodine",    126.90,   17, 5, "p", "halogen",             2.66, 1.39, [-1    ],  7, 1008.4, "#940094", "solid", 2.20 ],
  [54, "Xe", "Xenon",     131.29,   18, 5, "p", "noble gas",           2.60, 1.40, [      ],  8, 1170.4, "#429eb0", "gas" ],
  [55, "Cs", "Caesium",   132.91,    1, 6, "s", "alkali metal",        0.79, 2.44, [ 1    ],  1,  375.7, "#57178f", "solid" ],
  [56, "Ba", "Barium",    137.33,    2, 6, "s", "alkaline earth metal",0.89, 2.15, [ 2    ],  2,  502.9, "#00c900", "solid" ],
];

export const ELEMENTS: ElementData[] = RAW.map((r) => ({
  z: r[0],
  symbol: r[1],
  name: r[2],
  mass: r[3],
  group: r[4],
  period: r[5],
  block: r[6],
  category: r[7],
  en: r[8],
  rCov: r[9],
  commonIons: r[10],
  valenceElectrons: r[11],
  ionizationEnergy: r[12],
  color: r[13],
  state: r[14],
  ...(r[15] !== undefined ? { rIon: r[15] } : {}),
}));

const BY_SYMBOL = new Map<string, ElementData>();
const BY_Z = new Map<number, ElementData>();
for (const el of ELEMENTS) {
  BY_SYMBOL.set(el.symbol, el);
  BY_SYMBOL.set(el.symbol.toUpperCase(), el);
  BY_Z.set(el.z, el);
}

export function getElement(symbolOrZ: string | number): ElementData {
  const el =
    typeof symbolOrZ === "number"
      ? BY_Z.get(symbolOrZ)
      : BY_SYMBOL.get(symbolOrZ) ?? BY_SYMBOL.get(capitalize(symbolOrZ));
  if (!el) throw new Error(`Unknown element: ${symbolOrZ}`);
  return el;
}

export function hasElement(symbolOrZ: string | number): boolean {
  if (typeof symbolOrZ === "number") return BY_Z.has(symbolOrZ);
  return BY_SYMBOL.has(symbolOrZ) || BY_SYMBOL.has(capitalize(symbolOrZ));
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/** CPK-style colors keyed by category, with per-element overrides above. */
export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  "alkali metal": "#ab5cf2",
  "alkaline earth metal": "#5ee06a",
  "transition metal": "#8fa8c8",
  "post-transition metal": "#b08f8f",
  metalloid: "#d1a85e",
  nonmetal: "#59c2ff",
  halogen: "#7ce87c",
  "noble gas": "#7dd8ff",
  lanthanide: "#e07bd0",
};

/** Whether an element behaves as a metal in bonding contexts. */
export function isMetal(el: ElementData): boolean {
  return (
    el.category === "alkali metal" ||
    el.category === "alkaline earth metal" ||
    el.category === "transition metal" ||
    el.category === "post-transition metal" ||
    el.category === "lanthanide"
  );
}

/** Typical maximum number of covalent bonds for simple Lewis structures. */
export function typicalMaxBonds(el: ElementData): number {
  switch (el.symbol) {
    case "H": return 1;
    case "F": case "Cl": case "Br": case "I": return 1;
    case "O": return 2;
    case "N": return 3;
    case "C": case "Si": return 4;
    case "B": return 3;
    case "P": return 5; // can expand octet
    case "S": return 6; // can expand octet
    default:
      return Math.max(1, el.valenceElectrons);
  }
}

/** Whether the element can expand its octet (period 3+ with d orbitals available). */
export function canExpandOctet(el: ElementData): boolean {
  return el.period >= 3 && (el.block === "p" || el.block === "d");
}
