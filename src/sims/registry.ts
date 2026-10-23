/**
 * Simulation registry — the single source of truth for every simulation:
 * metadata for the library page & search, presets for lesson embeds, related
 * concepts, and the lazy-loaded component. Adding a simulation = adding one
 * entry here.
 */
import type { SimMeta } from "./types";

export const SIM_CATEGORIES = [
  { id: "atomic", label: "Atomic Structure & Subatomic Particles" },
  { id: "electrons", label: "Electron Configurations & Orbitals" },
  { id: "lewis", label: "Valence Electrons & Lewis Structures" },
  { id: "bonding", label: "Ionic, Covalent & Metallic Bonding" },
  { id: "molecules", label: "Molecular Construction & Formulas" },
  { id: "vsepr", label: "VSEPR & Molecular Geometry" },
  { id: "polarity", label: "Molecular Polarity & Electronegativity" },
  { id: "imf", label: "Intermolecular Forces" },
  { id: "reactions", label: "Chemical Reactions" },
] as const;

export const SIMS: SimMeta[] = [
  {
    id: "atom-builder",
    name: "Atom Builder",
    tagline: "Assemble atoms, isotopes, and ions from protons, neutrons, and electrons",
    description:
      "Build any atom from its subatomic particles and watch the consequences: protons set the element's identity, neutrons set the isotope, and electrons set the charge. Form cations and anions, see isotope notation (ᴬZX), electron configurations, nuclear-stability hints, and an animated 3-D Bohr model with a clear disclaimer about its limits.",
    category: "atomic",
    keywords: [
      "proton", "neutron", "electron", "subatomic", "isotope", "ion", "cation", "anion",
      "bohr model", "atomic number", "mass number", "charge", "nucleus", "nuclear stability",
      "belt of stability", "transmutation", "build an atom", "ions", "electron count",
    ],
    icon: "⚛️",
    units: [1, 3, 8],
    concepts: ["atom", "isotope", "ion", "cation", "anion", "bohr-model", "subatomic-particles", "atomic-number", "mass-number"],
    accent: "#4cc3ff",
    presets: [
      { id: "carbon-12", label: "Carbon-12", description: "The atomic-mass standard: 6p, 6n, 6e." },
      { id: "carbon-14", label: "Carbon-14", description: "The radioisotope behind radiocarbon dating." },
      { id: "na-ion", label: "Sodium ion Na⁺", description: "Metal loses its 3s electron → [Ne]." },
      { id: "cl-ion", label: "Chloride ion Cl⁻", description: "Nonmetal gains an electron → [Ar]." },
      { id: "mg2+", label: "Mg²⁺", description: "Group 2 loses two electrons." },
      { id: "fe2+", label: "Iron(II) Fe²⁺", description: "Transition metal: 4s electrons go first." },
      { id: "fe3+", label: "Iron(III) Fe³⁺", description: "Half-filled d⁵ stability." },
      { id: "o2-", label: "Oxide O²⁻", description: "Isoelectronic with neon." },
      { id: "al3+", label: "Aluminum Al³⁺", description: "Group 13 → +3." },
      { id: "hydrogen", label: "Hydrogen-1", description: "One proton, one electron, no neutrons." },
    ],
    load: () => import("./AtomBuilder"),
  },
  {
    id: "electron-config",
    name: "Electron Configuration Lab",
    tagline: "Fill orbitals by aufbau, Hund, and Pauli — with 3-D orbital shapes",
    description:
      "Build ground-state electron configurations one electron at a time. Orbital box diagrams, full and noble-gas notation, 3-D boundary surfaces for s/p/d orbitals, cation/anion modes (transition metals lose 4s before 3d), the Cr/Cu exceptions with a predicted-vs-observed toggle, and step-by-step explanations naming the rule behind every electron placement.",
    category: "electrons",
    keywords: [
      "electron configuration", "aufbau", "hund's rule", "pauli exclusion", "orbital diagram",
      "orbitals", "spdf", "noble gas notation", "valence", "unpaired electrons", "quantum",
      "subshell", "energy levels", "excited state", "ground state", "cr cu exception", "4s 3d",
    ],
    icon: "🌀",
    units: [1, 3],
    concepts: ["electron-configuration", "aufbau", "hund", "pauli", "orbitals", "valence-electrons", "quantum-numbers"],
    accent: "#a78bfa",
    presets: [
      { id: "oxygen", label: "Oxygen", description: "Hund's rule in action: 2p⁴ has two unpaired electrons." },
      { id: "sodium", label: "Sodium", description: "Noble-gas shorthand [Ne] 3s¹." },
      { id: "iron", label: "Iron", description: "d-block filling order." },
      { id: "fe2+", label: "Fe²⁺", description: "Lose 4s before 3d." },
      { id: "chromium", label: "Chromium", description: "The 4s¹3d⁵ exception." },
      { id: "copper", label: "Copper", description: "The 4s¹3d¹⁰ exception." },
      { id: "cl-", label: "Chloride", description: "Anion: add to the valence shell." },
    ],
    load: () => import("./ElectronConfigLab"),
  },
  {
    id: "periodic-explorer",
    name: "Periodic Trends Explorer",
    tagline: "Heat-map the table by electronegativity, IE, radius — and compare elements",
    description:
      "An interactive periodic table (Z = 1–56) that color-codes categories or property heatmaps — electronegativity, ionization energy, covalent radius, valence electrons, state. Click any element for a full data card, or use Compare mode for side-by-side trend reasoning based on effective nuclear charge and shielding.",
    category: "atomic",
    keywords: [
      "periodic table", "periodic trends", "electronegativity", "ionization energy", "atomic radius",
      "metallic character", "groups", "periods", "effective nuclear charge", "shielding", "zeff",
      "element properties", "compare elements", "valence electrons", "blocks",
    ],
    icon: "🗂️",
    units: [1, 2],
    concepts: ["periodic-trends", "electronegativity", "ionization-energy", "atomic-radius", "shielding", "zeff"],
    accent: "#34d399",
    presets: [
      { id: "trends-en", label: "Electronegativity heatmap", description: "F = 3.98 at the top-right peak." },
      { id: "default", label: "Category view", description: "Metals, nonmetals, metalloids." },
    ],
    load: () => import("./PeriodicExplorer"),
  },
  {
    id: "ionic-bonding",
    name: "Ionic Bonding Lab",
    tagline: "Transfer electrons from metal to nonmetal and assemble the lattice",
    description:
      "Pick a metal and a nonmetal; the lab derives the formula unit by charge balance, then you transfer electrons one at a time between 3-D Bohr atoms until both reach noble-gas configurations. Assemble the ions into a lattice fragment and compare Coulombic lattice strength q₊q₋/(r₊+r₋) and real melting points across compounds.",
    category: "bonding",
    keywords: [
      "ionic bond", "electron transfer", "lattice", "lattice energy", "coulomb's law",
      "formula unit", "criss cross", "charge balance", "isoelectronic", "noble gas configuration",
      "ionic compound", "melting point", "cation anion", "electrostatic",
    ],
    icon: "🧲",
    units: [1, 2, 3],
    concepts: ["ionic-bond", "ion", "lattice-energy", "coulomb-law", "electronegativity", "isoelectronic"],
    accent: "#f87171",
    presets: [
      { id: "nacl", label: "NaCl", description: "The classic 1:1 salt." },
      { id: "mgo", label: "MgO", description: "2+/2− charges → enormous lattice energy (mp 2852 °C)." },
      { id: "cacl2", label: "CaCl₂", description: "Charge balance makes a 1:2 ratio." },
      { id: "li2o", label: "Li₂O", description: "A 2:1 ratio." },
      { id: "al2o3", label: "Al₂O₃", description: "3+ and 2− cross over to 2:3." },
      { id: "naf", label: "NaF", description: "Compare with NaCl: smaller ions, stronger lattice." },
    ],
    load: () => import("./IonicBondingLab"),
  },
  {
    id: "lewis-studio",
    name: "Lewis Structure Studio",
    tagline: "Read Lewis diagrams deeply: bookkeeping, formal charge, resonance",
    description:
      "Load any species from the 40+ molecule library and dissect its Lewis structure: full valence-electron bookkeeping (ΣV − charge → bonds → lone pairs), per-atom formal charges with the FC formula shown, a resonance carousel with hybrid explanation, octet/validity reports, and the linked 3-D VSEPR model beside the 2-D diagram.",
    category: "lewis",
    keywords: [
      "lewis structure", "lewis dot", "electron dot", "formal charge", "resonance", "octet rule",
      "valence electrons", "lone pairs", "bonding pairs", "electron bookkeeping", "delocalized",
      "resonance hybrid", "polyatomic ions", "dot diagram",
    ],
    icon: "🔵",
    units: [2],
    concepts: ["lewis-structure", "formal-charge", "resonance", "octet-rule", "valence-electrons", "lone-pair"],
    accent: "#38bdf8",
    presets: [
      { id: "no3", label: "Nitrate NO₃⁻", description: "Three equivalent resonance forms." },
      { id: "co3", label: "Carbonate CO₃²⁻", description: "Classic resonance + formal charges." },
      { id: "o3", label: "Ozone O₃", description: "Bent with resonance." },
      { id: "so4", label: "Sulfate SO₄²⁻", description: "Expanded octet debate + six resonance forms." },
      { id: "co", label: "Carbon monoxide", description: "Triple bond with formal charges." },
      { id: "nh4", label: "Ammonium NH₄⁺", description: "Cation from a lone pair grabbing H⁺." },
      { id: "bf3", label: "BF₃", description: "Octet exception: electron-deficient boron." },
      { id: "sf6", label: "SF₆", description: "Expanded octet: 12 electrons on S." },
    ],
    load: () => import("./LewisStudio"),
  },
  {
    id: "molecule-builder",
    name: "3-D Molecule Builder",
    tagline: "Construct molecules atom by atom — with chemistry enforcement",
    description:
      "The full construction sandbox: add atoms from an element library, connect them with single/double/triple bonds, add or remove electrons to form ions, and watch four linked views update live — 3-D ball-and-stick, 2-D Lewis diagram, formula/charge/molar-mass bookkeeping, and VSEPR shape with bond angles and hybridization. Invalid operations are blocked with explanations (octet violations, H with two bonds, F double bonds…), and a one-click pass minimizes formal charges.",
    category: "molecules",
    keywords: [
      "molecule builder", "build molecules", "construct", "bonding", "single bond", "double bond",
      "triple bond", "connect atoms", "molecular formula", "molar mass", "vsepr", "lewis",
      "lone pairs", "formal charge", "expanded octet", "chemical structure", "3d molecules",
      "valence", "ions", "polyatomic", "organic",
    ],
    icon: "🧬",
    units: [2, 3],
    concepts: ["covalent-bond", "lewis-structure", "octet-rule", "formal-charge", "vsepr", "molecular-geometry", "molar-mass"],
    accent: "#4ade80",
    presets: [
      { id: "h2o", label: "Water", description: "Bent AX₂E₂ with two lone pairs." },
      { id: "ch4", label: "Methane", description: "Tetrahedral AX₄." },
      { id: "co2", label: "Carbon dioxide", description: "Linear with double bonds." },
      { id: "nh3", label: "Ammonia", description: "Trigonal pyramidal." },
      { id: "co3", label: "Carbonate", description: "Resonance polyatomic ion." },
      { id: "c2h4", label: "Ethene", description: "C=C double bond, planar." },
      { id: "sf6", label: "SF₆", description: "Octahedral expanded octet." },
      { id: "blank", label: "Blank workspace", description: "Start from scratch." },
    ],
    load: () => import("./MoleculeBuilder"),
  },
  {
    id: "vsepr-lab",
    name: "VSEPR Geometry Lab",
    tagline: "Every molecular shape on the AP exam, in 3-D, with lone pairs",
    description:
      "Set the central atom, number of bonded atoms (X), and lone pairs (E) to explore all twelve VSEPR geometries — linear to square planar. See AXE notation, electron-group vs molecular geometry, bond angles with lone-pair compression, hybridization, Lewis and 3-D views, and a reference table of every shape. Presets load the classic examples (CH₄, NH₃, H₂O, SF₄, XeF₄…).",
    category: "vsepr",
    keywords: [
      "vsepr", "molecular geometry", "molecular shape", "electron geometry", "tetrahedral",
      "trigonal planar", "trigonal pyramidal", "bent", "linear", "octahedral", "seesaw",
      "t-shaped", "square planar", "square pyramidal", "trigonal bipyramidal", "bond angle",
      "109.5", "120", "180", "lone pair repulsion", "axe notation", "steric number",
      "electron groups", "hybridization", "shape", "shape of molecules", "molecular shapes",
      "molecule shapes", "3d shapes",
    ],
    icon: "📐",
    units: [2],
    concepts: ["vsepr", "molecular-geometry", "electron-groups", "bond-angle", "hybridization", "lone-pair"],
    accent: "#fbbf24",
    presets: [
      { id: "tetrahedral", label: "Tetrahedral (CH₄)", description: "AX₄, 109.5°." },
      { id: "bent-109", label: "Bent (H₂O)", description: "AX₂E₂, 104.5°." },
      { id: "pyramidal", label: "Trigonal pyramidal (NH₃)", description: "AX₃E₁, 107°." },
      { id: "trigonal-planar", label: "Trigonal planar (BF₃)", description: "AX₃, 120°." },
      { id: "linear", label: "Linear (CO₂)", description: "AX₂, 180°." },
      { id: "tbp", label: "Trigonal bipyramidal (PCl₅)", description: "AX₅." },
      { id: "octahedral", label: "Octahedral (SF₆)", description: "AX₆." },
      { id: "seesaw", label: "Seesaw (SF₄)", description: "AX₄E₁." },
      { id: "square-planar", label: "Square planar (XeF₄)", description: "AX₄E₂." },
      { id: "linear-lp", label: "Linear w/ 3 LPs (XeF₂)", description: "AX₂E₃." },
    ],
    load: () => import("./VseprLab"),
  },
  {
    id: "bond-polarity",
    name: "Bond Polarity & Electronegativity",
    tagline: "ΔEN, percent ionic character, PE curves, and the electron sea",
    description:
      "Pick any two elements and classify the bond: ΔEN gauge, percent ionic character, a 3-D bond with the shared electron cloud visibly shifted toward the more electronegative atom (δ+/δ−), the full potential-energy vs distance curve you can drag along (find the bond-length minimum and bond energy), and a metallic-bonding electron-sea view.",
    category: "bonding",
    keywords: [
      "electronegativity", "bond polarity", "polar bond", "nonpolar", "ionic character", "delta en",
      "potential energy curve", "bond energy", "bond length", "morse", "metallic bonding",
      "electron sea", "delocalized", "dipole", "partial charge", "covalent vs ionic",
    ],
    icon: "⚖️",
    units: [2, 3],
    concepts: ["electronegativity", "bond-polarity", "ionic-bond", "covalent-bond", "metallic-bond", "bond-energy", "potential-energy-curve"],
    accent: "#fb923c",
    presets: [
      { id: "hcl", label: "H–Cl", description: "Polar covalent, ΔEN = 0.96." },
      { id: "nacl", label: "Na–Cl", description: "Ionic, ΔEN = 2.23." },
      { id: "cl2", label: "Cl–Cl", description: "Pure nonpolar, ΔEN = 0." },
      { id: "hf", label: "H–F", description: "The most polar 'covalent' bond." },
      { id: "ch", label: "C–H", description: "Nearly nonpolar (ΔEN = 0.35)." },
    ],
    load: () => import("./BondPolarity"),
  },
  {
    id: "bond-length-lab",
    name: "Molecular Bond Length Explorer",
    tagline: "Add molecules, annotate every bond in Å, and explore its energy well",
    description:
      "Search and compare up to four molecules from the built-in structure library. Every bond is labeled with a reference or covalent-radius estimate; click a bond to adjust internuclear distance on a Morse potential-energy curve. Resonance structures can be averaged to show why equivalent bonds become the same intermediate length. Use the Molecule Builder for a custom connectivity graph.",
    category: "bonding",
    keywords: [
      "bond length", "bond-length diagram", "bond length diagram", "potential energy curve", "potential-energy diagram",
      "internuclear distance", "bond order", "bond energy", "morse potential", "molecule bond lengths",
      "compare molecules", "resonance bond length", "bond length vs bond order", "angstrom", "pm",
    ],
    icon: "📏",
    units: [2],
    concepts: ["bond-length", "bond-energy", "potential-energy-curve", "resonance", "covalent-bond"],
    accent: "#49bdb4",
    presets: [
      { id: "c2h4", label: "Ethene · C=C and C–H", description: "Compare double and single bonds in one molecule." },
      { id: "n2", label: "Nitrogen · N≡N", description: "A short, exceptionally strong triple bond." },
      { id: "co2", label: "Carbon dioxide · C=O", description: "Two equivalent double bonds." },
      { id: "h2o", label: "Water · O–H", description: "Reference O–H bond length and curve." },
      { id: "co3", label: "Carbonate · resonance", description: "See the average length of three equivalent C–O bonds." },
    ],
    load: () => import("./BondLengthLab"),
  },
  {
    id: "molecular-polarity",
    name: "Molecular Polarity",
    tagline: "Bond dipoles as vectors — see when they cancel and when they don't",
    description:
      "The exam's favorite trap in 3-D: polar bonds don't guarantee a polar molecule. Load any species, watch its bond dipoles and lone-pair contributions sum vectorially to a net dipole (or cancel), and run head-to-head comparisons — CO₂ vs H₂O, CH₄ vs CH₃Cl, BF₃ vs NH₃ — each with the symmetry argument spelled out.",
    category: "polarity",
    keywords: [
      "polarity", "polar molecule", "nonpolar molecule", "dipole moment", "bond dipole",
      "vector", "cancellation", "symmetry", "co2 vs h2o", "net dipole", "asymmetric",
      "lone pair effect", "solubility", "like dissolves like",
    ],
    icon: "🧭",
    units: [2, 3],
    concepts: ["molecular-polarity", "bond-dipole", "vsepr", "electronegativity", "dipole-dipole"],
    accent: "#f472b6",
    presets: [
      { id: "co2-vs-h2o", label: "CO₂ vs H₂O", description: "Symmetry decides everything." },
      { id: "ch4-vs-ch3cl", label: "CH₄ vs CH₃Cl", description: "One substitution breaks the symmetry." },
      { id: "bf3-vs-nh3", label: "BF₃ vs NH₃", description: "Lone pairs wreck planarity." },
      { id: "h2o", label: "Water (single)", description: "Strongly polar, bent." },
      { id: "ccl4", label: "CCl₄ (single)", description: "Polar bonds, nonpolar molecule." },
    ],
    load: () => import("./MolecularPolarity"),
  },
  {
    id: "imf-lab",
    name: "Intermolecular Forces Lab",
    tagline: "A box of real molecules under LDFs, dipoles, and hydrogen bonds",
    description:
      "Watch a crowd of 3-D molecules interact under its predicted intermolecular force. The lab predicts LDF / dipole–dipole / hydrogen bonding from structure, animates attraction vs thermal motion in a particle box (crank the temperature to melt and boil!), draws H-bond links, and grounds it all in real boiling-point datasets: halogens, group hydrides and their anomalies, isomers, and alkanes.",
    category: "imf",
    keywords: [
      "intermolecular forces", "imf", "london dispersion", "dispersion", "dipole-dipole",
      "hydrogen bonding", "hydrogen bond", "boiling point", "vapor pressure", "polarizability",
      "phase", "melting", "evaporation", "viscosity", "surface tension", "ldf", "van der waals",
      "states of matter", "temperature",
    ],
    icon: "🫧",
    units: [3],
    concepts: ["intermolecular-forces", "ldf", "dipole-dipole", "hydrogen-bond", "polarizability", "boiling-point", "vapor-pressure"],
    accent: "#22d3ee",
    presets: [
      { id: "h2o", label: "Water box", description: "Hydrogen bonding network." },
      { id: "ch4", label: "Methane box", description: "LDF only — boils at −161 °C." },
      { id: "nh3", label: "Ammonia box", description: "H-bond donor and acceptor." },
      { id: "hcl", label: "HCl box", description: "Dipole–dipole, no H-bonding." },
      { id: "group16", label: "Group 16 hydride data", description: "The H₂O anomaly." },
      { id: "halogens", label: "Halogen data", description: "LDF size trend." },
    ],
    load: () => import("./IMFLab"),
  },
  {
    id: "reaction-viewer",
    name: "Reaction Viewer",
    tagline: "Particulate-level reactions and balancing practice",
    description:
      "See reactions the way particles do: 3-D boxes of reactant and product molecules in exact coefficient ratios (formation of water, combustion of methane, Haber process, electrolysis…). Switch to Balance mode to reconstruct coefficients from atom conservation with a live atom-inventory table, or classify reaction types.",
    category: "reactions",
    keywords: [
      "chemical reaction", "balancing", "balance equations", "coefficients", "stoichiometry",
      "particulate", "conservation of mass", "synthesis", "decomposition", "combustion",
      "single replacement", "double replacement", "reaction types", "haber process", "electrolysis",
    ],
    icon: "⚗️",
    units: [4],
    concepts: ["chemical-reaction", "balancing-equations", "stoichiometry", "law-conservation-mass", "reaction-types"],
    accent: "#c084fc",
    presets: [
      { id: "water", label: "2H₂ + O₂ → 2H₂O", description: "The classic synthesis." },
      { id: "methane", label: "CH₄ + 2O₂ → CO₂ + 2H₂O", description: "Combustion of natural gas." },
      { id: "haber", label: "N₂ + 3H₂ → 2NH₃", description: "Industrial ammonia." },
      { id: "water-split", label: "2H₂O → 2H₂ + O₂", description: "Electrolysis." },
      { id: "ethene", label: "C₂H₄ + 3O₂ → 2CO₂ + 2H₂O", description: "Organic combustion." },
      { id: "hcl", label: "H₂ + Cl₂ → 2HCl", description: "Diatomic synthesis." },
      { id: "co-burn", label: "2CO + O₂ → 2CO₂", description: "CO combustion." },
      { id: "nh3-decomp", label: "2NH₃ → N₂ + 3H₂", description: "Decomposition." },
      { id: "halogenation", label: "CH₄ + Cl₂ → CH₃Cl + HCl", description: "Organic substitution." },
    ],
    load: () => import("./ReactionViewer"),
  },
];

export const SIM_MAP = new Map(SIMS.map((s) => [s.id, s]));

export function getSim(id: string): SimMeta | undefined {
  return SIM_MAP.get(id);
}

export function simsForCategory(catId: string): SimMeta[] {
  return SIMS.filter((s) => s.category === catId);
}

export function simsForUnit(unit: number): SimMeta[] {
  return SIMS.filter((s) => s.units.includes(unit));
}
