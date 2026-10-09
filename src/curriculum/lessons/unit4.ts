import type { Lesson } from "../lessonTypes";

/**
 * Unit 4 — Chemical Reactions.
 * Full lessons: 4.2, 4.5, 4.7, 4.9. Concise but complete: the rest.
 */
export const unit4: Record<string, Lesson> = {
  /* ================================================================ 4.1 */
  "4.1": {
    id: "4.1",
    unit: 4,
    title: "Introduction to Reactions",
    objectives: ["Distinguish physical from chemical change", "Read and write reaction notation: states, coefficients, reaction types"],
    keyTerms: ["chemical-reaction", "physical-vs-chemical", "matter-classification"],
    relatedSims: ["reaction-viewer"],
    blocks: [
      {
        t: "p",
        text: "A [[chemical-reaction|chemical reaction]] rearranges atoms into new substances — bonds break and form. [[physical-vs-chemical|Physical changes]] rearrange matter without changing identity (melting, dissolving, crushing). The evidence test: new substance formed (color, gas, precipitate, temperature change, light) = chemical.",
      },
      {
        t: "list",
        items: [
          "State symbols matter: (s), (l), (g), (aq) — (aq) means dissolved in water, ions free to move.",
          "Coefficients = mole ratios; subscripts = identity (never change subscripts to balance).",
          "[[balancing-equations|Balancing]] enforces conservation of mass and charge on both sides.",
        ],
      },
      {
        t: "exam",
        text: "MCQs give observations (bubbles when two clear solutions mix) and ask you to classify the change and identify evidence of reaction.",
      },
    ],
  },

  /* ================================================================ 4.2 */
  "4.2": {
    id: "4.2",
    unit: 4,
    title: "Net Ionic Equations",
    objectives: [
      "Write molecular, complete ionic, and net ionic equations for reactions in solution",
      "Identify spectator ions and justify their removal",
      "Apply solubility rules to predict precipitates",
    ],
    keyTerms: ["net-ionic-equation", "precipitation", "solubility-rules", "electrolyte", "solution", "acid", "base", "neutralization", "redox"],
    relatedSims: ["reaction-viewer", "imf-lab"],
    blocks: [
      {
        t: "p",
        text: "When solutions react, many ions just hang around unchanged — [[net-ionic-equation|spectator ions]]. The net ionic equation strips them out and shows only the particles that actually transform. Three layers for every aqueous reaction:",
      },
      {
        t: "example",
        title: "Silver nitrate + sodium chloride",
        steps: [
          "**Molecular**: AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq).",
          "**Complete ionic** (split ALL strong electrolytes into ions): Ag⁺ + NO₃⁻ + Na⁺ + Cl⁻ → AgCl(s) + Na⁺ + NO₃⁻.",
          "Cancel spectators (Na⁺, NO₃⁻ appear identically on both sides).",
          "**Net ionic**: $Ag^+(aq) + Cl^-(aq) \\rightarrow AgCl(s)$.",
        ],
        answer: "The real chemistry: silver ions and chloride ions forming an insoluble lattice. Note AgCl(s) stays together — solids do NOT split into ions.",
      },
      {
        t: "key",
        term: "What splits into ions",
        text: "Split: strong acids (HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄), strong bases (Group 1 hydroxides, Ca/Ba/Sr(OH)₂), all soluble salts. Never split: solids (s), liquids (l — including H₂O), gases (g), weak acids and weak bases (CH₃COOH, NH₃ stay molecular).",
      },
      {
        t: "table",
        headers: ["[[solubility-rules|Solubility rule]]", "Soluble", "Watch for exceptions"],
        rows: [
          ["Group 1 ions + NH₄⁺", "always", "—"],
          ["NO₃⁻, ClO₄⁻, CH₃COO⁻", "always", "—"],
          ["Cl⁻, Br⁻, I⁻", "usually", "Ag⁺, Pb²⁺, Hg₂²⁺"],
          ["SO₄²⁻", "usually", "Ba²⁺, Sr²⁺, Pb²⁺, Ca²⁺ (slightly)"],
          ["OH⁻, S²⁻, CO₃²⁻, PO₄³⁻", "usually INSOLUBLE", "with Group 1 / NH₄⁺ they dissolve"],
        ],
      },
      {
        t: "callout",
        tone: "violet",
        title: "The three net-ionic archetypes",
        text: "(1) **[[precipitation]]**: insoluble product forms — Ag⁺ + Br⁻ → AgBr(s). (2) **[[neutralization|Acid–base]]**: H⁺ + OH⁻ → H₂O(l); with weak acid involved: CH₃COOH + OH⁻ → CH₃COO⁻ + H₂O (weak acid stays molecular!). (3) **[[redox]]**: electrons transfer — Zn + Cu²⁺ → Zn²⁺ + Cu. If you can't classify a reaction as one of these, re-check your splits.",
      },
      { t: "sim", sim: "reaction-viewer", preset: "hcl", caption: "HCl + NaOH: the viewer's particle accounting mirrors what the net ionic equation does by hand — track which species actually change." },
      {
        t: "misconception",
        text: "'All dissolved things split into ions.' Weak electrolytes don't — writing CH₃COOH(aq) as H⁺ + CH₃COO⁻ in a complete ionic equation is the single most common AP net-ionic error. Also: diatomic gases (Cl₂, O₂) never split — they're molecules, not ions.",
      },
      {
        t: "exam",
        text: "FRQ form: 'Write the balanced net ionic equation…' Points require (1) correct species AND states, (2) balanced mass and charge. Spectator ions present = no credit. Charge-balance check: Ag⁺ + Cl⁻ → AgCl(s) has net charge 0 on both sides — always verify.",
      },
    ],
  },

  /* ================================================================ 4.3 */
  "4.3": {
    id: "4.3",
    unit: 4,
    title: "Representations of Reactions",
    objectives: ["Translate between particulate diagrams, balanced equations, and data graphs", "Use diagrams to judge stoichiometry and identify limiting reactants"],
    keyTerms: ["chemical-reaction", "balancing-equations", "stoichiometry", "limiting-reactant"],
    relatedSims: ["reaction-viewer"],
    blocks: [
      {
        t: "p",
        text: "The same reaction can be drawn as a symbolic equation, a particulate beaker diagram, or a mass/concentration-vs-time graph — and the exam flips freely between them. In a good particulate diagram, particle counts honor the coefficients: for $2H_2 + O_2 \\rightarrow 2H_2O$, a box with 8 H₂ and 4 O₂ should yield 8 H₂O with 0 H₂ left (O₂ is excess — H₂ was the [[limiting-reactant|limiting reactant]]).",
      },
      {
        t: "list",
        items: [
          "Count atoms before and after — conservation of mass is the diagram's built-in check.",
          "Graphs: reactant curves fall, product curves rise, plateau at completion; slopes give [[reaction-rate|rate]].",
          "Mass data: total mass constant in a closed system; mass loss = gas escaped.",
        ],
      },
      {
        t: "exam",
        text: "'Which diagram represents the mixture after complete reaction?' — count particles against coefficients and identify leftovers.",
      },
    ],
  },

  /* ================================================================ 4.4 */
  "4.4": {
    id: "4.4",
    unit: 4,
    title: "Physical and Chemical Changes",
    objectives: ["Classify changes with evidence at the particle level", "Explain energy signatures of each change type"],
    keyTerms: ["physical-vs-chemical", "chemical-reaction", "phase-change", "matter-classification"],
    relatedSims: ["imf-lab"],
    blocks: [
      {
        t: "p",
        text: "The particle-level distinction: [[physical-vs-chemical|physical change]] = particles keep their identity, only arrangement/spacing/motion changes (ice → water: H₂O molecules intact, [[phase-change|hydrogen bonds]] rearranged). [[chemical-reaction|Chemical change]] = bonds within particles break, atoms re-partner into NEW substances (H₂ + O₂ → H₂O: molecules themselves are different).",
      },
      {
        t: "callout",
        tone: "info",
        title: "Energy tells on them",
        text: "Physical changes involve modest energy ([[intermolecular-forces|IMF]] scale: vaporizing water ≈ 41 kJ/mol). Chemical changes involve covalent/ionic bond energies — typically 10–20× larger (forming H₂O from elements releases ~242 kJ/mol). Big energy signatures hint at chemical change.",
      },
      {
        t: "misconception",
        text: "'Dissolving salt is a chemical change — it makes ions!' It's physical: evaporate the water and NaCl crystals return unchanged. The ions existed in the lattice already. (Dissolving a METAL in acid is chemical — new substances, no reversal by evaporation.)",
      },
      {
        t: "exam",
        text: "Classify-and-justify items: burning (chemical), boiling (physical), rusting (chemical), crushing (physical), electrolysis of water (chemical). Justification must reference new substances vs rearranged ones.",
      },
    ],
  },

  /* ================================================================ 4.5 */
  "4.5": {
    id: "4.5",
    unit: 4,
    title: "Stoichiometry",
    objectives: [
      "Execute the mole-ratio machine: mass → moles → moles → mass",
      "Identify limiting reactants and compute theoretical, actual, and percent yield",
    ],
    keyTerms: ["stoichiometry", "mole", "molar-mass", "limiting-reactant", "percent-yield", "balancing-equations", "avogadro"],
    relatedSims: ["reaction-viewer"],
    blocks: [
      {
        t: "p",
        text: "[[stoichiometry|Stoichiometry]] is quantitative chemistry: coefficients in a balanced equation are mole ratios, and moles are the only bridge between the subscripts on a formula and grams on a balance. The universal route:",
      },
      {
        t: "eq",
        latex: "\\text{grams A} \\xrightarrow{\\div M_A} \\text{moles A} \\xrightarrow{\\text{ratio } b/a} \\text{moles B} \\xrightarrow{\\times M_B} \\text{grams B}",
        caption: "Never go grams → grams directly. The mole is the toll booth.",
      },
      {
        t: "example",
        title: "Full worked problem: limiting reactant and yield",
        steps: [
          "Reaction: $2Al + 3Cl_2 \\rightarrow 2AlCl_3$. Given 5.40 g Al and 21.3 g Cl₂, what mass of AlCl₃ forms?",
          "Moles: Al = 5.40/26.98 = 0.200 mol; Cl₂ = 21.3/70.90 = 0.300 mol.",
          "Test each as limiting: 0.200 mol Al needs 0.300 mol Cl₂ (ratio 3/2 × 0.200) — exactly what we have! (In general, compare moles-available ÷ coefficient: Al 0.100 vs Cl₂ 0.100 — tie, both fully consumed.)",
          "Product from Al: 0.200 mol AlCl₃ (2:2) → 0.200 × 133.33 = 26.7 g.",
        ],
        answer: "26.7 g AlCl₃. If the lab actually isolates 21.4 g, [[percent-yield]] = 21.4/26.7 × 100 = 80.1%.",
      },
      {
        t: "key",
        term: "Limiting-reactant shortcut",
        text: "Divide each reactant's moles by its coefficient. Smallest quotient = [[limiting-reactant|limiting reactant]]; all product calculations use THAT reactant only. The other is in excess — its leftover amount is a common follow-up question.",
      },
      {
        t: "list",
        items: [
          "**Theoretical yield**: stoichiometry's maximum (100% conversion).",
          "**Actual yield**: what the lab measures — always lower (side reactions, mechanical losses, incomplete reaction, equilibrium).",
          "**[[percent-yield]]** = actual / theoretical × 100%.",
        ],
      },
      { t: "sim", sim: "reaction-viewer", preset: "methane", caption: "Watch mole ratios play out particle by particle — CH₄ + 2O₂ consumes exactly two oxygens per methane, the same ratio the math enforces." },
      {
        t: "misconception",
        text: "'Limiting = smaller mass or fewer moles.' It's moles ÷ COEFFICIENT that decides. 0.30 mol Cl₂ can't beat 0.20 mol Al here because the recipe demands 1.5 Cl₂ per Al — always normalize by the ratio.",
      },
      {
        t: "exam",
        text: "The workhorse long FRQ: grams in → identify limiting reactant → theoretical yield → percent yield → sometimes leftover excess. Show the mole route at every step; skipping to grams loses method points even when the number is right.",
      },
    ],
  },

  /* ================================================================ 4.6 */
  "4.6": {
    id: "4.6",
    unit: 4,
    title: "Introduction to Titration",
    objectives: ["Use titration data (volume + known concentration) to find unknown concentration", "Define equivalence point and distinguish it from the endpoint"],
    keyTerms: ["titration", "equivalence-point", "molarity", "stoichiometry", "neutralization", "indicator"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "A [[titration]] delivers a solution of known concentration (titrant) from a buret into a measured volume of unknown until the reaction is stoichiometrically complete — the [[equivalence-point|equivalence point]], where moles titrant × ratio = moles analyte. An [[indicator]]'s color flip (endpoint) marks it visually.",
      },
      { t: "eq", latex: "M_{acid} V_{acid} \\cdot a = M_{base} V_{base} \\cdot b", caption: "For a + b stoichiometry (a moles acid per b moles base). For 1:1 reactions it collapses to M₁V₁ = M₂V₂." },
      {
        t: "example",
        title: "Finding unknown acid concentration",
        steps: [
          "25.0 mL of HCl requires 18.4 mL of 0.150 M NaOH to reach the endpoint.",
          "Moles NaOH = 0.0184 L × 0.150 M = 2.76 × 10⁻³ mol.",
          "1:1 reaction → moles HCl = 2.76 × 10⁻³ mol.",
          "$M_{HCl} = 2.76\\times10^{-3} / 0.0250 = 0.110$ M.",
        ],
        answer: "0.110 M HCl. Volumes in liters, moles through the ratio, divide by the analyte's volume.",
      },
      {
        t: "callout",
        tone: "warning",
        title: "M₁V₁ = M₂V₂ is not universal",
        text: "It fails whenever the stoichiometry isn't 1:1 — e.g. H₂SO₄ + 2NaOH needs the mole-ratio step. Always route through moles; the shortcut is a special case.",
      },
      {
        t: "exam",
        text: "Error-analysis MCQs: overshooting the endpoint (too much titrant) → calculated concentration too HIGH; air bubble in buret tip that escapes → recorded volume too high → also high. Reason from moles = M × V.",
      },
    ],
  },

  /* ================================================================ 4.7 */
  "4.7": {
    id: "4.7",
    unit: 4,
    title: "Types of Chemical Reactions",
    objectives: [
      "Classify reactions as synthesis, decomposition, single/double replacement, combustion, or acid–base",
      "Predict products from patterns and activity/solubility rules",
    ],
    keyTerms: ["reaction-types", "redox", "precipitation", "neutralization", "solubility-rules"],
    relatedSims: ["reaction-viewer"],
    blocks: [
      {
        t: "p",
        text: "[[reaction-types|Reactions come in families]], and each family has a predictable product pattern — recognizing the type is half of writing the equation:",
      },
      {
        t: "table",
        headers: ["Type", "Pattern", "Example"],
        rows: [
          ["Synthesis (combination)", "A + B → AB", "2 Mg + O₂ → 2 MgO"],
          ["Decomposition", "AB → A + B (needs energy input)", "2 H₂O₂ → 2 H₂O + O₂"],
          ["Single replacement", "A + BC → AC + B (A must be more active than B)", "Zn + CuSO₄ → ZnSO₄ + Cu"],
          ["Double replacement", "AB + CD → AD + CB (needs precipitate, gas, or weak electrolyte to 'go')", "AgNO₃ + NaCl → AgCl↓ + NaNO₃"],
          ["Combustion", "fuel + O₂ → CO₂ + H₂O (hydrocarbons)", "CH₄ + 2 O₂ → CO₂ + 2 H₂O"],
          ["Acid–base ([[neutralization]])", "acid + base → salt + water", "HCl + NaOH → NaCl + H₂O"],
        ],
      },
      {
        t: "callout",
        tone: "info",
        title: "Single replacement = redox in disguise",
        text: "A + BC → AC + B only fires when A is the more reactive element (activity series: Li > K > Ca > Na > Mg > Al > Zn > Fe > … > Cu > Ag > Au). Zinc displaces copper; copper does NOT displace zinc. Every single replacement involves electron transfer — [[redox]].",
      },
      {
        t: "p",
        text: "Double replacement reactions proceed only when one product LEAVES the ion soup: a precipitate ([[solubility-rules|solubility rules]]), a gas (CO₂ from carbonate + acid), or a weak electrolyte (H₂O from [[neutralization]]). Mix two soluble salts with all-soluble products and nothing happens — every ion stays a spectator.",
      },
      { t: "sim", sim: "reaction-viewer", preset: "halogenation", caption: "A substitution reaction in the viewer — watch bonds break and re-form as the pattern unfolds particle by particle." },
      {
        t: "example",
        title: "Predict and balance",
        steps: [
          "Ca(s) + HCl(aq) → ? Single replacement: Ca displaces H (Ca is above H in activity).",
          "Ca + HCl → CaCl₂ + H₂ — balance charges first (Ca²⁺ needs 2 Cl⁻).",
          "Balance atoms: Ca + 2HCl → CaCl₂ + H₂.",
        ],
        answer: "Ca + 2HCl → CaCl₂(aq) + H₂(g). Also a redox reaction: Ca 0 → +2 (oxidized), H +1 → 0 (reduced).",
      },
      {
        t: "misconception",
        text: "'Every double replacement makes a precipitate.' No — it must make a precipitate, gas, or molecular species (water/weak acid) to occur at all. And combustion isn't only hydrocarbons: metals burn (synthesis with O₂) and the products differ.",
      },
      {
        t: "exam",
        text: "Given reactants, write balanced products — the classification skill IS the prediction skill. FRQs often follow with 'what type of reaction is this?' and 'identify the species oxidized.'",
      },
    ],
  },

  /* ================================================================ 4.8 */
  "4.8": {
    id: "4.8",
    unit: 4,
    title: "Introduction to Acid–Base Reactions",
    objectives: ["Define acids and bases (Arrhenius, Brønsted–Lowry)", "Write neutralization reactions at molecular, ionic, and net-ionic level"],
    keyTerms: ["acid", "base", "arrhenius-equation", "bronsted-lowry", "neutralization", "strong-acid", "weak-acid", "net-ionic-equation"],
    relatedSims: ["bond-polarity"],
    blocks: [
      {
        t: "p",
        text: "Two definitions do the work here. **Arrhenius**: an [[acid]] produces H⁺ in water; a [[base]] produces OH⁻. **[[bronsted-lowry|Brønsted–Lowry]]** (broader): an acid is a proton DONOR, a base a proton ACCEPTOR — NH₃ is a base with no OH⁻ of its own because it grabs H⁺ from water.",
      },
      {
        t: "list",
        items: [
          "Strong acid + strong base net ionic: $H^+ + OH^- \\rightarrow H_2O(l)$.",
          "Weak acid + strong base: $CH_3COOH + OH^- \\rightarrow CH_3COO^- + H_2O$ — weak acid stays molecular.",
          "Strong acid + weak base: $H^+ + NH_3 \\rightarrow NH_4^+$.",
          "Acid + carbonate/bicarbonate: $2H^+ + CO_3^{2-} \\rightarrow H_2O + CO_2(g)$ — fizz!",
        ],
      },
      {
        t: "callout",
        tone: "violet",
        title: "Conjugate pairs sneak in early",
        text: "Every proton transfer leaves behind a [[conjugate-pair]]: acid → conjugate base (lost H⁺), base → conjugate acid (gained H⁺). In CH₃COOH + OH⁻ → CH₃COO⁻ + H₂O, the pairs are CH₃COOH/CH₃COO⁻ and H₂O/OH⁻.",
      },
      { t: "sim", sim: "bond-polarity", preset: "hcl", caption: "Why HCl is an acid: the H–Cl bond is polarized enough that water can tear the proton clean off. Compare with H₂'s nonpolar bond — no proton to give." },
      {
        t: "misconception",
        text: "'Neutralization always gives pH 7.' Only strong acid + strong base in exact stoichiometric amounts. Strong acid + weak base lands acidic (NH₄⁺ hydrolyzes); weak acid + strong base lands basic (CH₃COO⁻ hydrolyzes). Unit 8 makes this quantitative.",
      },
      {
        t: "exam",
        text: "Write the net ionic equation for a given acid–base pair — the strong/weak classification of each partner determines what splits. Misclassifying acetic acid as H⁺ + CH₃COO⁻ costs the point.",
      },
    ],
  },

  /* ================================================================ 4.9 */
  "4.9": {
    id: "4.9",
    unit: 4,
    title: "Oxidation–Reduction (Redox) Reactions",
    objectives: [
      "Assign oxidation numbers using the standard rules",
      "Identify what is oxidized, reduced, the oxidizing agent, and the reducing agent",
      "Balance redox reactions and connect electron transfer to half-reactions",
    ],
    keyTerms: ["redox", "oxidation-number", "reaction-types", "electrolyte", "galvanic-cell", "cell-potential"],
    relatedSims: ["reaction-viewer", "ionic-bonding"],
    blocks: [
      {
        t: "p",
        text: "[[redox|Redox reactions]] move electrons between species. We track the bookkeeping with [[oxidation-number|oxidation numbers]] — hypothetical charges assigned by rules. Oxidation = number rises (electrons lost, OIL); reduction = number falls (electrons gained, RIG). Both always occur together: every electron lost is gained by someone.",
      },
      {
        t: "table",
        headers: ["Rule", "Assignment", "Example"],
        rows: [
          ["Free elements", "0", "Zn(s), O₂(g), Cl₂(g), S₈"],
          ["Monatomic ions", "= ion charge", "Na⁺ = +1, S²⁻ = −2"],
          ["Fluorine", "always −1", "any compound"],
          ["Oxygen", "−2 (except peroxides −1, with F positive)", "H₂O, CO₂; H₂O₂ has −1"],
          ["Hydrogen", "+1 with nonmetals, −1 with metals", "HCl +1; NaH −1"],
          ["Group 1 / Group 2 in compounds", "+1 / +2", "always"],
          ["Neutral compound / polyatomic ion", "sum = 0 / sum = ion charge", "solve for the unknown"],
        ],
      },
      {
        t: "example",
        title: "Assign and classify: Zn + CuSO₄ → ZnSO₄ + Cu",
        steps: [
          "Net ionic first (SO₄²⁻ is spectator): Zn + Cu²⁺ → Zn²⁺ + Cu.",
          "Oxidation numbers: Zn 0 → +2 (rose = oxidized); Cu +2 → 0 (fell = reduced).",
          "Half-reactions: Zn → Zn²⁺ + 2e⁻ (oxidation); Cu²⁺ + 2e⁻ → Cu (reduction).",
          "Agents: Zn is the REDUCING agent (it causes reduction by giving electrons); Cu²⁺ is the OXIDIZING agent (it takes them).",
        ],
        answer: "2 electrons transferred per Zn atom. The agent labels always point at the reactant, never the product.",
      },
      {
        t: "callout",
        tone: "info",
        title: "Where redox hides",
        text: "Combustion (C and H oxidized, O₂ reduced), single replacement (always redox), decomposition of peroxides, photosynthesis/respiration, batteries ([[galvanic-cell]]) and electroplating ([[electrolytic-cell]]). Double replacement and acid–base neutralization are NEVER redox — no oxidation numbers change.",
      },
      {
        t: "example",
        title: "Finding an unknown oxidation number",
        steps: [
          "Chromium in $Cr_2O_7^{2-}$: oxygens give 7 × (−2) = −14.",
          "Sum must equal ion charge: 2(Cr) − 14 = −2 → 2(Cr) = +12.",
          "Cr = +6 each.",
        ],
        answer: "+6. In the product Cr³⁺, chromium is reduced from +6 — dichromate is a classic oxidizing agent.",
      },
      {
        t: "misconception",
        text: "'The oxidizing agent gets oxidized.' Backwards! The oxidizing agent TAKES electrons and is itself REDUCED. Memory fix: the agent does the action TO the other species — and suffers the opposite fate.",
      },
      {
        t: "exam",
        text: "FRQ: assign oxidation numbers, identify oxidized/reduced species + agents, and sometimes balance in acidic solution (half-reaction method: balance atoms → O with H₂O → H with H⁺ → charge with e⁻). Unit 9 continues with cells.",
      },
    ],
  },
};
