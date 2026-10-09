import type { Lesson } from "../lessonTypes";

/**
 * Unit 7 — Equilibrium.
 * Full lessons: 7.1, 7.3, 7.4, 7.7, 7.9, 7.11. Concise but complete: the rest.
 */
export const unit7: Record<string, Lesson> = {
  /* ================================================================ 7.1 */
  "7.1": {
    id: "7.1",
    unit: 7,
    title: "Introduction to Equilibrium",
    objectives: [
      "Define dynamic equilibrium: forward and reverse rates equal, concentrations constant",
      "Recognize equilibrium from data (concentration plateaus) and explain it at particle level",
      "Understand that equilibrium is reachable from either direction",
    ],
    keyTerms: ["equilibrium", "reaction-rate", "reversible-reaction", "equilibrium-constant", "closed-system"],
    relatedSims: ["reaction-viewer", "imf-lab"],
    blocks: [
      {
        t: "p",
        text: "Most reactions in a closed vessel don't run to completion — they settle. As reactants convert to products, the forward [[reaction-rate]] slows (fewer reactant particles) while the reverse rate grows (more product particles to collide). The moment the two rates become EQUAL, the system reaches [[equilibrium|chemical equilibrium]]: concentrations stop changing — but the reaction has NOT stopped.",
      },
      {
        t: "key",
        term: "Dynamic, not static",
        text: "At equilibrium, molecules keep reacting in both directions at identical rates — every forward event balanced by a reverse event. It's like a store with equal customers entering and leaving: headcount constant, traffic continuous. Evidence: radioactive tracer studies show isotopes scrambling between reactant and product at equilibrium.",
      },
      {
        t: "list",
        items: [
          "Macroscopic observables (concentration, color, pressure) are CONSTANT.",
          "Microscopic processes continue at equal forward/reverse rates.",
          "The SAME equilibrium state is reached starting from all reactants, all products, or any mixture — only the path differs.",
          "Requires a closed system: escaping matter (gas leaving) prevents equilibrium.",
        ],
      },
      {
        t: "callout",
        tone: "info",
        title: "Physical equilibria count too",
        text: "Liquid ⇌ vapor in a sealed bottle ([[vapor-pressure]]), saturated solutions with undissolved solute ([[solubility]]), even phase changes on plateaus — all are dynamic equilibria governed by the same logic.",
      },
      { t: "sim", sim: "imf-lab", preset: "h2o", caption: "Physical equilibrium in the box: at a steady temperature, evaporation and condensation balance — a dynamic steady state just like a chemical equilibrium." },
      {
        t: "misconception",
        text: "'At equilibrium, reactants = products.' Equality is in RATES, not concentrations. The equilibrium mixture can be 99.99% product (huge K) or 99.99% reactant (tiny K) — rates are still matched. Also: 'equilibrium means the reaction stopped' — it never does.",
      },
      {
        t: "exam",
        text: "Graph identification: pick the curve set where concentrations plateau at DIFFERENT values (not necessarily equal) and remain constant. FRQ: 'Explain why the color stops changing even though N₂O₄ ⇌ 2NO₂ continues' — equal rates, dynamic balance.",
      },
    ],
  },

  /* ================================================================ 7.2 */
  "7.2": {
    id: "7.2",
    unit: 7,
    title: "Direction of Reversible Reactions",
    objectives: ["Predict net reaction direction by comparing Q with K"],
    keyTerms: ["reaction-quotient", "equilibrium-constant", "equilibrium", "le-chatelier"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Given any snapshot of a reversible reaction, compute the [[reaction-quotient|reaction quotient]] Q and compare with K: Q < K → too much reactant, net forward; Q > K → too much product, net reverse; Q = K → at [[equilibrium]], no net change. The system always 'drives' toward Q = K.",
      },
      {
        t: "list",
        items: [
          "Q has the same form as K but uses CURRENT (possibly non-equilibrium) concentrations.",
          "'Direction' is about net change — both reactions still occur, one just outpaces the other.",
          "This comparison is the quantitative backbone of [[le-chatelier|Le Châtelier]] reasoning (7.10).",
        ],
      },
      {
        t: "exam",
        text: "MCQ: given Q = 2.5 and K = 1.0 × 10³, the reaction proceeds… (forward, strongly — Q ≪ K).",
      },
    ],
  },

  /* ================================================================ 7.3 */
  "7.3": {
    id: "7.3",
    unit: 7,
    title: "Reaction Quotient and Equilibrium Constant",
    objectives: [
      "Write Q and K expressions from balanced equations (mass-action form)",
      "Apply the exclusion rules: pure solids and liquids never appear",
      "Convert between Kc and Kp",
    ],
    keyTerms: ["equilibrium-constant", "reaction-quotient", "equilibrium", "partial-pressure", "ideal-gas-law"],
    relatedSims: ["reaction-viewer"],
    blocks: [
      {
        t: "p",
        text: "For $aA + bB \\rightleftharpoons cC + dD$, the [[reaction-quotient|mass-action expression]] is products over reactants, each raised to its coefficient:",
      },
      { t: "eq", latex: "Q_c = \\frac{[C]^c [D]^d}{[A]^a [B]^b} \\qquad K_c = Q_c\\ \\text{at equilibrium}", caption: "K is Q evaluated with equilibrium concentrations — a constant at a given temperature." },
      {
        t: "key",
        term: "Exclusion rules",
        text: "Pure solids (s) and pure liquids (l) NEVER appear — their 'concentrations' are constant (density/molar mass) and fold into K. H₂O(l) in aqueous equilibria is excluded; H₂O(g) in gas-phase reactions is INCLUDED. In AgCl(s) ⇌ Ag⁺ + Cl⁻, only the ions appear ([[ksp]]).",
      },
      {
        t: "list",
        items: [
          "Gas-phase version uses partial pressures: $K_p = \\frac{P_C^c P_D^d}{P_A^a P_B^b}$.",
          "Conversion: $K_p = K_c(RT)^{\\Delta n}$ where Δn = moles of gas products − moles of gas reactants.",
          "Manipulating the equation manipulates K: reverse → 1/K; ×2 coefficients → K²; ÷2 → √K; add reactions → multiply Ks.",
        ],
      },
      {
        t: "example",
        title: "Writing K and converting",
        steps: [
          "For $N_2(g) + 3H_2(g) \\rightleftharpoons 2NH_3(g)$: $K_c = [NH_3]^2/([N_2][H_2]^3)$.",
          "Δn = 2 − 4 = −2, so $K_p = K_c(RT)^{-2}$.",
          "For the reverse ($2NH_3 \\rightleftharpoons N_2 + 3H_2$): K' = 1/K.",
          "For half ($\\tfrac{1}{2}N_2 + \\tfrac{3}{2}H_2 \\rightleftharpoons NH_3$): K'' = √K.",
        ],
        answer: "K expressions follow the equation EXACTLY as written — always state which equation your K belongs to.",
      },
      {
        t: "misconception",
        text: "'K has no units / K = concentrations summed.' K is a ratio of concentration POWERS (treated as unitless on AP); coefficients become exponents, NOT multipliers. And water as liquid solvent never goes in the expression — but as steam it does.",
      },
      {
        t: "exam",
        text: "Write-the-expression MCQs test the exclusion rules; FRQs chain K expressions when reactions are combined (multiply Ks). R = 0.08206 for Kp↔Kc with T in kelvin.",
      },
    ],
  },

  /* ================================================================ 7.4 */
  "7.4": {
    id: "7.4",
    unit: 7,
    title: "Calculating the Equilibrium Constant",
    objectives: [
      "Compute K from equilibrium concentrations",
      "Use an ICE table to find K from initial conditions plus one equilibrium measurement",
    ],
    keyTerms: ["equilibrium-constant", "ice-table", "stoichiometry", "equilibrium", "reaction-quotient"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Two data situations: (1) ALL equilibrium concentrations given → substitute straight into the K expression. (2) Initial concentrations plus ONE equilibrium value → build an [[ice-table|ICE table]] (Initial, Change, Equilibrium) and let stoichiometry do the rest.",
      },
      {
        t: "key",
        term: "ICE table mechanics",
        text: "Row I: initial values (products often 0). Row C: changes in terms of x, scaled by coefficients — if A changes by −2x, B changes by −x and C by +2x for 2A + B ⇌ 2C. Row E: I + C. Plug row E into K and solve.",
      },
      {
        t: "example",
        title: "K from one equilibrium measurement",
        steps: [
          "$2SO_2 + O_2 \\rightleftharpoons 2SO_3$. Start: [SO₂] = 0.400 M, [O₂] = 0.200 M, [SO₃] = 0. At equilibrium [SO₃] = 0.260 M.",
          "Change in SO₃ = +0.260 = +2x → x = 0.130.",
          "SO₂ change = −2x = −0.260 → [SO₂]eq = 0.140 M. O₂ change = −x = −0.130 → [O₂]eq = 0.070 M.",
          "$K_c = \\frac{0.260^2}{0.140^2 \\times 0.070} = \\frac{0.0676}{0.001372}$.",
        ],
        answer: "K ≈ 49.3. The entire trick: one measured species + coefficient ratios gives you every other equilibrium value.",
      },
      {
        t: "callout",
        tone: "info",
        title: "The 5% rule preview",
        text: "When K is small and the initial reactant concentration large, x is often negligible compared to it — approximate (0.400 − x ≈ 0.400) to avoid the quadratic. Justify after solving: if x < 5% of the value it was subtracted from, the approximation stands.",
      },
      {
        t: "misconception",
        text: "'Changes equal coefficients times nothing — I'll just subtract x everywhere.' Changes MUST scale with coefficients (−2x, −x, +2x) — using the same x for all species breaks stoichiometry and is the top ICE-table error.",
      },
      {
        t: "exam",
        text: "A guaranteed FRQ: ICE table → K, or the reverse (7.7). Show the table; partial credit lives in rows I, C, E even if algebra slips.",
      },
    ],
  },

  /* ================================================================ 7.5 */
  "7.5": {
    id: "7.5",
    unit: 7,
    title: "Magnitude of the Equilibrium Constant",
    objectives: ["Interpret K ≫ 1 vs K ≪ 1 in terms of mixture composition"],
    keyTerms: ["equilibrium-constant", "equilibrium", "thermodynamic-favorability"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "K's magnitude describes WHERE equilibrium sits: K ≫ 1 (say > 10³) → mixture is mostly products — the forward reaction is [[thermodynamic-favorability|thermodynamically favorable]]; K ≪ 1 (< 10⁻³) → mostly reactants — 'the reaction hardly happens'; K near 1 → comparable amounts of both.",
      },
      {
        t: "list",
        items: [
          "K says nothing about SPEED — a K = 10⁴⁰ reaction can still take years without a catalyst (diamond ⇌ graphite again).",
          "Comparing K values across similar equations ranks product-favorability.",
          "Reciprocal K for the reverse flips the interpretation (K = 10⁻⁵ forward ⟹ 10⁵ reverse).",
        ],
      },
      {
        t: "exam",
        text: "MCQ: 'For K = 2.6 × 10⁻⁸, the equilibrium mixture contains…' mostly reactants. Pair with a diagram question: which particulate box matches the K magnitude?",
      },
    ],
  },

  /* ================================================================ 7.6 */
  "7.6": {
    id: "7.6",
    unit: 7,
    title: "Properties of the Equilibrium Constant",
    objectives: ["State what does and doesn't change K", "Combine K values for coupled equations"],
    keyTerms: ["equilibrium-constant", "temperature", "catalyst", "equilibrium", "hess-law"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "K depends on the reaction as written and on [[temperature]] — NOTHING else. Concentrations, pressure, volume, and [[catalyst|catalysts]] shift the POSITION of equilibrium (how fast you get there, which side is favored at the new balance) but never change K itself. Only heating/cooling rewrites K (the van't Hoff direction follows [[enthalpy]] sign: heating favors the endothermic direction, raising its K).",
      },
      {
        t: "table",
        headers: ["Manipulation", "Effect on K"],
        rows: [
          ["Reverse the equation", "K' = 1/K"],
          ["Multiply coefficients by n", "K' = Kⁿ"],
          ["Add two sequential equations", "K' = K₁ × K₂"],
          ["Change T", "K changes — only true modifier"],
          ["Add catalyst / change P, V, [conc]", "K unchanged"],
        ],
      },
      {
        t: "exam",
        text: "'Which changes increase K?' — temperature only (for the favored direction). Coupled-reaction K multiplication mirrors [[hess-law]] arithmetic for ΔH.",
      },
    ],
  },

  /* ================================================================ 7.7 */
  "7.7": {
    id: "7.7",
    unit: 7,
    title: "Calculating Equilibrium Concentrations",
    objectives: [
      "Solve ICE problems with K known: find all equilibrium concentrations",
      "Apply and justify the small-x approximation",
    ],
    keyTerms: ["ice-table", "equilibrium-constant", "equilibrium", "reaction-quotient", "stoichiometry"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "The mirror image of 7.4: K is known, initial concentrations are known — find the equilibrium mixture. Build the [[ice-table|ICE table]] with unknown x, substitute row E into the K expression, and solve (quadratic, or the small-x shortcut when justified).",
      },
      {
        t: "example",
        title: "Small-x approximation, fully justified",
        steps: [
          "$N_2 + O_2 \\rightleftharpoons 2NO$, K = 4.1 × 10⁻⁴ at some T. Start with [N₂] = 0.50 M, [O₂] = 0.50 M, [NO] = 0.",
          "ICE: changes −x, −x, +2x → E: 0.50−x, 0.50−x, 2x.",
          "$4.1\\times10^{-4} = \\frac{(2x)^2}{(0.50-x)^2}$. Take square roots: $0.0202 = \\frac{2x}{0.50-x}$.",
          "Assume x ≪ 0.50: 2x ≈ 0.0202 × 0.50 = 0.0101 → x ≈ 0.00505.",
          "Check: 0.00505/0.50 = 1.0% < 5% ✓. [NO]eq = 2x = 0.010 M; [N₂] = [O₂] ≈ 0.495 M.",
        ],
        answer: "[NO] ≈ 0.010 M. When the expression is a perfect square, square-rooting beats the quadratic formula; the 5% check earns the approximation's credit.",
      },
      {
        t: "key",
        term: "When you must go quadratic",
        text: "If K is not tiny or the 5% check fails, keep x: expand and solve $ax^2+bx+c=0$. Discard roots that give negative concentrations or exceed initial amounts (unphysical). AP calculators handle quadratics; set up correctly and the algebra is routine.",
      },
      {
        t: "callout",
        tone: "warning",
        title: "Direction check first",
        text: "If the mixture starts with products too, compute Q first to see which way the reaction runs — that decides the SIGNS in row C. Guessing forward when Q > K makes the quadratic return garbage roots.",
      },
      {
        t: "misconception",
        text: "'Approximate means ignore x everywhere.' Only where it's subtracted from a LARGE initial value; the product side (2x) keeps x fully — otherwise [NO] would compute as zero.",
      },
      {
        t: "exam",
        text: "The classic long FRQ: ICE → solve → report all equilibrium concentrations (often followed by a [[le-chatelier]] perturbation question). Always verify your answers by plugging back into K.",
      },
    ],
  },

  /* ================================================================ 7.8 */
  "7.8": {
    id: "7.8",
    unit: 7,
    title: "Representations of Equilibrium",
    objectives: ["Interpret particulate diagrams and graphs of systems at equilibrium"],
    keyTerms: ["equilibrium", "reaction-quotient", "equilibrium-constant", "le-chatelier"],
    relatedSims: ["imf-lab"],
    blocks: [
      {
        t: "p",
        text: "Equilibrium shows up in three visual languages: (1) **Particulate boxes** — count A vs B particles; the ratio pattern across boxes at the same temperature reveals K's magnitude. (2) **Concentration–time graphs** — curves flatten at constant (unequal) values; from the plateau values you can literally compute K. (3) **Rate–time graphs** — forward and reverse rate curves converge and merge.",
      },
      {
        t: "list",
        items: [
          "Same T, different starting points → same plateau RATIO (same K), different absolute values.",
          "A perturbation on a graph (spike then new plateau) is Le Châtelier in pictures — read 7.9 into the kink.",
          "Molecular boxes before/after a volume change test whether you can count particles and reason with Q.",
        ],
      },
      {
        t: "exam",
        text: "'Which box represents equilibrium for K = 4?' — count particles, form the mass-action ratio with coefficients as exponents, compare.",
      },
    ],
  },

  /* ================================================================ 7.9 */
  "7.9": {
    id: "7.9",
    unit: 7,
    title: "Introduction to Le Châtelier's Principle",
    objectives: [
      "Predict shifts from concentration, pressure/volume, and temperature changes",
      "Justify each prediction with Q vs K reasoning, not just the slogan",
    ],
    keyTerms: ["le-chatelier", "equilibrium", "reaction-quotient", "equilibrium-constant", "enthalpy", "temperature", "catalyst"],
    relatedSims: ["reaction-viewer"],
    blocks: [
      {
        t: "p",
        text: "[[le-chatelier|Le Châtelier's principle]]: a system at [[equilibrium]] disturbed by a stress responds to partially counteract the stress. The slogan predicts; the MATH explains — every stress momentarily makes Q ≠ K, and the reaction runs in whichever direction restores Q = K. (K itself changes only with temperature.)",
      },
      {
        t: "table",
        headers: ["Stress", "Q effect", "Shift"],
        rows: [
          ["Add reactant", "Q < K (denominator grows)", "forward — consumes some added reactant"],
          ["Remove product", "Q < K", "forward — partially replaces it"],
          ["Add inert gas (constant V)", "no concentration change", "NO shift (pressures change, Q doesn't)"],
          ["Decrease volume (↑P)", "Q shifts toward side with FEWER gas moles", "toward smaller Δn_gas side"],
          ["Increase volume (↓P)", "mirror image", "toward MORE gas moles"],
          ["Raise T (exothermic rxn, ΔH<0)", "K decreases", "reverse — heat treated as a product"],
          ["Raise T (endothermic rxn)", "K increases", "forward — heat treated as a reactant"],
          ["Add [[catalyst]]", "none — speeds both directions equally", "NO shift; equilibrium reached faster"],
        ],
      },
      {
        t: "example",
        title: "The Haber process under stress",
        steps: [
          "$N_2(g) + 3H_2(g) \\rightleftharpoons 2NH_3(g)$, ΔH° = −92 kJ (exothermic).",
          "Compress the vessel: 4 gas moles → 2 gas moles — shift RIGHT (fewer moles relieves pressure).",
          "Heat it: treat heat as a product of an exothermic reaction — shift LEFT; K shrinks.",
          "Industry's compromise: high pressure (helps yield), moderate temperature (rate vs yield), iron catalyst (rate only).",
        ],
        answer: "Every industrial choice is Le Châtelier + kinetics traded against each other — expect exactly this reasoning on FRQs.",
      },
      {
        t: "callout",
        tone: "warning",
        title: "Solids and liquids are stress-immune",
        text: "Adding more solid AgCl to a [[ksp|solubility equilibrium]] shifts nothing — its 'concentration' doesn't appear in Q. Only species IN the expression can stress it.",
      },
      {
        t: "misconception",
        text: "'Adding reactant shifts right, so [reactant] ends up LOWER than before.' It ends up HIGHER than before the addition (lower than the instant spike, but the counteraction is PARTIAL). Le Châtelier offsets; it never fully reverses.",
      },
      {
        t: "exam",
        text: "FRQ format: state shift + justify with Q vs K (concentration/pressure stresses) or with K's temperature dependence (thermal stresses). 'Because Le Châtelier says so' alone earns nothing — the mechanism must appear.",
      },
    ],
  },

  /* ================================================================ 7.10 */
  "7.10": {
    id: "7.10",
    unit: 7,
    title: "Reaction Quotient and Le Châtelier's Principle",
    objectives: ["Use Q vs K as the universal decision rule for perturbations"],
    keyTerms: ["reaction-quotient", "equilibrium-constant", "le-chatelier", "equilibrium"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "This topic unifies 7.2 and 7.9 into one computational move: after ANY disturbance, recompute Q with the new conditions and compare to K. Q < K → net forward; Q > K → net reverse; Q = K → still at [[equilibrium]]. Volume changes work because concentrations (and hence Q) change unequally when Δn_gas ≠ 0; temperature changes work because K ITSELF changes while Q lags behind.",
      },
      {
        t: "example",
        title: "Volume doubling, quantitatively",
        steps: [
          "For N₂ + 3H₂ ⇌ 2NH₃ at equilibrium, double the volume: every concentration halves.",
          "$Q = \\frac{(0.5[NH_3])^2}{(0.5[N_2])(0.5[H_2])^3} = \\frac{0.25}{0.5 \\times 0.125} \\times K = 4K$.",
          "Q = 4K > K → shift reverse (toward 4 gas moles) — Le Châtelier's pressure rule, derived not memorized.",
        ],
        answer: "Q-vs-K reasoning reproduces every slogan prediction and never misfires on edge cases (inert gases, solids, Δn = 0).",
      },
      {
        t: "exam",
        text: "Justification points increasingly demand the Q/K computation shown. Δn_gas = 0 reactions (H₂ + I₂ ⇌ 2HI) show Q unchanged by volume — no shift; Q math makes that obvious.",
      },
    ],
  },

  /* ================================================================ 7.11 */
  "7.11": {
    id: "7.11",
    unit: 7,
    title: "Introduction to Solubility Equilibria",
    objectives: [
      "Write Ksp expressions and relate Ksp to molar solubility",
      "Predict precipitation with Q vs Ksp; explain saturated-solution dynamic equilibrium",
    ],
    keyTerms: ["ksp", "solubility", "precipitation", "equilibrium", "reaction-quotient", "common-ion-effect", "ice-table"],
    relatedSims: ["ionic-bonding"],
    blocks: [
      {
        t: "p",
        text: "An 'insoluble' salt still dissolves — a little. In a saturated solution, solid and dissolved ions sit in dynamic [[equilibrium]]: ions leave the crystal at the same rate they re-deposit. The constant is [[ksp|Ksp]], the solubility product — a mass-action expression with the solid excluded:",
      },
      { t: "eq", latex: "AgCl(s) \\rightleftharpoons Ag^+ + Cl^-:\\ K_{sp} = [Ag^+][Cl^-] \\qquad CaF_2 \\rightleftharpoons Ca^{2+} + 2F^-:\\ K_{sp} = [Ca^{2+}][F^-]^2", caption: "Coefficients become exponents — the 2 in CaF₂ makes [F⁻]² and doubles F⁻ relative to Ca²⁺." },
      {
        t: "example",
        title: "Ksp ↔ molar solubility (both directions)",
        steps: [
          "**Solubility → Ksp**: AgBr dissolves 7.3 × 10⁻⁷ mol/L. Then [Ag⁺] = [Br⁻] = 7.3 × 10⁻⁷.",
          "$K_{sp} = (7.3\\times10^{-7})^2 = 5.3\\times10^{-13}$.",
          "**Ksp → solubility**: MgF₂ has Ksp = 6.4 × 10⁻⁹. Let solubility = s: [Mg²⁺] = s, [F⁻] = 2s.",
          "$K_{sp} = (s)(2s)^2 = 4s^3 = 6.4\\times10^{-9} \\Rightarrow s^3 = 1.6\\times10^{-9} \\Rightarrow s = 1.2\\times10^{-3}$ M.",
        ],
        answer: "The 4s³ (not s²) factor for 1:2 salts is the classic trap — write the ion table before the algebra, every time.",
      },
      {
        t: "callout",
        tone: "info",
        title: "Precipitation prediction",
        text: "Mix solutions → compute ion concentrations after dilution → Q = mass-action with those values. Q > Ksp → precipitate forms until Q = Ksp; Q < Ksp → nothing forms (unsaturated). This is 7.2's rule wearing a solubility hat.",
      },
      {
        t: "p",
        text: "A [[common-ion-effect|common ion]] suppresses solubility: AgCl in 0.10 M NaCl dissolves far less than in pure water — the extra Cl⁻ pushes Q above Ksp immediately, shifting the equilibrium back toward solid (Le Châtelier again). Ksp itself is unchanged.",
      },
      {
        t: "misconception",
        text: "'Lower Ksp always means less soluble.' Only true comparing salts with the SAME ion ratio: AgCl (Ksp 1.8×10⁻¹⁰, s = 1.3×10⁻⁵ M) vs Ag₂CrO₄ (Ksp 1.1×10⁻¹², s = 6.5×10⁻⁵ M) — the chromate has the SMALLER Ksp yet is FIVE TIMES more soluble, because Ksp = 4s³ there. Convert to molar solubility to compare fairly.",
      },
      {
        t: "exam",
        text: "FRQ favorites: compute s from Ksp, predict precipitate from mixed solutions (dilution step!), explain common-ion suppression with Q/Ksp + Le Châtelier. Unit 8.11 adds pH control of solubility (Mg(OH)₂ in acid).",
      },
    ],
  },

  /* ================================================================ 7.12 */
  "7.12": {
    id: "7.12",
    unit: 7,
    title: "Common-Ion Effect",
    objectives: ["Quantify solubility suppression by a common ion", "Apply the same logic to weak-acid equilibria (preview of buffers)"],
    keyTerms: ["common-ion-effect", "ksp", "solubility", "le-chatelier", "buffer", "equilibrium"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Dissolving CaF₂ into a solution that ALREADY contains F⁻ (say from NaF) means starting with product on the board: Q > Ksp territory, so equilibrium solubility shrinks. Quantitatively, let s = [Ca²⁺] formed; then [F⁻] = 0.10 + 2s ≈ 0.10 (the common ion dominates), and $K_{sp} = s(0.10)^2$ — solve for a much smaller s.",
      },
      {
        t: "example",
        title: "Solubility with and without common ion",
        steps: [
          "PbCl₂, Ksp = 1.7 × 10⁻⁵. Pure water: 4s³ = 1.7×10⁻⁵ → s = 1.6 × 10⁻² M.",
          "In 0.20 M NaCl: [Cl⁻] ≈ 0.20 (2s negligible). Ksp = s(0.20)² → s = 1.7×10⁻⁵/0.040.",
          "s = 4.3 × 10⁻⁴ M.",
        ],
        answer: "Solubility drops ~40× in the common-ion solution. The approximation [Cl⁻] ≈ 0.20 is justified because 2s = 8.6×10⁻⁴ ≪ 0.20.",
      },
      {
        t: "callout",
        tone: "violet",
        title: "Same story in acid–base land",
        text: "Acetic acid + sodium acetate: the shared CH₃COO⁻ suppresses ionization of CH₃COOH — that solution is a [[buffer]] (Unit 8.8). The common-ion effect IS the buffer principle, first met through solubility.",
      },
      {
        t: "exam",
        text: "Explain-with-Ksp FRQs: name the common ion, write Q's response, conclude suppressed solubility via [[le-chatelier]] — and note Ksp is unchanged.",
      },
    ],
  },

  /* ================================================================ 7.13 */
  "7.13": {
    id: "7.13",
    unit: 7,
    title: "pH and Solubility",
    objectives: ["Explain why solubility of basic salts depends on pH", "Predict dissolution in acid"],
    keyTerms: ["ksp", "solubility", "ph", "le-chatelier", "common-ion-effect", "acid"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Salts whose anion is a BASE dissolve more in acid. Mg(OH)₂(s) ⇌ Mg²⁺ + 2OH⁻: added H⁺ neutralizes OH⁻ (→ H₂O), continuously removing a product — Q drops below [[ksp|Ksp]], more solid dissolves, and stomach acid dissolves 'insoluble' antacid. Carbonates fizz in acid the same way (CO₃²⁻ + 2H⁺ → H₂O + CO₂↑ — the gas ESCAPES, so dissolution goes to completion).",
      },
      {
        t: "list",
        items: [
          "Anion = conjugate base of a WEAK acid (OH⁻, CO₃²⁻, S²⁻, PO₄³⁻, F⁻, CH₃COO⁻) → pH-sensitive solubility.",
          "Anion from a STRONG acid (Cl⁻, Br⁻, I⁻, NO₃⁻) → pH-insensitive (its conjugate acid wouldn't stay protonated anyway). AgCl dissolves no better in acid.",
          "Higher pH (more OH⁻) = common-ion SUPPRESSION for hydroxides — the reverse effect.",
        ],
      },
      {
        t: "exam",
        text: "'Explain why Mg(OH)₂ dissolves in HCl but not in NaCl' — removal of OH⁻ drives Q < Ksp (net ionic: Mg(OH)₂ + 2H⁺ → Mg²⁺ + 2H₂O). Also appears as 8.11 with titration flavor.",
      },
    ],
  },
};
