import type { Lesson } from "../lessonTypes";

/**
 * Unit 5 — Kinetics.
 * Full lessons: 5.2, 5.5, 5.6. Concise but complete: the rest.
 */
export const unit5: Record<string, Lesson> = {
  /* ================================================================ 5.1 */
  "5.1": {
    id: "5.1",
    unit: 5,
    title: "Reaction Rates",
    objectives: ["Define rate from concentration–time data", "Relate rates of different species through stoichiometry"],
    keyTerms: ["reaction-rate", "rate-law", "stoichiometry"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "[[reaction-rate|Rate]] is the change in concentration per unit time: $rate = -\\Delta[R]/\\Delta t = +\\Delta[P]/\\Delta t$. Reactants decrease (negative Δ[R], so we add a minus sign to make rate positive); products increase. Rates are fastest at the start (most reactant) and slow toward zero as reactants deplete.",
      },
      { t: "eq", latex: "aA + bB \\rightarrow cC:\\qquad rate = -\\tfrac{1}{a}\\tfrac{\\Delta[A]}{\\Delta t} = -\\tfrac{1}{b}\\tfrac{\\Delta[B]}{\\Delta t} = +\\tfrac{1}{c}\\tfrac{\\Delta[C]}{\\Delta t}", caption: "Divide each species' rate by its coefficient to get THE rate of the reaction." },
      {
        t: "example",
        title: "Stoichiometric rate linking",
        steps: ["For N₂ + 3H₂ → 2NH₃, H₂ disappears at 0.090 M/s.", "Rate = (1/3)(0.090) = 0.030 M/s.", "NH₃ appears at 2 × 0.030 = 0.060 M/s."],
        answer: "H₂ falls 3× faster than N₂; NH₃ rises 2× the reaction rate. Always normalize by coefficients.",
      },
      {
        t: "exam",
        text: "Graph reading: slope of a tangent line on [A] vs t = instantaneous rate; average rate = chord slope between two points. Units: M/s always.",
      },
    ],
  },

  /* ================================================================ 5.2 */
  "5.2": {
    id: "5.2",
    unit: 5,
    title: "Introduction to Rate Law",
    objectives: [
      "Write rate = k[A]^m[B]^n and determine m, n from initial-rate data",
      "Distinguish rate law from stoichiometry; state overall order and k units",
    ],
    keyTerms: ["rate-law", "reaction-order", "rate-constant", "reaction-rate", "elementary-step"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "The [[rate-law|rate law]] says how rate responds to concentration: $rate = k[A]^m[B]^n$. The exponents m and n are the [[reaction-order|orders]] — determined ONLY from experiment, never read off the balanced equation (unless the reaction is a single [[elementary-step|elementary step]]). The [[rate-constant]] k absorbs temperature and activation energy.",
      },
      {
        t: "key",
        term: "The method of initial rates",
        text: "Compare experiments where ONE concentration doubles while others stay fixed. Rate unchanged → order 0 in that species. Rate doubles → order 1. Rate quadruples → order 2. Mathematically: $\\frac{rate_2}{rate_1} = \\left(\\frac{[A]_2}{[A]_1}\\right)^m$, solve for m.",
      },
      {
        t: "example",
        title: "Full initial-rate determination",
        steps: [
          "Data: Exp 1 [A]=0.10, [B]=0.10, rate=2.0×10⁻³; Exp 2 [A]=0.20, [B]=0.10, rate=4.0×10⁻³; Exp 3 [A]=0.10, [B]=0.30, rate=1.8×10⁻² (M/s).",
          "Exp 1→2: [A] doubles, rate doubles (×2) → 2^m = 2 → m = 1.",
          "Exp 1→3: [B] triples, rate ×9 → 3^n = 9 → n = 2.",
          "Rate law: $rate = k[A][B]^2$; overall order = 1 + 2 = 3.",
          "Solve k from Exp 1: k = 2.0×10⁻³ / (0.10 × 0.10²) = 2.0 M⁻²s⁻¹.",
        ],
        answer: "rate = k[A][B]², third order overall, k = 2.0 M⁻²·s⁻¹. Check k's units: M/s ÷ (M·M²) = M⁻²s⁻¹.",
      },
      {
        t: "callout",
        tone: "info",
        title: "Units of k by overall order",
        text: "k always makes rate come out M/s: 0th order → M/s; 1st → s⁻¹; 2nd → M⁻¹s⁻¹; 3rd → M⁻²s⁻¹. On the AP exam, correct k units with a numerically correct k earns the point.",
      },
      {
        t: "misconception",
        text: "'Exponents = coefficients.' For most reactions they don't match — the rate law is experimental. 2N₂O₅ → 4NO₂ + O₂ is FIRST order in N₂O₅ despite the coefficient 2. Only elementary steps have coefficient-orders.",
      },
      {
        t: "exam",
        text: "The initial-rate table is a guaranteed FRQ. Method: pick experiment pairs changing one reactant, state the ratio argument explicitly ('doubling [B] quadruples the rate, so the reaction is second order in B'), write the law, compute k with units.",
      },
    ],
  },

  /* ================================================================ 5.3 */
  "5.3": {
    id: "5.3",
    unit: 5,
    title: "Concentration Changes over Time",
    objectives: ["Use integrated rate laws for 0th, 1st, 2nd order reactions", "Compute half-lives and identify order from linear plots"],
    keyTerms: ["integrated-rate-law", "reaction-order", "rate-constant"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "[[integrated-rate-law|Integrated rate laws]] convert the rate law into concentration-vs-time predictions — and their linear forms let you diagnose order from data:",
      },
      {
        t: "table",
        headers: ["Order", "Integrated law", "Linear plot", "Half-life"],
        rows: [
          ["0", "$[A]_t = -kt + [A]_0$", "[A] vs t straight", "$t_{1/2} = [A]_0/2k$"],
          ["1", "$\\ln[A]_t = -kt + \\ln[A]_0$", "ln[A] vs t straight", "$t_{1/2} = 0.693/k$ (constant!)"],
          ["2", "$1/[A]_t = kt + 1/[A]_0$", "1/[A] vs t straight", "$t_{1/2} = 1/(k[A]_0)$"],
        ],
      },
      {
        t: "callout",
        tone: "violet",
        title: "The half-life fingerprint",
        text: "Constant half-life as concentration falls ⟺ first order. This is why radioactive decay (Unit 1's [[isotope|carbon-14]] dating) is first order: each half-life halves what remains, independent of how much there was.",
      },
      {
        t: "example",
        title: "First-order decay",
        steps: ["k = 0.0231 s⁻¹. How long until [A] drops to 25% of initial?", "25% = two half-lives. t½ = 0.693/0.0231 = 30.0 s.", "t = 2 × 30.0 = 60.0 s. (Or directly: ln(0.25) = −0.0231 t → t = 60.0 s.)"],
        answer: "60 s. Fraction remaining after n half-lives = (1/2)ⁿ.",
      },
      {
        t: "exam",
        text: "'Which plot is linear?' MCQs and FRQ calculations from one data pair. Slope of ln[A] vs t = −k (negative); slope of 1/[A] vs t = +k.",
      },
    ],
  },

  /* ================================================================ 5.4 */
  "5.4": {
    id: "5.4",
    unit: 5,
    title: "Elementary Reactions",
    objectives: ["Define molecularity and connect it to order for single-step reactions"],
    keyTerms: ["elementary-step", "reaction-mechanism", "rate-law", "collision-theory"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "An [[elementary-step|elementary reaction]] is a single collision event — no hidden steps. Its molecularity (number of particles colliding) IS its order: unimolecular (A → products, rate = k[A]), bimolecular (A + B → products, rate = k[A][B]; 2A → products, rate = k[A]²). Termolecular events are rare — three-body simultaneous collisions almost never happen.",
      },
      {
        t: "callout",
        tone: "info",
        title: "Why this matters",
        text: "Real reactions are [[reaction-mechanism|mechanisms]] — sequences of elementary steps. The overall rate law comes from the SLOWEST step's molecularity, which is why experimental orders often differ from overall coefficients.",
      },
      {
        t: "exam",
        text: "Given a proposed mechanism, write each step's rate law from its molecularity — no experimental data needed for elementary steps (unlike overall reactions).",
      },
    ],
  },

  /* ================================================================ 5.5 */
  "5.5": {
    id: "5.5",
    unit: 5,
    title: "Collision Model",
    objectives: [
      "Explain rate effects of concentration, temperature, and surface area through collisions",
      "Define activation energy and use Maxwell–Boltzmann distributions to explain temperature's outsized effect",
    ],
    keyTerms: ["collision-theory", "activation-energy", "temperature", "reaction-rate", "arrhenius-equation", "catalyst", "kinetic-molecular-theory"],
    relatedSims: ["reaction-viewer"],
    blocks: [
      {
        t: "p",
        text: "[[collision-theory|Collision theory]]: particles must collide to react — but most collisions do nothing. A successful collision needs (1) enough energy to reach the [[activation-energy|activation energy]] $E_a$ (the barrier to breaking old bonds) and (2) the right orientation (the reactive sites must meet). Rate ∝ (collision frequency) × (energy fraction) × (orientation fraction).",
      },
      {
        t: "table",
        headers: ["Change", "Collision effect", "Why rate rises"],
        rows: [
          ["↑ concentration/pressure", "more particles per volume", "more frequent collisions"],
          ["↑ temperature", "faster particles AND (key!) bigger fraction above Eₐ", "both frequency and success rate rise — the energy-fraction effect dominates"],
          ["↑ surface area (solids)", "more exposed reactive sites", "more collision opportunities"],
          ["Add [[catalyst]]", "new lower-Eₐ pathway", "same collisions, much bigger success fraction"],
        ],
      },
      {
        t: "callout",
        tone: "violet",
        title: "The Maxwell–Boltzmann picture",
        text: "Molecular energies form a skewed distribution; the area to the RIGHT of Eₐ is the reactive fraction. Heating shifts the curve right and flattens it — the above-Eₐ tail grows exponentially, which is why a 10 °C rise often doubles or triples a rate even though average speed rises only ~2%. The [[arrhenius-equation|Arrhenius equation]] $k = Ae^{-E_a/RT}$ says exactly this.",
      },
      {
        t: "p",
        text: "Orientation matters most for complex molecules: NO + O₃ reacts readily (small, easy to align), but two branched organics must meet at just the right face — steric effects make the orientation factor tiny.",
      },
      {
        t: "example",
        title: "Reasoning task: why does refrigeration slow spoilage?",
        steps: [
          "Spoilage = biochemical reactions driven by molecular collisions.",
          "Cooling shrinks the fraction of collisions with energy ≥ Eₐ (exponential effect).",
          "Fewer successful collisions per second → slower reaction → slower spoilage.",
        ],
        answer: "Temperature controls the ENERGY FRACTION, not just frequency — that's the explanation that earns credit.",
      },
      {
        t: "misconception",
        text: "'Higher temperature makes rate rise because particles collide more often.' Frequency rises only ~2%; the reactive fraction can rise 100%+. The Boltzmann tail is the real story. Also: 'catalysts make reactions spontaneous' — no, they speed up reactions that were already favorable; they never change ΔG or equilibrium position (Topic 7.9).",
      },
      {
        t: "exam",
        text: "Explain-in-terms-of-collision-theory FRQs: name the changed variable, connect it to collision frequency / energy fraction / orientation, and conclude with rate. Sketching a before/after Maxwell–Boltzmann curve with Eₐ marked is gold for temperature and catalyst questions.",
      },
    ],
  },

  /* ================================================================ 5.6 */
  "5.6": {
    id: "5.6",
    unit: 5,
    title: "Reaction Energy Profile",
    objectives: [
      "Read potential-energy diagrams: reactants, transition state, activation energy, ΔH",
      "Compare forward/reverse barriers and relate Ea to rate",
    ],
    keyTerms: ["energy-profile", "activation-energy", "transition-state", "intermediate", "enthalpy", "reaction-mechanism", "catalyst"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "An [[energy-profile|energy profile]] plots potential energy along the reaction path. It shows everything kinetics and thermochemistry care about in one picture:",
      },
      {
        t: "list",
        ordered: true,
        items: [
          "**Reactants** at the left plateau, **products** at the right.",
          "**[[transition-state]]** at the peak — the highest-energy arrangement (bonds half-broken/half-formed). It is NOT an isolable species.",
          "**[[activation-energy|$E_a$]]** = height from reactants to the peak. Governs RATE.",
          "**ΔH** = products − reactants. Negative → [[exothermic]] (products lower); positive → [[endothermic]]. Governs energy released/absorbed.",
          "For multi-step mechanisms: a peak per step; valleys between peaks are [[intermediate]]s (real, transient species). The tallest peak belongs to the rate-determining step.",
        ],
      },
      {
        t: "callout",
        tone: "info",
        title: "Reverse-reaction barrier",
        text: "$E_{a,reverse} = E_{a,forward} - \\Delta H$. For an exothermic reaction (ΔH < 0), the reverse barrier is LARGER — the reverse reaction is slower at the same temperature. A catalyst redraws the profile with a lower peak (new pathway) but leaves reactant/product levels — and therefore ΔH — untouched.",
      },
      {
        t: "example",
        title: "Reading numbers off a diagram",
        steps: [
          "Reactants at 50 kJ, peak at 130 kJ, products at 20 kJ.",
          "Eₐ(forward) = 130 − 50 = 80 kJ.",
          "ΔH = 20 − 50 = −30 kJ (exothermic).",
          "Eₐ(reverse) = 130 − 20 = 110 kJ — the reverse reaction faces a bigger wall.",
        ],
        answer: "Fast-ish forward (moderate Ea), thermodynamically downhill, slow reverse. Profile reading is pure subtraction — but you must subtract the RIGHT pairs.",
      },
      {
        t: "misconception",
        text: "'Big negative ΔH means fast reaction.' Thermochemistry (ΔH, ΔG) says NOTHING about speed — that's [[activation-energy|Eₐ]]'s job. Diamond → graphite is spontaneous yet immeasurably slow (huge Ea). Thermodynamically favorable ≠ kinetically fast.",
      },
      {
        t: "exam",
        text: "Diagrams appear in MCQs (identify Ea, ΔH, intermediate vs transition state) and FRQs (draw the catalyzed profile on the same axes — lower peak(s), same endpoints). Label the rate-determining step as the highest barrier.",
      },
    ],
  },

  /* ================================================================ 5.7 */
  "5.7": {
    id: "5.7",
    unit: 5,
    title: "Reaction Mechanisms",
    objectives: ["Interpret multi-step mechanisms; identify intermediates and the rate-determining step"],
    keyTerms: ["reaction-mechanism", "elementary-step", "intermediate", "rate-law"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "A [[reaction-mechanism|mechanism]] is the step-by-step story: a sequence of [[elementary-step|elementary steps]] whose sum equals the overall balanced equation. Species produced in one step and consumed in a later one are [[intermediate|intermediates]] — they appear in the mechanism but NOT in the overall equation. The slowest step is the rate-determining step (RDS); it bottlenecks everything.",
      },
      {
        t: "example",
        title: "Mechanism bookkeeping",
        steps: [
          "Step 1 (slow): NO₂ + F₂ → NO₂F + F",
          "Step 2 (fast): NO₂ + F → NO₂F",
          "Sum: 2NO₂ + F₂ → 2NO₂F (the F atom cancels).",
        ],
        answer: "F is the intermediate; step 1 is the RDS; predicted rate law = k[NO₂][F₂] — from the slow step's molecularity.",
      },
      {
        t: "callout",
        tone: "info",
        title: "Valid, not proven",
        text: "A mechanism is consistent with the observed rate law, mass balance, and detected intermediates — it can be supported, never proven. Different mechanisms can predict the same rate law.",
      },
      {
        t: "exam",
        text: "'Identify the intermediate and write the rate law consistent with this mechanism' — intermediates cancel in the sum; the RDS gives the law. If the RDS involves an intermediate, expect Topic 5.8/5.9 machinery.",
      },
    ],
  },

  /* ================================================================ 5.8 */
  "5.8": {
    id: "5.8",
    unit: 5,
    title: "Mechanism and Rate Law",
    objectives: ["Check mechanisms against experimental rate laws", "Handle mechanisms with a fast equilibrium before the slow step"],
    keyTerms: ["reaction-mechanism", "rate-law", "elementary-step", "intermediate"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "The experimental [[rate-law|rate law]] is the judge of any proposed [[reaction-mechanism|mechanism]]. The predicted law comes from the rate-determining step — but if an [[intermediate]] appears there, it must be eliminated using a FAST EQUILIBRIUM preceding the slow step:",
      },
      {
        t: "example",
        title: "Fast equilibrium + slow step",
        steps: [
          "Step 1 (fast, reversible): NO + NO ⇌ N₂O₂ (K = [N₂O₂]/[NO]²)",
          "Step 2 (slow): N₂O₂ + H₂ → N₂O + H₂O",
          "RDS rate: k₂[N₂O₂][H₂] — contains the intermediate N₂O₂.",
          "Substitute from step 1 equilibrium: [N₂O₂] = K[NO]².",
          "rate = k₂K[NO]²[H₂] = k[NO]²[H₂] — matches the observed third-order law.",
        ],
        answer: "Intermediates never appear in final rate laws; the fast-equilibrium substitution converts them to reactant concentrations.",
      },
      {
        t: "exam",
        text: "FRQs give a mechanism and ask whether it's consistent with data: sum the steps, find the RDS, derive the law (substituting if needed), compare exponents with experiment.",
      },
    ],
  },

  /* ================================================================ 5.9 */
  "5.9": {
    id: "5.9",
    unit: 5,
    title: "Steady-State Approximation",
    objectives: ["Apply the steady-state assumption to reactive intermediates"],
    keyTerms: ["intermediate", "reaction-mechanism", "rate-law"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "When no single step is clearly slow, the **steady-state approximation** takes over: a reactive [[intermediate]] I forms and is consumed so rapidly that its concentration stays tiny and constant — $d[I]/dt \\approx 0$. Set (rate of formation of I) = (rate of consumption of I), solve for [I], and substitute into the product-formation rate.",
      },
      {
        t: "example",
        title: "Deriving a rate law by steady state",
        steps: [
          "Step 1: A → I (k₁); Step 2: I → A (k₋₁); Step 3: I + B → P (k₂).",
          "Steady state: k₁[A] = k₋₁[I] + k₂[I][B] → [I] = k₁[A] / (k₋₁ + k₂[B]).",
          "rate = k₂[I][B] = k₁k₂[A][B] / (k₋₁ + k₂[B]).",
          "Limiting cases: if k₂[B] ≫ k₋₁, rate ≈ k₁[A] (first order); if k₂[B] ≪ k₋₁, rate ≈ (k₁k₂/k₋₁)[A][B] (second order).",
        ],
        answer: "Steady-state derivations produce composite rate laws whose apparent order can shift with conditions — the mechanism hides inside k.",
      },
      {
        t: "exam",
        text: "AP-level treatment is qualitative-to-simple: recognize the assumption (intermediate concentration constant), set formation = consumption, solve algebraically. Full derivations are more common in general chemistry courses.",
      },
    ],
  },

  /* ================================================================ 5.10 */
  "5.10": {
    id: "5.10",
    unit: 5,
    title: "Multistep Reaction Energy Profile",
    objectives: ["Draw/read profiles with multiple peaks and valleys", "Distinguish transition states from intermediates on the curve"],
    keyTerms: ["energy-profile", "transition-state", "intermediate", "activation-energy", "reaction-mechanism"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Each [[elementary-step|step]] of a mechanism adds a peak ([[transition-state]]) to the [[energy-profile|profile]]; each [[intermediate]] sits in a valley between peaks. Count them: n steps → n peaks, n−1 intermediates. The highest peak (measured from the nearest preceding valley or the reactants, depending on the step's own barrier) marks the rate-determining step.",
      },
      {
        t: "list",
        items: [
          "Valleys = intermediates: real species with finite (if short) lifetimes — in principle detectable.",
          "Peaks = transition states: instantaneous bond-making/breaking arrangements — never detectable.",
          "Overall ΔH still = final products − initial reactants, regardless of the path's bumps.",
        ],
      },
      {
        t: "exam",
        text: "'How many intermediates? Which step is slowest? Sketch the catalyzed profile.' A catalyst lowers one or more peaks without moving endpoints or erasing intermediates' existence (it may add its own steps).",
      },
    ],
  },

  /* ================================================================ 5.11 */
  "5.11": {
    id: "5.11",
    unit: 5,
    title: "Catalysts",
    objectives: ["Explain how catalysts work and what they don't change", "Distinguish homogeneous, heterogeneous, and enzymatic catalysis"],
    keyTerms: ["catalyst", "activation-energy", "energy-profile", "reaction-rate", "reaction-mechanism"],
    relatedSims: ["reaction-viewer"],
    blocks: [
      {
        t: "p",
        text: "A [[catalyst]] speeds a reaction by providing an alternative [[reaction-mechanism|mechanism]] with lower [[activation-energy|activation energy]] — it participates (binds reactants, transfers atoms) but is regenerated, never consumed. On an [[energy-profile|energy profile]], the catalyzed path has lower peaks with identical reactant/product levels.",
      },
      {
        t: "table",
        headers: ["Type", "Phase", "Example"],
        rows: [
          ["Homogeneous", "same phase as reactants", "H⁺ catalyzing ester hydrolysis in solution"],
          ["Heterogeneous", "different phase — usually solid surface", "Pt/Rh in catalytic converters adsorbing exhaust gases; Ni hydrogenating oils"],
          ["Enzymatic", "biological, lock-and-key active sites", "catalase decomposing H₂O₂ millions of times per second"],
        ],
      },
      {
        t: "callout",
        tone: "warning",
        title: "What a catalyst does NOT do",
        text: "It does not change ΔH, ΔG, the equilibrium constant, or the equilibrium position — it accelerates forward AND reverse equally, reaching equilibrium sooner at the same composition. It cannot make an unfavorable reaction proceed.",
      },
      {
        t: "exam",
        text: "'A catalyst increases the yield' — false, it increases the RATE. Identify the catalyst in a mechanism (consumed early, reappears later; the reverse of an intermediate's pattern).",
      },
    ],
  },
};
