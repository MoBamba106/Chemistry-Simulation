import type { Lesson } from "../lessonTypes";

/**
 * Unit 1 — Atomic Structure and Properties (full lessons for all topics).
 */
export const unit1: Record<string, Lesson> = {
  /* ================================================================ 1.1 */
  "1.1": {
    id: "1.1",
    unit: 1,
    title: "Moles and Molar Mass",
    objectives: [
      "Convert between mass, moles, and particle count using molar mass and Avogadro's number",
      "Explain why the mole is defined the way it is (the amu–gram bridge)",
      "Compute molar mass of any compound from the periodic table",
    ],
    keyTerms: ["mole", "avogadro", "molar-mass", "atom"],
    relatedSims: ["periodic-explorer", "molecule-builder"],
    blocks: [
      {
        t: "p",
        text: "Atoms are absurdly small: one gram of hydrogen holds about $6 \\times 10^{23}$ atoms. No balance can weigh a single atom, and no spoon counts them — so chemistry needs a **counting unit tied to a weighable amount**. That unit is the [[mole]].",
      },
      {
        t: "key",
        term: "Mole (mol)",
        text: "Exactly $6.022 \\times 10^{23}$ particles — [[avogadro|Avogadro's number]]. Defined so that the mass of 1 mole of a substance in **grams** equals the mass of one particle in **amu**: one ¹²C atom weighs 12 amu; one mole of ¹²C weighs exactly 12 g.",
      },
      {
        t: "key",
        term: "Molar mass (M)",
        text: "Mass of one mole (g/mol). For compounds, sum the atomic masses: $M(\\text{H}_2\\text{SO}_4) = 2(1.008) + 32.06 + 4(16.00) = 98.08$ g/mol. The **Molecule Builder** computes this live for any structure you draw.",
      },
      { t: "eq", latex: "n = \\frac{m}{M} \\qquad N = n \\times N_A", caption: "The two conversion bridges: mass ↔ moles (molar mass) and moles ↔ particles (Avogadro's number)." },
      {
        t: "example",
        title: "How many water molecules are in a sip (18 mL)?",
        steps: [
          "Water's density is ≈ 1.00 g/mL, so 18 mL ≈ 18 g.",
          "Molar mass of H₂O = 2(1.008) + 16.00 = 18.02 g/mol.",
          "Moles: $n = 18\\ \\text{g} \\div 18.02\\ \\text{g/mol} \\approx 1.0$ mol.",
          "Molecules: $1.0\\ \\text{mol} \\times 6.022 \\times 10^{23} = 6.0 \\times 10^{23}$ molecules.",
          "Each molecule has 3 atoms → about $1.8 \\times 10^{24}$ **atoms** in one sip.",
        ],
        answer: "≈ 6.0 × 10²³ molecules (1.0 mol). Notice the trap: molecules ≠ atoms. Count what the question asks for.",
      },
      {
        t: "example",
        title: "Mass of a given number of formula units",
        steps: [
          "Question: what mass is $3.01 \\times 10^{23}$ formula units of NaCl?",
          "Convert particles → moles: $3.01 \\times 10^{23} \\div 6.022 \\times 10^{23} = 0.500$ mol.",
          "Molar mass: 22.99 + 35.45 = 58.44 g/mol.",
          "Mass: $0.500 \\times 58.44 = 29.2$ g.",
        ],
        answer: "29.2 g. The path is always: particles → mol → grams (or the reverse).",
      },
      {
        t: "misconception",
        text: "“Molar mass and atomic mass are different numbers in different units.” No — they are **numerically identical**: carbon's atomic mass is 12.01 amu/atom and its molar mass is 12.01 g/mol. That equivalence is the entire point of defining the mole this way.",
      },
      {
        t: "exam",
        text: "Mole conversions underpin every quantitative FRQ (stoichiometry, solutions, gas laws, equilibrium). Show dimensional analysis with units canceling — AP scorers award the setup point even if arithmetic slips. Use atomic masses to two decimals from the periodic table provided.",
      },
      {
        t: "callout",
        tone: "info",
        title: "Why 6.022 × 10²³?",
        text: "It's not arbitrary: it's the number of amu in one gram. Since a nucleon weighs ≈ 1 amu and atoms are mostly nucleons, Avogadro's number is the exchange rate between the atomic currency (amu) and the lab currency (grams).",
      },
    ],
  },

  /* ================================================================ 1.2 */
  "1.2": {
    id: "1.2",
    unit: 1,
    title: "Mass Spectroscopy of Elements",
    objectives: [
      "Interpret a mass spectrum: peak position = isotope mass, peak area = relative abundance",
      "Calculate average atomic mass as a weighted average",
      "Explain how mass spectrometry provides evidence for isotopes",
    ],
    keyTerms: ["mass-spectroscopy", "isotope", "average-atomic-mass", "mass-number"],
    relatedSims: ["atom-builder"],
    blocks: [
      {
        t: "p",
        text: "A [[mass-spectroscopy|mass spectrometer]] vaporizes and ionizes a sample, accelerates the ions with an electric field, and bends their paths with a magnet. Heavier ions bend less, lighter ions bend more, and a detector records where each ion lands. The result is direct experimental evidence that elements come in different-mass versions: [[isotope|isotopes]].",
      },
      {
        t: "list",
        items: [
          "**Peak position (x-axis)**: the mass of each isotope (amu), usually mass-to-charge ratio m/z with z = 1.",
          "**Peak height / area (y-axis)**: relative abundance — how common that isotope is.",
          "**Number of peaks**: number of isotopes.",
        ],
      },
      { t: "eq", latex: "\\bar{m} = \\sum_i f_i \\, m_i", caption: "Average atomic mass = Σ (fractional abundance × isotope mass). This weighted average is the decimal number on the periodic table." },
      {
        t: "example",
        title: "Chlorine's famous 3:1 double peak",
        steps: [
          "Chlorine's spectrum shows two peaks: 34.97 amu (75.77%) and 36.97 amu (24.23%).",
          "Weighted average: $\\bar{m} = 0.7577(34.97) + 0.2423(36.97)$.",
          "$= 26.50 + 8.96 = 35.45$ amu.",
          "That matches the periodic table's 35.45 — no chlorine atom actually weighs 35.45 amu!",
        ],
        answer: "35.45 amu. The periodic-table mass is an average over isotopes, never the mass of an individual atom.",
      },
      {
        t: "sim",
        sim: "atom-builder",
        preset: "carbon-14",
        caption: "Carbon-12 and carbon-14 are the same element (6 protons — the Build screen shows why) with different neutron counts. A mass spectrometer of carbon would show a huge peak at 12 and a whisper at 13–14.",
      },
      {
        t: "misconception",
        text: "Students read the tallest peak's mass as 'the atomic mass'. It isn't — the atomic mass is the **weighted average of all peaks**. Boron's spectrum peaks at 11 (80%) and 10 (20%): average = 10.81, between the peaks and closer to 11.",
      },
      {
        t: "exam",
        text: "MCQs love giving a spectrum and asking which element it is (count peaks, compute the weighted average, match the periodic table) or justifying that a sample is pure by comparing its measured average mass to the table value.",
      },
    ],
  },

  /* ================================================================ 1.3 */
  "1.3": {
    id: "1.3",
    unit: 1,
    title: "Elemental Composition of Pure Substances",
    objectives: [
      "Apply the law of definite proportions to pure compounds",
      "Convert between percent composition, empirical formula, and molecular formula",
      "Interpret combustion-analysis data",
    ],
    keyTerms: ["percent-composition", "empirical-formula", "molecular-formula", "law-definite-proportions", "molar-mass"],
    relatedSims: ["molecule-builder"],
    blocks: [
      {
        t: "p",
        text: "Every pure sample of a [[compound]] has the same element ratio — water from a glacier and water from a faucet are both 8:1 oxygen-to-hydrogen **by mass**. This is the [[law-definite-proportions|law of definite proportions]], and it's the fingerprint that distinguishes compounds from mixtures (whose composition varies).",
      },
      { t: "eq", latex: "\\%\\,X = \\frac{n \\cdot M_X}{M_{\\text{compound}}} \\times 100\\%", caption: "Percent composition: mass contributed by element X in one mole of compound, over the molar mass." },
      {
        t: "example",
        title: "Percent composition of iron(III) oxide, Fe₂O₃",
        steps: [
          "Molar mass: $2(55.85) + 3(16.00) = 159.70$ g/mol.",
          "Iron: $111.70 \\div 159.70 \\times 100 = 69.94\\%$.",
          "Oxygen: $48.00 \\div 159.70 \\times 100 = 30.06\\%$.",
        ],
        answer: "69.94% Fe, 30.06% O. (This is why Fe₂O₃ is a viable iron ore — nearly 70% iron by mass.)",
      },
      {
        t: "h",
        text: "From percent to empirical to molecular",
      },
      {
        t: "list",
        ordered: true,
        items: [
          "Assume a **100 g sample** — percents become grams.",
          "Convert each mass to **moles** with molar masses.",
          "Divide all mole values by the **smallest** one.",
          "If needed, multiply by a small integer to get whole numbers (×2 for '.5', ×3 for '.33', ×4 for '.25').",
          "That's the [[empirical-formula]]. For the [[molecular-formula]], compute $n = M_{\\text{actual}} / M_{\\text{empirical}}$ and multiply every subscript by n.",
        ],
      },
      {
        t: "example",
        title: "Finding glucose from combustion-style data",
        steps: [
          "A compound is 40.0% C, 6.71% H, 53.28% O; its molar mass is ≈180 g/mol.",
          "Per 100 g: C 40.0/12.01 = 3.33 mol; H 6.71/1.008 = 6.66 mol; O 53.28/16.00 = 3.33 mol.",
          "Divide by smallest (3.33): C 1, H 2, O 1 → empirical CH₂O (30.03 g/mol).",
          "$n = 180 / 30.03 \\approx 6$ → molecular formula C₆H₁₂O₆.",
        ],
        answer: "Empirical CH₂O, molecular C₆H₁₂O₆ — glucose. Acetic acid (C₂H₄O₂) and formaldehyde (CH₂O) share the empirical formula; only molar mass distinguishes them.",
      },
      {
        t: "callout",
        tone: "violet",
        title: "Combustion analysis in one sentence",
        text: "Burn an unknown C/H(/O) compound, trap the CO₂ and H₂O, and their masses tell you the moles of C and H directly; oxygen is found by subtracting C and H mass from the original sample mass.",
      },
      {
        t: "misconception",
        text: "“Empirical formula = the real formula.” Only when n = 1. And you can NEVER get the molecular formula from percent composition alone — you need the molar mass too.",
      },
      {
        t: "exam",
        text: "Typical MCQ: given percents and a molar mass, pick the formula. Typical FRQ piece: 'Determine the empirical formula from the data' — show the mole table and the division step to earn the point.",
      },
    ],
  },

  /* ================================================================ 1.4 */
  "1.4": {
    id: "1.4",
    unit: 1,
    title: "Composition of Mixtures",
    objectives: [
      "Analyze the composition of mixtures using mass percent",
      "Distinguish pure substances from mixtures using composition data",
    ],
    keyTerms: ["matter-classification", "percent-composition"],
    relatedSims: ["periodic-explorer"],
    blocks: [
      {
        t: "p",
        text: "Pure substances have fixed composition; [[matter-classification|mixtures]] vary. Composition analysis turns that difference into a measuring tool: knowing each component's identity lets you determine how much of each is present.",
      },
      {
        t: "example",
        title: "A mixture from mass percent",
        steps: [
          "A 4.00 g sample of NaCl + KCl is 58.0% chlorine by… no — by *mass of chloride* the sample yields 2.20 g Cl.",
          "Set up: let x = mass NaCl (35.45/58.44 = 60.66% Cl), (4.00 − x) = mass KCl (35.45/74.55 = 47.55% Cl).",
          "$0.6066x + 0.4755(4.00 - x) = 2.20$ → $0.1311x = 0.298$ → x ≈ 2.27 g.",
          "Sample is ≈ 57% NaCl, 43% KCl by mass.",
        ],
        answer: "Mixture problems = one equation per measured quantity. Mass percent of each component is the standard report format.",
      },
      {
        t: "exam",
        text: "The AP exam often frames this as sample purity: 'A 2.50 g sample labeled 98% pure CaCO₃ reacts with acid…' — impurities that don't react simply subtract from the effective mass.",
      },
    ],
  },

  /* ================================================================ 1.5 */
  "1.5": {
    id: "1.5",
    unit: 1,
    title: "Atomic Structure and Electron Configuration",
    objectives: [
      "Identify subatomic particles and their roles (identity, isotope, charge)",
      "Write ground-state electron configurations and orbital diagrams using aufbau, Pauli, and Hund",
      "Use noble-gas shorthand and write configurations for ions",
    ],
    keyTerms: ["atom", "subatomic-particles", "electron-configuration", "aufbau", "hund", "pauli", "orbitals", "quantum-numbers", "valence-electrons"],
    relatedSims: ["electron-config", "atom-builder"],
    blocks: [
      {
        t: "p",
        text: "An [[atom]] is a nucleus of [[proton|protons]] and [[neutron|neutrons]] surrounded by [[electron|electrons]]. Three bookkeeping rules do nearly all the work: the [[atomic-number|atomic number]] Z = protons = identity; the [[mass-number|mass number]] A = protons + neutrons = isotope; and charge = protons − electrons = [[ion]] status. Notation packs it all: $^{A}_{Z}X^{c}$, as in $^{23}_{11}\\text{Na}^{+}$.",
      },
      {
        t: "table",
        headers: ["Particle", "Charge", "Mass (amu)", "Role"],
        rows: [
          ["Proton", "+1", "1.0073", "Defines the element (Z)"],
          ["Neutron", "0", "1.0087", "Defines the isotope; stabilizes nucleus"],
          ["Electron", "−1", "0.00055", "Defines charge; does ALL the chemistry"],
        ],
      },
      {
        t: "h",
        text: "Where the electrons live",
      },
      {
        t: "p",
        text: "Electrons occupy [[orbitals]] — quantized probability regions grouped into subshells (s: 1 orbital, p: 3, d: 5, f: 7; each holds 2 electrons). Three rules fill them:",
      },
      {
        t: "list",
        items: [
          "**[[aufbau|Aufbau principle]]** — lowest energy first: 1s 2s 2p 3s 3p **4s** 3d 4p 5s 4d 5p 6s 4f 5d… (the n + ℓ rule orders them).",
          "**[[pauli|Pauli exclusion]]** — max 2 electrons per orbital, opposite spins.",
          "**[[hund|Hund's rule]]** — fill degenerate orbitals singly (parallel spins) before pairing.",
        ],
      },
      {
        t: "example",
        title: "Sulfur: configuration, diagram, valence",
        steps: [
          "Z = 16 → 16 electrons to place.",
          "Aufbau: 1s² (2), 2s² (4), 2p⁶ (10), 3s² (12), 3p⁴ (16) — done.",
          "Configuration: **1s² 2s² 2p⁶ 3s² 3p⁴**, shorthand **[Ne] 3s² 3p⁴**.",
          "3p⁴ orbital diagram: ↑↓ ↑ ↑ — two unpaired electrons (Hund).",
          "Valence electrons: shell n = 3 → 3s²3p⁴ = **6** (group 16 ✓).",
        ],
        answer: "[Ne] 3s² 3p⁴ with 2 unpaired electrons and 6 valence electrons.",
      },
      {
        t: "sim",
        sim: "electron-config",
        preset: "oxygen",
        caption: "Build configurations one electron at a time — each placement names the rule it follows. Try Fe²⁺ to see transition metals lose 4s before 3d.",
      },
      {
        t: "callout",
        tone: "warning",
        title: "Two exceptions to memorize",
        text: "Cr = [Ar] 4s¹3d⁵ and Cu = [Ar] 4s¹3d¹⁰ — half-filled and fully-filled d subshells are extra stable, so an s electron is promoted. The toggle in the lab shows predicted vs observed.",
      },
      {
        t: "callout",
        tone: "violet",
        title: "Ions",
        text: "Main-group **anions**: add electrons to the aufbau order (Cl⁻ = [Ar]). **Cations**: remove from the highest n first — for transition metals that means 4s empties BEFORE 3d: Fe = [Ar]4s²3d⁶ → Fe²⁺ = [Ar]3d⁶, Fe³⁺ = [Ar]3d⁵.",
      },
      {
        t: "misconception",
        text: "Orbitals are not orbits. The [[bohr-model|Bohr model's]] neat rings are a bookkeeping picture for energy levels; real electrons are probability clouds with no defined path. Also: '4s fills first' does NOT mean '4s ionizes last' — it ionizes first.",
      },
      {
        t: "exam",
        text: "Expect MCQs on identifying a configuration (neutral vs ion vs excited state) and FRQ justifications that lean on configurations: 'Explain why the first IE of Mg exceeds that of Na' — answer in terms of Z_eff and the stability of full/half-full subshells.",
      },
    ],
  },

  /* ================================================================ 1.6 */
  "1.6": {
    id: "1.6",
    unit: 1,
    title: "Photoelectron Spectroscopy",
    objectives: [
      "Explain the physics of PES: photon in, electron out, kinetic energy measured",
      "Read a PES spectrum: peaks = subshells, position = binding energy, height = electron count",
      "Use PES to argue for shells, subshells, and effective nuclear charge",
    ],
    keyTerms: ["pes", "electron-configuration", "shielding", "zeff", "photon"],
    relatedSims: ["electron-config"],
    blocks: [
      {
        t: "p",
        text: "Fire high-energy photons (usually UV or X-ray) at atoms and electrons get ejected. Measure each ejected electron's kinetic energy and energy conservation reveals exactly how tightly it was held — this is [[pes|photoelectron spectroscopy]], the most direct experimental map of [[electron-configuration|electron configurations]] we have.",
      },
      { t: "eq", latex: "E_{\\text{photon}} = BE + KE_e \\quad\\Rightarrow\\quad BE = h\\nu - \\tfrac{1}{2}m_ev^2", caption: "Photon energy = binding energy + kinetic energy of the freed electron." },
      {
        t: "list",
        items: [
          "**One peak per occupied subshell** (not per shell — 2s and 2p are separate peaks).",
          "**Peak position** = binding energy: farther right = more tightly held = closer to nucleus / less shielded (1s is always the far-right, tallest-energy peak).",
          "**Peak height (or area)** = number of electrons in that subshell: a p-subshell peak is 3× taller than an s-subshell peak when both are full.",
        ],
      },
      {
        t: "example",
        title: "Identify an element from its spectrum",
        steps: [
          "Three peaks at binding energies ≈ 870, 48, and 21 MJ/mol with height ratio 2 : 2 : 6.",
          "Heights mean 2, 2, 6 electrons = 10 electrons total → Z = 10.",
          "Assignment: 870 MJ/mol = 1s² (innermost), 48 = 2s², 21 = 2p⁶.",
          "Configuration 1s²2s²2p⁶ → **neon**.",
        ],
        answer: "Neon. The huge gap between 870 and 48 MJ/mol is the shell boundary — direct evidence for quantized shells.",
      },
      {
        t: "example",
        title: "Comparing 1s peaks across elements",
        steps: [
          "The 1s peak of oxygen sits at higher binding energy than nitrogen's, which sits above carbon's.",
          "1s electrons are in the SAME shell (n = 1) for all three — distance is not the variable.",
          "What changes is nuclear charge: C (Z=6) < N (Z=7) < O (Z=8), with essentially identical shielding.",
          "Higher Z, same distance → stronger Coulomb attraction → more energy needed to eject.",
        ],
        answer: "The shifting 1s peak is a live demonstration of [[zeff|effective nuclear charge]] increasing across a period.",
      },
      {
        t: "misconception",
        text: "Peak height ≠ energy, and peak position ≠ number of electrons. The x-axis tells you HOW TIGHTLY held; the y-axis tells you HOW MANY. Also, peaks appear in order of binding energy, not filling order.",
      },
      {
        t: "exam",
        text: "PES is a favorite FRQ data-analysis hook: 'Justify the difference in 1s binding energies' or 'Identify the element and write its configuration.' Always cite Coulomb's law — charge and distance — in your justification.",
      },
      { t: "sim", sim: "electron-config", preset: "iron", caption: "Iron's PES would show peaks for 1s 2s 2p 3s 3p 4s 3d — seven subshells, with the 3d peak carrying 6 electrons' worth of height." },
    ],
  },

  /* ================================================================ 1.7 */
  "1.7": {
    id: "1.7",
    unit: 1,
    title: "Periodicity",
    objectives: [
      "Explain and predict trends in atomic/ionic radius, ionization energy, and electronegativity",
      "Justify trends with Z_eff, shielding, and Coulomb's law",
      "Rank isoelectronic species and explain IE anomalies (N vs O, Be vs B)",
    ],
    keyTerms: ["periodic-trends", "atomic-radius", "ionization-energy", "electronegativity", "zeff", "shielding", "coulomb-law", "isoelectronic"],
    relatedSims: ["periodic-explorer"],
    blocks: [
      {
        t: "p",
        text: "Every periodic trend reduces to one sentence: **attraction between nucleus and valence electrons is governed by [[coulomb-law|Coulomb's law]]** — charge over distance. Across a period, [[zeff|Z_eff]] rises (protons added, shielding roughly constant) so attraction strengthens. Down a group, valence shells get farther out and better shielded, so attraction weakens.",
      },
      {
        t: "table",
        headers: ["Property", "Across a period (→)", "Down a group (↓)", "Why"],
        rows: [
          ["[[atomic-radius|Atomic radius]]", "decreases", "increases", "Z_eff pulls same shell in; new shells push out"],
          ["[[ionization-energy|1st ionization energy]]", "increases*", "decreases", "tighter hold = harder to remove"],
          ["[[electronegativity]]", "increases", "decreases", "same physics, applied to shared electrons"],
          ["Metallic character", "decreases", "increases", "easy e⁻ loss = metallic"],
        ],
        caption: "*with famous exceptions — see below.",
      },
      {
        t: "h",
        text: "The exceptions the exam loves",
      },
      {
        t: "list",
        items: [
          "**N > O in first IE** (reversing the trend): N's 2p³ is half-filled — one electron per orbital. O's 2p⁴ must pair two electrons in one orbital, and that e⁻–e⁻ repulsion makes one easier to remove.",
          "**Be > B**: removing B's single 2p electron (higher energy, more shielded) is easier than breaking into Be's full 2s².",
          "**Anions are bigger, cations smaller** than their parent atom: Cl⁻ (1.81 Å) vs Cl (0.99 Å); Na⁺ (1.02 Å) vs Na (1.66 Å). Gaining electrons adds repulsion; losing them raises Z_eff per remaining electron (and cations often lose a whole shell).",
        ],
      },
      {
        t: "example",
        title: "Rank the isoelectronic series O²⁻, F⁻, Ne, Na⁺, Mg²⁺",
        steps: [
          "All have 10 electrons (1s²2s²2p⁶) — shielding is identical.",
          "Only the proton count differs: O(8), F(9), Ne(10), Na(11), Mg(12).",
          "More protons pulling the same 10 electrons → smaller radius.",
        ],
        answer: "Largest → smallest: O²⁻ > F⁻ > Ne > Na⁺ > Mg²⁺. Isoelectronic ranking is a pure Coulomb's-law question.",
      },
      {
        t: "sim",
        sim: "periodic-explorer",
        preset: "trends-en",
        caption: "Switch the heatmap between radius, IE, and electronegativity and watch the trends appear — then use Compare mode to practice justification language.",
      },
      {
        t: "misconception",
        text: "'Ionization energy always increases across a period' — the N/O and Be/B dips exist. And noble gases have NO meaningful electronegativity in the Pauling sense (they don't form ordinary bonds).",
      },
      {
        t: "exam",
        text: "FRQ justifications have a formula that scores: (1) identify the controlling factor (Z_eff / distance / shielding), (2) compare the two species, (3) connect to Coulomb attraction, (4) state the property consequence. 'Smaller radius' alone never earns the point — say WHY.",
      },
    ],
  },

  /* ================================================================ 1.8 */
  "1.8": {
    id: "1.8",
    unit: 1,
    title: "Formation of Ions",
    objectives: [
      "Predict monatomic ion charges from position in the periodic table",
      "Explain ion formation via noble-gas configurations and ionization energy data",
      "Work with isoelectronic series and transition-metal multi-charges",
    ],
    keyTerms: ["ion", "cation", "anion", "isoelectronic", "ionization-energy", "electron-configuration"],
    relatedSims: ["atom-builder", "ionic-bonding"],
    blocks: [
      {
        t: "p",
        text: "Atoms form [[ion|ions]] to reach the electron configuration of a noble gas — a full valence shell, the deepest energy well available to main-group elements. [[cation|Cations]] come from metals losing electrons (charge = group number for groups 1–2, and 3+ for Al); [[anion|anions]] from nonmetals gaining electrons (charge = group number − 18).",
      },
      {
        t: "table",
        headers: ["Group", "Ion", "Example", "Configuration result"],
        rows: [
          ["1 (alkali)", "+1", "Na → Na⁺", "[Ne] — loses 3s¹"],
          ["2 (alkaline earth)", "+2", "Mg → Mg²⁺", "[Ne] — loses 3s²"],
          ["13", "+3", "Al → Al³⁺", "[Ne] — loses 3s²3p¹"],
          ["15", "−3", "N → N³⁻", "[Ne] — gains 3"],
          ["16", "−2", "O → O²⁻", "[Ne] — gains 2"],
          ["17 (halogens)", "−1", "Cl → Cl⁻", "[Ar] — gains 1"],
        ],
      },
      {
        t: "p",
        text: "The ionization-energy record proves the shell story: sodium's IE₁ = 496 kJ/mol but IE₂ = 4560 — a **nine-fold jump**. The first electron comes off the lone, distant, shielded 3s orbital; the second would have to break into the stable neon core. Elements lose exactly as many electrons as it takes to reach that cliff.",
      },
      {
        t: "example",
        title: "Why does magnesium form Mg²⁺ and not Mg⁺ or Mg³⁺?",
        steps: [
          "Mg = [Ne]3s². IE₁ = 738, IE₂ = 1450 — comparable; both 3s electrons come off.",
          "IE₃ = 7730 kJ/mol — a colossal jump: removing from the [Ne] core.",
          "The lattice energy released by a 2+ ion in compounds (∝ q₊q₋) more than pays for IE₂.",
          "Mg³⁺ would require the impossible-to-repay IE₃.",
        ],
        answer: "Mg²⁺ = [Ne]: two affordable ionizations to reach a noble-gas core; the third is energetically forbidden.",
      },
      {
        t: "callout",
        tone: "info",
        title: "Transition metals play by different rules",
        text: "Fe forms Fe²⁺ ([Ar]3d⁶) and Fe³⁺ ([Ar]3d⁵ — extra-stable half-filled d). They lose 4s electrons first, keep the 3d, and Roman numerals name the charge: iron(II) vs iron(III). Zn is almost always 2+, Ag 1+.",
      },
      {
        t: "sim",
        sim: "atom-builder",
        preset: "na-ion",
        caption: "Strip sodium's electron count from 11 to 10 and watch the configuration collapse to [Ne] — then rebuild it as Cl⁻ and compare.",
      },
      {
        t: "misconception",
        text: "Ions do NOT have the same properties as their atoms. Na (explosive in water) + Cl₂ (toxic gas) → NaCl (table salt). The electron configuration changed, so everything changed.",
      },
      {
        t: "exam",
        text: "MCQs ask you to identify ions from particle counts or IE tables; FRQs use IE jumps as evidence for shell structure ('Explain how the data supports the existence of discrete energy levels').",
      },
    ],
  },
};
