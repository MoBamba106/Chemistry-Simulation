/**
 * Complete 118-element data set for the interactive reference table.
 *
 * The chemistry engines intentionally keep using the better-curated AP
 * subset in elements.ts (Z = 1–56). This display data extends that table to
 * all named elements without implying that every late-element property is
 * experimentally established. Values marked estimated/predicted are shown
 * as such in the element inspector; unavailable properties remain null.
 */
import { ELEMENTS, type ElementCategory, type ElementData } from "./elements";

export type PropertyConfidence = "reference" | "estimated" | "predicted";

export interface PeriodicElementData {
  z: number;
  symbol: string;
  name: string;
  mass: number;
  massLabel: string;
  group: number;
  period: number;
  block: "s" | "p" | "d" | "f";
  category: ElementCategory;
  en: number | null;
  rCov: number | null;
  ionizationEnergy: number | null;
  valenceElectrons: number | null;
  state: "solid" | "liquid" | "gas";
  commonIons: number[];
  tableRow: number;
  tableColumn: number;
  confidence: PropertyConfidence;
}

type ExtraRow = [
  z: number,
  symbol: string,
  name: string,
  mass: number,
  massLabel: string,
  group: number,
  period: number,
  block: PeriodicElementData["block"],
  category: ElementCategory,
  en: number | null,
  rCov: number | null,
  ionizationEnergy: number | null,
  valenceElectrons: number | null,
  state: PeriodicElementData["state"],
  commonIons: number[],
  confidence: PropertyConfidence,
];

