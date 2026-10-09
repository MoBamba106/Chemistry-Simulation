/**
 * Concept registry — the encyclopedia layer.
 *
 * Every concept has a short definition (popover), an optional deeper
 * explanation, links to simulations and lessons, and optionally a 3-D
 * molecule preview. Lesson text references concepts with [[concept-id]] —
 * rendering a Wikipedia-style link whose popover is generated from HERE, so
 * definitions are written once and reused everywhere (search, popovers,
 * concept pages, lesson sidebars).
 *
 * Adding a concept = adding one entry; it immediately becomes linkable,
 * searchable, and previewable.
 */

export interface Concept {
  id: string;
  term: string;
  /** Alternative terms users might search or read. */
  aliases?: string[];
  /** 1–3 sentence definition shown in popovers and concept pages. */
  short: string;
  /** Optional deeper paragraph for the concept page. */
  detail?: string;
  /** Key equation (KaTeX). */
  equation?: string;
  /** Simulation ids where this concept can be explored. */
  sims?: string[];
  /** Lesson (topic) ids that teach this concept. */
  lessons?: string[];
  /** Molecule library id to preview in 3-D. */
  molecule?: string;
  related?: string[];
}

export const CONCEPTS: Concept[] = [
  /* ---------------- Unit 1: atomic structure ---------------- */
  {
    id: "atom", term: "Atom",
    short: "The smallest particle of an element that retains its chemical identity: a dense nucleus of protons and neutrons surrounded by electrons in quantized energy levels.",
    detail: "Atoms are ~10⁻¹⁰ m across but their nuclei are ~10⁻¹⁵ m — if an atom were a stadium, the nucleus would be a marble at center field. Nearly all the mass is in the nucleus; nearly all the volume is 'electron probability'.",
    sims: ["atom-builder"], lessons: ["1.5", "3.13"], related: ["subatomic-particles", "isotope", "ion"],
  },
  {
    id: "subatomic-particles", term: "Subatomic particles", aliases: ["proton", "neutron", "electron"],
    short: "Protons (+1, ≈1 amu, define the element), neutrons (0, ≈1 amu, define the isotope), and electrons (−1, ≈1/1836 amu, define the charge and the chemistry).",
    detail: "Chemical reactions rearrange electrons; nuclear reactions change protons and neutrons. That's why chemistry is 'only' about electrons.",
    sims: ["atom-builder"], lessons: ["1.5"], related: ["atom", "atomic-number", "mass-number"],
  },
  {
    id: "proton", term: "Proton",
    short: "Positively charged nucleon (≈1.0073 amu). The proton count Z is the atomic number — it defines which element an atom is.",
    sims: ["atom-builder"], lessons: ["1.5"], related: ["atomic-number", "subatomic-particles"],
  },
  {
    id: "neutron", term: "Neutron",
    short: "Neutral nucleon (≈1.0087 amu). Neutrons add mass and nuclear stability without changing chemical identity — atoms of the same element with different neutron counts are isotopes.",
    sims: ["atom-builder"], lessons: ["1.5", "1.2"], related: ["isotope", "mass-number"],
  },
  {
    id: "electron", term: "Electron",
    short: "Negatively charged particle (−1, ≈0.00055 amu) occupying quantized orbitals. Electron arrangement controls bonding, reactivity, and virtually all of chemistry.",
    sims: ["atom-builder", "electron-config"], lessons: ["1.5", "1.8"], related: ["orbitals", "electron-configuration", "valence-electrons"],
  },
  {
    id: "atomic-number", term: "Atomic number (Z)",
    short: "The number of protons in a nucleus. Z uniquely identifies the element and equals the electron count in a neutral atom.",
    sims: ["atom-builder", "periodic-explorer"], lessons: ["1.5"],
  },
  {
    id: "mass-number", term: "Mass number (A)",
    short: "Protons + neutrons in a specific isotope (a whole number). Distinct from atomic mass, the weighted average over isotopes on the periodic table.",
    sims: ["atom-builder"], lessons: ["1.2", "1.5"], related: ["isotope", "average-atomic-mass"],
  },
  {
    id: "isotope", term: "Isotope",
    short: "Atoms of the same element (same Z) with different neutron counts, hence different mass numbers — e.g. carbon-12 and carbon-14. Isotopes are chemically near-identical but physically distinguishable by mass.",
    detail: "Because chemistry lives in the electrons, isotopes behave almost the same in reactions; their differences show up in mass spectrometry, density, and nuclear stability.",
    sims: ["atom-builder"], lessons: ["1.2", "1.1"], related: ["mass-spectroscopy", "average-atomic-mass"],
  },
  {
    id: "ion", term: "Ion",
    short: "An atom or molecule whose electron count differs from its proton count, giving a net charge. Cations (+) form by losing electrons; anions (−) by gaining them.",
    sims: ["atom-builder", "ionic-bonding", "molecule-builder"], lessons: ["1.8", "2.1"], related: ["cation", "anion", "isoelectronic"],
  },
  {
    id: "cation", term: "Cation",
    short: "A positively charged ion formed by losing electrons — typically metals losing valence electrons to reach a noble-gas configuration (Na → Na⁺ + e⁻). Cations are smaller than their parent atoms.",
    sims: ["atom-builder", "ionic-bonding"], lessons: ["1.8"], related: ["ion", "ionization-energy"],
  },
  {
    id: "anion", term: "Anion",
    short: "A negatively charged ion formed by gaining electrons — typically nonmetals completing their valence octet (Cl + e⁻ → Cl⁻). Anions are larger than their parent atoms.",
    sims: ["atom-builder", "ionic-bonding"], lessons: ["1.8"], related: ["ion", "electron-affinity"],
  },
  {
    id: "isoelectronic", term: "Isoelectronic series",
    short: "Species with the same electron configuration but different nuclear charges (O²⁻, F⁻, Ne, Na⁺, Mg²⁺ all have 10 electrons). More protons = tighter pull = smaller radius.",
    lessons: ["1.8"], related: ["ion", "atomic-radius"],
  },
  {
    id: "mole", term: "Mole", aliases: ["avogadro's number"],
    short: "The chemist's counting unit: 1 mol = 6.022 × 10²³ particles (Avogadro's number), defined so that 1 mol of amu-mass equals 1 gram. Moles bridge the atomic and laboratory scales.",
    equation: "n = \\frac{m}{M}",
    lessons: ["1.1", "4.5"], related: ["molar-mass", "avogadro"],
  },
  {
    id: "avogadro", term: "Avogadro's number",
    short: "6.022 × 10²³ — the number of particles in exactly one mole. It converts between countable particles and weighable grams.",
    lessons: ["1.1"], related: ["mole"],
  },
  {
    id: "molar-mass", term: "Molar mass",
    short: "The mass of one mole of a substance (g/mol), numerically equal to its formula mass in amu. Computed by summing atomic masses from the periodic table.",
    equation: "M = \\sum_i n_i M_i",
    sims: ["molecule-builder"], lessons: ["1.1", "1.3"], related: ["mole", "empirical-formula"],
  },
  {
    id: "mass-spectroscopy", term: "Mass spectrometry", aliases: ["mass spec", "mass spectroscopy"],
    short: "An instrument that ionizes atoms/molecules, accelerates them, and separates them by mass-to-charge ratio. Peaks reveal isotopes and their relative abundances; the weighted average gives atomic mass.",
    detail: "In a mass spectrum of an element, each peak is one isotope: x-position = mass, peak height/area = relative abundance. Average atomic mass = Σ(fraction × mass).",
    lessons: ["1.2"], related: ["isotope", "average-atomic-mass"],
  },
  {
    id: "average-atomic-mass", term: "Average atomic mass",
    short: "The weighted mean of isotope masses by natural abundance — why chlorine is 35.45 amu (¾ Cl-35, ¼ Cl-37) rather than a whole number.",
    equation: "\\bar{m} = \\sum_i f_i m_i",
    lessons: ["1.2"], related: ["isotope", "mass-spectroscopy"],
  },
  {
    id: "percent-composition", term: "Percent composition",
    short: "The mass percent of each element in a compound: (mass of element in 1 mol / molar mass) × 100. Pure compounds have fixed percent composition (law of definite proportions).",
    lessons: ["1.3"], related: ["empirical-formula", "molar-mass"],
  },
  {
    id: "empirical-formula", term: "Empirical formula",
    short: "The simplest whole-number ratio of atoms in a compound (CH₂O for glucose C₆H₁₂O₆). Derived from percent composition by converting to moles and dividing by the smallest.",
    lessons: ["1.3"], related: ["molecular-formula", "percent-composition"],
  },
  {
    id: "molecular-formula", term: "Molecular formula",
    short: "The actual atom count per molecule. It equals the empirical formula multiplied by an integer n = molar mass / empirical mass.",
    sims: ["molecule-builder"], lessons: ["1.3"], related: ["empirical-formula"],
  },
  {
    id: "bohr-model", term: "Bohr model",
    short: "An early quantized atom picture: electrons orbit at fixed energies and absorb/emit photons when jumping levels. It explains hydrogen's line spectrum but is superseded by orbital (quantum) models.",
    detail: "Bohr's key insight — energy is quantized — survives; his planetary orbits do not. Modern quantum mechanics replaces orbits with orbitals: probability distributions.",
    sims: ["atom-builder"], lessons: ["3.13", "1.5"], related: ["orbitals", "emission-spectrum"],
  },
  {
    id: "orbitals", term: "Orbital", aliases: ["atomic orbital", "s orbital", "p orbital", "d orbital"],
    short: "A 3-D region where an electron is probably found (~90% probability surface), defined by quantum numbers. Shapes: s = sphere, p = dumbbell (3 orientations), d = cloverleaf (5 orientations).",
    detail: "Orbitals are not orbits. They are wave-function solutions: standing patterns of electron probability. Each orbital holds ≤ 2 electrons of opposite spin.",
    sims: ["electron-config"], lessons: ["1.5", "2.7"], related: ["electron-configuration", "quantum-numbers", "hybridization"],
  },
  {
    id: "electron-configuration", term: "Electron configuration",
    short: "The arrangement of an atom's electrons among subshells (e.g. O: 1s² 2s² 2p⁴), built with the aufbau principle, Pauli exclusion, and Hund's rule. It explains the periodic table's shape and an element's chemistry.",
    sims: ["electron-config", "atom-builder"], lessons: ["1.5", "1.8"], related: ["aufbau", "hund", "pauli", "valence-electrons"],
  },
  {
    id: "aufbau", term: "Aufbau principle", aliases: ["building-up principle"],
    short: "Electrons occupy the lowest-energy subshells first: 1s → 2s → 2p → 3s → 3p → 4s → 3d… The n + ℓ rule orders subshell energies (4s fills before 3d; but 4s also ionizes first).",
    sims: ["electron-config"], lessons: ["1.5"], related: ["electron-configuration", "hund", "pauli"],
  },
  {
    id: "hund", term: "Hund's rule",
    short: "Within a subshell, electrons fill degenerate orbitals singly with parallel spins before pairing — minimizing electron–electron repulsion.",
    sims: ["electron-config"], lessons: ["1.5"], related: ["electron-configuration", "aufbau"],
  },
  {
    id: "pauli", term: "Pauli exclusion principle",
    short: "No two electrons in an atom share all four quantum numbers — so an orbital holds at most two electrons, and they must have opposite spins.",
    sims: ["electron-config"], lessons: ["1.5"], related: ["quantum-numbers", "electron-configuration"],
  },
  {
    id: "quantum-numbers", term: "Quantum numbers",
    short: "An electron's address: n (shell/size/energy), ℓ (subshell shape 0–n−1), mℓ (orbital orientation −ℓ…+ℓ), ms (spin ±½).",
    lessons: ["1.5"], related: ["orbitals", "pauli"],
  },
  {
    id: "valence-electrons", term: "Valence electrons",
    short: "The outermost-shell electrons available for bonding — the group number for main-group elements. They, and only they, participate in Lewis structures.",
    sims: ["molecule-builder", "lewis-studio", "electron-config"], lessons: ["1.5", "2.5"], related: ["electron-configuration", "octet-rule"],
  },
  {
    id: "pes", term: "Photoelectron spectroscopy (PES)", aliases: ["pes spectrum"],
    short: "Bombard atoms with high-energy photons, measure ejected electrons' kinetic energies, and map every subshell's binding energy. Peaks: position = binding energy, height = electron count.",
    detail: "PES is direct experimental evidence for shells AND subshells. 1s electrons appear at the highest binding energy (closest, most attracted); peak heights are proportional to electrons in each subshell.",
    equation: "E_{\\text{photon}} = BE + KE_{\\text{electron}}",
    sims: ["electron-config"], lessons: ["1.6", "3.11"], related: ["electron-configuration", "shielding", "photoelectric-effect"],
  },
  {
    id: "shielding", term: "Shielding (electron screening)",
    short: "Inner-shell electrons partially block outer electrons from the full nuclear charge. Core electrons shield well (~1.0 each); same-shell electrons shield poorly (~0.35).",
    lessons: ["1.7", "1.6"], related: ["zeff", "periodic-trends"],
  },
  {
    id: "zeff", term: "Effective nuclear charge (Z_eff)", aliases: ["effective nuclear charge", "zeff"],
    short: "The net positive charge an electron actually feels: Z_eff = Z − S (protons minus shielding). Rising Z_eff across a period explains shrinking radii and rising ionization energies.",
    equation: "Z_{\\text{eff}} = Z - S",
    sims: ["periodic-explorer"], lessons: ["1.7"], related: ["shielding", "periodic-trends", "atomic-radius"],
  },
  {
    id: "periodic-trends", term: "Periodic trends",
    short: "Predictable property gradients across the table: radius ↓→ and ↑↓; ionization energy, electronegativity, electron affinity ↑→ and ↑↑; metallic character the reverse. All trace to Z_eff vs shell distance.",
    sims: ["periodic-explorer"], lessons: ["1.7"], related: ["atomic-radius", "ionization-energy", "electronegativity"],
  },
  {
    id: "atomic-radius", term: "Atomic radius",
    short: "Half the distance between nuclei of two bonded identical atoms. Decreases across a period (rising Z_eff pulls the same shell in), increases down a group (added shells).",
    sims: ["periodic-explorer"], lessons: ["1.7"], related: ["periodic-trends", "zeff"],
  },
  {
    id: "ionization-energy", term: "Ionization energy", aliases: ["first ionization energy", "ie1"],
    short: "Energy required to remove the most loosely held electron from a gaseous atom. Rises across periods and up groups; big jumps between successive IEs reveal shell boundaries (e.g. Na: IE₂ ≫ IE₁).",
    sims: ["periodic-explorer"], lessons: ["1.7", "1.8"], related: ["periodic-trends", "cation"],
  },
  {
    id: "electronegativity", term: "Electronegativity",
    short: "An atom's pull on SHARED bonding electrons (Pauling scale; F = 3.98 is the max). The ΔEN between bonded atoms decides bond type: <0.4 nonpolar covalent, 0.4–1.7 polar covalent, >1.7 ionic.",
    detail: "Electronegativity trends like ionization energy (up and to the right): small atoms with high Z_eff attract bonding electrons strongly. It's a property of atoms IN bonds — unlike electron affinity, which is for isolated atoms.",
    sims: ["bond-polarity", "periodic-explorer", "molecular-polarity"], lessons: ["2.1", "1.7"], related: ["bond-polarity", "ionic-bond", "covalent-bond", "periodic-trends"],
  },
  {
    id: "electron-affinity", term: "Electron affinity",
    short: "The energy change when a gaseous atom gains an electron. More negative = the atom 'wants' the electron more (halogens most eager; noble gases positive/unfavorable).",
    lessons: ["1.7"], related: ["anion", "electronegativity"],
  },

  /* ---------------- bonding & structure ---------------- */
  {
    id: "chemical-bond", term: "Chemical bond",
    short: "A lasting attraction holding atoms together — always an electrostatic balance between nuclei and electrons, differing in HOW electrons are distributed: transferred (ionic), shared (covalent), pooled (metallic).",
    sims: ["bond-polarity", "ionic-bonding", "molecule-builder"], lessons: ["2.1"], related: ["ionic-bond", "covalent-bond", "metallic-bond"],
  },
  {
    id: "ionic-bond", term: "Ionic bond",
    short: "Electrostatic attraction between cations and anions, formed when ΔEN ≳ 1.7 — electrons are effectively transferred (usually metal → nonmetal). Ionic compounds form lattices, not molecules.",
    detail: "Ionic solids: high melting points, hard but brittle, insulate when solid and conduct when molten/dissolved (ions are free to move). No directional bonds — every ion attracts every neighbor of opposite charge.",
    sims: ["ionic-bonding", "bond-polarity"], lessons: ["2.1", "3.2"], molecule: "nacl-fu", related: ["lattice-energy", "cation", "anion"],
  },
  {
    id: "covalent-bond", term: "Covalent bond",
    short: "A shared pair of electrons between atoms of similar electronegativity — both nuclei attracted to the same electron density, balanced at the bond length (PE minimum).",
    detail: "Covalent bonds are directional, giving molecules definite shapes (VSEPR). Sharing can be equal (nonpolar, ΔEN < 0.4) or unequal (polar, 0.4–1.7) — a continuum, not a switch.",
    sims: ["molecule-builder", "bond-polarity", "lewis-studio"], lessons: ["2.1", "2.2"], molecule: "h2o", related: ["bond-polarity", "sigma-bond", "pi-bond"],
  },
  {
    id: "metallic-bond", term: "Metallic bond",
    short: "Metal cations immersed in a delocalized 'sea' of valence electrons. The mobile electrons explain conductivity, malleability, ductility, and luster.",
    sims: ["bond-polarity"], lessons: ["2.1", "3.2"], related: ["delocalization"],
  },
  {
    id: "lattice-energy", term: "Lattice energy",
    short: "Energy released when gaseous ions assemble into an ionic solid. Governed by Coulomb's law: larger charges and smaller ions → stronger attraction → higher lattice energy and melting point (MgO ≫ NaCl).",
    equation: "U \\propto \\frac{q_+ q_-}{r_+ + r_-}",
    sims: ["ionic-bonding"], lessons: ["2.1", "3.2"], related: ["ionic-bond", "coulomb-law"],
  },
  {
    id: "coulomb-law", term: "Coulomb's law",
    short: "Electrostatic force scales as F ∝ q₁q₂/r². The master key of AP Chemistry: ionization trends, lattice energies, acid strength, ionic radii — all Coulomb's law at work.",
    equation: "F \\propto \\frac{q_1 q_2}{r^2}",
    sims: ["ionic-bonding"], lessons: ["1.7", "2.1", "3.2"], related: ["lattice-energy", "zeff"],
  },
  {
    id: "bond-polarity", term: "Bond polarity",
    short: "Unequal sharing in a covalent bond due to ΔEN — the more electronegative atom carries δ−, the other δ+. Creates a bond dipole measured in debyes.",
    sims: ["bond-polarity", "molecular-polarity"], lessons: ["2.1", "3.1"], related: ["electronegativity", "bond-dipole", "molecular-polarity"],
  },
  {
    id: "bond-dipole", term: "Bond dipole",
    short: "The vector pointing from δ+ to δ− across a polar bond, with magnitude proportional to ΔEN. Molecular polarity is the vector sum of all bond dipoles (plus lone-pair contributions).",
    sims: ["molecular-polarity"], lessons: ["2.7", "3.1"], related: ["bond-polarity", "molecular-polarity"],
  },
  {
    id: "molecular-polarity", term: "Molecular polarity",
    short: "Whether a molecule has a NET dipole: polar bonds must fail to cancel geometrically. Symmetric arrangements of identical bonds (CO₂, CH₄, CCl₄) are nonpolar despite polar bonds; lone pairs or different ligands break symmetry (H₂O, NH₃, CH₃Cl).",
    detail: "Predicting polarity: (1) Lewis structure, (2) VSEPR shape, (3) bond dipoles as vectors, (4) add them. Cancel = nonpolar; nonzero sum = polar. Polarity drives solubility, boiling points, and IMF type.",
    sims: ["molecular-polarity"], lessons: ["2.7", "3.1"], molecule: "h2o", related: ["bond-dipole", "vsepr", "dipole-dipole"],
  },
  {
    id: "lewis-structure", term: "Lewis structure", aliases: ["lewis diagram", "lewis dot structure", "electron dot diagram"],
    short: "A 2-D valence-electron map: element symbols = nuclei + core electrons, lines = shared pairs (bonds), dots = lone pairs. The starting point for shape, polarity, and reactivity reasoning.",
    sims: ["lewis-studio", "molecule-builder"], lessons: ["2.5"], related: ["octet-rule", "formal-charge", "resonance", "valence-electrons"],
  },
  {
    id: "octet-rule", term: "Octet rule",
    short: "Main-group atoms bond toward eight valence electrons (two for H) — a noble-gas configuration. Exceptions: electron-deficient B/Be (6), expanded octets for period 3+ (P, S, Xe — 10 or 12), and odd-electron radicals (NO).",
    sims: ["molecule-builder", "lewis-studio"], lessons: ["2.5"], related: ["lewis-structure", "expanded-octet"],
  },
  {
    id: "expanded-octet", term: "Expanded octet",
    short: "Central atoms in period 3+ (S, P, Cl, Xe…) can host 10 or 12 valence electrons by using d orbitals — e.g. SF₆, PCl₅. Period-2 atoms (C, N, O, F) can NEVER exceed eight.",
    sims: ["molecule-builder", "lewis-studio", "vsepr-lab"], lessons: ["2.5", "2.7"], molecule: "sf6", related: ["octet-rule"],
  },
  {
    id: "formal-charge", term: "Formal charge",
    short: "Bookkeeping charge assuming equal sharing: FC = valence e⁻ − lone e⁻ − ½ bonding e⁻. The best Lewis structures have FCs closest to zero, with any negative FC on the more electronegative atom.",
    equation: "FC = V - L - \\tfrac{1}{2}B",
    sims: ["lewis-studio", "molecule-builder"], lessons: ["2.6"], related: ["lewis-structure", "resonance"],
  },
  {
    id: "resonance", term: "Resonance", aliases: ["resonance hybrid", "delocalization"],
    short: "When one Lewis diagram can't capture the electron distribution, multiple valid structures (same atoms, different electron placements) represent one real molecule — the resonance hybrid, with delocalized electrons and fractional bond orders.",
    detail: "The molecule never 'flips' between forms. In carbonate, all three C–O bonds are identical (order 1⅓) and the −2 charge is smeared over all three oxygens. Resonance stabilizes — delocalization lowers energy.",
    sims: ["lewis-studio"], lessons: ["2.6"], molecule: "co3", related: ["formal-charge", "delocalization"],
  },
  {
    id: "delocalization", term: "Delocalized electrons",
    short: "Electrons spread over several atoms rather than fixed between two — in resonance systems (NO₃⁻), aromatic rings, and metals. Delocalization lowers energy and equalizes bond lengths.",
    lessons: ["2.6", "2.1"], related: ["resonance", "metallic-bond"],
  },
  {
    id: "bond-energy", term: "Bond energy", aliases: ["bond enthalpy"],
    short: "Energy required to break one mole of bonds in gas phase (always endothermic). Shorter, higher-order bonds are stronger: C≡C (839) > C=C (614) > C–C (347) kJ/mol.",
    equation: "\\Delta H_{rxn} \\approx \\sum BE_{\\text{broken}} - \\sum BE_{\\text{formed}}",
    sims: ["bond-polarity"], lessons: ["2.3", "2.4", "6.7"], related: ["bond-length", "potential-energy-curve"],
  },
  {
    id: "bond-length", term: "Bond length",
    short: "The internuclear distance at the potential-energy minimum — where attraction and repulsion balance. Decreases with bond order and with smaller atoms.",
    sims: ["bond-polarity"], lessons: ["2.2", "2.3"], related: ["potential-energy-curve", "bond-energy"],
  },
  {
    id: "potential-energy-curve", term: "Potential energy curve", aliases: ["bonding curve", "pe diagram bonding"],
    short: "PE vs internuclear distance for a bond: at long range PE → 0; attraction pulls it down to a minimum (the bond length; depth = bond energy); at short range nuclear repulsion spikes it up.",
    sims: ["bond-polarity"], lessons: ["2.2"], related: ["bond-length", "bond-energy"],
  },
  {
    id: "vsepr", term: "VSEPR theory", aliases: ["valence shell electron pair repulsion"],
    short: "Valence Shell Electron Pair Repulsion: electron groups (bonds of ANY order count as one group, plus lone pairs) repel and arrange as far apart as possible — linear (2), trigonal planar (3), tetrahedral (4), trigonal bipyramidal (5), octahedral (6).",
    detail: "Repulsion hierarchy LP–LP > LP–BP > BP–BP compresses angles when lone pairs are present: CH₄ 109.5° → NH₃ 107° → H₂O 104.5°. Electron geometry counts all groups; molecular geometry names only the atom positions.",
    sims: ["vsepr-lab", "molecule-builder"], lessons: ["2.7"], related: ["electron-groups", "molecular-geometry", "bond-angle", "hybridization"],
  },
  {
    id: "electron-groups", term: "Electron groups", aliases: ["steric number", "electron domains"],
    short: "Bonds (single, double, or triple — each counts ONCE) plus lone pairs around a central atom. The group count (steric number) selects the electron geometry.",
    sims: ["vsepr-lab"], lessons: ["2.7"], related: ["vsepr", "hybridization"],
  },
  {
    id: "molecular-geometry", term: "Molecular geometry", aliases: ["molecular shape", "shape"],
    short: "The arrangement of ATOMS only (lone pairs are invisible in the shape but dictate it): linear, bent, trigonal planar, trigonal pyramidal, tetrahedral, seesaw, T-shaped, square pyramidal, square planar, trigonal bipyramidal, octahedral.",
    sims: ["vsepr-lab", "molecule-builder"], lessons: ["2.7"], related: ["vsepr", "electron-groups", "bond-angle"],
  },
  {
    id: "bond-angle", term: "Bond angle",
    short: "The angle between bonds at a central atom: 180° (linear), 120° (trigonal planar), 109.5° (tetrahedral), 90/120/180° (trigonal bipyramidal), 90° (octahedral) — each reduced ~2–2.5° per lone pair.",
    sims: ["vsepr-lab"], lessons: ["2.7"], related: ["vsepr", "molecular-geometry"],
  },
  {
    id: "hybridization", term: "Hybridization",
    short: "Mixing atomic orbitals into bonding-ready hybrids matching the electron geometry: 2 groups = sp (linear), 3 = sp² (planar), 4 = sp³ (tetrahedral), 5 = sp³d, 6 = sp³d². Unhybridized p orbitals form π bonds.",
    sims: ["vsepr-lab", "molecule-builder"], lessons: ["2.7"], related: ["vsepr", "sigma-bond", "pi-bond", "orbitals"],
  },
  {
    id: "sigma-bond", term: "Sigma (σ) bond",
    short: "Head-on orbital overlap along the bond axis — the first bond between any two atoms, cylindrically symmetric, freely rotatable.",
    lessons: ["2.7"], related: ["pi-bond", "hybridization", "covalent-bond"],
  },
  {
    id: "pi-bond", term: "Pi (π) bond",
    short: "Side-by-side overlap of parallel p orbitals above and below the bond axis — the second (and third) bond in double/triple bonds. π bonds lock rotation and shorten bonds.",
    sims: ["molecule-builder"], lessons: ["2.7"], molecule: "c2h4", related: ["sigma-bond", "hybridization"],
  },
  {
    id: "lone-pair", term: "Lone pair", aliases: ["nonbonding pair"],
    short: "A valence pair not shared in bonding. Lone pairs repel more strongly than bonding pairs (held by one nucleus, fatter cloud), compressing bond angles — and they can donate into bonds (Lewis bases, coordinate covalency).",
    sims: ["vsepr-lab", "molecule-builder", "lewis-studio"], lessons: ["2.5", "2.7"], related: ["vsepr", "lewis-acid-base"],
  },

  /* ---------------- IMFs & bulk properties ---------------- */
  {
    id: "intermolecular-forces", term: "Intermolecular forces", aliases: ["imf", "van der waals forces"],
    short: "Attractions BETWEEN molecules (not within them): London dispersion (all particles), dipole–dipole (polar molecules), hydrogen bonding (H bonded to N/O/F near a lone pair). IMFs set boiling points, viscosity, and solubility; bonds set identity.",
    detail: "Strength ladder: LDF (weakest, universal) < dipole–dipole < hydrogen bonding ≪ covalent/ionic bonds. Boiling a substance overcomes IMFs only — the molecules themselves stay intact.",
    sims: ["imf-lab", "molecular-polarity"], lessons: ["3.1"], related: ["ldf", "dipole-dipole", "hydrogen-bond", "boiling-point"],
  },
  {
    id: "ldf", term: "London dispersion forces", aliases: ["dispersion forces", "london forces", "induced dipole"],
    short: "Momentary electron-density fluctuations create instantaneous dipoles that induce dipoles in neighbors. Present in ALL particles; the only force in nonpolar ones. Strength grows with polarizability (electron count, cloud size, chain length).",
    sims: ["imf-lab"], lessons: ["3.1"], related: ["polarizability", "intermolecular-forces", "boiling-point"],
  },
  {
    id: "polarizability", term: "Polarizability",
    short: "How easily an electron cloud distorts into a dipole. Big, loose electron clouds (I₂, long alkanes, big anions) are highly polarizable → stronger LDFs.",
    sims: ["imf-lab"], lessons: ["3.1"], related: ["ldf"],
  },
  {
    id: "dipole-dipole", term: "Dipole–dipole forces",
    short: "Attraction between the permanent δ+ end of one polar molecule and the δ− end of another. Stronger than LDFs for similar-sized species; orientation-dependent.",
    sims: ["imf-lab", "molecular-polarity"], lessons: ["3.1"], related: ["molecular-polarity", "hydrogen-bond"],
  },
  {
    id: "hydrogen-bond", term: "Hydrogen bonding",
    short: "A strong dipole–dipole attraction (NOT a covalent bond) between H bonded to N, O, or F on one molecule and a lone pair on N/O/F of another. Explains water's anomalies, DNA base pairing, and protein folding.",
    detail: "Requirements: (1) H covalently bound to N/O/F — tiny, fiercely electronegative atoms that strip H's electron nearly bare; (2) a lone pair on N/O/F nearby. CH₄ and HCl have neither geometry; H₂O, NH₃, HF, alcohols, amines, and acids do.",
    sims: ["imf-lab"], lessons: ["3.1", "3.3"], molecule: "h2o", related: ["dipole-dipole", "boiling-point"],
  },
  {
    id: "ion-dipole", term: "Ion–dipole forces",
    short: "Attraction between an ion and the partial charge of a polar molecule — the force that dissolves salts in water (Na⁺ surrounded by O-ends, Cl⁻ by H-ends: hydration shells).",
    sims: ["imf-lab"], lessons: ["3.10", "3.7"], related: ["solvation", "electrolyte"],
  },
  {
    id: "boiling-point", term: "Boiling point",
    short: "The temperature at which a liquid's vapor pressure equals external pressure. It ranks IMF strength: stronger IMFs → higher boiling point. Comparing substances' bps is comparing their IMFs.",
    sims: ["imf-lab"], lessons: ["3.1", "3.3"], related: ["vapor-pressure", "intermolecular-forces"],
  },
  {
    id: "vapor-pressure", term: "Vapor pressure",
    short: "Pressure of a substance's vapor in dynamic equilibrium with its liquid. Stronger IMFs → fewer molecules escape → lower vapor pressure. Depends only on temperature and substance, not on amounts.",
    sims: ["imf-lab"], lessons: ["3.3"], related: ["boiling-point", "intermolecular-forces"],
  },
  {
    id: "viscosity", term: "Viscosity",
    short: "Resistance to flow. Stronger IMFs (especially hydrogen bonding — glycerol, honey) and longer, entangling molecules → higher viscosity; heating lowers it.",
    lessons: ["3.1"], related: ["intermolecular-forces"],
  },
  {
    id: "surface-tension", term: "Surface tension",
    short: "The 'skin' on a liquid surface: interior molecules are attracted in all directions while surface molecules are pulled only inward. Water's hydrogen bonding gives it famously high surface tension.",
    lessons: ["3.1"], related: ["intermolecular-forces", "hydrogen-bond"],
  },
  {
    id: "types-of-solids", term: "Types of solids", aliases: ["crystal types", "network solid", "molecular solid"],
    short: "Four families by particle and force: ionic (ions, Coulomb — hard, high mp, conduct when molten), covalent network (atoms, covalent — diamond/quartz: extreme mp), metallic (cations + e⁻ sea — conduct, malleable), molecular (molecules, IMFs — soft, low mp: ice, dry ice).",
    detail: "Melting-point questions are solid-identification questions in disguise: mp > 1000 °C and conducting when molten → ionic; mp > 1500 °C, insoluble nonconductor → network covalent; conducts as a solid → metallic; mp < 300 °C → molecular.",
    lessons: ["3.2"], related: ["ionic-bond", "metallic-bond", "intermolecular-forces", "lattice-energy"],
  },
  {
    id: "states-of-matter", term: "States of matter",
    short: "Solid (fixed shape/volume, particles vibrate in place), liquid (fixed volume, flows), gas (fills container, mostly empty space). Phase = the tug-of-war between thermal kinetic energy and intermolecular attraction.",
    sims: ["imf-lab"], lessons: ["3.3"], related: ["phase-change", "intermolecular-forces"],
  },
  {
    id: "phase-change", term: "Phase changes", aliases: ["melting", "vaporization", "sublimation", "condensation"],
    short: "Melting/vaporization/sublimation absorb energy (endothermic — overcoming attractions); freezing/condensation/deposition release it. During a phase change, temperature stays constant — energy goes into potential energy, not kinetic.",
    sims: ["imf-lab"], lessons: ["3.3", "6.1"], related: ["states-of-matter", "enthalpy"],
  },
  {
    id: "kinetic-molecular-theory", term: "Kinetic molecular theory", aliases: ["kmt"],
    short: "Ideal-gas postulates: particles in constant random straight-line motion, negligible volume, no attractions, elastic collisions, and average kinetic energy ∝ kelvin temperature (same for all gases at the same T).",
    lessons: ["3.5"], related: ["ideal-gas-law", "temperature"],
  },
  {
    id: "ideal-gas-law", term: "Ideal gas law",
    short: "PV = nRT with R = 0.08206 L·atm/(mol·K). Combines Boyle (P∝1/V), Charles (V∝T), and Avogadro (V∝n). Use kelvin; derive density (d = PM/RT) and stoichiometry volumes from it.",
    equation: "PV = nRT",
    lessons: ["3.4"], related: ["kinetic-molecular-theory", "partial-pressure", "real-gas"],
  },
  {
    id: "real-gas", term: "Real gas deviations",
    short: "Real gases stray from ideality at HIGH pressure (particle volume matters) and LOW temperature (attractions matter). Small, nonpolar gases (He, H₂) stay most ideal.",
    lessons: ["3.6"], related: ["ideal-gas-law", "kinetic-molecular-theory"],
  },
  {
    id: "partial-pressure", term: "Partial pressure", aliases: ["dalton's law"],
    short: "Each gas in a mixture contributes P_i = X_i·P_total (mole fraction × total). Dalton: pressures add.",
    equation: "P_{total} = \\sum_i P_i",
    lessons: ["3.4"], related: ["ideal-gas-law"],
  },
  {
    id: "temperature", term: "Temperature (kinetic meaning)",
    short: "A measure of the AVERAGE kinetic energy of particles: KE_avg = (3/2)(RT/N_A) per molecule for an ideal gas. At the same T, heavy molecules move slower (v_rms = √(3RT/M)) but have the same average KE.",
    lessons: ["3.5"], related: ["kinetic-molecular-theory"],
  },
  {
    id: "solution", term: "Solution",
    short: "A homogeneous mixture of solute dissolved in solvent. 'Like dissolves like': polar/ionic solutes in polar solvents, nonpolar in nonpolar — because solute–solvent forces must compete with the pure-substance forces.",
    sims: ["imf-lab"], lessons: ["3.7", "3.10"], related: ["solvation", "electrolyte", "molarity"],
  },
  {
    id: "solvation", term: "Solvation (hydration)",
    short: "Solvent molecules surround and stabilize solute particles — ion–dipole shells around ions in water. Dissolving = break solute forces + break solvent forces (endothermic) + form solute–solvent forces (exothermic); the sum decides ΔH_soln.",
    sims: ["imf-lab"], lessons: ["3.10", "6.8"], related: ["ion-dipole", "solution", "electrolyte"],
  },
  {
    id: "electrolyte", term: "Electrolyte",
    short: "A solute whose solution conducts electricity because it produces mobile ions. Strong electrolytes dissociate completely (NaCl, strong acids); weak ones partially (acetic acid); nonelectrolytes dissolve as neutral molecules (sugar).",
    lessons: ["3.7", "8.1"], related: ["solution", "net-ionic-equation", "strong-acid"],
  },
  {
    id: "molarity", term: "Molarity",
    short: "Moles of solute per liter of solution — the workhorse concentration unit.",
    equation: "M = \\frac{n_{\\text{solute}}}{V_{\\text{solution (L)}}}",
    lessons: ["3.8", "4.5"], related: ["dilution", "solution"],
  },
  {
    id: "dilution", term: "Dilution",
    short: "Adding solvent lowers concentration while moles of solute stay fixed: M₁V₁ = M₂V₂.",
    equation: "M_1 V_1 = M_2 V_2",
    lessons: ["3.8"], related: ["molarity"],
  },
  {
    id: "spectroscopy", term: "Spectroscopy",
    short: "Probing matter with light: absorbed/emitted wavelengths reveal structure. UV-vis moves valence electrons (concentration via Beer–Lambert), IR vibrates bonds, microwaves rotate molecules.",
    equation: "A = \\varepsilon b c",
    lessons: ["3.11"], related: ["electromagnetic-spectrum", "beers-law", "photon"],
  },
  {
    id: "beers-law", term: "Beer–Lambert law",
    short: "Absorbance grows linearly with concentration: A = εbc (ε = molar absorptivity, b = path length, c = concentration). The basis of colorimetry.",
    equation: "A = \\varepsilon b c",
    lessons: ["3.11"], related: ["spectroscopy"],
  },
  {
    id: "electromagnetic-spectrum", term: "Electromagnetic spectrum",
    short: "All light ordered by wavelength/frequency: radio → microwave → IR → visible → UV → X-ray → gamma. E = hc/λ = hν: short wavelength = high energy.",
    equation: "E = h\\nu = \\frac{hc}{\\lambda}",
    lessons: ["3.11", "3.13"], related: ["photon", "spectroscopy"],
  },
  {
    id: "photon", term: "Photon",
    short: "A quantum of light energy E = hν. Energy arrives in indivisible packets — the insight behind the photoelectric effect and atomic spectra.",
    lessons: ["3.12", "3.13"], related: ["photoelectric-effect", "electromagnetic-spectrum"],
  },
  {
    id: "photoelectric-effect", term: "Photoelectric effect",
    short: "Electrons eject from a metal only when light exceeds a threshold frequency; brighter-but-redder light does nothing. Proof that light energy is quantized: one photon kicks out one electron, E = hν.",
    lessons: ["3.12"], related: ["photon", "quantized-energy"],
  },
  {
    id: "quantized-energy", term: "Quantized energy levels",
    short: "Electrons in atoms occupy only discrete energies. Transitions between levels absorb/emit photons of exactly ΔE = hν — producing line spectra, unique atomic fingerprints.",
    sims: ["electron-config"], lessons: ["3.13", "3.14"], related: ["emission-spectrum", "photon", "bohr-model"],
  },
  {
    id: "emission-spectrum", term: "Emission spectrum",
    short: "Bright lines at wavelengths emitted when excited electrons fall to lower levels. Absorption spectra show dark lines where photons were captured going up. Both fingerprint the element.",
    lessons: ["3.14", "3.13"], related: ["quantized-energy", "bohr-model"],
  },

  /* ---------------- reactions & stoichiometry ---------------- */
  {
    id: "chemical-reaction", term: "Chemical reaction",
    short: "Rearrangement of atoms via bond breaking/forming, yielding new substances. Mass, charge, and atoms are conserved — equations must balance.",
    sims: ["reaction-viewer"], lessons: ["4.1", "4.7"], related: ["balancing-equations", "reaction-types"],
  },
  {
    id: "law-conservation-mass", term: "Law of conservation of mass",
    short: "Matter is neither created nor destroyed in a chemical reaction: total mass of reactants equals total mass of products, because atoms are only rearranged.",
    detail: "Lavoisier's closed-vessel experiments showed mass unchanged after reaction. At the atomic level, balancing coefficients enforces this law — every atom present before must be present after. Nuclear reactions are the exception, where mass converts to energy.",
    sims: ["reaction-viewer"], lessons: ["4.1", "4.3", "4.5"], related: ["balancing-equations", "stoichiometry", "chemical-reaction"],
  },
  {
    id: "balancing-equations", term: "Balancing equations",
    short: "Adjusting coefficients so every element (and net charge) appears equally on both sides — conservation of mass in symbols. Never change subscripts; that would change the substances.",
    sims: ["reaction-viewer"], lessons: ["4.1"], related: ["stoichiometry", "chemical-reaction"],
  },
  {
    id: "stoichiometry", term: "Stoichiometry",
    short: "Quantitative chemistry from balanced equations: coefficients are mole ratios. The path: grams → moles → mole ratio → moles → grams (or liters, or particles).",
    sims: ["reaction-viewer"], lessons: ["4.5"], related: ["limiting-reactant", "mole", "balancing-equations"],
  },
  {
    id: "limiting-reactant", term: "Limiting reactant",
    short: "The reactant exhausted first — it caps product formation. Identify by dividing each reactant's moles by its coefficient: smallest quotient wins. The rest is excess.",
    lessons: ["4.5"], related: ["stoichiometry", "percent-yield"],
  },
  {
    id: "percent-yield", term: "Percent yield",
    short: "Actual yield / theoretical yield × 100. Real reactions lose material to side reactions, incomplete conversion, and handling.",
    equation: "\\%\\text{yield} = \\frac{\\text{actual}}{\\text{theoretical}} \\times 100",
    lessons: ["4.5"], related: ["limiting-reactant"],
  },
  {
    id: "net-ionic-equation", term: "Net ionic equation",
    short: "The chemical equation stripped of spectator ions — only species that actually change appear. Solids, liquids, gases, and weak electrolytes stay written whole; strong electrolytes dissociate.",
    detail: "Writing one: (1) balance molecular equation, (2) split strong electrolytes into ions, (3) cancel spectators. Example: AgNO₃ + NaCl → AgCl(s) + NaNO₃ becomes just Ag⁺ + Cl⁻ → AgCl(s).",
    sims: ["reaction-viewer"], lessons: ["4.2"], related: ["precipitation", "electrolyte", "solubility-rules"],
  },
  {
    id: "precipitation", term: "Precipitation reaction",
    short: "Ions in solution combine into an insoluble solid (precipitate) that falls out — a double-replacement reaction driven by removing ions from solution.",
    lessons: ["4.2", "7.11"], related: ["net-ionic-equation", "solubility-rules", "ksp"],
  },
  {
    id: "solubility-rules", term: "Solubility rules",
    short: "Always soluble: group 1 salts, NH₄⁺, nitrates, acetates, perchlorates. Usually soluble: chlorides (except Ag⁺, Pb²⁺, Hg₂²⁺), sulfates (except Ba²⁺, Sr²⁺, Pb²⁺, Ca²⁺ borderline). Insoluble: carbonates, phosphates, hydroxides, sulfides — except with group 1 / NH₄⁺.",
    lessons: ["4.2", "7.11"], related: ["precipitation", "net-ionic-equation"],
  },
  {
    id: "reaction-types", term: "Reaction types",
    short: "Synthesis (A+B→AB), decomposition (AB→A+B), combustion (fuel+O₂→CO₂+H₂O), single replacement (redox swap), double replacement (ion exchange: precipitation/neutralization), acid–base, and redox.",
    sims: ["reaction-viewer"], lessons: ["4.7"], related: ["redox", "chemical-reaction"],
  },
  {
    id: "redox", term: "Redox reaction", aliases: ["oxidation", "reduction", "oxidation number"],
    short: "Electron-transfer chemistry: oxidation loses electrons (oxidation number rises), reduction gains them (falls). OIL RIG. The oxidizing agent gets reduced; the reducing agent gets oxidized.",
    detail: "Assign oxidation numbers: elements 0; monatomic ions = charge; O = −2 (peroxides −1); H = +1 (hydrides −1); F = −1; sums equal species charge. Any combustion, single-replacement, battery, or corrosion is redox.",
    lessons: ["4.9", "9.7"], related: ["oxidation-number", "galvanic-cell", "electrolytic-cell"],
  },
  {
    id: "oxidation-number", term: "Oxidation number",
    short: "The bookkeeping charge an atom would have if bonds were fully ionic. Tracking their changes identifies what's oxidized and reduced.",
    lessons: ["4.9"], related: ["redox"],
  },
  {
    id: "titration", term: "Titration",
    short: "Volumetric analysis: add a standard solution until the reaction completes (equivalence point), detected by an indicator or pH meter. At equivalence for acid–base: moles H⁺ = moles OH⁻.",
    lessons: ["4.6", "8.5"], related: ["molarity", "equivalence-point", "titration-curve"],
  },
  {
    id: "equivalence-point", term: "Equivalence point",
    short: "The titration moment when stoichiometrically exact amounts have reacted. Distinct from the endpoint (indicator color change) — good indicators switch right at equivalence.",
    lessons: ["8.5", "4.6"], related: ["titration", "titration-curve"],
  },
  {
    id: "titration-curve", term: "Titration curve",
    short: "pH vs volume added. Strong–strong: steep jump through pH 7. Weak–strong: buffered start, half-equivalence pH = pKa, equivalence off-center (basic for weak acid titrated by strong base).",
    lessons: ["8.5"], related: ["titration", "buffer", "ka"],
  },

  /* ---------------- kinetics ---------------- */
  {
    id: "reaction-rate", term: "Reaction rate",
    short: "Change in concentration per time: rate = −Δ[reactant]/Δt = +Δ[product]/Δt (divided by coefficients). Rates are fastest at t = 0 and decay as reactants deplete.",
    lessons: ["5.1"], related: ["rate-law", "collision-theory"],
  },
  {
    id: "rate-law", term: "Rate law",
    short: "rate = k[A]^m[B]^n — orders m, n determined ONLY by experiment (initial-rates method), never from coefficients (except elementary steps). Overall order = m + n; k's units keep rate in M/s.",
    equation: "\\text{rate} = k[A]^m[B]^n",
    lessons: ["5.2"], related: ["reaction-order", "reaction-rate", "rate-constant"],
  },
  {
    id: "reaction-order", term: "Reaction order",
    short: "The exponent on a reactant in the rate law: 0th (rate ignores it), 1st (rate ∝ concentration), 2nd (rate ∝ concentration²). Doubling a 1st-order reactant doubles the rate; a 2nd-order one quadruples it.",
    lessons: ["5.2", "5.3"], related: ["rate-law", "integrated-rate-law"],
  },
  {
    id: "rate-constant", term: "Rate constant (k)",
    short: "The proportionality constant in the rate law — big k = fast reaction. Depends on temperature (Arrhenius) and catalysts, not concentrations. Its units vary with overall order.",
    lessons: ["5.2"], related: ["rate-law", "arrhenius-equation"],
  },
  {
    id: "integrated-rate-law", term: "Integrated rate law", aliases: ["half-life"],
    short: "Concentration-vs-time forms: 0th [A] = [A]₀ − kt (linear [A] vs t); 1st ln[A] = ln[A]₀ − kt (linear ln[A] vs t, t½ = 0.693/k constant); 2nd 1/[A] = 1/[A]₀ + kt (linear 1/[A] vs t). The linear plot reveals the order.",
    lessons: ["5.3"], related: ["reaction-order", "rate-law"],
  },
  {
    id: "collision-theory", term: "Collision model", aliases: ["collision theory"],
    short: "Reactions require collisions with (1) energy ≥ activation energy and (2) correct orientation. More concentrated, hotter, or catalyzed systems react faster because more collisions qualify.",
    sims: ["imf-lab"], lessons: ["5.5"], related: ["activation-energy", "reaction-rate"],
  },
  {
    id: "activation-energy", term: "Activation energy (Ea)",
    short: "The energy barrier collisions must surmount — the climb from reactants to the transition state. Ea sets rate sensitivity to temperature; catalysts work by lowering it.",
    lessons: ["5.5", "5.6", "5.11"], related: ["arrhenius-equation", "energy-profile", "catalyst"],
  },
  {
    id: "arrhenius-equation", term: "Arrhenius equation",
    short: "k = Ae^(−Ea/RT): rate constants grow exponentially with temperature and shrink with activation energy. Plotting ln k vs 1/T gives a line of slope −Ea/R.",
    equation: "k = Ae^{-E_a/RT}",
    lessons: ["5.2", "5.5"], related: ["activation-energy", "rate-constant"],
  },
  {
    id: "energy-profile", term: "Reaction energy profile", aliases: ["potential energy diagram"],
    short: "PE vs reaction progress: reactants climb Ea to the transition state (peak), descend to products; ΔH = PE(products) − PE(reactants). Multi-step mechanisms show one peak per step and valleys (intermediates) between.",
    sims: [], lessons: ["5.6", "5.10", "6.2"], related: ["activation-energy", "transition-state", "intermediate", "enthalpy"],
  },
  {
    id: "transition-state", term: "Transition state", aliases: ["activated complex"],
    short: "The maximum-energy arrangement on the profile — bonds half-broken/half-formed. It exists fleetingly and cannot be isolated.",
    lessons: ["5.6"], related: ["energy-profile", "activation-energy"],
  },
  {
    id: "intermediate", term: "Reaction intermediate",
    short: "A species produced in one elementary step and consumed in a later one — a valley between profile peaks. Intermediates never appear in the overall balanced equation.",
    lessons: ["5.7", "5.10"], related: ["reaction-mechanism", "energy-profile"],
  },
  {
    id: "reaction-mechanism", term: "Reaction mechanism",
    short: "The step-by-step elementary sequence summing to the overall reaction. Validity test: steps must add up correctly AND the mechanism must reproduce the experimental rate law (slow step dominates).",
    lessons: ["5.7", "5.8"], related: ["elementary-step", "intermediate", "rate-law"],
  },
  {
    id: "elementary-step", term: "Elementary step",
    short: "A single collision/event. Its molecularity equals its order: unimolecular → 1st order, bimolecular → 2nd. The SLOW (rate-determining) step sets the overall rate law.",
    lessons: ["5.4", "5.8"], related: ["reaction-mechanism"],
  },
  {
    id: "catalyst", term: "Catalyst",
    short: "Speeds a reaction by providing a lower-Ea pathway; regenerated, never consumed, never appearing in the net equation. Does NOT change ΔH, ΔG, or K — only how fast equilibrium is reached.",
    lessons: ["5.11"], related: ["activation-energy", "energy-profile"],
  },

  /* ---------------- thermodynamics ---------------- */
  {
    id: "system-surroundings", term: "System and surroundings",
    short: "The system is what you study (the reaction); the surroundings are everything else (flask, air, thermometer). Energy lost by one is gained by the other — the universe's total is constant.",
    lessons: ["6.1", "6.3"], related: ["enthalpy", "first-law"],
  },
  {
    id: "exothermic", term: "Exothermic process",
    short: "Releases heat to surroundings (ΔH < 0): products sit lower in energy than reactants. Combustion, neutralization, condensation, freezing. The container feels warm.",
    lessons: ["6.1"], related: ["enthalpy", "endothermic", "energy-profile"],
  },
  {
    id: "endothermic", term: "Endothermic process",
    short: "Absorbs heat from surroundings (ΔH > 0): products sit higher. Melting, vaporization, most decompositions, dissolving NH₄NO₃. The container feels cold.",
    lessons: ["6.1"], related: ["enthalpy", "exothermic"],
  },
  {
    id: "enthalpy", term: "Enthalpy (H)", aliases: ["heat of reaction", "δh"],
    short: "Heat flow at constant pressure — the state function tracking reaction energy. ΔH < 0 exothermic, > 0 endothermic. Break bonds = absorb; form bonds = release.",
    equation: "\\Delta H_{rxn} = H_{products} - H_{reactants}",
    lessons: ["6.1", "6.5"], related: ["exothermic", "endothermic", "hess-law", "enthalpy-formation"],
  },
  {
    id: "first-law", term: "First law of thermodynamics",
    short: "Energy is conserved: ΔE_system = q + w. Heat into the system and work done ON it are positive.",
    lessons: ["6.1", "6.3"], related: ["system-surroundings", "enthalpy"],
  },
  {
    id: "heat-capacity", term: "Heat capacity & specific heat",
    short: "Specific heat c: energy to warm 1 g by 1 K (water: 4.184 J/g·K — famously high). q = mcΔT underpins calorimetry.",
    equation: "q = mc\\Delta T",
    lessons: ["6.4", "6.3"], related: ["calorimetry"],
  },
  {
    id: "calorimetry", term: "Calorimetry",
    short: "Measuring reaction heat via temperature change of a known mass: q_solution = mcΔT, and q_reaction = −q_solution (coffee-cup, constant P). Bomb calorimeters run constant-volume combustion.",
    lessons: ["6.4"], related: ["heat-capacity", "enthalpy"],
  },
  {
    id: "hess-law", term: "Hess's law",
    short: "Enthalpy is a state function, so ΔH adds over reaction steps: reverse a step → flip sign; scale a step → scale ΔH. Enables computing unknown ΔH from known reactions.",
    lessons: ["6.6"], related: ["enthalpy", "enthalpy-formation"],
  },
  {
    id: "enthalpy-formation", term: "Enthalpy of formation (ΔH°f)",
    short: "ΔH for forming 1 mol of compound from elements in standard states (elements themselves: ΔH°f = 0). Reaction enthalpies follow from products minus reactants.",
    equation: "\\Delta H^\\circ_{rxn} = \\sum n\\Delta H^\\circ_f(\\text{prod}) - \\sum m\\Delta H^\\circ_f(\\text{react})",
    lessons: ["6.6"], related: ["hess-law", "enthalpy"],
  },
  {
    id: "enthalpy-solution", term: "Enthalpy of solution",
    short: "ΔH_soln = energy to separate solute (+) + separate solvent (+) + form solute–solvent attractions (−). Net sign decides whether dissolving feels hot (NaOH) or cold (NH₄NO₃) — and endothermic dissolving can still be spontaneous (entropy!).",
    lessons: ["6.8"], related: ["solvation", "entropy"],
  },
  {
    id: "entropy", term: "Entropy (S)",
    short: "The dispersal of energy and matter — the number of ways a system can arrange its energy (microstates). Increases: solid→liquid→gas, more particles, mixing, higher T. Gases dominate entropy budgets.",
    lessons: ["9.1", "9.2"], related: ["gibbs-free-energy", "second-law"],
  },
  {
    id: "second-law", term: "Second law of thermodynamics",
    short: "Spontaneous processes increase the entropy of the UNIVERSE: ΔS_univ = ΔS_sys + ΔS_surr > 0. Gibbs free energy packages this for the system alone at constant T, P.",
    lessons: ["9.1", "9.3"], related: ["entropy", "gibbs-free-energy"],
  },
  {
    id: "gibbs-free-energy", term: "Gibbs free energy (ΔG)",
    short: "ΔG = ΔH − TΔS: negative = thermodynamically favorable (spontaneous), positive = unfavorable. Balances enthalpy's drive downhill against entropy's drive toward dispersal — temperature decides close cases.",
    equation: "\\Delta G = \\Delta H - T\\Delta S",
    lessons: ["9.3"], related: ["entropy", "enthalpy", "thermodynamic-favorability", "equilibrium-constant"],
  },
  {
    id: "thermodynamic-favorability", term: "Thermodynamic favorability", aliases: ["spontaneous", "spontaneity"],
    short: "ΔG < 0: the reaction CAN proceed without continuous energy input (says nothing about speed). Sign table: (−ΔH, +ΔS) always favorable; (+ΔH, −ΔS) never; mixed cases depend on T.",
    sims: [], lessons: ["9.3", "9.4"], related: ["gibbs-free-energy", "kinetic-vs-thermo-control"],
  },
  {
    id: "kinetic-vs-thermo-control", term: "Thermodynamic vs kinetic control",
    short: "Favorable (ΔG < 0) ≠ fast (low Ea). Diamond → graphite is spontaneous but geologically slow: kinetics traps it. Reactions 'choose' products by the fastest path (kinetic) or most stable endpoint (thermodynamic).",
    lessons: ["9.4"], related: ["gibbs-free-energy", "activation-energy"],
  },
  {
    id: "coupled-reactions", term: "Coupled reactions",
    short: "A thermodynamically unfavorable reaction (ΔG > 0) can be driven by adding a favorable one (ΔG ≪ 0) sharing intermediates — how biology builds everything (ATP coupling) and how metals are extracted from ores.",
    lessons: ["9.6"], related: ["gibbs-free-energy"],
  },

  /* ---------------- equilibrium ---------------- */
  {
    id: "reversible-reaction", term: "Reversible reaction",
    short: "A reaction that proceeds in both directions — written with ⇌ — so products can re-form reactants. In a closed vessel it settles at equilibrium rather than running to completion.",
    detail: "Microscopically every reaction is reversible; whether the reverse matters depends on K. Huge K (combustion) means the reverse rate is negligible for practical purposes, while moderate K (Haber process, weak acids) makes the reverse reaction central to the system's behavior.",
    lessons: ["7.1", "7.2"], related: ["equilibrium", "equilibrium-constant", "chemical-reaction"],
  },
  {
    id: "closed-system", term: "Closed system",
    short: "A system that exchanges energy with its surroundings but not matter. Equilibrium requires one: escaping gas or evaporating solvent prevents the reverse reaction from ever balancing the forward one.",
    detail: "Open systems (an unstoppered flask) lose matter and cannot reach chemical equilibrium — combustion products escape, water evaporates. Sealed containers are the standard equilibrium setting on the exam.",
    lessons: ["7.1"], related: ["equilibrium", "system-surroundings", "vapor-pressure"],
  },
  {
    id: "equilibrium", term: "Chemical equilibrium", aliases: ["dynamic equilibrium"],
    short: "Forward and reverse rates equal; concentrations constant (not equal!). Dynamic — both reactions still run. Reached from either direction; the equilibrium position (K) is temperature-dependent only.",
    lessons: ["7.1", "7.2"], related: ["equilibrium-constant", "le-chatelier", "reaction-quotient"],
  },
  {
    id: "equilibrium-constant", term: "Equilibrium constant (K)",
    short: "The ratio of product to reactant concentrations at equilibrium, each raised to its coefficient. Pure solids and liquids are omitted (= 1). K ≫ 1: products favored; K ≪ 1: reactants favored.",
    equation: "aA + bB \\rightleftharpoons cC + dD: \\quad K = \\frac{[C]^c[D]^d}{[A]^a[B]^b}",
    lessons: ["7.3", "7.4", "7.5"], related: ["reaction-quotient", "equilibrium", "gibbs-free-energy"],
  },
  {
    id: "reaction-quotient", term: "Reaction quotient (Q)",
    short: "The K expression evaluated at ANY moment. Q < K: shift right (make products); Q > K: shift left; Q = K: at equilibrium. The quantitative engine behind Le Châtelier.",
    lessons: ["7.3", "7.10"], related: ["equilibrium-constant", "le-chatelier"],
  },
  {
    id: "le-chatelier", term: "Le Châtelier's principle",
    short: "Stress a system at equilibrium (change concentration, pressure/volume, temperature) and it shifts to partially counteract the stress. Only temperature changes K itself; catalysts change nothing about position.",
    detail: "Add reactant → shift right. Compress (↑P) → shift toward fewer gas moles. Heat an endothermic reaction → shift right (heat is a 'reactant'). Inert gas at constant volume: no shift (concentrations unchanged).",
    sims: ["reaction-viewer"], lessons: ["7.9", "7.10"], related: ["equilibrium", "reaction-quotient"],
  },
  {
    id: "ice-table", term: "ICE table",
    short: "Initial / Change / Equilibrium — the standard bookkeeping for equilibrium concentrations: let x be the change per coefficient, plug into K, solve (5% rule often justifies skipping the quadratic).",
    lessons: ["7.7", "8.3"], related: ["equilibrium-constant"],
  },
  {
    id: "ksp", term: "Solubility product (Ksp)",
    short: "The equilibrium constant for a sparingly soluble salt dissolving: AgCl(s) ⇌ Ag⁺ + Cl⁻, Ksp = [Ag⁺][Cl⁻]. If ion product Q < Ksp, more dissolves; Q > Ksp, precipitate forms.",
    lessons: ["7.11", "7.12"], related: ["solubility", "precipitation", "common-ion-effect"],
  },
  {
    id: "solubility", term: "Solubility",
    short: "Maximum solute that dissolves in a solvent at given conditions (g/100 g or mol/L). Solids usually dissolve better when hot; gases dissolve better when cold and under higher pressure (Henry's law).",
    lessons: ["3.7", "7.11"], related: ["ksp", "solution", "solvation"],
  },
  {
    id: "common-ion-effect", term: "Common-ion effect",
    short: "Adding an ion the equilibrium already contains shifts it backward (Le Châtelier): salt solubility drops in a solution sharing its ion; weak-acid dissociation drops when its conjugate base is added.",
    lessons: ["7.12", "8.8"], related: ["ksp", "le-chatelier", "buffer"],
  },

  /* ---------------- acids & bases ---------------- */
  {
    id: "acid", term: "Acid",
    short: "Proton (H⁺) donor in Brønsted–Lowry theory; produces H₃O⁺ in water (Arrhenius); electron-pair acceptor in Lewis theory. Sour, pH < 7, turns litmus red.",
    sims: ["molecule-builder"], lessons: ["8.1", "4.8"], related: ["base", "bronsted-lowry", "conjugate-pair", "ph"],
  },
  {
    id: "base", term: "Base",
    short: "Proton acceptor (Brønsted–Lowry); produces OH⁻ in water (Arrhenius); electron-pair donor (Lewis). Bitter, slippery, pH > 7.",
    lessons: ["8.1", "4.8"], related: ["acid", "conjugate-pair", "ph"],
  },
  {
    id: "bronsted-lowry", term: "Brønsted–Lowry theory",
    short: "Acids donate protons; bases accept them. Every transfer creates conjugate pairs: HA + H₂O ⇌ H₃O⁺ + A⁻ (HA/A⁻ and H₃O⁺/H₂O are two conjugate pairs).",
    lessons: ["8.1"], related: ["acid", "base", "conjugate-pair"],
  },
  {
    id: "conjugate-pair", term: "Conjugate acid–base pair",
    short: "Two species differing by one H⁺ (CH₃COOH/CH₃COO⁻). Strong acids have feeble conjugate bases and vice versa: Ka·Kb = Kw = 1.0 × 10⁻¹⁴.",
    equation: "K_a \\cdot K_b = K_w",
    lessons: ["8.1", "8.3"], related: ["bronsted-lowry", "ka", "kb"],
  },
  {
    id: "lewis-acid-base", term: "Lewis acid & base",
    short: "The widest definition: Lewis acids ACCEPT an electron pair (BF₃, H⁺, metal cations); Lewis bases DONATE one (NH₃, OH⁻, H₂O — anything with a lone pair).",
    sims: ["molecule-builder"], lessons: ["8.13"], molecule: "bf3", related: ["lone-pair", "acid", "base"],
  },
  {
    id: "ph", term: "pH",
    short: "pH = −log[H₃O⁺]: the log scale of hydronium concentration. pH 7 neutral (25 °C), each unit = 10× concentration. pOH = −log[OH⁻]; pH + pOH = 14.",
    equation: "\\text{pH} = -\\log[H_3O^+]",
    lessons: ["8.2"], related: ["poh", "kw", "acid"],
  },
  {
    id: "poh", term: "pOH",
    short: "−log[OH⁻]. Complements pH: pH + pOH = 14.00 at 25 °C.",
    lessons: ["8.2"], related: ["ph", "kw"],
  },
  {
    id: "kw", term: "Water autoionization (Kw)",
    short: "Water self-ionizes: 2H₂O ⇌ H₃O⁺ + OH⁻ with Kw = [H₃O⁺][OH⁻] = 1.0 × 10⁻¹⁴ at 25 °C. This single number ties every aqueous pH together.",
    lessons: ["8.2"], related: ["ph", "poh"],
  },
  {
    id: "strong-acid", term: "Strong acid",
    short: "Ionizes ~100% in water (HCl, HBr, HI, HNO₃, H₂SO₄ first proton, HClO₄). [H₃O⁺] = initial acid concentration — no equilibrium math needed. Their conjugate bases are negligibly basic.",
    lessons: ["8.2", "8.1"], related: ["weak-acid", "ph"],
  },
  {
    id: "weak-acid", term: "Weak acid",
    short: "Partially ionizes — an equilibrium governed by Ka (acetic acid: Ka = 1.8 × 10⁻⁵). Smaller Ka = weaker acid = larger pKa. pH requires ICE-table math (often with the 5% approximation).",
    lessons: ["8.3"], related: ["ka", "strong-acid", "ice-table"],
  },
  {
    id: "percent-ionization", term: "Percent ionization",
    short: "The fraction of weak-acid molecules that donate their proton: (ionized [HA] ÷ initial [HA]) × 100% = ([H⁺] at equilibrium ÷ initial concentration) × 100%.",
    detail: "It rises as solutions get more dilute — with fewer neighbors, Le Châtelier favors ionization. 0.10 M acetic acid is ~1.3% ionized; 0.0010 M is ~13%. Strength (Ka) is constant; percent ionization depends on concentration.",
    equation: "\\%\\ \text{ionization} = \\frac{[H^+]_{eq}}{[HA]_0} \\times 100\\%",
    lessons: ["8.3"], related: ["weak-acid", "ka", "ph"],
  },
  {
    id: "ka", term: "Acid dissociation constant (Ka)",
    short: "K for HA + H₂O ⇌ H₃O⁺ + A⁻: Ka = [H₃O⁺][A⁻]/[HA]. Bigger Ka = stronger acid. pKa = −log Ka; at half-neutralization, pH = pKa.",
    equation: "K_a = \\frac{[H_3O^+][A^-]}{[HA]}",
    lessons: ["8.3", "8.7"], related: ["weak-acid", "conjugate-pair", "buffer"],
  },
  {
    id: "kb", term: "Base dissociation constant (Kb)",
    short: "K for B + H₂O ⇌ BH⁺ + OH⁻. For a conjugate pair Ka·Kb = Kw, so pKa + pKb = 14.",
    lessons: ["8.3"], related: ["ka", "conjugate-pair", "weak-base"],
  },
  {
    id: "weak-base", term: "Weak base",
    short: "Partially accepts protons (NH₃, amines, conjugate bases of weak acids). Kb equilibrium math mirrors weak acids, producing OH⁻.",
    lessons: ["8.3"], related: ["kb", "weak-acid"],
  },
  {
    id: "buffer", term: "Buffer",
    short: "A weak acid + its conjugate base (or weak base + conjugate acid) that resists pH change by chemically consuming added H⁺ or OH⁻. Works best when [HA] ≈ [A⁻], within about ±1 pH unit of pKa.",
    detail: "Add strong acid: A⁻ + H⁺ → HA. Add strong base: HA + OH⁻ → A⁻ + H₂O. The ratio [A⁻]/[HA] shifts only slightly, so pH barely moves — until buffer capacity is exhausted.",
    lessons: ["8.4", "8.8", "8.10"], related: ["henderson-hasselbalch", "weak-acid", "common-ion-effect"],
  },
  {
    id: "henderson-hasselbalch", term: "Henderson–Hasselbalch equation",
    short: "pH = pKa + log([A⁻]/[HA]) — the buffer pH shortcut, valid whenever the equilibrium approximation holds (buffered solutions).",
    equation: "\\text{pH} = \\text{p}K_a + \\log\\frac{[A^-]}{[HA]}",
    lessons: ["8.9"], related: ["buffer", "ka"],
  },
  {
    id: "buffer-capacity", term: "Buffer capacity",
    short: "How much strong acid/base a buffer absorbs before pH swings hard — proportional to the concentrations of HA and A⁻. Equimolar buffers have maximum capacity at their pKa.",
    lessons: ["8.10"], related: ["buffer"],
  },
  {
    id: "acid-structure", term: "Molecular structure & acid strength",
    short: "Binary acids: strength rises down a group (bond length/polarizability beat bond energy: HI > HBr > HCl ≫ HF). Oxyacids: more terminal oxygens = stronger (HClO₄ > HClO₃ > HClO₂ > HClO) — they disperse the conjugate base's negative charge.",
    sims: ["molecular-polarity"], lessons: ["8.6"], related: ["bond-polarity", "resonance", "weak-acid"],
  },
  {
    id: "neutralization", term: "Neutralization",
    short: "Acid + base → salt + water. The net ionic for strong–strong is simply H⁺ + OH⁻ → H₂O (K = 1/Kw = 10¹⁴ — essentially complete).",
    sims: ["reaction-viewer"], lessons: ["4.8", "8.4"], related: ["acid", "base", "net-ionic-equation"],
  },
  {
    id: "indicator", term: "Acid–base indicator",
    short: "A weak acid whose conjugate base is a different color; it flips near its pKa. Choose indicators whose transition brackets the titration's equivalence-point pH (phenolphthalein ≈ 8.2–10).",
    lessons: ["8.5"], related: ["titration-curve", "equivalence-point"],
  },

  /* ---------------- electrochemistry ---------------- */
  {
    id: "galvanic-cell", term: "Galvanic (voltaic) cell",
    short: "A spontaneous redox split across two half-cells so electrons travel through a wire: oxidation at the anode (−), reduction at the cathode (+), ion flow through the salt bridge. ΔG < 0, E°cell > 0.",
    detail: "Cell notation: anode | anode ion || cathode ion | cathode. Electrons ALWAYS flow anode → cathode. The salt bridge preserves neutrality — without it, charge buildup stops the cell instantly.",
    lessons: ["9.7", "9.8"], related: ["redox", "cell-potential", "electrolytic-cell", "salt-bridge"],
  },
  {
    id: "electrolytic-cell", term: "Electrolytic cell",
    short: "The nonspontaneous reverse: an external power source forces redox uphill (electroplating, molten-salt electrolysis, water splitting). ΔG > 0, E°cell < 0; anode is still where oxidation occurs (now labeled +).",
    sims: ["reaction-viewer"], lessons: ["9.9"], related: ["galvanic-cell", "redox", "cell-potential"],
  },
  {
    id: "cell-potential", term: "Cell potential (E°cell)",
    short: "The voltage driving electrons: E°cell = E°cathode − E°anode (reduction potentials from a table). Positive = spontaneous (galvanic); ties to free energy via ΔG° = −nFE°.",
    equation: "\\Delta G^\\circ = -nFE^\\circ_{cell}",
    lessons: ["9.8"], related: ["galvanic-cell", "gibbs-free-energy", "redox"],
  },
  {
    id: "salt-bridge", term: "Salt bridge",
    short: "Completes the circuit by letting inert ions migrate (anions → anode half, cations → cathode half), preventing charge buildup that would halt electron flow.",
    lessons: ["9.7"], related: ["galvanic-cell"],
  },
  {
    id: "faraday-electrolysis", term: "Electrolysis stoichiometry",
    short: "Charge moves matter: Q = I·t, moles of e⁻ = Q/F (F = 96,485 C/mol e⁻), then mole ratios from the half-reaction give product mass. Every electron is an accounting unit.",
    equation: "n_{e^-} = \\frac{I \\cdot t}{F}",
    lessons: ["9.9"], related: ["electrolytic-cell", "redox"],
  },

  /* ---------------- cross-cutting ---------------- */
  {
    id: "matter-classification", term: "Classification of matter",
    short: "Pure substances (elements, compounds — fixed composition, separable only chemically) vs mixtures (homogeneous: solutions; heterogeneous: suspensions — separable physically).",
    lessons: ["1.4", "3.7"], related: ["solution", "compound"],
  },
  {
    id: "compound", term: "Compound",
    short: "Two or more elements chemically bonded in fixed whole-number ratios (law of definite proportions). Properties differ utterly from constituent elements (NaCl vs explosive Na + poisonous Cl₂).",
    sims: ["molecule-builder"], lessons: ["1.3", "1.4"], related: ["molecular-formula", "chemical-bond"],
  },
  {
    id: "law-definite-proportions", term: "Law of definite proportions",
    short: "A given compound always contains its elements in the same mass ratio — water is always 8:1 oxygen:hydrogen by mass. Evidence that compounds are made of fixed atom combinations.",
    lessons: ["1.3"], related: ["compound", "percent-composition"],
  },
  {
    id: "physical-vs-chemical", term: "Physical vs chemical change",
    short: "Physical: same substance, new arrangement or phase (melting, dissolving, crushing). Chemical: bonds rearranged, new substances (burning, rusting, reacting). Energy changes accompany both — evidence matters.",
    lessons: ["4.4", "4.1"], related: ["chemical-reaction", "phase-change"],
  },
  {
    id: "standard-state", term: "Standard conditions",
    short: "Thermo's reference frame: 1 M solutions, 1 atm gases, pure solids/liquids, usually 25 °C (298 K). The ° in ΔH°, ΔG°, K marks standard-state values.",
    lessons: ["6.6", "9.3"], related: ["enthalpy-formation", "gibbs-free-energy"],
  },
];

export const CONCEPT_MAP = new Map(CONCEPTS.map((c) => [c.id, c]));

export function getConcept(id: string): Concept | undefined {
  return CONCEPT_MAP.get(id);
}

/** Search helper: find concepts matching a query by term or alias. */
export function searchConcepts(query: string, limit = 8) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const scored: Array<{ c: Concept; score: number }> = [];
  for (const c of CONCEPTS) {
    const term = c.term.toLowerCase();
    let score = 0;
    if (term === q) score = 100;
    else if (term.startsWith(q)) score = 80;
    else if (term.includes(q)) score = 60;
    if (c.aliases?.some((a) => a.toLowerCase() === q)) score = Math.max(score, 90);
    if (c.aliases?.some((a) => a.toLowerCase().includes(q))) score = Math.max(score, 70);
    if (score > 0) scored.push({ c, score });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.c);
}
