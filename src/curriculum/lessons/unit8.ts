import type { Lesson } from "../lessonTypes";

/**
 * Unit 8 — Acids and Bases.
 * Full lessons: 8.1, 8.2, 8.3, 8.5, 8.8. Concise but complete: the rest.
 */
export const unit8: Record<string, Lesson> = {
  /* ================================================================ 8.1 */
  "8.1": {
    id: "8.1",
    unit: 8,
    title: "Introduction to Acids and Bases",
    objectives: [
      "Apply Brønsted–Lowry definitions and identify conjugate acid–base pairs",
      "Classify strong vs weak acids and bases and predict reaction direction",
      "Use Kw to relate [H⁺] and [OH⁻] in any aqueous solution",
    ],
    keyTerms: ["acid", "base", "bronsted-lowry", "conjugate-pair", "strong-acid", "weak-acid", "weak-base", "kw", "neutralization", "lewis-acid-base"],
    relatedSims: ["bond-polarity", "molecular-polarity"],
    blocks: [
      {
        t: "p",
        text: "[[bronsted-lowry|Brønsted–Lowry]]: an [[acid]] donates a proton (H⁺), a [[base]] accepts one. Every transfer creates a [[conjugate-pair|conjugate pair]] differing by exactly one H⁺: in $NH_3 + H_2O \\rightleftharpoons NH_4^+ + OH^-$, the pairs are NH₃/NH₄⁺ (base→conjugate acid) and H₂O/OH⁻ (acid→conjugate base). Water plays BOTH roles — it's amphoteric.",
      },
      {
        t: "key",
        term: "The strong lists (memorize exactly)",
        text: "**Strong acids** (ionize ~100%): HCl, HBr, HI, HNO₃, H₂SO₄ (first proton), HClO₄. Everything else is weak — including the famous ones students assume are strong: HF, CH₃COOH, H₂CO₃, H₃PO₄. **Strong bases**: Group 1 hydroxides (NaOH, KOH…) plus Ca(OH)₂, Sr(OH)₂, Ba(OH)₂. NH₃ is a WEAK base (Kb = 1.8 × 10⁻⁵).",
      },
      {
        t: "list",
        items: [
          "Strong acid in water: $HCl \\rightarrow H^+ + Cl^-$ — one arrow, complete.",
          "Weak acid in water: $CH_3COOH \\rightleftharpoons H^+ + CH_3COO^-$ — double arrow, ~1% ionized, governed by [[ka|Ka]].",
          "Proton-transfer reactions favor the WEAKER acid side: HCl + CH₃COO⁻ → CH₃COOH + Cl⁻ goes essentially to completion.",
        ],
      },
      { t: "eq", latex: "K_w = [H^+][OH^-] = 1.0 \\times 10^{-14}\\ (25\\,^\\circ C)", caption: "True in EVERY aqueous solution — acid, base, or pure water. Know one ion concentration, get the other." },
      {
        t: "callout",
        tone: "info",
        title: "Lewis definitions (broader still)",
        text: "A [[lewis-acid-base|Lewis acid]] accepts an electron PAIR; a Lewis base donates one. BF₃ + NH₃ → F₃B–NH₃ is acid–base chemistry with no proton anywhere: boron's vacant p orbital takes nitrogen's [[lone-pair]]. Every Brønsted base is a Lewis base; metal ions hydrating in water act as Lewis acids.",
      },
      { t: "sim", sim: "bond-polarity", preset: "hcl", caption: "Structural root of acidity: the polar H–Cl bond lets water pry the proton loose. Compare H–F — MORE polar yet a weak acid, because the bond is far stronger (bond energy beats polarity for HX acids)." },
      {
        t: "misconception",
        text: "'Strong = concentrated.' Strength is the FRACTION ionized (a property of the substance); concentration is moles per liter (a property of the solution). 0.001 M HCl is dilute but strong; 12 M acetic acid is concentrated but weak.",
      },
      {
        t: "exam",
        text: "Identify conjugate pairs in any given equation (the pair test: differ by exactly one H⁺ AND charge by exactly 1). Classify strong/weak correctly — every equilibrium calculation in this unit depends on it.",
      },
    ],
  },

  /* ================================================================ 8.2 */
  "8.2": {
    id: "8.2",
    unit: 8,
    title: "pH and pOH of Strong Acids and Bases",
    objectives: [
      "Compute pH, pOH, [H⁺], [OH⁻] and convert between all four",
      "Handle polyprotic strong acids and Group 2 hydroxides",
      "Know when water's autoionization starts to matter",
    ],
    keyTerms: ["ph", "poh", "kw", "strong-acid", "acid", "base"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "[[ph|pH]] compresses the enormous range of hydrogen-ion concentrations into a friendly scale: $pH = -\\log[H^+]$, and its partner $pOH = -\\log[OH^-]$. At 25 °C the [[kw|water constant]] makes them sum to 14:",
      },
      { t: "eq", latex: "pH + pOH = 14 \\qquad [H^+] = 10^{-pH} \\qquad [OH^-] = K_w/[H^+]", caption: "Acidic: pH < 7 ([H⁺] > 10⁻⁷). Basic: pH > 7. Neutral: pH = 7 exactly at 25 °C." },
      {
        t: "example",
        title: "Strong acid and strong base, side by side",
        steps: [
          "**0.0025 M HCl** (strong, monoprotic): [H⁺] = 0.0025 M → pH = −log(2.5×10⁻³) = 2.60; pOH = 11.40.",
          "**0.0030 M Ba(OH)₂** (strong base, TWO OH⁻ per formula): [OH⁻] = 2 × 0.0030 = 0.0060 M.",
          "pOH = −log(6.0×10⁻³) = 2.22 → pH = 11.78.",
        ],
        answer: "The Ba(OH)₂ multiplier (×2) and H₂SO₄'s first-proton logic are where strong-base problems live or die. Count hydroxides per formula unit.",
      },
      {
        t: "callout",
        tone: "warning",
        title: "Very dilute acids",
        text: "For 10⁻⁸ M HCl, 'pH = 8' is wrong — that would make an acid basic! Water's own [H⁺] ≈ 10⁻⁷ dominates; the true pH is just under 7 (~6.98). Rule of thumb: if acid concentration < ~10⁻⁶ M, autoionization of water matters. AP rarely demands the full quadratic — but recognizing the trap is fair game.",
      },
      {
        t: "list",
        items: [
          "Each pH unit = 10× change in [H⁺]: pH 3 is TEN times more acidic than pH 4, 100× more than pH 5.",
          "Diluting a strong acid 10× raises pH by exactly 1 (until ~7 approaches).",
          "Mixtures: total moles H⁺ (or OH⁻) ÷ total volume — moles are additive, concentrations are not.",
        ],
      },
      {
        t: "misconception",
        text: "'pH can't be negative or above 14.' 2 M HCl has pH = −0.3; 2 M NaOH has pH ≈ 14.3. The scale is a log, not a fence. Also 'neutral pH is always 7' — Kw grows with temperature, so neutral pH = 6.14 at 100 °C (still [H⁺] = [OH⁻]).",
      },
      {
        t: "exam",
        text: "Four-way conversions (pH ↔ pOH ↔ [H⁺] ↔ [OH⁻]) with significant figures: pH decimal places = concentration sig figs (0.0025 M, two sig figs → pH 2.60, two decimals). Calculator slip-ups are the main point-killer here.",
      },
    ],
  },

  /* ================================================================ 8.3 */
  "8.3": {
    id: "8.3",
    unit: 8,
    title: "Weak Acid and Base Equilibria",
    objectives: [
      "Write Ka/Kb expressions and use ICE tables to find pH of weak acids/bases",
      "Apply the small-x approximation and check it",
      "Relate Ka, Kb, and Kw for conjugate pairs",
    ],
    keyTerms: ["weak-acid", "weak-base", "ka", "kb", "kw", "ice-table", "ph", "conjugate-pair", "percent-ionization"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Weak acids ionize partially: $HA \\rightleftharpoons H^+ + A^-$ with $K_a = \\frac{[H^+][A^-]}{[HA]}$. Typical Ka values (10⁻³–10⁻¹⁰) mean [HA] barely budges — perfect small-x territory. Water is excluded (liquid solvent).",
      },
      {
        t: "example",
        title: "pH of 0.10 M acetic acid (Ka = 1.8 × 10⁻⁵)",
        steps: [
          "ICE: [HA] = 0.10 − x, [H⁺] = [A⁻] = x.",
          "$1.8\\times10^{-5} = x^2/(0.10 - x)$. Assume x ≪ 0.10: $x^2 = 1.8\\times10^{-6}$.",
          "x = 1.34 × 10⁻³ M = [H⁺]. Check: 1.34×10⁻³/0.10 = 1.3% < 5% ✓.",
          "pH = −log(1.34×10⁻³) = 2.87.",
        ],
        answer: "pH 2.87 — compare 0.10 M HCl at pH 1.00. Same concentration, ~75× less H⁺: that's 'weak'. [[percent-ionization|Percent ionization]] = 1.3%, and it RISES as the solution gets more dilute.",
      },
      { t: "eq", latex: "K_a \\times K_b = K_w = 1.0\\times10^{-14} \\qquad pK_a + pK_b = 14", caption: "For any conjugate pair: the stronger the acid, the weaker its conjugate base — quantitatively." },
      {
        t: "key",
        term: "Weak bases run the same machine",
        text: "$NH_3 + H_2O \\rightleftharpoons NH_4^+ + OH^-$ with $K_b = 1.8\\times10^{-5}$: ICE with x = [OH⁻], solve $x^2/0.10 = K_b$, get pOH FIRST, then pH = 14 − pOH. Anion bases work identically: $A^- + H_2O \\rightleftharpoons HA + OH^-$ with Kb = Kw/Ka.",
      },
      {
        t: "callout",
        tone: "info",
        title: "Polyprotic acids: first step wins",
        text: "H₃PO₄ ionizes in stages with Ka₁ ≫ Ka₂ ≫ Ka₃ (10³–10⁵× apart). For pH purposes, use Ka₁ ONLY — later steps contribute negligible H⁺ (and their suppression by the first step's product makes them smaller still).",
      },
      {
        t: "misconception",
        text: "'Weak acids don't conduct / aren't corrosive.' Partial ionization still yields real H⁺ (and 1.3 mM ions conduct). And 'Ka small = pH high' ignores concentration: a very concentrated weak acid can beat a dilute strong acid's pH — always run the ICE table.",
      },
      {
        t: "exam",
        text: "Guaranteed FRQ terrain: pH of weak acid/base (ICE + 5% check), Ka from measured pH (reverse ICE: x = 10⁻ᵖᴴ, then Ka = x²/(C₀−x)), and conjugate-pair conversions Ka↔Kb.",
      },
    ],
  },

  /* ================================================================ 8.4 */
  "8.4": {
    id: "8.4",
    unit: 8,
    title: "Acid–Base Reactions and Buffers",
    objectives: ["Predict products and extent of acid–base reactions", "Recognize what makes a buffer and preview its action"],
    keyTerms: ["neutralization", "acid", "base", "buffer", "conjugate-pair", "net-ionic-equation"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Acid + base reactions go in the direction that forms the WEAKER acid and weaker base, and they're [[stoichiometry]] problems first: they run essentially to completion, so treat them with moles (limiting-reactant style), THEN handle whatever equilibrium remains. A [[buffer]] is what remains when a weak acid and its conjugate base coexist in comparable amounts — the mixture that resists pH change (8.8 makes it quantitative).",
      },
      {
        t: "table",
        headers: ["Combination", "Reaction character", "Resulting solution"],
        rows: [
          ["Strong acid + strong base", "H⁺ + OH⁻ → H₂O, complete", "neutral at equivalence (pH 7)"],
          ["Weak acid + strong base", "HA + OH⁻ → A⁻ + H₂O, complete", "basic at equivalence (A⁻ hydrolyzes)"],
          ["Strong acid + weak base", "H⁺ + B → BH⁺, complete", "acidic at equivalence (BH⁺ hydrolyzes)"],
          ["Weak acid + weak base", "small K, equilibrium-limited", "depends on Ka vs Kb"],
        ],
      },
      {
        t: "callout",
        tone: "info",
        title: "Half-neutralized = born buffer",
        text: "Add exactly enough strong base to neutralize HALF the weak acid: moles HA remaining = moles A⁻ formed → a 1:1 buffer with pH = pKa. This is the standard recipe and the midpoint of every titration curve (8.5).",
      },
      {
        t: "exam",
        text: "'Does a buffer form when…?' — yes when weak acid + its conjugate partner coexist after the stoichiometry settles (e.g. 0.1 mol CH₃COOH + 0.05 mol NaOH → half-neutralized buffer; HCl + NaCl → no buffer, both strong-family).",
      },
    ],
  },

  /* ================================================================ 8.5 */
  "8.5": {
    id: "8.5",
    unit: 8,
    title: "Acid–Base Titrations",
    objectives: [
      "Predict titration curve shape for strong/strong, weak/strong combinations",
      "Locate equivalence point, half-equivalence point, and buffer region on the curve",
      "Choose indicators by pKa matching",
    ],
    keyTerms: ["titration", "titration-curve", "equivalence-point", "indicator", "buffer", "ka", "ph", "stoichiometry", "henderson-hasselbalch"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "A [[titration-curve|titration curve]] plots pH vs titrant volume — and its shape is a story in four acts: initial pH (from the analyte's strength), [[buffer|buffer region]] (weak analytes only — gentle slope), the steep equivalence jump, and the excess-titrant plateau (dominated by leftover strong reagent).",
      },
      {
        t: "table",
        headers: ["Curve feature", "Strong acid + strong base", "Weak acid + strong base"],
        rows: [
          ["Initial pH", "very low (−log C₀)", "higher (ICE with Ka)"],
          ["Buffer region", "none", "yes — flat stretch before equivalence"],
          ["Half-equivalence point", "—", "pH = pKa exactly (HA = A⁻)"],
          ["Equivalence pH", "7.00", "> 7 (conjugate base A⁻ hydrolyzes)"],
          ["Steep jump size", "huge (≈ pH 3→11)", "smaller, centered higher"],
          ["Beyond equivalence", "excess OH⁻ sets pH", "same — excess titrant always wins"],
        ],
      },
      {
        t: "key",
        term: "Equivalence ≠ endpoint ≠ neutral",
        text: "[[equivalence-point|Equivalence point]]: stoichiometric moles match (n_OH⁻ added = n_HA started). Endpoint: the [[indicator]] flips — chosen to coincide with equivalence. Neutral (pH 7): only guaranteed for strong/strong. Weak-acid equivalence solutions are BASIC; weak-base equivalence solutions are ACIDIC.",
      },
      {
        t: "example",
        title: "Reading a weak-acid curve",
        steps: [
          "25.0 mL of unknown HA titrated with 0.100 M NaOH; equivalence at 30.0 mL, and pH = 4.74 at 15.0 mL.",
          "Moles base at equivalence: 0.0300 L × 0.100 M = 3.00 × 10⁻³ mol = moles HA.",
          "[HA] initial = 3.00×10⁻³ / 0.0250 = 0.120 M.",
          "15.0 mL is HALF-equivalence → pH = pKa = 4.74 → Ka = 1.8 × 10⁻⁵ (it's acetic acid!).",
        ],
        answer: "Half-equivalence point hands you pKa for free — the single most exploited feature on AP titration curves.",
      },
      {
        t: "callout",
        tone: "info",
        title: "Choosing the indicator",
        text: "An indicator is a weak acid whose conjugate base is a different color; it flips over ~pH = pKa ± 1. Match the indicator's transition range to the curve's STEEP SECTION: phenolphthalein (8.2–10) for weak-acid/strong-base; methyl red (4.4–6.2) for weak-base/strong-acid; anything works for strong/strong.",
      },
      {
        t: "misconception",
        text: "'Equivalence point is always pH 7.' Only strong/strong. At weak-acid equivalence, ALL HA became A⁻ — a weak base — so pH ≈ 8–9. Compute it: treat A⁻ with Kb = Kw/Ka at its diluted concentration.",
      },
      {
        t: "exam",
        text: "Long FRQ: curve sketch/interpretation, calculate analyte concentration, find Ka from half-equivalence, justify indicator choice, and compute pH at selected volumes (initial / buffer region via [[henderson-hasselbalch]] / equivalence via hydrolysis / beyond via excess strong reagent).",
      },
    ],
  },

  /* ================================================================ 8.6 */
  "8.6": {
    id: "8.6",
    unit: 8,
    title: "Molecular Structure of Acids and Bases",
    objectives: ["Predict relative acid strength from bond polarity, bond strength, and conjugate-base stability"],
    keyTerms: ["acid-structure", "bond-polarity", "electronegativity", "resonance", "weak-acid", "strong-acid"],
    relatedSims: ["bond-polarity"],
    blocks: [
      {
        t: "p",
        text: "Acid strength = how readily H⁺ leaves = how stable the conjugate base is. Three structural levers ([[acid-structure]]):",
      },
      {
        t: "list",
        items: [
          "**Binary HX acids, down a group**: bond STRENGTH dominates — HF (weak) < HCl < HBr < HI (strongest): bigger atoms make longer, weaker H–X bonds despite lower [[electronegativity|polarity]].",
          "**Binary HX, across a period**: polarity dominates — CH₄ < NH₃ < H₂O < HF.",
          "**Oxoacids (H–O–Y)**: electronegativity and NUMBER of oxygens on Y pull electron density from O–H — HClO₄ > HClO₃ > HClO₂ > HClO; H₂SO₄ > H₂SO₃; HNO₃ > H₃BO₃.",
          "**Carboxylic acids**: [[resonance]]-stabilized conjugate base (RCOO⁻ spreads −1 over two oxygens) makes them far stronger than alcohols (RO⁻ holds the charge on one O). Electron-withdrawing neighbors boost it further: ClCH₂COOH > CH₃COOH.",
        ],
      },
      { t: "sim", sim: "bond-polarity", preset: "hcl", caption: "Bond polarity in 3-D: the H–Cl dipole primes the proton for hand-off to water. But remember HF is MORE polar and still weak — bond strength overrides polarity down the halogen group." },
      {
        t: "exam",
        text: "Rank-acids FRQ: name the governing factor for the comparison at hand (same row → polarity; same group → bond strength; oxoacids → O count/EN; conjugate-base resonance → stability).",
      },
    ],
  },

  /* ================================================================ 8.7 */
  "8.7": {
    id: "8.7",
    unit: 8,
    title: "pH and pKa",
    objectives: ["Use the p-scale fluently: pKa, pKb, pH as −log quantities", "Compare acid strengths via pKa"],
    keyTerms: ["ka", "ph", "weak-acid", "conjugate-pair", "buffer", "henderson-hasselbalch"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "The p-operator is just $-\\log_{10}$: $pK_a = -\\log K_a$. Because logs flip order, SMALLER pKa = LARGER Ka = STRONGER acid. Acetic acid pKa 4.74 vs formic 3.74: formic is 10× stronger. pKa also predicts proton-transfer direction: protons flow from the lower-pKa (stronger) acid to the higher-pKa acid's conjugate base.",
      },
      {
        t: "list",
        items: [
          "pKa + pKb = 14 for conjugate pairs (25 °C).",
          "At pH = pKa, exactly half the acid is ionized ([HA] = [A⁻]) — the buffer midpoint.",
          "pH < pKa → HA form dominates; pH > pKa → A⁻ dominates. (Blood at 7.4 vs acetic pKa 4.74: acetate exists essentially all as A⁻.)",
        ],
      },
      {
        t: "exam",
        text: "'Which species predominates at pH 9?' compare pH to pKa. This logic underlies indicators, amino-acid charge states, and buffer design.",
      },
    ],
  },

  /* ================================================================ 8.8 */
  "8.8": {
    id: "8.8",
    unit: 8,
    title: "Properties of Buffers",
    objectives: [
      "Explain buffer action with Le Châtelier and the common-ion effect",
      "Compute buffer pH with Henderson–Hasselbalch and track added strong acid/base",
      "Relate buffer composition to pH and effectiveness",
    ],
    keyTerms: ["buffer", "buffer-capacity", "common-ion-effect", "henderson-hasselbalch", "ka", "le-chatelier", "conjugate-pair", "ph", "titration"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "A [[buffer]] contains a weak acid HA and its conjugate base A⁻ in comparable amounts — a two-way chemical sponge. Add strong acid: the H⁺ is mopped up by A⁻ (→ HA). Add strong base: the OH⁻ is neutralized by HA (→ A⁻ + H₂O). Either way the RATIO [A⁻]/[HA] shifts only slightly, so pH shifts only slightly. This is the [[common-ion-effect|common-ion effect]] plus [[le-chatelier]] doing useful work.",
      },
      { t: "eq", latex: "pH = pK_a + \\log\\frac{[A^-]}{[HA]}", caption: "Henderson–Hasselbalch: pH tracks the conjugate ratio, offset from pKa. Equal amounts → pH = pKa exactly." },
      {
        t: "example",
        title: "Buffer before and after a strong-acid hit",
        steps: [
          "Buffer: 0.50 L containing 0.20 M CH₃COOH and 0.20 M CH₃COONa (pKa = 4.74). Initial pH = 4.74 + log(1) = 4.74.",
          "Moles present: 0.100 mol HA, 0.100 mol A⁻. Add 0.010 mol HCl (volume unchanged).",
          "H⁺ + A⁻ → HA: A⁻ = 0.090 mol, HA = 0.110 mol.",
          "New pH = 4.74 + log(0.090/0.110) = 4.74 − 0.087 = 4.65.",
        ],
        answer: "pH moved 0.09 units. The same 0.010 mol HCl in 0.50 L pure water: [H⁺] = 0.020 M → pH 1.70, a 5.3-unit crash. Buffers convert insults into ratios.",
      },
      {
        t: "callout",
        tone: "info",
        title: "Do buffer math in MOLES",
        text: "Added strong acid/base changes the mole inventory of HA and A⁻ — run stoichiometry on moles first, THEN take the ratio (volumes cancel when both species share the solution, so mole ratios may be used directly in H–H).",
      },
      {
        t: "key",
        term: "Buffer capacity and range",
        text: "[[buffer-capacity|Capacity]] = how much strong acid/base the buffer absorbs before breaking — set by the ABSOLUTE amounts of HA and A⁻ (1.0 M/1.0 M buffer outlasts 0.1 M/0.1 M at the same pH). Useful range: pH = pKa ± 1, where the ratio stays between 1:10 and 10:1. Choose the acid whose pKa is closest to your target pH.",
      },
      {
        t: "misconception",
        text: "'Buffers keep pH perfectly constant.' They RESIST change — the ratio still moves, so pH still drifts a little (4.74 → 4.65 above). Also: 'any acid + its salt is a buffer' — STRONG acid + conjugate (HCl + NaCl) is not; Cl⁻ has no proton-grabbing power (Kb = Kw/Ka_strong ≈ 0).",
      },
      {
        t: "exam",
        text: "The buffer FRQ trifecta: (1) compute initial pH with H–H; (2) recompute after added strong acid/base using a mole table; (3) explain capacity/range or design a buffer ('mix 0.10 mol propanoic acid with 0.05 mol NaOH → half-neutralized, pH = pKa = 4.89'). Blood's bicarbonate system is the favorite real-world frame.",
      },
    ],
  },

  /* ================================================================ 8.9 */
  "8.9": {
    id: "8.9",
    unit: 8,
    title: "Henderson–Hasselbalch Equation",
    objectives: ["Derive H–H from Ka and apply it to buffers and titration midpoints"],
    keyTerms: ["henderson-hasselbalch", "buffer", "ka", "ph", "titration-curve"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Take $K_a = [H^+][A^-]/[HA]$, solve for [H⁺], and apply −log to both sides — out falls $pH = pK_a + \\log([A^-]/[HA])$. It's the [[ka]] expression wearing a logarithm, valid whenever the equilibrium approximation holds (buffer solutions, titration buffer regions).",
      },
      {
        t: "list",
        items: [
          "Ratio = 1 → pH = pKa (half-equivalence point of a [[titration-curve|titration]]).",
          "Ratio = 10 → pH = pKa + 1; ratio = 0.1 → pH = pKa − 1 (edges of the useful [[buffer]] range).",
          "In titration buffer regions, plug in current moles of HA and A⁻ from the stoichiometry table.",
        ],
      },
      {
        t: "exam",
        text: "'Find the ratio needed for pH 5.00 with acetic acid (pKa 4.74)': log(ratio) = 0.26 → [A⁻]/[HA] = 1.8. Buffer-design questions are this one line.",
      },
    ],
  },

  /* ================================================================ 8.10 */
  "8.10": {
    id: "8.10",
    unit: 8,
    title: "Buffer Capacity",
    objectives: ["Distinguish capacity from pH; choose buffer compositions for a task"],
    keyTerms: ["buffer-capacity", "buffer", "henderson-hasselbalch", "ph"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Two 1-L buffers can share pH 4.74 yet differ 10× in [[buffer-capacity|capacity]]: 0.10 M HA + 0.10 M A⁻ absorbs ~0.05 mol of strong acid before collapsing; 1.0 M + 1.0 M absorbs ~0.5 mol. Capacity = inventory of both buffer components; pH = their RATIO. Capacity is spent when one component is nearly consumed — then pH swings violently (the titration curve's steep section IS exhausted-buffer territory).",
      },
      {
        t: "example",
        title: "Which buffer survives the insult?",
        steps: [
          "Buffer A: 0.050 mol HA + 0.050 mol A⁻; Buffer B: 0.50 mol HA + 0.50 mol A⁻. Add 0.040 mol NaOH to each.",
          "Added base consumes HA in both: A → HA 0.010 mol, A⁻ 0.090 mol; ratio 9:1 → pH = pKa + 0.95.",
          "B: HA 0.46, A⁻ 0.54 → ratio 1.17 → pH = pKa + 0.07.",
        ],
        answer: "Same insult: A swings ~0.95 pH units (80% of its acid consumed), B barely moves. Design rule: keep expected acid/base load well under the component inventory.",
      },
      {
        t: "exam",
        text: "'Which solution has the greatest buffer capacity?' → highest TOTAL concentration of the conjugate pair (with ratio near 1 for max efficiency at the target pH).",
      },
    ],
  },

  /* ================================================================ 8.11 */
  "8.11": {
    id: "8.11",
    unit: 8,
    title: "pH and Solubility",
    objectives: ["Compute solubility of hydroxides/basic salts at given pH", "Predict selective precipitation by pH control"],
    keyTerms: ["ksp", "solubility", "ph", "poh", "common-ion-effect", "le-chatelier", "precipitation"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "7.13 with numbers: for M(OH)₂ salts, pH FIXES [OH⁻], so [[ksp|Ksp]] directly sets the maximum dissolved metal: $[M^{2+}]_{max} = K_{sp}/[OH^-]^2$. At pH 10 (pOH 4, [OH⁻] = 10⁻⁴), Mg(OH)₂ (Ksp = 1.8×10⁻¹¹) allows [Mg²⁺] = 1.8×10⁻¹¹/10⁻⁸ = 1.8×10⁻³ M — but at pH 12, only 1.8×10⁻⁷ M. Raising pH precipitates the hydroxide; acid redissolves it.",
      },
      {
        t: "list",
        items: [
          "Selective precipitation: with two metals of different Ksp hydroxides, tune pH so one exceeds its Ksp while the other stays dissolved.",
          "Carbonates/sulfides/phosphates behave alike — basic anions removed by H⁺ → more dissolves.",
          "Chlorides/bromides/iodides/nitrates: pH-independent (anions of strong acids).",
        ],
      },
      {
        t: "exam",
        text: "'Calculate [Fe²⁺] remaining at pH 9.00 given Ksp(Fe(OH)₂)' — two lines: pOH → [OH⁻] → Ksp division. Explain-the-trend versions want [[le-chatelier]] + the net ionic equation of the anion's protonation.",
      },
    ],
  },

  /* ================================================================ 8.12 */
  "8.12": {
    id: "8.12",
    unit: 8,
    title: "Titrations and Solubility Equilibria",
    objectives: ["Analyze precipitation titrations and their curves"],
    keyTerms: ["titration", "ksp", "precipitation", "equivalence-point", "titration-curve"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Titrating Cl⁻ with Ag⁺ precipitates AgCl continuously; the curve plots pAg (or pCl) vs volume instead of pH. Before equivalence, excess Cl⁻ keeps [Ag⁺] tiny (via [[ksp|Ksp]); AT equivalence, [Ag⁺] = [Cl⁻] = √Ksp; beyond, added Ag⁺ dominates directly. The jump at equivalence is steeper for smaller Ksp — exactly like stronger-contrast acid curves for weaker acids.",
      },
      {
        t: "example",
        title: "Midpoint calculation",
        steps: [
          "Titrate 50.0 mL of 0.050 M Cl⁻ with 0.050 M Ag⁺ (Ksp = 1.8×10⁻¹⁰); equivalence at 50.0 mL.",
          "At equivalence: [Ag⁺] = √(1.8×10⁻¹⁰) = 1.34×10⁻⁵ M → pAg = 4.87.",
          "At 25.0 mL (half): half the Cl⁻ remains, ≈0.0167 M after dilution → [Ag⁺] = Ksp/0.0167 = 1.1×10⁻⁸ → pAg ≈ 7.96.",
        ],
        answer: "The curve climbs from high pAg (low [Ag⁺]) and plunges past equivalence — mirror image of a pH curve's fall.",
      },
      {
        t: "exam",
        text: "Rarer on the AP than acid–base titrations, but the reasoning pattern (Q vs Ksp governing the whole curve, equivalence = √Ksp) is fair game in MCQs.",
      },
    ],
  },

  /* ================================================================ 8.13 */
  "8.13": {
    id: "8.13",
    unit: 8,
    title: "Lewis Acids and Bases",
    objectives: ["Identify Lewis acids/bases in reactions without proton transfer", "Connect Lewis behavior to Lewis structures and orbitals"],
    keyTerms: ["lewis-acid-base", "lone-pair", "octet-rule", "expanded-octet", "hybridization"],
    relatedSims: ["lewis-studio", "molecule-builder"],
    blocks: [
      {
        t: "p",
        text: "The [[lewis-acid-base|Lewis definition]] generalizes acid–base chemistry to electron PAIRS: a Lewis base donates a [[lone-pair]]; a Lewis acid accepts one into an empty orbital. BF₃ (boron with six electrons — hungry [[octet-rule|octet]]) + :NH₃ → F₃B–NH₃ forms a coordinate covalent bond with no proton in sight.",
      },
      {
        t: "list",
        items: [
          "Lewis acids: electron-deficient species (BF₃, AlCl₃), small highly-charged cations (Al³⁺, Fe³⁺ — their hydration IS Lewis adduct formation), molecules expandable beyond the octet (SF₄, CO₂ accepting OH⁻).",
          "Lewis bases: anything with a lone pair — NH₃, H₂O, OH⁻, halides, amines.",
          "Every Brønsted acid–base event is Lewis-flavored: H⁺ (empty 1s) accepts the base's lone pair.",
        ],
      },
      { t: "sim", sim: "lewis-studio", preset: "bf3", caption: "BF₃ in the Lewis studio: boron's sextet — an incomplete octet — is precisely what makes it a Lewis acid. Its trigonal planar shape exposes the empty p orbital perpendicular to the plane." },
      {
        t: "exam",
        text: "'Identify the Lewis acid in: Ag⁺ + 2NH₃ → Ag(NH₃)₂⁺' — Ag⁺ accepts both lone pairs. Complex-ion formation, catalysis (AlCl₃ in organic reactions), and gas scrubbing (CO₂ + OH⁻) are the recurring contexts.",
      },
    ],
  },
};
