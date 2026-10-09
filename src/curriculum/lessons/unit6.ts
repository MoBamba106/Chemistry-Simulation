import type { Lesson } from "../lessonTypes";

/**
 * Unit 6 — Thermodynamics.
 * Full lessons: 6.1, 6.4, 6.6. Concise but complete: the rest.
 */
export const unit6: Record<string, Lesson> = {
  /* ================================================================ 6.1 */
  "6.1": {
    id: "6.1",
    unit: 6,
    title: "Endothermic and Exothermic Processes",
    objectives: [
      "Define system and surroundings and apply the sign convention for heat flow",
      "Connect bond breaking/forming to ΔH sign",
      "Read energy flow at the particle level",
    ],
    keyTerms: ["endothermic", "exothermic", "system-surroundings", "enthalpy", "bond-energy", "first-law", "temperature"],
    relatedSims: ["reaction-viewer"],
    blocks: [
      {
        t: "p",
        text: "Thermochemistry starts by drawing a circle: everything inside is the [[system-surroundings|system]] (the reaction, the dissolving salt); everything outside is the surroundings (the water, the beaker, the air, the universe-minus-system). Energy crossing that boundary as heat is $q$. The sign convention is written from the SYSTEM's point of view:",
      },
      {
        t: "table",
        headers: ["", "System gains heat", "System loses heat"],
        rows: [
          ["Name", "[[endothermic]]", "[[exothermic]]"],
          ["Sign of q / ΔH", "positive (+)", "negative (−)"],
          ["Surroundings feel", "colder (heat flows in)", "hotter (heat flows out)"],
          ["Bond story", "breaking > forming", "forming > breaking"],
          ["Classic examples", "melting ice, NH₄NO₃ dissolving, photosynthesis", "combustion, neutralization, condensation"],
        ],
      },
      {
        t: "key",
        term: "The bond-energy bookkeeping",
        text: "Breaking bonds COSTS energy (+); forming bonds PAYS energy (−). ΔH = Σ(bond energies broken) − Σ(bond energies formed). Combustion of methane: breaking C–H's and O=O costs less than the C=O and O–H bonds formed repay — the excess floods out as heat, ΔH = −890 kJ/mol.",
      },
      {
        t: "callout",
        tone: "info",
        title: "The first law",
        text: "[[first-law|Energy is conserved]]: whatever the system gains, the surroundings lose, and vice versa. $q_{system} = -q_{surroundings}$. An endothermic process isn't 'creating cold' — it's pumping heat in from somewhere you can measure.",
      },
      { t: "sim", sim: "reaction-viewer", preset: "co-burn", caption: "Carbon monoxide combustion in the viewer — a strongly exothermic rearrangement: the C=O bonds formed in CO₂ repay far more than the bonds broken demanded." },
      {
        t: "misconception",
        text: "'Exothermic means the products have more energy.' The opposite — products sit LOWER on the energy landscape; the difference left as heat. Also 'endothermic reactions feel cold because they destroy heat' — they feel cold because your hand IS the surroundings donating energy.",
      },
      {
        t: "exam",
        text: "Sign-convention MCQs and particle-level FRQs ('the flask gets warm when X dissolves — classify and explain in terms of bond/interaction energies vs released energy'). Always state the direction of heat flow relative to the system.",
      },
    ],
  },

  /* ================================================================ 6.2 */
  "6.2": {
    id: "6.2",
    unit: 6,
    title: "Energy Diagrams",
    objectives: ["Interpret potential-energy diagrams of physical and chemical processes", "Locate ΔH, Ea, and states on the curve"],
    keyTerms: ["energy-profile", "enthalpy", "activation-energy", "potential-energy-curve", "phase-change"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Energy diagrams map potential energy against the progress of a process — chemical ([[energy-profile|reaction profiles]]: peaks = [[transition-state|transition states]], ΔH = endpoints) or physical ([[phase-change]] landscapes: plateaus where energy goes into rearranging particles at constant temperature). Unit 1's [[potential-energy-curve|PE curves]] for bonded atoms are the microscopic version: the well depth IS the bond energy.",
      },
      {
        t: "list",
        items: [
          "Reactants/products at local plateaus; difference = ΔH.",
          "Barrier height from reactants = [[activation-energy|Eₐ]] — kinetics, not thermochemistry.",
          "Heating curves: sloped segments raise [[temperature|KE]]; flat segments change PE (phase).",
        ],
      },
      {
        t: "exam",
        text: "Diagram interpretation questions overlap heavily with 5.6 — distinguish 'energy released (ΔH)' from 'energy needed to start (Eₐ)' at a glance.",
      },
    ],
  },

  /* ================================================================ 6.3 */
  "6.3": {
    id: "6.3",
    unit: 6,
    title: "Heat Transfer and Thermal Equilibrium",
    objectives: ["Apply conservation of energy to hot + cold mixing problems", "Explain equilibrium temperature in terms of energy flow"],
    keyTerms: ["heat-capacity", "temperature", "first-law", "system-surroundings", "kinetic-molecular-theory"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Put hot metal in cool water: energy flows hot → cold until both reach one [[temperature]] — [[thermal equilibrium]]. No energy vanishes ([[first-law]]): the heat the metal loses, the water gains. That single sentence is the whole problem type:",
      },
      { t: "eq", latex: "q_{lost} + q_{gained} = 0 \\quad\\Rightarrow\\quad m_{hot}c_{hot}(T_f - T_{hot}) = -\\,m_{cold}c_{cold}(T_f - T_{cold})", caption: "With [[heat-capacity|specific heats]] c for each substance; solve for T_f." },
      {
        t: "example",
        title: "Final temperature of a quench",
        steps: [
          "150 g iron at 95 °C (c = 0.449 J/g·°C) dropped into 200 g water at 22 °C (c = 4.184 J/g·°C).",
          "Heat lost = heat gained: 150(0.449)(95 − T) = 200(4.184)(T − 22).",
          "67.35(95 − T) = 836.8(T − 22) → 6398 − 67.35T = 836.8T − 18410.",
          "24808 = 904.15T → T = 27.4 °C.",
        ],
        answer: "27.4 °C — barely above the water's start, because water's heat capacity dwarfs iron's (it takes ~9× more energy per gram per degree).",
      },
      {
        t: "callout",
        tone: "info",
        title: "Particle-level story",
        text: "Fast-moving hot particles collide with slow cool ones, transferring KE at every impact ([[kinetic-molecular-theory]]). Net flow continues while average KEs differ; equilibrium = equal average KE = equal temperature.",
      },
      {
        t: "exam",
        text: "These problems reappear inside [[calorimetry]] (6.4): the reaction IS the 'hot metal', the solution is the water. Same conservation sentence.",
      },
    ],
  },

  /* ================================================================ 6.4 */
  "6.4": {
    id: "6.4",
    unit: 6,
    title: "Heat Capacity and Calorimetry",
    objectives: [
      "Use q = mcΔT and distinguish specific heat capacity from molar heat capacity",
      "Design and compute coffee-cup calorimetry results, including ΔH per mole",
    ],
    keyTerms: ["heat-capacity", "calorimetry", "enthalpy", "first-law", "system-surroundings", "temperature"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "[[heat-capacity|Specific heat capacity]] c is the energy needed to warm 1 g of a substance by 1 °C (or 1 K — the intervals are identical). Water's c = 4.184 J/g·°C is remarkably high, which is why oceans moderate climate and why calorimetry uses water as the energy accountant.",
      },
      { t: "eq", latex: "q = mc\\Delta T", caption: "m = mass (g), c = specific heat (J/g·°C), ΔT = T_final − T_initial. Sign of q follows the substance being described." },
      {
        t: "key",
        term: "Coffee-cup calorimetry logic",
        text: "An insulated cup makes the SOLUTION the surroundings: the reaction (system) dumps or draws heat, and we read it off the solution's temperature change. $q_{rxn} = -q_{soln} = -(m_{soln} \\cdot c \\cdot \\Delta T)$. Assumptions the exam wants you to state: no heat escapes to the cup/air, and the solution's specific heat ≈ water's (4.184 J/g·°C) with density ≈ 1.00 g/mL.",
      },
      {
        t: "example",
        title: "ΔH of neutralization, start to finish",
        steps: [
          "50.0 mL of 1.00 M HCl + 50.0 mL of 1.00 M NaOH, both at 22.0 °C, mix in a coffee cup; T rises to 28.9 °C.",
          "Solution mass = 100.0 g; ΔT = +6.9 °C.",
          "q_soln = (100.0)(4.184)(6.9) = 2887 J absorbed by the solution.",
          "q_rxn = −2887 J (reaction released it).",
          "Moles reacted: 0.0500 mol H⁺ × 1:1 = 0.0500 mol water formed.",
          "ΔH per mole = −2887 J / 0.0500 mol = −57,700 J/mol ≈ −58 kJ/mol.",
        ],
        answer: "ΔH ≈ −58 kJ/mol — exothermic neutralization. The per-mole division is the step students forget; ΔH is an INTENSIVE molar quantity.",
      },
      {
        t: "callout",
        tone: "warning",
        title: "Sign discipline",
        text: "Temperature RISE → q_soln positive → q_rxn NEGATIVE → exothermic. Temperature FALL → q_rxn positive → endothermic. Write the −q_soln step explicitly; it's where most sign errors live.",
      },
      {
        t: "misconception",
        text: "'Heat and temperature are the same.' Temperature measures average KE; heat is energy IN TRANSIT, and how much a substance's temperature moves per joule depends on its mass and c. 100 g of water at 50 °C holds far more thermal energy than 10 g at 90 °C.",
      },
      {
        t: "exam",
        text: "Calorimetry is a lab-based FRQ staple: compute q, convert to ΔH/mol, then critique the setup ('heat absorbed by the calorimeter was neglected → is the reported |ΔH| too high or too low?'). Unaccounted losses make |ΔH| too SMALL (solution captured less energy than released).",
      },
    ],
  },

  /* ================================================================ 6.5 */
  "6.5": {
    id: "6.5",
    unit: 6,
    title: "Energy of Chemical Reactions",
    objectives: ["Estimate ΔH from bond energies", "Explain reaction enthalpy as breaking-vs-forming arithmetic"],
    keyTerms: ["bond-energy", "enthalpy", "energy-profile", "exothermic", "endothermic"],
    relatedSims: ["reaction-viewer"],
    blocks: [
      {
        t: "p",
        text: "Every reaction first tears bonds apart (energy in) and then builds new ones (energy out). The net is the [[enthalpy]] of reaction from average [[bond-energy|bond energies]]:",
      },
      { t: "eq", latex: "\\Delta H_{rxn} = \\sum (\\text{bond energies broken}) - \\sum (\\text{bond energies formed})", caption: "Broken − formed. Memorize the order: you PAY to break, you EARN by forming." },
      {
        t: "example",
        title: "H₂ + Cl₂ → 2HCl",
        steps: [
          "Break: H–H (436 kJ/mol) + Cl–Cl (243 kJ/mol) = 679 kJ.",
          "Form: 2 × H–Cl (431 kJ/mol) = 862 kJ.",
          "ΔH = 679 − 862 = −183 kJ.",
        ],
        answer: "−183 kJ per reaction as written — exothermic; the new bonds are stronger than the old.",
      },
      {
        t: "callout",
        tone: "info",
        title: "Why these are estimates",
        text: "Tabulated bond energies are AVERAGES across many molecules — a C–H in methane isn't exactly a C–H in ethanol. Bond-energy ΔH values are good to ~±10%; formation-enthalpy tables (6.6) are exact for standard states. Also count bonds carefully using Lewis structures — the C in CO₂ forms TWO C=O bonds (2 × 799 kJ/mol).",
      },
      {
        t: "exam",
        text: "FRQs provide the bond-energy table and a balanced equation; draw/use the Lewis structure to count every bond, then broken − formed. Double/triple bonds have their own entries — don't double-count.",
      },
    ],
  },

  /* ================================================================ 6.6 */
  "6.6": {
    id: "6.6",
    unit: 6,
    title: "Enthalpy of Formation",
    objectives: [
      "Use ΔH°f tables: ΔH°rxn = ΣnΔH°f(products) − ΣmΔH°f(reactants)",
      "Apply Hess's law to combine reaction enthalpies",
      "Know what a formation reaction is (and that elements have ΔH°f = 0)",
    ],
    keyTerms: ["enthalpy-formation", "hess-law", "enthalpy", "standard-state", "exothermic", "endothermic"],
    relatedSims: ["reaction-viewer"],
    blocks: [
      {
        t: "p",
        text: "The [[enthalpy-formation|standard enthalpy of formation]] ΔH°f is the enthalpy change when ONE mole of a compound forms from its elements in their [[standard-state|standard states]] (25 °C, 1 atm, most stable form). By definition, elements in standard states have ΔH°f = 0 — O₂(g), not O(g); graphite, not diamond; Br₂(l), not Br₂(g).",
      },
      { t: "eq", latex: "\\Delta H^\\circ_{rxn} = \\sum n\\,\\Delta H^\\circ_f(\\text{products}) - \\sum m\\,\\Delta H^\\circ_f(\\text{reactants})", caption: "Products − reactants, each weighted by its coefficient. The workhorse of Unit 6." },
      {
        t: "key",
        term: "Formation reaction checklist",
        text: "Exactly 1 mole of product; reactants are ELEMENTS in standard states; coefficients may be fractions (½O₂ is fine). C + O₂ → CO₂ ✓. CO + ½O₂ → CO₂ ✗ (CO isn't an element). 2H₂ + O₂ → 2H₂O ✗ (makes 2 moles — halve it).",
      },
      {
        t: "example",
        title: "Combustion of propane from ΔH°f",
        steps: [
          "C₃H₈(g) + 5O₂(g) → 3CO₂(g) + 4H₂O(l).",
          "ΔH°f values: C₃H₈ −104, CO₂ −393.5, H₂O(l) −285.8, O₂ 0 (kJ/mol).",
          "Products: 3(−393.5) + 4(−285.8) = −1180.5 − 1143.2 = −2323.7 kJ.",
          "Reactants: −104 + 0 = −104 kJ.",
          "ΔH°rxn = −2323.7 − (−104) = −2219.7 ≈ −2220 kJ.",
        ],
        answer: "−2220 kJ per mole of propane — that's the heat in a camping fuel canister. Note the trap: subtracting a negative reactant term ADDS it.",
      },
      {
        t: "callout",
        tone: "violet",
        title: "Hess's law: enthalpy is a state function",
        text: "ΔH depends only on start and end, not the path ([[hess-law]]). So you may flip reactions (negate ΔH), multiply them (scale ΔH), and add them (sum ΔHs) to reach any target equation. ΔH°f tables are Hess's law pre-packaged: formation from elements, then rearrangement to products.",
      },
      {
        t: "example",
        title: "Hess's law manipulation",
        steps: [
          "Target: C(s) + ½O₂(g) → CO(g). Given: (1) C + O₂ → CO₂, ΔH = −393.5; (2) CO + ½O₂ → CO₂, ΔH = −283.0.",
          "Keep (1) as is; REVERSE (2): CO₂ → CO + ½O₂, ΔH = +283.0.",
          "Add: C + O₂ + CO₂ → CO₂ + CO + ½O₂; cancel CO₂ and ½O₂ from both sides.",
        ],
        answer: "C + ½O₂ → CO, ΔH = −393.5 + 283.0 = −110.5 kJ. Flip → negate; add → sum.",
      },
      {
        t: "misconception",
        text: "'ΔH°f of O₂ is −249 kJ because O–O bonds hold energy.' ΔH°f of ELEMENTS in standard state is always zero — bond energies are a different accounting system (6.5). Mixing the two tables is a classic exam error.",
      },
      {
        t: "exam",
        text: "Long FRQs: compute ΔH°rxn from ΔH°f (watch H₂O(l) vs H₂O(g): −285.8 vs −241.8 — the 44 kJ gap is vaporization), then often chain into ΔG° = ΔH° − TΔS° (Unit 9) or calorimetry cross-checks.",
      },
    ],
  },

  /* ================================================================ 6.7 */
  "6.7": {
    id: "6.7",
    unit: 6,
    title: "Bond Energies",
    objectives: ["Use average bond-energy tables quantitatively", "Compare bond strength from length and order"],
    keyTerms: ["bond-energy", "bond-length", "sigma-bond", "pi-bond", "enthalpy"],
    relatedSims: ["molecule-builder"],
    blocks: [
      {
        t: "p",
        text: "[[bond-energy|Bond energy]] is the energy required to break one mole of bonds in the gas phase. Stronger bonds are shorter and harder to break: C≡C (839 kJ/mol, 120 pm) > C=C (614, 134 pm) > C–C (347, 154 pm). Multiple bonds stack [[sigma-bond|σ]] and [[pi-bond|π]] components — but π bonds are individually weaker and more reactive, which is why alkenes add across the double bond.",
      },
      {
        t: "list",
        items: [
          "Tables give AVERAGES over many compounds — results are estimates (±10%).",
          "Gas phase only: bond energies ignore IMF effects of liquids/solids.",
          "Apply exactly as in 6.5: ΔH = broken − formed, counting bonds via Lewis structures.",
        ],
      },
      { t: "sim", sim: "molecule-builder", preset: "c2h4", caption: "Build ethene and inspect its C=C bond — the viewer's metrics tie bond order to length and strength the tables summarize." },
      {
        t: "exam",
        text: "'Which bond is longest/strongest?' ranks by order, then by atom size. Quantitative items route through broken − formed arithmetic.",
      },
    ],
  },

  /* ================================================================ 6.8 */
  "6.8": {
    id: "6.8",
    unit: 6,
    title: "Enthalpy of Solution",
    objectives: ["Decompose ΔH_soln into lattice, separation, and hydration terms", "Explain endothermic dissolving and its limits"],
    keyTerms: ["enthalpy-solution", "solvation", "lattice-energy", "ion-dipole", "entropy", "solubility"],
    relatedSims: ["imf-lab", "ionic-bonding"],
    blocks: [
      {
        t: "p",
        text: "[[enthalpy-solution|Dissolving a salt]] runs three energy steps: (1) shatter the crystal — pay the [[lattice-energy|lattice energy]] (+); (2) make space in the solvent — weaken water–water attractions (+); (3) hydrate the ions — [[ion-dipole]] attractions pay out (−, [[solvation|hydration enthalpy]]). $\\Delta H_{soln} = \\Delta H_{lattice} + \\Delta H_{hydration}$ (with lattice entered as positive work against the crystal).",
      },
      {
        t: "list",
        items: [
          "Hydration wins → ΔH_soln < 0 → dissolving warms the flask (NaOH, CaCl₂ — hot packs).",
          "Lattice wins → ΔH_soln > 0 → dissolving chills (NH₄NO₃ — cold packs); it still dissolves because [[entropy]] gain drives it (Unit 9).",
          "Lattice energy huge (small, highly charged ions like Al₂O₃, MgO) → hydration can't keep up → insoluble.",
        ],
      },
      {
        t: "exam",
        text: "'Explain why NH₄NO₃ dissolves endothermically' — name the competing terms, conclude entropy/ΔG decides. Cold-pack and hot-pack contexts are favorites.",
      },
    ],
  },
};
