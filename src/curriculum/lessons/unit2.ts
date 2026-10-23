import type { Lesson } from "../lessonTypes";

/**
 * Unit 2 — Molecular and Ionic Compound Structure and Properties (full).
 */
export const unit2: Record<string, Lesson> = {
  /* ================================================================ 2.1 */
  "2.1": {
    id: "2.1",
    unit: 2,
    title: "Types of Chemical Bonds",
    objectives: [
      "Classify bonds (ionic, covalent, metallic) by electronegativity difference and electron behavior",
      "Explain each bond type at the particle level with Coulomb's law",
      "Connect bond type to observable properties (melting point, conductivity, brittleness)",
    ],
    keyTerms: ["chemical-bond", "ionic-bond", "covalent-bond", "metallic-bond", "electronegativity", "lattice-energy"],
    relatedSims: ["bond-polarity", "ionic-bonding"],
    blocks: [
      {
        t: "p",
        text: "All chemical bonds are the same physics — electrostatic attraction between positive nuclei and negative electrons — arranged three different ways. What differs is **where the electrons live**, decided mostly by the [[electronegativity|electronegativity]] gap between partners.",
      },
      {
        t: "table",
        headers: ["Type", "ΔEN", "Electron behavior", "Classic pair", "Signature properties"],
        rows: [
          ["[[ionic-bond|Ionic]]", "> 1.7", "Transferred → cations + anions in a lattice", "NaCl, MgO", "High mp, brittle, conduct when molten/dissolved"],
          ["[[covalent-bond|Covalent]]", "0.4–1.7 polar; < 0.4 nonpolar", "Shared between specific atoms", "H₂O, CH₄", "Discrete molecules, lower mp (molecular solids)"],
          ["[[metallic-bond|Metallic]]", "≈ 0 (both metals)", "Pooled — 'sea' of delocalized electrons", "Cu, Fe, brass", "Conduct as solids, malleable, lustrous"],
        ],
      },
      {
        t: "callout",
        tone: "violet",
        title: "It's a continuum, not three boxes",
        text: "No bond is 100% ionic — even in CsF electrons are only ~92% transferred (see the percent-ionic gauge in the bond lab). The ΔEN cutoffs (0.4 / 1.7) are AP rules of thumb for classifying, not laws of nature.",
      },
      {
        t: "p",
        text: "Ionic compounds are held by [[lattice-energy|lattice energy]] — Coulomb attraction across the whole crystal, $U \\propto q_+q_-/(r_+ + r_-)$. Double both charges (Mg²⁺O²⁻ vs Na⁺Cl⁻) and the lattice energy roughly quadruples: MgO melts at 2852 °C, NaCl at 801 °C.",
      },
      { t: "sim", sim: "bond-polarity", preset: "nacl", caption: "Slide between element pairs and watch the classification flip from covalent to ionic as ΔEN crosses 1.7. Try Na–Cl, then H–Cl, then Cl–Cl." },
      { t: "sim", sim: "ionic-bonding", preset: "mgo", caption: "Transfer electrons from Mg to O, then assemble the lattice — and compare Coulomb strength with NaCl (2×2 charges vs 1×1)." },
      {
        t: "misconception",
        text: "'Ionic compounds are made of molecules.' They aren't — NaCl is a formula unit describing a ratio in a giant lattice, not a discrete NaCl pair. That's why ionic equations use (s), (aq), and net ionic forms.",
      },
      {
        t: "exam",
        text: "A perennial FRQ: 'Solid NaCl does not conduct but molten/dissolved NaCl does. Explain.' Answer: in the lattice, ions are locked in position by Coulomb forces; melted or dissolved, the ions are mobile charge carriers. Electrons never do the conducting in ionic systems.",
      },
    ],
  },

  /* ================================================================ 2.2 */
  "2.2": {
    id: "2.2",
    unit: 2,
    title: "Intramolecular Force and Potential Energy",
    objectives: [
      "Read a bonding potential-energy curve: minimum = bond length, depth = bond energy",
      "Explain bond formation as attraction–repulsion balance",
      "Connect the curve to energy changes in breaking/forming bonds",
    ],
    keyTerms: ["potential-energy-curve", "bond-length", "bond-energy", "covalent-bond", "coulomb-law"],
    relatedSims: ["bond-polarity"],
    blocks: [
      {
        t: "p",
        text: "Bring two atoms together and two battles start: each nucleus attracts the other's electrons (pulling them together) while nucleus–nucleus and electron–electron repulsions push them apart. The [[potential-energy-curve|potential-energy curve]] records the outcome at every distance.",
      },
      {
        t: "list",
        items: [
          "**Far apart (right side)**: PE ≈ 0 — the atoms don't feel each other.",
          "**Approaching**: attraction dominates; PE falls — energy is RELEASED.",
          "**The minimum**: perfect balance. This distance is the [[bond-length|bond length]]; the depth is the [[bond-energy|bond energy]].",
          "**Too close (left side)**: nuclear repulsion explodes upward — PE spikes.",
        ],
      },
      {
        t: "callout",
        tone: "info",
        title: "Reading signs like a pro",
        text: "Forming a bond always RELEASES energy (ΔH negative — you 'fall into' the well). Breaking a bond always REQUIRES energy (ΔH positive — you climb out). Every 'why is this reaction exothermic?' question comes down to: bonds formed (releases) outweighed bonds broken (costs).",
      },
      { t: "sim", sim: "bond-polarity", preset: "hcl", caption: "Open the PE curve view and drag the distance slider: inside the minimum, repulsion spikes; outside, attraction pulls. The minimum's depth is the bond energy." },
      {
        t: "misconception",
        text: "'Strong bonds have high potential energy.' The opposite: a strong bond sits in a DEEPER well — more negative PE, more energy required to escape. Low (negative) PE = stable.",
      },
      {
        t: "exam",
        text: "MCQs show two curves (e.g. F₂ vs Cl₂) and ask which bond is longer/stronger: longer bond = minimum farther right; stronger bond = minimum deeper. Justifications invoke Coulomb's law and orbital overlap.",
      },
    ],
  },

  /* ================================================================ 2.3 */
  "2.3": {
    id: "2.3",
    unit: 2,
    title: "Bond Length and Strength",
    objectives: [
      "Relate bond order, bond length, and bond strength",
      "Use resonance to explain fractional bonds (equal lengths between single and double)",
    ],
    keyTerms: ["bond-length", "bond-energy", "resonance", "covalent-bond"],
    relatedSims: ["bond-polarity", "bond-length-lab", "lewis-studio"],
    blocks: [
      {
        t: "p",
        text: "More shared pairs pull nuclei closer and bind them tighter. For the same two atoms: **triple < double < single** in length; the reverse order in strength. Carbon–carbon: C–C 154 pm / 347 kJ/mol; C=C 134 pm / 614; C≡C 120 pm / 839.",
      },
      {
        t: "table",
        headers: ["Bond", "Length (pm)", "Energy (kJ/mol)"],
        rows: [
          ["C–C", "154", "347"], ["C=C", "134", "614"], ["C≡C", "120", "839"],
          ["C–H", "109", "413"], ["O–H", "96", "467"], ["N≡N", "110", "941"],
        ],
        caption: "N≡N's 941 kJ/mol is why atmospheric nitrogen is famously unreactive.",
      },
      {
        t: "p",
        text: "[[resonance|Resonance]] splits the difference: in carbonate (CO₃²⁻), each C–O bond is order 1⅓, and all three are identical in length — between a single and a double. X-ray data confirm what Lewis structures can only average.",
      },
      { t: "sim", sim: "bond-length-lab", preset: "c2h4", caption: "Start with ethene: select C=C and C–H to compare their lengths, then add acetylene or carbonate. Drag the internuclear-distance control and watch the energy curve move through its minimum." },
      { t: "sim", sim: "lewis-studio", preset: "co3", caption: "Flip through carbonate's resonance forms — then remember the real molecule has three identical 1⅓ bonds." },
      {
        t: "exam",
        text: "Justification template: 'The bonds in NO₃⁻ are shorter than a N–O single bond because resonance delocalizes the double-bond character equally over all three bonds (average order 4/3).'",
      },
    ],
  },

  /* ================================================================ 2.4 */
  "2.4": {
    id: "2.4",
    unit: 2,
    title: "Bond Energy",
    objectives: [
      "Estimate reaction enthalpy from average bond enthalpies",
      "Explain why the estimate is approximate",
    ],
    keyTerms: ["bond-energy", "enthalpy", "exothermic", "endothermic"],
    relatedSims: ["bond-polarity", "reaction-viewer"],
    blocks: [
      {
        t: "p",
        text: "Since breaking bonds costs energy and forming bonds releases it, a reaction's enthalpy change is a bond-accounting problem:",
      },
      { t: "eq", latex: "\\Delta H_{rxn} \\approx \\sum BE_{\\text{bonds broken}} - \\sum BE_{\\text{bonds formed}}", caption: "Broken minus formed. Negative result = net release = exothermic." },
      {
        t: "example",
        title: "Combustion of methane by bond energies",
        steps: [
          "CH₄ + 2O₂ → CO₂ + 2H₂O. Broken: 4 C–H (4×413) + 2 O=O (2×498) = 1652 + 996 = 2648 kJ.",
          "Formed: 2 C=O (2×799) + 4 O–H (4×467) = 1598 + 1868 = 3466 kJ.",
          "$\\Delta H \\approx 2648 - 3466 = -818$ kJ/mol.",
          "Measured value: −890 kJ/mol — close, because table bond energies are gas-phase averages.",
        ],
        answer: "≈ −818 kJ/mol: strongly [[exothermic]] — formed bonds (especially the C=O and O–H) are much stronger than those broken.",
      },
      {
        t: "misconception",
        text: "Order of terms: it's BROKEN − FORMED (costs minus payoffs). Flipping the sign flips exo/endothermic — a classic self-inflicted error.",
      },
      {
        t: "exam",
        text: "You'll get a bond-energy table in the question. Count bonds carefully from Lewis structures (CO₂ has TWO C=O bonds per molecule, not one 'double bond unit').",
      },
    ],
  },

  /* ================================================================ 2.5 */
  "2.5": {
    id: "2.5",
    unit: 2,
    title: "Lewis Diagrams",
    objectives: [
      "Draw Lewis structures for molecules and polyatomic ions by a reliable algorithm",
      "Handle the octet rule's exceptions: electron-deficient B, expanded octets, radicals",
      "Verify structures by electron bookkeeping",
    ],
    keyTerms: ["lewis-structure", "octet-rule", "valence-electrons", "lone-pair", "expanded-octet", "covalent-bond"],
    relatedSims: ["lewis-studio", "molecule-builder"],
    blocks: [
      {
        t: "p",
        text: "A [[lewis-structure|Lewis diagram]] maps the valence electrons: symbols for nuclei-plus-core-electrons, lines for shared pairs, dots for [[lone-pair|lone pairs]]. It's the foundation for shape, polarity, and reactivity — worth drilling until it's automatic.",
      },
      {
        t: "h",
        text: "The algorithm",
      },
      {
        t: "list",
        ordered: true,
        items: [
          "**Count valence electrons**: group numbers summed; ADD one per negative charge, SUBTRACT one per positive charge.",
          "**Pick the central atom**: lowest electronegativity (never H — it takes one bond and leaves).",
          "**Draw single bonds** to every terminal atom (2 electrons each).",
          "**Complete octets of terminal atoms** with lone pairs (H gets just its duet).",
          "**Give leftovers to the central atom**; if the center is still short, **convert a lone pair into a multiple bond** (double, then triple as needed).",
          "**Check**: total electrons on paper = count from step 1; compute [[formal-charge|formal charges]].",
        ],
      },
      {
        t: "example",
        title: "Carbon dioxide, CO₂",
        steps: [
          "Valence: 4 + 2(6) = 16 electrons.",
          "C is central (lower EN than O): O–C–O with two single bonds uses 4 electrons; 12 left.",
          "Complete O octets: 6 on each oxygen uses all 12. But C has only 4 electrons — short!",
          "Convert one lone pair from EACH O into a second bond: O=C=O.",
          "Verify: 4 bonds × 2 + 4 lone pairs × 2 = 8 + 8 = 16 ✓. All formal charges 0 ✓.",
        ],
        answer: "O=C=O with two lone pairs on each oxygen — linear, every atom with an octet.",
      },
      {
        t: "h",
        text: "The three octet exceptions",
      },
      {
        t: "table",
        headers: ["Exception", "Who", "Example", "Note"],
        rows: [
          ["Electron-deficient (< 8)", "Be, B, Al", "BF₃ (B has 6)", "Strong Lewis acids — hungry for a lone pair (BF₃ + :NH₃ → F₃B–NH₃)"],
          ["[[expanded-octet|Expanded]] (> 8)", "Period 3+ centers (P, S, Cl, Xe)", "SF₆ (12), PCl₅ (10), XeF₄", "d orbitals available; minimizes formal charge"],
          ["Odd-electron radicals", "Any", "NO (11 e⁻)", "One unpaired electron; paramagnetic"],
        ],
      },
      {
        t: "callout",
        tone: "warning",
        title: "The hard limit",
        text: "Period-2 elements (C, N, O, F) can NEVER have more than 8 valence electrons — no d orbitals exist at n = 2. 'Carbon with five bonds' or 'NF₅' is an instant red flag. The **Molecule Builder** blocks exactly these moves and tells you why.",
      },
      { t: "sim", sim: "molecule-builder", preset: "blank", caption: "Build structures atom-by-atom: invalid moves are rejected with chemistry reasons, and the Lewis diagram, formula, and shape update live." },
      { t: "sim", sim: "lewis-studio", preset: "bf3", caption: "BF₃ — boron comfortable with six electrons, the classic Lewis acid." },
      {
        t: "misconception",
        text: "Counting a double bond as '4 electrons on each atom' twice over. Each atom's octet count = its lone electrons + ALL shared electrons in its bonds (2 per bond order). And lone pairs are part of the total — a common bookkeeping loss.",
      },
      {
        t: "exam",
        text: "'Draw the Lewis diagram for…' is a standard FRQ point. Include every lone pair, use correct bond orders, add brackets and charge for ions, and check the electron count before moving on.",
      },
    ],
  },

  /* ================================================================ 2.6 */
  "2.6": {
    id: "2.6",
    unit: 2,
    title: "Resonance and Formal Charge",
    objectives: [
      "Calculate formal charges and use them to select the best Lewis structure",
      "Draw resonance structures and describe the resonance hybrid",
      "Connect delocalization to stability and equalized bond lengths",
    ],
    keyTerms: ["resonance", "formal-charge", "delocalization", "lewis-structure", "bond-length"],
    relatedSims: ["lewis-studio"],
    blocks: [
      {
        t: "p",
        text: "Sometimes one Lewis diagram lies by omission. Ozone's two O–O bonds are experimentally IDENTICAL (128 pm — between single 148 and double 121), but any single drawing gives one of each. The truth is [[resonance]]: two valid structures, one real molecule.",
      },
      {
        t: "key",
        term: "Resonance hybrid",
        text: "The real molecule — an average of all resonance forms with **delocalized** electrons. Forms differ ONLY in electron placement, never atom positions. Double-headed arrows ↔ connect forms; they are NOT an equilibrium.",
      },
      {
        t: "h",
        text: "Formal charge: choosing the best structure",
      },
      { t: "eq", latex: "FC = V - L - \\tfrac{1}{2}S", caption: "Valence electrons − lone electrons − half of shared electrons. The sum of formal charges must equal the species charge." },
      {
        t: "list",
        items: [
          "Prefer structures with formal charges closest to **zero**.",
          "Any negative formal charge belongs on the **more electronegative** atom.",
          "Avoid like charges on adjacent atoms.",
        ],
      },
      {
        t: "example",
        title: "Two candidate structures for CO₂ — which wins?",
        steps: [
          "Candidate A: O=C=O. FCs: each O = 6 − 4 − 2 = 0; C = 4 − 0 − 4 = 0. All zero.",
          "Candidate B: C≡O⁺–O⁻… i.e. ⁻O≡C–O⁺? FCs: one O = 6−2−3 = +1, C = 4−0−3−… = 0 with single-bonded O⁻ (−1).",
          "A has all-zero charges; B separates +1/−1.",
        ],
        answer: "A wins decisively: O=C=O. Formal charge is the tie-breaker when several valid skeletons exist.",
      },
      {
        t: "example",
        title: "Why sulfate draws two double bonds",
        steps: [
          "All-single-bond SO₄²⁻: S has FC = 6 − 0 − 4 = +2, each O = −1. Legal, but ugly.",
          "Upgrade two S–O to S=O (sulfur is period 3 — [[expanded-octet|expanded octet]] allowed): S = 0, two O = 0, two O = −1.",
          "Six equivalent resonance forms shuffle which two oxygens carry the double bonds.",
        ],
        answer: "Minimized formal charges + expanded octet → the conventional drawing; all four bonds end up equivalent in the hybrid.",
      },
      { t: "sim", sim: "lewis-studio", preset: "so4", caption: "Carousel through sulfate's resonance forms; the bookkeeping panel shows formal charges updating per form." },
      {
        t: "misconception",
        text: "'The molecule flips back and forth between resonance forms.' It doesn't — there is ONE molecule, ONE electron distribution, best described as the average. Electrons are delocalized, not oscillating.",
      },
      {
        t: "exam",
        text: "FRQs: 'Draw the Lewis diagram… include all equivalent resonance structures' (you must show them all or note equivalence), and 'Explain why all C–O bond lengths in CO₃²⁻ are equal' — answer with delocalization and fractional bond order.",
      },
    ],
  },

  /* ================================================================ 2.7 */
  "2.7": {
    id: "2.7",
    unit: 2,
    title: "VSEPR and Bond Hybridization",
    objectives: [
      "Predict electron-group and molecular geometry from a Lewis structure",
      "State ideal bond angles and explain lone-pair compression",
      "Assign hybridization and distinguish σ and π bonds",
    ],
    keyTerms: ["vsepr", "electron-groups", "molecular-geometry", "bond-angle", "hybridization", "sigma-bond", "pi-bond", "lone-pair"],
    relatedSims: ["vsepr-lab", "molecule-builder", "molecular-polarity"],
    blocks: [
      {
        t: "p",
        text: "Lewis diagrams are flat; molecules are not. [[vsepr|VSEPR theory]] builds the third dimension from one idea: [[electron-groups|electron groups]] around a central atom repel each other and spread out as far as geometry allows. Count the groups (each bond — single, double, or triple — counts as ONE; each lone pair counts as one) and the arrangement follows.",
      },
      {
        t: "table",
        headers: ["Groups", "Electron geometry", "Angles", "With 1 LP", "With 2 LPs"],
        rows: [
          ["2", "linear", "180°", "—", "—"],
          ["3", "trigonal planar", "120°", "bent (<120°)", "—"],
          ["4", "tetrahedral", "109.5°", "trigonal pyramidal (107°)", "bent (104.5°)"],
          ["5", "trigonal bipyramidal", "90/120/180°", "seesaw", "T-shaped"],
          ["6", "octahedral", "90°", "square pyramidal", "square planar"],
        ],
        caption: "The complete AP geometry table. Lone pairs occupy space but are invisible in the molecular shape.",
      },
      {
        t: "key",
        term: "Electron vs molecular geometry",
        text: "**Electron geometry** counts ALL groups (including lone pairs); **molecular geometry** names only the atom arrangement. Water: electron geometry tetrahedral (4 groups), molecular geometry bent (2 bonds + 2 lone pairs). The exam asks for both — know the difference.",
      },
      {
        t: "p",
        text: "Lone pairs repel harder than bonding pairs (held by one nucleus → fatter cloud): **LP–LP > LP–BP > BP–BP**. That's the whole reason angles compress: CH₄ 109.5° → NH₃ 107° → H₂O 104.5°. In trigonal bipyramids, lone pairs ALWAYS go equatorial (fewer 90° interactions).",
      },
      { t: "sim", sim: "vsepr-lab", preset: "bent-109", caption: "Build every geometry from AXE counts and watch lone-pair compression in 3-D. The reference tab lists all twelve shapes." },
      {
        t: "h",
        text: "Hybridization and bond types",
      },
      {
        t: "p",
        text: "Quantum mechanics 'mixes' atomic orbitals into hybrids matching the electron geometry: 2 groups → **sp**, 3 → **sp²**, 4 → **sp³**, 5 → sp³d, 6 → sp³d². Every single bond is a [[sigma-bond|σ bond]] (head-on overlap, rotatable). The 2nd and 3rd bonds of multiples are [[pi-bond|π bonds]] (side-by-side p overlap above/below the axis) — they lock rotation, which is why cis/trans isomers exist around C=C.",
      },
      {
        t: "table",
        headers: ["Molecule", "Groups on C", "Geometry", "Hybridization", "Bonds"],
        rows: [
          ["CH₄", "4", "tetrahedral", "sp³", "4 σ"],
          ["C₂H₄", "3", "trigonal planar", "sp²", "5 σ + 1 π"],
          ["C₂H₂", "2", "linear", "sp", "3 σ + 2 π"],
        ],
      },
      { t: "sim", sim: "molecule-builder", preset: "c2h4", caption: "Load ethene: trigonal planar carbons, and the C=C shows as two cylinders — one σ plus one π." },
      {
        t: "misconception",
        text: "'A double bond has twice the repulsion of a single bond in VSEPR.' It counts as ONE group. It does repel slightly harder (that's why H₂C=O angles are 121.8°/116.1°, not exactly 120°), but for AP purposes: one group, one slot.",
      },
      {
        t: "exam",
        text: "The shape-and-polarity combo is exam gold: 'Identify the geometry of X and use it to explain why the molecule is polar.' Chain the reasoning: Lewis → groups → electron geometry → lone pairs → molecular geometry → dipole cancellation or not.",
      },
    ],
  },
};