// Z = 57–118. Bracketed masses are representative mass numbers for elements
// with no stable isotope. Heavy-element radii/EN values are rounded reference
// or predicted values and are deliberately identified as estimates.
const EXTRA: ExtraRow[] = [
  [57, "La", "Lanthanum", 138.90547, "138.905", 3, 6, "f", "lanthanide", 1.10, 2.07, 538.1, 3, "solid", [3], "estimated"],
  [58, "Ce", "Cerium", 140.116, "140.116", 3, 6, "f", "lanthanide", 1.12, 2.04, 534.4, 3, "solid", [3, 4], "estimated"],
  [59, "Pr", "Praseodymium", 140.90766, "140.908", 3, 6, "f", "lanthanide", 1.13, 2.03, 527.0, 3, "solid", [3, 4], "estimated"],
  [60, "Nd", "Neodymium", 144.242, "144.242", 3, 6, "f", "lanthanide", 1.14, 2.01, 533.1, 3, "solid", [3], "estimated"],
  [61, "Pm", "Promethium", 145, "[145]", 3, 6, "f", "lanthanide", 1.13, 1.99, 540.0, 3, "solid", [3], "estimated"],
  [62, "Sm", "Samarium", 150.36, "150.36", 3, 6, "f", "lanthanide", 1.17, 1.98, 544.5, 3, "solid", [2, 3], "estimated"],
  [63, "Eu", "Europium", 151.964, "151.964", 3, 6, "f", "lanthanide", 1.20, 1.98, 547.1, 3, "solid", [2, 3], "estimated"],
  [64, "Gd", "Gadolinium", 157.25, "157.25", 3, 6, "f", "lanthanide", 1.20, 1.96, 593.4, 3, "solid", [3], "estimated"],
  [65, "Tb", "Terbium", 158.92535, "158.925", 3, 6, "f", "lanthanide", 1.10, 1.94, 565.8, 3, "solid", [3, 4], "estimated"],
  [66, "Dy", "Dysprosium", 162.500, "162.500", 3, 6, "f", "lanthanide", 1.22, 1.92, 573.0, 3, "solid", [3], "estimated"],
  [67, "Ho", "Holmium", 164.93033, "164.930", 3, 6, "f", "lanthanide", 1.23, 1.92, 581.0, 3, "solid", [3], "estimated"],
  [68, "Er", "Erbium", 167.259, "167.259", 3, 6, "f", "lanthanide", 1.24, 1.89, 589.3, 3, "solid", [3], "estimated"],
  [69, "Tm", "Thulium", 168.93422, "168.934", 3, 6, "f", "lanthanide", 1.25, 1.90, 596.7, 3, "solid", [2, 3], "estimated"],
  [70, "Yb", "Ytterbium", 173.045, "173.045", 3, 6, "f", "lanthanide", 1.10, 1.87, 603.4, 3, "solid", [2, 3], "estimated"],
  [71, "Lu", "Lutetium", 174.9668, "174.967", 3, 6, "f", "lanthanide", 1.27, 1.87, 523.5, 3, "solid", [3], "estimated"],
  [72, "Hf", "Hafnium", 178.49, "178.49", 4, 6, "d", "transition metal", 1.30, 1.75, 658.5, 4, "solid", [4], "estimated"],
  [73, "Ta", "Tantalum", 180.94788, "180.948", 5, 6, "d", "transition metal", 1.50, 1.70, 761.0, 5, "solid", [5], "estimated"],
  [74, "W", "Tungsten", 183.84, "183.84", 6, 6, "d", "transition metal", 2.36, 1.62, 770.0, 6, "solid", [4, 6], "estimated"],
  [75, "Re", "Rhenium", 186.207, "186.207", 7, 6, "d", "transition metal", 1.90, 1.51, 760.0, 7, "solid", [4, 6, 7], "estimated"],
  [76, "Os", "Osmium", 190.23, "190.23", 8, 6, "d", "transition metal", 2.20, 1.44, 840.0, 8, "solid", [4, 8], "estimated"],
  [77, "Ir", "Iridium", 192.217, "192.217", 9, 6, "d", "transition metal", 2.20, 1.41, 880.0, 9, "solid", [3, 4], "estimated"],
  [78, "Pt", "Platinum", 195.084, "195.084", 10, 6, "d", "transition metal", 2.28, 1.36, 870.0, 10, "solid", [2, 4], "estimated"],
  [79, "Au", "Gold", 196.96657, "196.967", 11, 6, "d", "transition metal", 2.54, 1.36, 890.1, 11, "solid", [1, 3], "estimated"],
  [80, "Hg", "Mercury", 200.592, "200.592", 12, 6, "d", "transition metal", 2.00, 1.32, 1007.1, 12, "liquid", [1, 2], "estimated"],
  [81, "Tl", "Thallium", 204.38, "204.38", 13, 6, "p", "post-transition metal", 1.62, 1.45, 589.4, 3, "solid", [1, 3], "estimated"],
  [82, "Pb", "Lead", 207.2, "207.2", 14, 6, "p", "post-transition metal", 2.33, 1.46, 715.6, 4, "solid", [2, 4], "estimated"],
  [83, "Bi", "Bismuth", 208.9804, "208.980", 15, 6, "p", "post-transition metal", 2.02, 1.48, 703.0, 5, "solid", [3, 5], "estimated"],
  [84, "Po", "Polonium", 209, "[209]", 16, 6, "p", "post-transition metal", 2.00, 1.40, 812.0, 6, "solid", [2, 4], "estimated"],
  [85, "At", "Astatine", 210, "[210]", 17, 6, "p", "halogen", 2.20, 1.50, 899.0, 7, "solid", [-1, 1], "estimated"],
  [86, "Rn", "Radon", 222, "[222]", 18, 6, "p", "noble gas", null, 1.50, 1037.0, 8, "gas", [], "estimated"],
  [87, "Fr", "Francium", 223, "[223]", 1, 7, "s", "alkali metal", 0.70, 2.60, 380.0, 1, "solid", [1], "estimated"],
  [88, "Ra", "Radium", 226, "[226]", 2, 7, "s", "alkaline earth metal", 0.90, 2.21, 509.3, 2, "solid", [2], "estimated"],
  [89, "Ac", "Actinium", 227, "[227]", 3, 7, "f", "actinide", 1.10, 2.15, 499.0, 3, "solid", [3], "estimated"],
  [90, "Th", "Thorium", 232.0377, "232.038", 3, 7, "f", "actinide", 1.30, 2.06, 587.0, 4, "solid", [4], "estimated"],
  [91, "Pa", "Protactinium", 231.03588, "231.036", 3, 7, "f", "actinide", 1.50, 2.00, 568.0, 5, "solid", [4, 5], "estimated"],
  [92, "U", "Uranium", 238.02891, "238.029", 3, 7, "f", "actinide", 1.38, 1.96, 597.6, 6, "solid", [3, 4, 6], "estimated"],
  [93, "Np", "Neptunium", 237, "[237]", 3, 7, "f", "actinide", 1.36, 1.90, 604.5, 7, "solid", [3, 4, 5, 6], "estimated"],
  [94, "Pu", "Plutonium", 244, "[244]", 3, 7, "f", "actinide", 1.28, 1.87, 584.7, 8, "solid", [3, 4, 5, 6], "estimated"],
  [95, "Am", "Americium", 243, "[243]", 3, 7, "f", "actinide", 1.30, 1.80, 578.0, 9, "solid", [3, 4, 5, 6], "estimated"],
  [96, "Cm", "Curium", 247, "[247]", 3, 7, "f", "actinide", 1.30, 1.69, 581.0, 10, "solid", [3, 4], "estimated"],
  [97, "Bk", "Berkelium", 247, "[247]", 3, 7, "f", "actinide", 1.30, 1.68, 601.0, 11, "solid", [3, 4], "estimated"],
  [98, "Cf", "Californium", 251, "[251]", 3, 7, "f", "actinide", 1.30, 1.68, 608.0, 12, "solid", [2, 3], "estimated"],
  [99, "Es", "Einsteinium", 252, "[252]", 3, 7, "f", "actinide", 1.30, 1.65, 619.0, 13, "solid", [3], "estimated"],
  [100, "Fm", "Fermium", 257, "[257]", 3, 7, "f", "actinide", 1.30, 1.67, 627.0, 14, "solid", [3], "estimated"],
  [101, "Md", "Mendelevium", 258, "[258]", 3, 7, "f", "actinide", 1.30, 1.73, 635.0, 15, "solid", [2, 3], "estimated"],
  [102, "No", "Nobelium", 259, "[259]", 3, 7, "f", "actinide", 1.30, 1.76, 642.0, 16, "solid", [2, 3], "estimated"],
  [103, "Lr", "Lawrencium", 266, "[266]", 3, 7, "f", "actinide", 1.30, 1.61, 470.0, 3, "solid", [3], "estimated"],
  [104, "Rf", "Rutherfordium", 267, "[267]", 4, 7, "d", "transition metal", null, 1.57, null, 4, "solid", [4], "predicted"],
  [105, "Db", "Dubnium", 268, "[268]", 5, 7, "d", "transition metal", null, 1.49, null, 5, "solid", [5], "predicted"],
  [106, "Sg", "Seaborgium", 269, "[269]", 6, 7, "d", "transition metal", null, 1.43, null, 6, "solid", [6], "predicted"],
  [107, "Bh", "Bohrium", 270, "[270]", 7, 7, "d", "transition metal", null, 1.41, null, 7, "solid", [7], "predicted"],
  [108, "Hs", "Hassium", 269, "[269]", 8, 7, "d", "transition metal", null, 1.34, null, 8, "solid", [8], "predicted"],
  [109, "Mt", "Meitnerium", 277, "[277]", 9, 7, "d", "transition metal", null, 1.29, null, 9, "solid", [], "predicted"],
  [110, "Ds", "Darmstadtium", 281, "[281]", 10, 7, "d", "transition metal", null, 1.28, null, 10, "solid", [], "predicted"],
  [111, "Rg", "Roentgenium", 282, "[282]", 11, 7, "d", "transition metal", null, 1.21, null, 11, "solid", [], "predicted"],
  [112, "Cn", "Copernicium", 285, "[285]", 12, 7, "d", "transition metal", null, 1.22, null, 12, "solid", [2], "predicted"],
  [113, "Nh", "Nihonium", 286, "[286]", 13, 7, "p", "post-transition metal", null, 1.36, null, 3, "solid", [], "predicted"],
  [114, "Fl", "Flerovium", 289, "[289]", 14, 7, "p", "post-transition metal", null, 1.43, null, 4, "solid", [], "predicted"],
  [115, "Mc", "Moscovium", 290, "[290]", 15, 7, "p", "post-transition metal", null, 1.62, null, 5, "solid", [], "predicted"],
  [116, "Lv", "Livermorium", 293, "[293]", 16, 7, "p", "post-transition metal", null, 1.75, null, 6, "solid", [], "predicted"],
  [117, "Ts", "Tennessine", 294, "[294]", 17, 7, "p", "halogen", null, 1.65, null, 7, "solid", [-1, 1], "predicted"],
  [118, "Og", "Oganesson", 294, "[294]", 18, 7, "p", "noble gas", null, 1.57, null, 8, "gas", [], "predicted"],
];

