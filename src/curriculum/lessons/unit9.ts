import type { Lesson } from "../lessonTypes";

/**
 * Unit 9 — Applications of Thermodynamics.
 * Full lessons: 9.1, 9.3, 9.7. Concise but complete: the rest.
 */
export const unit9: Record<string, Lesson> = {
  /* ================================================================ 9.1 */
  "9.1": {
    id: "9.1",
    unit: 9,
    title: "Introduction to Entropy",
    objectives: [
      "Define entropy as energy dispersal / microstate count",
      "Predict entropy change signs from phase, moles of gas, temperature, and dissolution",
      "State the second law and its criterion for spontaneity of the universe",
    ],
    keyTerms: ["entropy", "second-law", "states-of-matter", "phase-change", "temperature", "thermodynamic-favorability"],
    relatedSims: ["imf-lab"],
    blocks: [
      {
        t: "p",
        text: "[[entropy|Entropy]] S measures how dispersed energy is among the available arrangements (microstates) of a system. More ways to arrange = higher S = more stable in the statistical sense. Boltzmann's $S = k\\ln W$ makes it literal: W is the count of microstates, and nature drifts toward bigger W simply because bigger W is overwhelmingly more probable.",
      },
      {
        t: "key",
        term: "The second law",
        text: "For any spontaneous process, the entropy of the UNIVERSE increases: $\\Delta S_{univ} = \\Delta S_{sys} + \\Delta S_{surr} > 0$. Spontaneous ≠ fast; spontaneous ≠ exothermic (though exothermicity helps by raising S_surr — dumped heat disperses into the surroundings).",
      },
      {
        t: "table",
        headers: ["Change", "ΔS sign", "Why"],
        rows: [
          ["solid → liquid → gas", "+ (large at vaporization)", "freedom of motion explodes; volume per particle grows ~1000×"],
          ["more gas moles on product side", "+", "gas particles have vastly more microstates"],
          ["heating a substance", "+", "more energetic levels accessible, wider speed distribution"],
          ["dissolving a salt / molecular solid", "+ usually", "ordered crystal disperses (solvent ordering can partly offset)"],
          ["precipitation, condensation, freezing", "−", "particles gather into fewer arrangements"],
          ["2 gas molecules combine into 1", "−", "fewer independent particles"],
        ],
      },
      {
        t: "callout",
        tone: "info",
        title: "The endothermic-spontaneous puzzle, solved",
        text: "Ice melts above 0 °C although it absorbs heat (ΔH > 0, ΔS_sys > 0). The second law still holds because ΔS_sys's gain outweighs ΔS_surr's loss (the surroundings cool slightly). NH₄NO₃ dissolving in cold water is the same arithmetic — [[enthalpy-solution|positive ΔH]] paid back by a big entropy win. Gibbs free energy (9.3) packages this trade into one number.",
      },
      { t: "sim", sim: "imf-lab", preset: "ch4", caption: "Gas-phase chaos: particles spread to fill the box — entropy as 'dispersal' made visible. Compress the idea in reverse and you see why expansion is spontaneous." },
      {
        t: "misconception",
        text: "'Entropy = disorder' is the pop-science gloss; the operational definition is ENERGY DISPERSAL among microstates. A shuffled deck isn't thermodynamic entropy. Also 'spontaneous means happens quickly' — diamond→graphite is spontaneous (ΔG < 0) and takes geologic time ([[activation-energy|Ea]] is kinetics' domain).",
      },
      {
        t: "exam",
        text: "Rank ΔS signs/magnitudes for processes or reactions: count GAS MOLES first (dominant term), then phase changes, then temperature/size effects. Justify with particle freedom/microstate language.",
      },
    ],
  },

  /* ================================================================ 9.2 */
  "9.2": {
    id: "9.2",
    unit: 9,
    title: "Absolute Entropy and Entropy Change",
    objectives: ["Compute ΔS°rxn from tabulated absolute entropies", "Interpret S° trends among substances"],
    keyTerms: ["entropy", "second-law", "states-of-matter", "standard-state"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Unlike [[enthalpy-formation|enthalpy]], entropy has a true zero: the third law sets S = 0 for a perfect crystal at 0 K, so tabulated S° values are ABSOLUTE. Reaction entropy is the familiar products-minus-reactants:",
      },
      { t: "eq", latex: "\\Delta S^\\circ_{rxn} = \\sum n S^\\circ(\\text{products}) - \\sum m S^\\circ(\\text{reactants})", caption: "Units: J/mol·K — note JOULES, while ΔH tables are in kJ. The 1000× mismatch is the #1 ΔG arithmetic error." },
      {
        t: "list",
        items: [
          "S° ordering: solids < liquids < gases; heavier/more complex molecules > lighter/simple ones (more bonds to vibrate = more microstates).",
          "Dissolved ions: S° can be small or even negative-looking relative to water ordering — but ΔS°rxn arithmetic never needs absolute judgments.",
          "ΔS°rxn ≈ strongly positive when gas moles increase (e.g. decomposition of carbonates releasing CO₂).",
        ],
      },
      {
        t: "exam",
        text: "Compute ΔS° from a table, then feed it with ΔH° into ΔG° = ΔH° − TΔS° (9.3). Watch the J vs kJ unit bridge every single time.",
      },
    ],
  },

  /* ================================================================ 9.3 */
  "9.3": {
    id: "9.3",
    unit: 9,
    title: "Gibbs Free Energy and Thermodynamic Favorability",
    objectives: [
      "Compute ΔG from ΔH, ΔS, T and from ΔG°f tables and equilibrium constants",
      "Classify favorability with the four-sign quadrant analysis",
      "Find the temperature where a reaction switches favorability",
    ],
    keyTerms: ["gibbs-free-energy", "thermodynamic-favorability", "entropy", "enthalpy", "temperature", "equilibrium-constant", "exothermic", "endothermic", "second-law"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "[[gibbs-free-energy|Gibbs free energy]] folds the system and surroundings into one system-only number: $\\Delta G = \\Delta H - T\\Delta S$. It's the second law repackaged — ΔG < 0 is exactly ΔS_univ > 0 at constant T and P. AP vocabulary: such reactions are **thermodynamically favorable** (the exam avoids 'spontaneous' as misleading about speed).",
      },
      {
        t: "table",
        headers: ["ΔH", "ΔS", "ΔG = ΔH − TΔS", "Verdict"],
        rows: [
          ["−", "+", "always negative", "favorable at ALL temperatures (combustion-ish)"],
          ["+", "−", "always positive", "UNfavorable at all temperatures (reverse is favorable)"],
          ["−", "−", "negative only when T < ΔH/ΔS", "low-temperature favorable (freezing, condensation)"],
          ["+", "+", "negative only when T > ΔH/ΔS", "high-temperature favorable (melting, decompositions)"],
        ],
        caption: "The crossover temperature T = ΔH/ΔS is where ΔG = 0 — equilibrium between the regimes.",
      },
      {
        t: "list",
        items: [
          "**From formation data**: $\\Delta G^\\circ = \\sum n\\Delta G^\\circ_f(\\text{products}) - \\sum m\\Delta G^\\circ_f(\\text{reactants})$ (elements = 0, same bookkeeping as [[enthalpy-formation|ΔH°f]]).",
          "**From H and S**: ΔG° = ΔH° − TΔS° with standard T = 298 K unless stated.",
          "**From equilibrium**: $\\Delta G^\\circ = -RT\\ln K$ — and at ANY conditions, $\\Delta G = \\Delta G^\\circ + RT\\ln Q$.",
        ],
      },
      {
        t: "example",
        title: "The decomposition switch",
        steps: [
          "CaCO₃(s) → CaO(s) + CO₂(g): ΔH° = +178 kJ, ΔS° = +165 J/K (gas appears — big entropy win).",
          "ΔG° at 298 K: 178 − 298(0.165) = 178 − 49.2 = +128.8 kJ → unfavorable at room temperature (limestone is stable).",
          "Crossover: T = ΔH/ΔS = 178,000/165 = 1079 K ≈ 806 °C.",
          "Above ~1100 K, ΔG < 0 — which is exactly why lime kilns run white-hot to make quicklime.",
        ],
        answer: "Sign quadrant 4 (ΔH+, ΔS+): heat it past ΔH/ΔS and entropy takes over. Units: convert ΔS to kJ/K (0.165) or ΔH to J — never mix.",
      },
      {
        t: "callout",
        tone: "warning",
        title: "ΔG° vs ΔG",
        text: "ΔG° describes STANDARD-STATE conditions and fixes K. ΔG (no circle) describes the ACTUAL mixture and decides which way THIS flask runs: ΔG = ΔG° + RT ln Q. At equilibrium both are consistent: ΔG = 0, Q = K, ΔG° = −RT ln K. A reaction with positive ΔG° still proceeds forward from pure reactants (ln Q = −∞ at Q = 0) — it just stops early (K < 1).",
      },
      {
        t: "misconception",
        text: "'ΔG < 0 means fast.' No — [[kinetic-vs-thermo-control|thermodynamics is the map, kinetics is the vehicle]]. And 'ΔG = 0 means nothing is happening' — it means forward and reverse balance: dynamic [[equilibrium]], Unit 7's story in energy language.",
      },
      {
        t: "exam",
        text: "The Unit 9 FRQ engine: quadrant classification, crossover temperature, ΔG° from tables, ΔG°↔K conversion, and 'justify favorability at temperature X'. Carry units religiously — kJ for ΔG/ΔH, J for ΔS, kelvin always.",
      },
    ],
  },

  /* ================================================================ 9.4 */
  "9.4": {
    id: "9.4",
    unit: 9,
    title: "Thermodynamic and Kinetic Control",
    objectives: ["Distinguish favorable-but-slow from unfavorable-but-fast", "Explain why thermodynamically unstable substances persist"],
    keyTerms: ["kinetic-vs-thermo-control", "gibbs-free-energy", "activation-energy", "catalyst", "thermodynamic-favorability"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Two independent verdicts govern every reaction: [[thermodynamic-favorability|thermodynamic]] (ΔG: does it WANT to happen — where do start and finish sit in energy?) and kinetic ([[activation-energy|Eₐ]]: CAN it happen at a useful rate — how big is the wall between?). Four combinations exist, and the 'favorable but frozen' corner explains the world's persistence.",
      },
      {
        t: "list",
        items: [
          "Diamond at 25 °C: ΔG° = −2.9 kJ/mol toward graphite — favorable, yet effectively permanent (Eₐ astronomic).",
          "Gasoline + O₂: hugely favorable; sits in your tank until a spark provides the activation kick.",
          "A [[catalyst]] changes ONLY the kinetic verdict (lower Eₐ) — never ΔG, never K, never the final equilibrium mixture.",
          "Product distributions can be kinetically OR thermodynamically controlled: low T favors whichever product forms fastest; high T/long time favors the most stable product.",
        ],
      },
      {
        t: "exam",
        text: "'Explain why H₂ and O₂ can be stored together indefinitely yet react explosively with a spark' — ΔG ≪ 0 (favorable) + large Eₐ (slow); the spark (or Pt catalyst) provides the pathway over the barrier.",
      },
    ],
  },

  /* ================================================================ 9.5 */
  "9.5": {
    id: "9.5",
    unit: 9,
    title: "Free Energy and Equilibrium",
    objectives: ["Use ΔG° = −RT ln K quantitatively", "Predict K's temperature dependence from ΔH and ΔS signs"],
    keyTerms: ["gibbs-free-energy", "equilibrium-constant", "temperature", "enthalpy", "entropy", "thermodynamic-favorability"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "$\\Delta G^\\circ = -RT\\ln K$ is the bridge between energy and position: ΔG° < 0 → ln K > 0 → K > 1 (products favored); ΔG° > 0 → K < 1; ΔG° = 0 → K = 1. Magnitudes are exponential — ΔG° = −5.7 kJ/mol at 298 K means K = 10; −11.4 kJ/mol means K = 100. Small energy gaps, enormous composition differences.",
      },
      {
        t: "list",
        items: [
          "Solve for K: $K = e^{-\\Delta G^\\circ / RT}$ with R = 8.314 J/mol·K (JOULES — match ΔG's units).",
          "Temperature dependence: since ΔG° = ΔH° − TΔS°, heating an exothermic reaction (ΔH < 0) shrinks K; heating an endothermic one grows K — the van't Hoff statement of [[le-chatelier]]'s temperature rule.",
          "At equilibrium ΔG = 0 while ΔG° generally isn't — ΔG° is the STANDARD-state gap, K is where the system parks.",
        ],
      },
      {
        t: "exam",
        text: "Two-way conversions (ΔG° ↔ K) with unit care, plus 'is K bigger at higher T?' answered from ΔH's sign. Often chained: ΔH°f/ΔS° tables → ΔG° → K.",
      },
    ],
  },

  /* ================================================================ 9.6 */
  "9.6": {
    id: "9.6",
    unit: 9,
    title: "Coupled Reactions",
    objectives: ["Explain how a favorable reaction drives an unfavorable one", "Add ΔG values for coupled processes"],
    keyTerms: ["coupled-reactions", "gibbs-free-energy", "thermodynamic-favorability", "hess-law"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Because ΔG is a state function, coupled reactions ADD like [[hess-law|Hess's law]] equations: an unfavorable process (ΔG₁ > 0) proceeds if paired with a sufficiently favorable one (ΔG₂ < 0, |ΔG₂| > ΔG₁) sharing an intermediate. Smelting: Cu₂S decomposition is unfavorable (ΔG = +86 kJ), but coupling with S + O₂ → SO₂ (ΔG = −300 kJ) drives copper extraction (net −214 kJ).",
      },
      {
        t: "list",
        items: [
          "Biology's universal currency: ATP hydrolysis (ΔG ≈ −30.5 kJ/mol) couples to muscle contraction, ion pumping, and biosynthesis.",
          "The coupling must be MECHANISTIC (a shared step/intermediate), not just two reactions in the same room.",
          "Coupling changes the NET favorability; it never makes the unfavorable half favorable by itself.",
        ],
      },
      {
        t: "exam",
        text: "Given ΔGs for two reactions plus their shared species, compute the net ΔG and conclude whether the overall coupled process is favorable. Industrial metallurgy and ATP are the standard costumes.",
      },
    ],
  },

  /* ================================================================ 9.7 */
  "9.7": {
    id: "9.7",
    unit: 9,
    title: "Galvanic (Voltaic) Cells",
    objectives: [
      "Build a galvanic cell from half-reactions: identify anode, cathode, electron and ion flow",
      "Compute E°cell from standard reduction potentials",
      "Write cell notation and explain the salt bridge's job",
    ],
    keyTerms: ["galvanic-cell", "cell-potential", "redox", "oxidation-number", "salt-bridge", "electrolytic-cell", "gibbs-free-energy"],
    relatedSims: ["reaction-viewer", "ionic-bonding"],
    blocks: [
      {
        t: "p",
        text: "A [[galvanic-cell|galvanic cell]] splits a spontaneous [[redox]] reaction into two half-cells so its electrons must travel through a wire — chemical energy becomes electrical. Oxidation happens at the **anode** (electrons leave there), reduction at the **cathode**; mnemonic AN OX, RED CAT. Conventional current flows cathode→anode outside; ELECTRONS flow anode→cathode.",
      },
      { t: "eq", latex: "E^\\circ_{cell} = E^\\circ_{cathode} - E^\\circ_{anode}\\ (\\text{both as reduction potentials})", caption: "Spontaneous cell → E°cell > 0. Flip a half-reaction? Don't — the subtraction already handles direction." },
      {
        t: "example",
        title: "Zn/Cu Daniell cell, completely",
        steps: [
          "Table: Cu²⁺ + 2e⁻ → Cu, E° = +0.34 V; Zn²⁺ + 2e⁻ → Zn, E° = −0.76 V.",
          "Higher reduction potential wins reduction: Cu²⁺ reduces at the CATHODE; Zn oxidizes at the ANODE.",
          "E°cell = 0.34 − (−0.76) = 1.10 V.",
          "Half-reactions: anode Zn → Zn²⁺ + 2e⁻; cathode Cu²⁺ + 2e⁻ → Cu; net Zn + Cu²⁺ → Zn²⁺ + Cu.",
          "Mass changes: Zn electrode LOSES mass (dissolves); Cu electrode GAINS mass (plates).",
          "Cell notation: Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s) — anode first, single bars = phase boundaries, double bar = [[salt-bridge]].",
        ],
        answer: "1.10 V, electrons flowing Zn → Cu through the wire. This is Topic 4.9's displacement reaction wearing a harness.",
      },
      {
        t: "key",
        term: "Why the salt bridge is non-negotiable",
        text: "Without ion flow, the anode compartment accumulates positive charge (Zn²⁺ piling up) and the cathode goes negative (SO₄²⁻ left behind) — the charge buildup stops electron flow in seconds. The [[salt-bridge]] completes the circuit: anions migrate to the anode, cations to the cathode, keeping both compartments neutral.",
      },
      {
        t: "callout",
        tone: "info",
        title: "Potentials are intensive",
        text: "Doubling a half-reaction's coefficients (to balance electrons) does NOT double its E° — voltage is energy PER electron, independent of amount. Balance electrons by multiplying, but keep E° values as tabulated.",
      },
      {
        t: "misconception",
        text: "'The anode is always negative.' In a GALVANIC cell yes (it's the electron source), but in an [[electrolytic-cell|electrolytic]] cell the anode is POSITIVE (the battery pushes electrons out of it). What never changes: anode = oxidation. Also 'E°cell needs a flipped sign' — using cathode-minus-anode on reduction potentials handles it automatically.",
      },
      {
        t: "exam",
        text: "Cell FRQs: identify electrodes and their signs, write both half-reactions and the net ionic, compute E°cell, trace electron and ion paths, predict electrode mass changes, and write cell notation. Connect to ΔG° = −nFE° (9.8) when asked about favorability.",
      },
    ],
  },

  /* ================================================================ 9.8 */
  "9.8": {
    id: "9.8",
    unit: 9,
    title: "Cell Potential and Free Energy",
    objectives: ["Use ΔG° = −nFE° to link voltage and favorability", "Connect E°cell to K"],
    keyTerms: ["cell-potential", "gibbs-free-energy", "galvanic-cell", "redox", "equilibrium-constant", "faraday-electrolysis"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Voltage is free energy per unit charge: $\\Delta G^\\circ = -nFE^\\circ$, with n = moles of electrons in the balanced redox equation and F = 96,485 C/mol ([[faraday-electrolysis|Faraday's constant]]). A positive E° gives negative ΔG° — the cell is thermodynamically favorable. Chained with 9.5: $E^\\circ = \\frac{RT}{nF}\\ln K$, so at 298 K, $\\log K = \\frac{nE^\\circ}{0.0592}$.",
      },
      {
        t: "example",
        title: "From voltage to K",
        steps: [
          "Zn/Cu cell: E° = 1.10 V, n = 2 electrons.",
          "ΔG° = −(2)(96485)(1.10) = −2.12 × 10⁵ J = −212 kJ.",
          "log K = nE°/0.0592 = (2)(1.10)/0.0592 = 37.2 → K ≈ 10³⁷.",
        ],
        answer: "That's why the reaction 'goes to completion' — K of 10³⁷ leaves essentially no Cu²⁺ unreacted. Small voltages hide exponential composition gaps.",
      },
      {
        t: "callout",
        tone: "info",
        title: "Dead battery = equilibrium",
        text: "As a cell runs, Q climbs, E falls (Nernst: $E = E^\\circ - \\frac{RT}{nF}\\ln Q$), until E = 0 and Q = K: the battery is at equilibrium — dead. ΔG = 0, no more useful work.",
      },
      {
        t: "exam",
        text: "Convert among E°, ΔG°, and K in either direction; n must come from the BALANCED equation (the electrons cancelled). Units: J when using F in C/mol with V.",
      },
    ],
  },

  /* ================================================================ 9.9 */
  "9.9": {
    id: "9.9",
    unit: 9,
    title: "Electrolytic Cells",
    objectives: ["Contrast electrolytic with galvanic cells", "Perform Faraday's-law stoichiometry", "Predict electrolysis products"],
    keyTerms: ["electrolytic-cell", "faraday-electrolysis", "galvanic-cell", "cell-potential", "redox", "stoichiometry"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "An [[electrolytic-cell|electrolytic cell]] runs a NON-spontaneous reaction backward using external power: E°cell < 0, ΔG° > 0 — the battery does the pushing. Electrode identities by process stay fixed (anode = oxidation, cathode = reduction), but signs flip vs galvanic: the anode is POSITIVE (wired to the supply's +), the cathode NEGATIVE.",
      },
      {
        t: "table",
        headers: ["", "Galvanic", "Electrolytic"],
        rows: [
          ["ΔG°, E°cell", "−, +", "+, −"],
          ["Energy conversion", "chemical → electrical", "electrical → chemical"],
          ["Anode sign", "negative (electron source)", "positive (electrons pulled away)"],
          ["Examples", "batteries, Daniell cell", "electroplating, molten NaCl electrolysis, water splitting"],
        ],
      },
      { t: "eq", latex: "mol\\ e^- = \\frac{I \\cdot t}{F} \\qquad (I\\ \\text{in A} = C/s,\\ F = 96{,}485\\ C/mol)", caption: "Faraday's law: current × time buys moles of electrons; the half-reaction converts e⁻ to product." },
      {
        t: "example",
        title: "Electroplating calculation",
        steps: [
          "How much copper plates from Cu²⁺ solution with 2.50 A for 45.0 minutes?",
          "Charge: Q = 2.50 C/s × 2700 s = 6750 C.",
          "Moles e⁻ = 6750 / 96485 = 0.0700 mol.",
          "Cu²⁺ + 2e⁻ → Cu: moles Cu = 0.0350 → mass = 0.0350 × 63.55 = 2.22 g.",
        ],
        answer: "2.22 g Cu. The route is always: A·s → C → mol e⁻ → (half-reaction ratio) → mol product → grams.",
      },
      {
        t: "callout",
        tone: "info",
        title: "Which species reacts?",
        text: "In molten NaCl: Na⁺ reduces at the cathode, Cl⁻ oxidizes at the anode (no competition). In aqueous NaCl, WATER competes — at the cathode H₂O reduces to H₂ + OH⁻ instead of Na plating (water's reduction potential is less negative); the anode still gives Cl₂ (overpotential keeps O₂ away). Aqueous electrolysis predictions must consult the reduction-potential table, not just the salt's ions.",
      },
      {
        t: "exam",
        text: "Faraday stoichiometry (current × time → mass) and galvanic-vs-electrolytic comparison tables are the recurring forms; molten vs aqueous product prediction tests whether you remember water's participation.",
      },
    ],
  },
};
