/**
 * AP Chemistry course structure — the nine College Board units and their
 * topics (Course and Exam Description numbering).
 *
 * This file is pure structure. Lesson CONTENT lives in curriculum/lessons/
 * keyed by topic id ("1.5", "7.9", …). If the framework changes, update the
 * topics here and drop in new lesson files — nothing else moves.
 */

export interface TopicMeta {
  /** CED topic number, also the lesson id. */
  id: string;
  title: string;
  /** One-line summary of what the topic covers. */
  summary: string;
  /** Depth of written content: "full" | "concise". */
  depth: "full" | "concise";
}

export interface UnitMeta {
  num: number;
  id: string;
  title: string;
  blurb: string;
  /** Approximate multiple-choice exam weight from the CED. */
  examWeight: string;
  color: string;
  icon: string;
  topics: TopicMeta[];
}

export const UNITS: UnitMeta[] = [
  {
    num: 1,
    id: "atomic-structure",
    title: "Atomic Structure and Properties",
    blurb:
      "What atoms are made of and how we know: moles and mass spectrometry, subatomic particles, electron configurations, photoelectron spectroscopy, periodic trends, and ion formation.",
    examWeight: "7–9%",
    color: "#4cc3ff",
    icon: "⚛️",
    topics: [
      { id: "1.1", title: "Moles and Molar Mass", summary: "The chemist's counting unit: converting between particles, grams, and moles.", depth: "full" },
      { id: "1.2", title: "Mass Spectroscopy of Elements", summary: "How instruments measure isotopes and produce average atomic masses.", depth: "full" },
      { id: "1.3", title: "Elemental Composition of Pure Substances", summary: "Percent composition, empirical and molecular formulas, combustion analysis.", depth: "full" },
      { id: "1.4", title: "Composition of Mixtures", summary: "Analyzing mixtures by mass percent and interpreting mixture data.", depth: "concise" },
      { id: "1.5", title: "Atomic Structure and Electron Configuration", summary: "Subatomic particles, aufbau, Hund, Pauli, and writing configurations.", depth: "full" },
      { id: "1.6", title: "Photoelectron Spectroscopy", summary: "Reading PES spectra: peak positions, heights, and electron evidence.", depth: "full" },
      { id: "1.7", title: "Periodicity", summary: "Atomic radius, ionization energy, electronegativity — and Z_eff explains all.", depth: "full" },
      { id: "1.8", title: "Formation of Ions", summary: "Why metals lose and nonmetals gain electrons; isoelectronic series.", depth: "full" },
    ],
  },
  {
    num: 2,
    id: "molecular-structure",
    title: "Molecular and Ionic Compound Structure and Properties",
    blurb:
      "How atoms stick together and what shape the result takes: bond types and energies, Lewis diagrams, resonance and formal charge, VSEPR geometry, and hybridization.",
    examWeight: "7–9%",
    color: "#4ade80",
    icon: "🧬",
    topics: [
      { id: "2.1", title: "Types of Chemical Bonds", summary: "Ionic vs covalent vs metallic — the electronegativity continuum.", depth: "full" },
      { id: "2.2", title: "Intramolecular Force and Potential Energy", summary: "The PE curve: why bonds form at the energy minimum.", depth: "full" },
      { id: "2.3", title: "Bond Length and Strength", summary: "Bond order, length, and energy relationships.", depth: "concise" },
      { id: "2.4", title: "Bond Energy", summary: "Average bond enthalpies and using them to estimate ΔH.", depth: "concise" },
      { id: "2.5", title: "Lewis Diagrams", summary: "Drawing Lewis structures step by step, including octet exceptions.", depth: "full" },
      { id: "2.6", title: "Resonance and Formal Charge", summary: "Delocalized electrons, equivalent structures, and choosing the best one.", depth: "full" },
      { id: "2.7", title: "VSEPR and Bond Hybridization", summary: "From electron groups to 3-D shape, angles, and sp/sp²/sp³ orbitals.", depth: "full" },
    ],
  },
  {
    num: 3,
    id: "intermolecular-forces",
    title: "Intermolecular Forces and Properties",
    blurb:
      "Forces BETWEEN particles and the bulk behavior they cause: IMFs, solids, liquids, gases, the ideal gas law and kinetic theory, solutions, and spectroscopy.",
    examWeight: "10–13%",
    color: "#22d3ee",
    icon: "🫧",
    topics: [
      { id: "3.1", title: "Intermolecular Forces", summary: "London dispersion, dipole–dipole, hydrogen bonding — predicting strength.", depth: "full" },
      { id: "3.2", title: "Properties of Solids", summary: "Ionic, covalent network, metallic, and molecular solids and their properties.", depth: "full" },
      { id: "3.3", title: "Solids, Liquids, and Gases", summary: "Phase behavior, kinetic vs potential energy, and phase changes.", depth: "full" },
      { id: "3.4", title: "Ideal Gas Law", summary: "PV = nRT: every variable, the constant, and combined manipulations.", depth: "full" },
      { id: "3.5", title: "Kinetic Molecular Theory", summary: "The five postulates and what temperature really measures.", depth: "concise" },
      { id: "3.6", title: "Deviation from Ideal Gas Law", summary: "When real gases misbehave: particle volume and attractions.", depth: "concise" },
      { id: "3.7", title: "Solutions and Mixtures", summary: "Solute, solvent, and the spectrum from solutions to colloids to suspensions.", depth: "concise" },
      { id: "3.8", title: "Representations of Solutions", summary: "Particulate drawings of dissolved species — ions vs molecules.", depth: "concise" },
      { id: "3.9", title: "Separation of Solutions and Mixtures", summary: "Chromatography, distillation, and the property each exploits.", depth: "concise" },
      { id: "3.10", title: "Solvation Process", summary: "How solutes dissolve: overcoming forces, ion–dipole interactions.", depth: "concise" },
      { id: "3.11", title: "Spectroscopy and the Electromagnetic Spectrum", summary: "What different wavelengths probe in matter; Beer–Lambert law.", depth: "full" },
      { id: "3.12", title: "Photoelectric Effect", summary: "Light as photons: threshold frequency and quantized energy.", depth: "concise" },
      { id: "3.13", title: "Bohr Model of the Hydrogen Atom", summary: "Quantized orbits, emission lines, and energy level transitions.", depth: "concise" },
      { id: "3.14", title: "Energy Levels and Spectra", summary: "Connecting electron transitions to absorption and emission spectra.", depth: "concise" },
    ],
  },
  {
    num: 4,
    id: "chemical-reactions",
    title: "Chemical Reactions",
    blurb:
      "Reading and writing chemical change: net ionic equations, particulate representations, stoichiometry, titration basics, reaction types, and redox.",
    examWeight: "7–9%",
    color: "#c084fc",
    icon: "⚗️",
    topics: [
      { id: "4.1", title: "Introduction to Reactions", summary: "Physical vs chemical change and how we represent reactions.", depth: "concise" },
      { id: "4.2", title: "Net Ionic Equations", summary: "Spectator ions out; the chemistry that actually happens stays.", depth: "full" },
      { id: "4.3", title: "Representations of Reactions", summary: "Translating between particulate diagrams, equations, and graphs.", depth: "concise" },
      { id: "4.4", title: "Physical and Chemical Changes", summary: "Telling the difference by evidence and energy.", depth: "concise" },
      { id: "4.5", title: "Stoichiometry", summary: "The mole-ratio machine: grams → moles → moles → grams.", depth: "full" },
      { id: "4.6", title: "Introduction to Titration", summary: "Volumetric analysis: equivalence point from concentration and volume.", depth: "concise" },
      { id: "4.7", title: "Types of Chemical Reactions", summary: "Synthesis, decomposition, replacement — and predicting products.", depth: "full" },
      { id: "4.8", title: "Introduction to Acid–Base Reactions", summary: "Arrhenius and Brønsted–Lowry acids and bases; neutralization.", depth: "concise" },
      { id: "4.9", title: "Oxidation-Reduction (Redox) Reactions", summary: "Oxidation numbers, electron bookkeeping, who is oxidized/reduced.", depth: "full" },
    ],
  },
  {
    num: 5,
    id: "kinetics",
    title: "Kinetics",
    blurb:
      "How FAST reactions run and why: rate laws, concentration vs time, collision theory, energy profiles, mechanisms, and catalysts.",
    examWeight: "7–9%",
    color: "#fb923c",
    icon: "⏱️",
    topics: [
      { id: "5.1", title: "Reaction Rates", summary: "Defining and measuring rate from concentration–time data.", depth: "concise" },
      { id: "5.2", title: "Introduction to Rate Law", summary: "rate = k[A]^m[B]^n — finding orders from initial-rate data.", depth: "full" },
      { id: "5.3", title: "Concentration Changes over Time", summary: "Integrated rate laws, half-lives, and linear plots (0th/1st/2nd order).", depth: "concise" },
      { id: "5.4", title: "Elementary Reactions", summary: "One-step events whose molecularity equals their order.", depth: "concise" },
      { id: "5.5", title: "Collision Model", summary: "Reactions need collisions with enough energy AND right orientation.", depth: "full" },
      { id: "5.6", title: "Reaction Energy Profile", summary: "Reading potential-energy diagrams: Ea, intermediates, ΔH.", depth: "full" },
      { id: "5.7", title: "Reaction Mechanisms", summary: "Multi-step stories: elementary steps sum to the overall reaction.", depth: "concise" },
      { id: "5.8", title: "Mechanism and Rate Law", summary: "The slow step governs; validating mechanisms against rate data.", depth: "concise" },
      { id: "5.9", title: "Steady-State Approximation", summary: "Handling reactive intermediates when no single step is clearly slow.", depth: "concise" },
      { id: "5.10", title: "Multistep Reaction Energy Profile", summary: "Peaks and valleys: transition states vs intermediates.", depth: "concise" },
      { id: "5.11", title: "Catalysts", summary: "Lowering Ea without being consumed; catalysts on profiles.", depth: "concise" },
    ],
  },
  {
    num: 6,
    id: "thermodynamics",
    title: "Thermodynamics",
    blurb:
      "Energy flow in chemical change: endo/exothermic processes, energy diagrams, heat transfer, calorimetry, and enthalpies of reaction, formation, and solution.",
    examWeight: "7–9%",
    color: "#f87171",
    icon: "🔥",
    topics: [
      { id: "6.1", title: "Endothermic and Exothermic Processes", summary: "System vs surroundings; sign conventions for heat flow.", depth: "full" },
      { id: "6.2", title: "Energy Diagrams", summary: "Particle-level potential energy views of energy absorption/release.", depth: "concise" },
      { id: "6.3", title: "Heat Transfer and Thermal Equilibrium", summary: "Energy conservation when hot meets cold.", depth: "concise" },
      { id: "6.4", title: "Heat Capacity and Calorimetry", summary: "q = mcΔT and measuring enthalpy changes in coffee cups.", depth: "full" },
      { id: "6.5", title: "Energy of Chemical Reactions", summary: "Bond breaking vs forming and reaction enthalpy.", depth: "concise" },
      { id: "6.6", title: "Enthalpy of Formation", summary: "ΔH°f tables and Hess's law arithmetic.", depth: "full" },
      { id: "6.7", title: "Bond Energies", summary: "Estimating ΔH from average bond enthalpies.", depth: "concise" },
      { id: "6.8", title: "Enthalpy of Solution", summary: "Why some things dissolve endothermically anyway.", depth: "concise" },
    ],
  },
  {
    num: 7,
    id: "equilibrium",
    title: "Equilibrium",
    blurb:
      "Reversible reactions at balance: Q vs K, calculating equilibrium concentrations, Le Châtelier's principle, and solubility equilibria.",
    examWeight: "7–9%",
    color: "#34d399",
    icon: "⚖️",
    topics: [
      { id: "7.1", title: "Introduction to Equilibrium", summary: "Dynamic balance: forward and reverse rates become equal.", depth: "full" },
      { id: "7.2", title: "Direction of Reversible Reactions", summary: "Both directions run at once; net change depends on conditions.", depth: "concise" },
      { id: "7.3", title: "Reaction Quotient and Equilibrium Constant", summary: "Writing Q and K expressions correctly (no solids, no liquids).", depth: "full" },
      { id: "7.4", title: "Calculating the Equilibrium Constant", summary: "From equilibrium concentrations — and from initial + one change.", depth: "full" },
      { id: "7.5", title: "Magnitude of the Equilibrium Constant", summary: "What K ≫ 1 and K ≪ 1 say about a reaction's extent.", depth: "concise" },
      { id: "7.6", title: "Properties of the Equilibrium Constant", summary: "Reversing, scaling, and adding reactions transforms K predictably.", depth: "concise" },
      { id: "7.7", title: "Calculating Equilibrium Concentrations", summary: "ICE tables: the workhorse of Unit 7.", depth: "full" },
      { id: "7.8", title: "Representations of Equilibrium", summary: "Particle diagrams and graphs of concentration vs time.", depth: "concise" },
      { id: "7.9", title: "Introduction to Le Châtelier's Principle", summary: "Stress the system and it shifts to partially relieve the stress.", depth: "full" },
      { id: "7.10", title: "Reaction Quotient and Le Châtelier's Principle", summary: "Q vs K predicts shift direction quantitatively.", depth: "concise" },
      { id: "7.11", title: "Introduction to Solubility Equilibria", summary: "Ksp and the saturated solution equilibrium.", depth: "full" },
      { id: "7.12", title: "Common-Ion Effect", summary: "Added product ion suppresses dissociation and solubility.", depth: "concise" },
      { id: "7.13", title: "pH and Solubility", summary: "Acidic solutions dissolve salts of weak-acid anions.", depth: "concise" },
    ],
  },
  {
    num: 8,
    id: "acids-bases",
    title: "Acids and Bases",
    blurb:
      "Proton chemistry: pH scale, strong vs weak acids and bases, Ka/Kb equilibria, buffers and Henderson–Hasselbalch, titration curves, and molecular structure of acids.",
    examWeight: "11–15%",
    color: "#fbbf24",
    icon: "🍋",
    topics: [
      { id: "8.1", title: "Introduction to Acids and Bases", summary: "Arrhenius, Brønsted–Lowry, and conjugate pairs.", depth: "full" },
      { id: "8.2", title: "pH and pOH of Strong Acids and Bases", summary: "Full dissociation makes the math direct; Kw connects pH and pOH.", depth: "full" },
      { id: "8.3", title: "Weak Acid and Base Equilibria", summary: "Ka and Kb: partial dissociation equilibrium calculations.", depth: "full" },
      { id: "8.4", title: "Acid–Base Reactions and Buffers", summary: "Neutralization and what makes a buffer a buffer.", depth: "concise" },
      { id: "8.5", title: "Acid–Base Titrations", summary: "Curve anatomy: equivalence point, half-equivalence, indicators.", depth: "full" },
      { id: "8.6", title: "Molecular Structure of Acids and Bases", summary: "Why some O–H bonds release H⁺ and binary acid strength trends.", depth: "concise" },
      { id: "8.7", title: "pH and pKa", summary: "pKa as acid strength; comparing pH of equimolar solutions.", depth: "concise" },
      { id: "8.8", title: "Properties of Buffers", summary: "How buffers resist pH change by consuming added H⁺/OH⁻.", depth: "full" },
      { id: "8.9", title: "Henderson–Hasselbalch Equation", summary: "pH = pKa + log([A⁻]/[HA]) and when to use it.", depth: "concise" },
      { id: "8.10", title: "Buffer Capacity", summary: "How much acid/base a buffer can absorb before pH breaks.", depth: "concise" },
      { id: "8.11", title: "pH and Solubility", summary: "Hydroxide and weak-acid salts: solubility depends on pH.", depth: "concise" },
      { id: "8.12", title: "Titrations and Solubility Equilibria", summary: "Selective precipitation and titrating mixtures.", depth: "concise" },
      { id: "8.13", title: "Lewis Acids and Bases", summary: "The widest definition: electron-pair acceptors and donors.", depth: "concise" },
    ],
  },
  {
    num: 9,
    id: "applications-thermo",
    title: "Applications of Thermodynamics",
    blurb:
      "What makes reactions GO: entropy, Gibbs free energy and thermodynamic favorability, coupled reactions, and electrochemistry — galvanic and electrolytic cells.",
    examWeight: "7–9%",
    color: "#f472b6",
    icon: "🔋",
    topics: [
      { id: "9.1", title: "Introduction to Entropy", summary: "Dispersal of energy and matter; predicting entropy changes.", depth: "full" },
      { id: "9.2", title: "Absolute Entropy and Entropy Change", summary: "Calculating ΔS° from tabulated values.", depth: "concise" },
      { id: "9.3", title: "Gibbs Free Energy and Thermodynamic Favorability", summary: "ΔG = ΔH − TΔS: the favorability decision tree.", depth: "full" },
      { id: "9.4", title: "Thermodynamic and Kinetic Control", summary: "Favorable ≠ fast: why diamonds don't turn into graphite visibly.", depth: "concise" },
      { id: "9.5", title: "Free Energy and Equilibrium", summary: "ΔG° = −RT ln K connects thermo to equilibrium.", depth: "concise" },
      { id: "9.6", title: "Coupled Reactions", summary: "Driving unfavorable reactions with favorable ones.", depth: "concise" },
      { id: "9.7", title: "Galvanic (Voltaic) Cells", summary: "Harvesting spontaneous redox as electricity: anode, cathode, salt bridge.", depth: "full" },
      { id: "9.8", title: "Cell Potential and Free Energy", summary: "E°cell, ΔG° = −nFE°, and how far from equilibrium a cell is.", depth: "concise" },
      { id: "9.9", title: "Electrolytic Cells", summary: "Forcing nonspontaneous redox with an external power source.", depth: "concise" },
    ],
  },
];

export const UNIT_MAP = new Map(UNITS.map((u) => [u.num, u]));
export const TOPIC_INDEX = new Map<string, { unit: UnitMeta; topic: TopicMeta }>();
for (const u of UNITS) {
  for (const t of u.topics) TOPIC_INDEX.set(t.id, { unit: u, topic: t });
}

export function getTopic(id: string) {
  return TOPIC_INDEX.get(id) ?? null;
}