function fromCore(element: ElementData): PeriodicElementData {
  const digits = element.mass < 10 ? 5 : 6;
  const massLabel = Number(element.mass.toPrecision(digits)).toString();
  return {
    z: element.z,
    symbol: element.symbol,
    name: element.name,
    mass: element.mass,
    massLabel,
    group: element.group,
    period: element.period,
    block: element.block,
    category: element.category,
    en: element.en,
    rCov: element.rCov,
    ionizationEnergy: element.ionizationEnergy,
    valenceElectrons: element.valenceElectrons,
    state: element.state,
    commonIons: element.commonIons,
    tableRow: element.period,
    tableColumn: element.group,
    confidence: "reference",
  };
}

function fromExtra(row: ExtraRow): PeriodicElementData {
  const [z, symbol, name, mass, massLabel, group, period, block, category, en, rCov, ionizationEnergy, valenceElectrons, state, commonIons, confidence] = row;
  const isLanthanide = z >= 57 && z <= 71;
  const isActinide = z >= 89 && z <= 103;
  return {
    z, symbol, name, mass, massLabel, group, period, block, category,
    en, rCov, ionizationEnergy, valenceElectrons, state, commonIons,
    tableRow: isLanthanide ? 8 : isActinide ? 9 : period,
    tableColumn: isLanthanide ? 3 + (z - 57) : isActinide ? 3 + (z - 89) : group,
    confidence,
  };
}

export const PERIODIC_ELEMENTS: PeriodicElementData[] = [
  ...ELEMENTS.map(fromCore),
  ...EXTRA.map(fromExtra),
].sort((a, b) => a.z - b.z);

export const PERIODIC_ELEMENT_BY_Z = new Map(PERIODIC_ELEMENTS.map((element) => [element.z, element]));
export const PERIODIC_ELEMENT_BY_SYMBOL = new Map(
  PERIODIC_ELEMENTS.flatMap((element) => [
    [element.symbol, element] as const,
    [element.symbol.toLowerCase(), element] as const,
  ])
);

export function toPeriodicElement(element: ElementData): PeriodicElementData {
  return PERIODIC_ELEMENT_BY_Z.get(element.z) ?? fromCore(element);
}
