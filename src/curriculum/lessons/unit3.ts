import type { Lesson } from "../lessonTypes";

/**
 * Unit 3 — Intermolecular Forces and Properties.
 * Full lessons: 3.1, 3.2, 3.3, 3.4, 3.11. Concise but complete: the rest.
 */
export const unit3: Record<string, Lesson> = {
  /* ================================================================ 3.1 */
  "3.1": {
    id: "3.1",
    unit: 3,
    title: "Intermolecular Forces",
    objectives: [
      "Identify LDF, dipole–dipole, and hydrogen bonding in any substance",
      "Rank IMF strength from structure and explain physical properties with it",
      "Distinguish intermolecular from intramolecular forces",
    ],
    keyTerms: ["intermolecular-forces", "ldf", "dipole-dipole", "hydrogen-bond", "polarizability", "molecular-polarity", "boiling-point"],
    relatedSims: ["imf-lab", "molecular-polarity"],
    blocks: [
      {
        t: "p",
        text: "Covalent bonds hold atoms together INSIDE molecules. [[intermolecular-forces|Intermolecular forces]] act BETWEEN molecules — and they run the bulk world: boiling points, viscosity, surface tension, solubility, DNA's double helix. Boiling water snaps hydrogen bonds between molecules; the H–O bonds inside each molecule survive untouched (steam is still H₂O).",
      },
      {
        t: "table",
        headers: ["Force", "Who has it", "Origin", "Relative strength"],
        rows: [
          ["[[ldf|London dispersion]]", "ALL particles", "Instantaneous dipoles from electron fluctuations induce dipoles in neighbors", "Weakest — but dominant for nonpolar & big species"],
          ["[[dipole-dipole]]", "Polar molecules", "Permanent δ+ attracts permanent δ−", "Moderate"],
          ["[[hydrogen-bond]]", "H–N/O/F + lone pair on N/O/F", "Extreme polarity of X–H exposes the proton; tiny N/O/F lone pairs concentrate charge", "Strong IMF (still ≪ covalent)"],
        ],
      },
      {
        t: "key",
        term: "Hydrogen bonding checklist",
        text: "(1) Does the molecule have H bonded directly to **N, O, or F**? (H–C does NOT count — ΔEN too small.) (2) Does a neighbor have a lone pair on N/O/F? Both required. Water, ammonia, HF, alcohols, amines, carboxylic acids: yes. CH₄, HCl, CH₃OCH₃ (acceptor only, no donor H): no true H-bonding.",
      },
      {
        t: "callout",
        tone: "info",
        title: "LDF is not 'just for nonpolar things'",
        text: "Every particle has LDFs — they simply get out-muscled when dipoles or H-bonds are present. And LDFs SCALE: bigger electron clouds distort more easily ([[polarizability]]), so I₂ (solid) > Br₂ (liquid) > Cl₂ (gas) > F₂ (gas, weakest) at room temperature — same force, more electrons.",
      },
      { t: "sim", sim: "imf-lab", preset: "h2o", caption: "A box of water molecules: hydrogen-bond links flash between neighbors. Raise the temperature and watch thermal motion overwhelm the attraction — melting, then boiling." },
      {
        t: "example",
        title: "Rank boiling points: CH₄, HCl, H₂O (all similar-ish size regime)",
        steps: [
          "CH₄: nonpolar, tetrahedral — LDF only → boils at −161 °C.",
          "HCl: polar (ΔEN 0.96) — LDF + dipole–dipole, but H is bonded to Cl, NOT N/O/F → no H-bonding → −85 °C.",
          "H₂O: bent, very polar, H bonded to O with two lone pairs → full hydrogen bonding → +100 °C.",
        ],
        answer: "CH₄ < HCl < H₂O. The 185 °C gap between HCl and H₂O is the price of hydrogen bonding.",
      },
      {
        t: "example",
        title: "Same molar mass, wildly different bp: ethanol vs dimethyl ether",
        steps: [
          "CH₃CH₂OH (46 g/mol) has an O–H group → H-bond donor and acceptor → bp 78 °C.",
          "CH₃OCH₃ (46 g/mol) has the O but no O–H → dipole–dipole only → bp −24 °C.",
        ],
        answer: "102 °C apart at identical molar mass — proof that IMF TYPE beats molar mass when H-bonding is on the table.",
      },
      {
        t: "misconception",
        text: "'Hydrogen bonds are bonds.' They're attractions between molecules (~5–10% the strength of a covalent O–H bond). Also: 'nonpolar molecules have no IMFs' — they have LDFs, the only IMF helium or octane ever needed to liquefy.",
      },
      {
        t: "exam",
        text: "The signature FRQ: 'Explain why substance X boils higher than Y.' Full-credit answer names the SPECIFIC force in each substance, ties it to structure (polarity/H–N,O,F/polarizability), and compares. 'X has stronger IMFs' with no identification earns nothing.",
      },
    ],
  },

  /* ================================================================ 3.2 */
  "3.2": {
    id: "3.2",
    unit: 3,
    title: "Properties of Solids",
    objectives: [
      "Classify solids as ionic, covalent network, metallic, or molecular",
      "Predict and explain properties (mp, hardness, conductivity) from particle type and bonding",
    ],
    keyTerms: ["types-of-solids", "ionic-bond", "metallic-bond", "lattice-energy", "intermolecular-forces"],
    relatedSims: ["ionic-bonding", "bond-polarity"],
    blocks: [
      {
        t: "p",
        text: "A solid's properties are a direct readout of what its particles are and what holds them. [[types-of-solids|Four families]], four personalities:",
      },
      {
        t: "table",
        headers: ["Type", "Particles", "Held by", "Properties", "Examples"],
        rows: [
          ["Ionic", "cations + anions", "[[coulomb-law|Coulomb]] attraction ([[lattice-energy]])", "High mp, hard, brittle; conduct only molten/dissolved", "NaCl, MgO, CaCO₃"],
          ["Covalent network", "atoms, all covalently bonded", "Covalent bonds through the whole crystal", "Very high mp, extremely hard, insulators (mostly)", "Diamond, quartz SiO₂, graphite*"],
          ["Metallic", "cations + e⁻ sea", "[[metallic-bond]]", "Variable mp, malleable, ductile, conduct as solids", "Cu, Fe, alloys"],
          ["Molecular", "discrete molecules", "[[intermolecular-forces|IMFs]] only", "Low mp, soft, insulators", "Ice, dry ice CO₂(s), sucrose, I₂"],
        ],
        caption: "*Graphite conducts along its sheets — delocalized π electrons — while remaining a network solid.",
      },
      {
        t: "callout",
        tone: "violet",
        title: "The melting-point diagnostic",
        text: "mp > ~1000 °C + conducts when molten → ionic. mp > ~1500 °C, insoluble, nonconducting → network. Conducts as a SOLID → metallic. mp < ~300 °C → molecular. AP questions are built exactly this way.",
      },
      {
        t: "misconception",
        text: "'Covalent compounds have low melting points.' MOLECULAR covalent compounds do (IMFs break). NETWORK covalent solids are among the highest-melting substances known (covalent bonds break — diamond at ~3550 °C).",
      },
      {
        t: "exam",
        text: "You'll get a table of properties for 3–4 unknown solids and be asked to classify each with justification citing particle type and bonding/forces.",
      },
    ],
  },

  /* ================================================================ 3.3 */
  "3.3": {
    id: "3.3",
    unit: 3,
    title: "Solids, Liquids, and Gases",
    objectives: [
      "Describe the three phases at particle level (order, spacing, motion, compressibility)",
      "Explain phase changes energetically: temperature constant while PE changes",
      "Connect vapor pressure and boiling point to IMF strength",
    ],
    keyTerms: ["states-of-matter", "phase-change", "vapor-pressure", "boiling-point", "intermolecular-forces", "kinetic-molecular-theory"],
    relatedSims: ["imf-lab"],
    blocks: [
      {
        t: "p",
        text: "Phase is a tug-of-war: thermal kinetic energy (scatter) versus [[intermolecular-forces|intermolecular attraction]] (gather). [[states-of-matter|Solids]] win attraction — particles locked in place, vibrating; [[states-of-matter|liquids]] are a draw — mobile but dense, sliding past each other; [[states-of-matter|gases]] win kinetic energy — particles far apart, filling any container.",
      },
      {
        t: "table",
        headers: ["Property", "Solid", "Liquid", "Gas"],
        rows: [
          ["Particle arrangement", "fixed, ordered", "close, disordered", "far apart, random"],
          ["Motion", "vibrate in place", "slide past neighbors", "free, straight-line flights"],
          ["Volume/shape", "both fixed", "fixed volume, container shape", "fills container"],
          ["Compressible?", "no", "barely", "very"],
          ["Density", "highest (usually)", "high", "~1000× lower"],
        ],
      },
      {
        t: "callout",
        tone: "info",
        title: "The heating-curve plateau",
        text: "During melting or boiling, added heat changes POTENTIAL energy (pulling particles apart against attractions) — temperature (average KE) stays constant until the phase change completes. Plateau length ∝ strength of the forces: water's huge ΔH_vap (40.7 kJ/mol) is hydrogen bonding's receipt.",
      },
      {
        t: "p",
        text: "[[vapor-pressure]]: in a closed container, molecules escape the liquid (evaporate) and return (condense) until rates match — dynamic equilibrium. The pressure at that balance is the vapor pressure, set by temperature and IMF strength. [[boiling-point|Boiling]] happens when vapor pressure reaches external pressure — which is why water boils below 100 °C on a mountain.",
      },
      { t: "sim", sim: "imf-lab", preset: "ch4", caption: "Methane's box: LDF-only attraction barely holds the particles together — compare with water's clinging network at the same temperature." },
      {
        t: "misconception",
        text: "'Bubbles in a boiling pot are steam/water vapor.' The first bubbles are dissolved air; at boiling, bubbles are indeed water vapor — but boiling ≠ evaporation: evaporation is surface-only at any temperature; boiling is bulk conversion when vapor pressure ≥ atmospheric.",
      },
      {
        t: "exam",
        text: "Heating/cooling curve interpretation is a recurring MCQ family: identify plateaus (phase changes, KE constant), slopes (single phase, KE rising), and rank IMF strength from plateau lengths or vapor pressures.",
      },
    ],
  },

  /* ================================================================ 3.4 */
  "3.4": {
    id: "3.4",
    unit: 3,
    title: "Ideal Gas Law",
    objectives: [
      "Apply PV = nRT with correct units (R = 0.08206 L·atm/mol·K, T in kelvin)",
      "Derive and use density and molar-mass forms",
      "Use partial pressures and mole fractions in mixtures",
    ],
    keyTerms: ["ideal-gas-law", "partial-pressure", "kinetic-molecular-theory", "mole"],
    relatedSims: ["reaction-viewer"],
    blocks: [
      {
        t: "p",
        text: "Three empirical laws collapse into one: Boyle ($V \\propto 1/P$ at constant n, T), Charles ($V \\propto T$ at constant n, P), and Avogadro ($V \\propto n$). Together:",
      },
      { t: "eq", latex: "PV = nRT, \\qquad R = 0.08206\\ \\tfrac{\\text{L·atm}}{\\text{mol·K}}", caption: "Temperature is ALWAYS kelvin. Pressure in atm, volume in liters for this R." },
      {
        t: "list",
        items: [
          "**Density form**: $d = \\dfrac{PM}{RT}$ — gas density rises with pressure and molar mass, falls with temperature.",
          "**Molar mass from data**: $M = \\dfrac{mRT}{PV}$ — weigh a gas sample in a known volume.",
          "**[[partial-pressure|Dalton]]**: $P_i = X_i P_{total}$; total pressure is the sum of partials.",
          "**Comparing two states** (same gas): $\\dfrac{P_1V_1}{T_1} = \\dfrac{P_2V_2}{T_2}$ — hold constant whatever the problem holds constant.",
        ],
      },
      {
        t: "example",
        title: "Volume of hydrogen from a reaction",
        steps: [
          "Zn + 2HCl → ZnCl₂ + H₂. How many liters of H₂ at 25 °C, 1.00 atm from 6.54 g Zn?",
          "Moles Zn: 6.54 / 65.38 = 0.100 mol → moles H₂ = 0.100 mol (1:1).",
          "$V = nRT/P = 0.100 \\times 0.08206 \\times 298 / 1.00$.",
        ],
        answer: "V = 2.45 L. The pattern: stoichiometry to moles, then gas law to volume.",
      },
      {
        t: "misconception",
        text: "Forgetting kelvin (a Celsius temperature in PV=nRT gives nonsense), and assuming 'STP = standard state': STP for gases is 0 °C, 1 atm (molar volume 22.4 L); thermochemical standard state uses 25 °C (molar volume ≈ 24.5 L).",
      },
      {
        t: "exam",
        text: "Gas laws show up inside bigger problems: collected-over-water (subtract water's vapor pressure!), combustion stoichiometry, and equilibrium (Kp). Unit discipline is the difference-maker.",
      },
    ],
  },

  /* ================================================================ 3.5 */
  "3.5": {
    id: "3.5",
    unit: 3,
    title: "Kinetic Molecular Theory",
    objectives: ["State KMT postulates and connect them to gas behavior", "Relate temperature to average kinetic energy and molecular speed"],
    keyTerms: ["kinetic-molecular-theory", "temperature", "ideal-gas-law", "real-gas"],
    relatedSims: ["imf-lab"],
    blocks: [
      {
        t: "p",
        text: "[[kinetic-molecular-theory|KMT]] models ideal gases with five postulates: (1) constant, random, straight-line motion; (2) particle volume negligible vs container; (3) no attractions or repulsions; (4) collisions are elastic (no energy lost); (5) average kinetic energy ∝ kelvin temperature.",
      },
      { t: "eq", latex: "KE_{avg} = \\tfrac{3}{2}\\cdot\\frac{RT}{N_A}\\ \\text{per molecule} \\qquad v_{rms} = \\sqrt{\\frac{3RT}{M}}", caption: "Same temperature → same average KE for all gases. Lighter molecules move faster to carry that same KE." },
      {
        t: "callout",
        tone: "info",
        title: "The classic comparison",
        text: "At 300 K, O₂ and H₂ have the SAME average kinetic energy, but H₂'s rms speed is ~4× higher (√(32/2)). Speed ratios scale as 1/√M — Graham's law of effusion rides the same math.",
      },
      {
        t: "misconception",
        text: "'Heavier gas = more KE at same T.' No: temperature IS average KE. Mass trades against speed, not energy. Also, individual molecules have a huge spread of speeds (Maxwell–Boltzmann) — KE_avg describes the distribution, not each particle.",
      },
      {
        t: "exam",
        text: "MCQs compare two gases in one container (equal T → equal KE_avg; lighter → faster → hits walls more often but with less impulse each). FRQs ask you to justify a pressure change with particle-level collision reasoning.",
      },
    ],
  },

  /* ================================================================ 3.6 */
  "3.6": {
    id: "3.6",
    unit: 3,
    title: "Deviation from Ideal Behavior",
    objectives: ["Explain when and why real gases deviate from PV = nRT"],
    keyTerms: ["real-gas", "ideal-gas-law", "intermolecular-forces"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Two KMT postulates are approximations that fail under stress. [[real-gas|Real gases]] deviate most at **high pressure** (particles crowded — their own volume is no longer negligible, so measured V exceeds ideal V) and **low temperature** (slow particles — [[intermolecular-forces|attractions]] have time to bend trajectories, reducing collision force so measured P falls below ideal).",
      },
      {
        t: "list",
        items: [
          "Most ideal: small, nonpolar — He, H₂, Ne (weak attractions, tiny volume).",
          "Least ideal: large, polar — NH₃, SF₆ (strong attractions).",
          "The van der Waals equation patches both: $(P + an^2/V^2)(V - nb) = nRT$ — a corrects attractions, b corrects volume.",
        ],
      },
      {
        t: "exam",
        text: "'Which gas behaves most ideally?' = smallest + least polar. Justify with particle volume and IMF strength.",
      },
    ],
  },

  /* ================================================================ 3.7 */
  "3.7": {
    id: "3.7",
    unit: 3,
    title: "Solutions and Mixtures",
    objectives: ["Define solutions, solutes, solvents", "Classify mixtures: solution vs colloid vs suspension", "Apply 'like dissolves like' from IMF reasoning"],
    keyTerms: ["solution", "solubility", "intermolecular-forces", "matter-classification", "electrolyte"],
    relatedSims: ["imf-lab"],
    blocks: [
      {
        t: "p",
        text: "A [[solution]] is a homogeneous mixture: solute particles (ions or molecules) dispersed at the atomic scale in solvent. Colloids scatter light (Tyndall effect — milk, fog); suspensions settle out (muddy water). Only solutions are homogeneous and permanently stable.",
      },
      {
        t: "callout",
        tone: "info",
        title: "Like dissolves like — the IMF argument",
        text: "Dissolving requires solute–solvent attractions to COMPETE with (a) solute–solute and (b) solvent–solvent attractions. Polar/ionic solutes dissolve in polar solvents ([[ion-dipole]], [[hydrogen-bond]]ing); nonpolar in nonpolar (shared [[ldf]]). Oil and water separate because water's H-bond network would rather keep itself than host oil.",
      },
      {
        t: "p",
        text: "[[solubility]] trends: most solids dissolve better when hot (kinetic energy beats lattice energy); gases dissolve better when COLD and under HIGH pressure (Henry's law — warm soda goes flat because CO₂ solubility falls).",
      },
      {
        t: "exam",
        text: "'Explain why ethanol is miscible with water but hexane is not' — answer with the specific forces on each side of the competition.",
      },
    ],
  },

  /* ================================================================ 3.8 */
  "3.8": {
    id: "3.8",
    unit: 3,
    title: "Representations of Solutions",
    objectives: ["Draw and interpret particulate diagrams of dissolved species", "Distinguish strong/weak electrolytes and nonelectrolytes at particle level"],
    keyTerms: ["solution", "electrolyte", "solvation", "molarity", "ion-dipole"],
    relatedSims: ["imf-lab"],
    blocks: [
      {
        t: "p",
        text: "A good particulate diagram of a solution shows the truth about particles: NaCl(aq) = separate Na⁺ and Cl⁻ ions, each ringed by oriented water molecules ([[solvation|hydration shells]]: O-ends toward cations, H-ends toward anions) — NOT NaCl pairs floating around. Sugar(aq) = intact C₁₂H₂₂O₁₁ molecules surrounded by H-bonded water. Weak acid (acetic) = mostly intact molecules, a few H₃O⁺/CH₃COO⁻.",
      },
      {
        t: "list",
        items: [
          "**Strong [[electrolyte]]**: dissolves as 100% ions (soluble salts, strong acids/bases) — conducts strongly.",
          "**Weak electrolyte**: partially ionizes (~1% for acetic acid) — conducts feebly.",
          "**Nonelectrolyte**: dissolves molecular, zero ions (sugars, alcohols) — doesn't conduct.",
        ],
      },
      {
        t: "exam",
        text: "You may be shown four beaker diagrams and asked which represents which solute — count dissociated vs intact particles. Concentration representation: more particles per box volume = more concentrated; [[molarity]] is particles-per-liter made visual.",
      },
    ],
  },

  /* ================================================================ 3.9 */
  "3.9": {
    id: "3.9",
    unit: 3,
    title: "Separation of Solutions and Mixtures",
    objectives: ["Match separation techniques to the physical property each exploits"],
    keyTerms: ["solution", "intermolecular-forces", "matter-classification"],
    relatedSims: [],
    blocks: [
      {
        t: "table",
        headers: ["Technique", "Separates", "Property exploited"],
        rows: [
          ["Chromatography (paper/TLC/column)", "components of a mixture", "differential attraction to stationary phase vs solubility in mobile phase — polar substances cling to polar paper"],
          ["Distillation", "liquids with different boiling points", "[[boiling-point|volatility]] — weakest IMFs vaporize first"],
          ["Filtration", "solid from liquid", "particle size"],
          ["Evaporation", "dissolved solid from solvent", "huge bp difference"],
        ],
      },
      {
        t: "callout",
        tone: "info",
        title: "Chromatography reasoning",
        text: "A component that travels far has weak attraction to the stationary phase and/or strong affinity for the mobile solvent. R_f = distance traveled by spot / distance by solvent front. Every separation question = 'which physical property differs, and how does the technique exploit it?'",
      },
      {
        t: "exam",
        text: "Lab-adjacent MCQs: pick the technique for a given mixture (dyes → chromatography; salt water → distillation/evaporation; sand+water → filtration) and justify by property.",
      },
    ],
  },

  /* ================================================================ 3.10 */
  "3.10": {
    id: "3.10",
    unit: 3,
    title: "The Solvation Process",
    objectives: ["Describe dissolution as a three-step energy process", "Explain why some endothermic dissolving still happens"],
    keyTerms: ["solvation", "ion-dipole", "enthalpy-solution", "entropy", "lattice-energy"],
    relatedSims: ["imf-lab"],
    blocks: [
      {
        t: "p",
        text: "[[solvation|Dissolving]] happens in three energetic steps: (1) break solute–solute attractions (+, e.g. [[lattice-energy]] for a salt); (2) make room in the solvent by weakening solvent–solvent attractions (+); (3) form solute–solvent attractions (−, e.g. [[ion-dipole]] hydration). The sum is ΔH_soln.",
      },
      {
        t: "callout",
        tone: "violet",
        title: "Why NH₄NO₃ dissolves in cold water anyway",
        text: "Its ΔH_soln is POSITIVE (endothermic — the flask chills), yet it dissolves readily because dispersing ordered crystal ions through the solution increases [[entropy]] — Unit 9's ΔG = ΔH − TΔS verdict: entropy wins. 'Dissolving requires energy release' is false.",
      },
      {
        t: "exam",
        text: "Particle-level FRQ: 'Explain why NaCl dissolves in water but not in hexane.' Cite ion–dipole forces overcoming lattice energy vs nonpolar hexane's inability to stabilize separated ions (only weak LDFs available).",
      },
    ],
  },

  /* ================================================================ 3.11 */
  "3.11": {
    id: "3.11",
    unit: 3,
    title: "Spectroscopy and the Electromagnetic Spectrum",
    objectives: ["Match wavelength regions to the molecular changes they probe", "Apply Beer–Lambert law to concentration measurements"],
    keyTerms: ["spectroscopy", "electromagnetic-spectrum", "beers-law", "photon"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Light is a probe sized by wavelength. [[electromagnetic-spectrum|Different regions]] excite different motions: microwaves rotate molecules; infrared vibrates bonds (each functional group absorbs characteristically — IR spectra are molecular fingerprints); UV-visible promotes [[valence-electrons|valence electrons]] (the basis of color and [[beers-law|colorimetry]]); X-rays reach core electrons (this is [[pes|PES]] territory).",
      },
      { t: "eq", latex: "A = \\varepsilon b c", caption: "Beer–Lambert: absorbance = molar absorptivity × path length × concentration. Linear in c — that's why calibration curves work." },
      {
        t: "example",
        title: "Reading a calibration curve",
        steps: [
          "Standard Cu²⁺ solutions: 0.020 M → A = 0.16; 0.040 M → 0.32; 0.060 M → 0.48 (linear, εb = 8.0 M⁻¹).",
          "Unknown measures A = 0.40.",
          "$c = A/(\\varepsilon b) = 0.40 / 8.0 = 0.050$ M.",
        ],
        answer: "0.050 M. Always build/verify the straight line — absorbance is proportional to concentration only within the linear range.",
      },
      {
        t: "misconception",
        text: "'A substance's color is what it absorbs.' The opposite: color is what it TRANSMITS/reflects. A blue solution absorbs orange-red (~600 nm) — the complementary color.",
      },
      {
        t: "exam",
        text: "Choose-the-wavelength MCQs: use the absorbance MAXIMUM (peak) for sensitivity. FRQs combine Beer's law with dilution math or reaction monitoring over time (kinetics crossover).",
      },
    ],
  },

  /* ================================================================ 3.12 */
  "3.12": {
    id: "3.12",
    unit: 3,
    title: "The Photoelectric Effect",
    objectives: ["Explain threshold frequency and one-photon-one-electron ejection", "Connect the effect to quantization of light"],
    keyTerms: ["photoelectric-effect", "photon", "quantized-energy"],
    relatedSims: [],
    blocks: [
      {
        t: "p",
        text: "Shine light on a metal: below a threshold frequency $\\nu_0$, NOTHING happens — no matter how bright. Above it, electrons pop out instantly, and their kinetic energy grows linearly with frequency. Classical wave theory can't explain this (it predicts brightness should matter); Einstein's [[photon]] picture does: light energy arrives in packets $E = h\\nu$, and ONE photon ejects ONE electron.",
      },
      { t: "eq", latex: "h\\nu = \\phi + KE_e \\qquad (\\phi = \\text{work function} = h\\nu_0)", caption: "Photon energy pays the ejection toll first; the remainder becomes kinetic energy." },
      {
        t: "list",
        items: [
          "Brighter light above threshold → MORE electrons (more photons), not faster ones.",
          "Higher frequency above threshold → FASTER electrons (more energy per photon).",
          "The effect proved light is quantized — the same logic that makes [[quantized-energy|atomic energy levels]] sensible.",
        ],
      },
      {
        t: "exam",
        text: "MCQs: 'Doubling intensity below ν₀ produces…' (no electrons). Justifications must mention photons and the threshold, not wave intensity.",
      },
    ],
  },

  /* ================================================================ 3.13 */
  "3.13": {
    id: "3.13",
    unit: 3,
    title: "Bohr Model of the Hydrogen Atom",
    objectives: ["Use quantized energy levels to compute transition energies and wavelengths", "State what the Bohr model gets right and wrong"],
    keyTerms: ["bohr-model", "quantized-energy", "emission-spectrum", "photon"],
    relatedSims: ["atom-builder", "electron-config"],
    blocks: [
      {
        t: "p",
        text: "Bohr proposed that hydrogen's electron occupies only fixed-energy orbits (n = 1, 2, 3…), with transitions between them absorbing or emitting a [[photon]] of exactly the energy gap. It perfectly reproduced hydrogen's line spectrum — the Balmer series (falls to n=2, visible lines) being the famous one.",
      },
      { t: "eq", latex: "E_n = -\\frac{2.18 \\times 10^{-18}\\ \\text{J}}{n^2} \\qquad \\Delta E = E_{final} - E_{initial} = h\\nu", caption: "Levels are negative (bound) and crowd together as n → ∞ (ionization at 0)." },
      {
        t: "example",
        title: "The red line of hydrogen",
        steps: [
          "Transition n = 3 → n = 2. ΔE = −2.18e−18(1/4 − 1/9) J = −2.18e−18 × 0.1389.",
          "|ΔE| = 3.03 × 10⁻¹⁹ J released as a photon.",
          "λ = hc/ΔE = (6.626e−34 × 3.00e8) / 3.03e−19 = 6.56 × 10⁻⁷ m.",
        ],
        answer: "656 nm — red light. That exact line is why hydrogen discharge tubes glow pink-red.",
      },
      {
        t: "callout",
        tone: "warning",
        title: "Where Bohr fails",
        text: "Only hydrogen-like (one-electron) species obey his formula. Orbits-as-paths are wrong — [[orbitals]] replace them. But his two core ideas survive every modern model: quantized levels and ΔE = hν transitions.",
      },
      {
        t: "exam",
        text: "Sign discipline matters: emission = ΔE negative (photon leaves); absorption = positive. MCQs compare transition energies — biggest jump between low n's wins (levels are far apart near the nucleus).",
      },
    ],
  },

  /* ================================================================ 3.14 */
  "3.14": {
    id: "3.14",
    unit: 3,
    title: "Energy Levels and Spectra",
    objectives: ["Connect emission and absorption spectra to electron transitions", "Distinguish line spectra from continuous spectra and interpret them"],
    keyTerms: ["emission-spectrum", "quantized-energy", "electromagnetic-spectrum", "pes"],
    relatedSims: ["electron-config"],
    blocks: [
      {
        t: "p",
        text: "Excited atoms relax by emitting photons of discrete energies → bright lines on dark ([[emission-spectrum|emission spectrum]]). Cold atoms absorb exactly those same energies from white light → dark lines on rainbow (absorption spectrum). Either way, the lines ARE the energy-level differences — a [[quantized-energy|quantization]] fingerprint unique to each element (astronomers read composition of stars this way).",
      },
      {
        t: "list",
        items: [
          "Discrete line spectra ← quantized levels; continuous spectra ← unquantized energy distributions (hot solids).",
          "More lines / closer spacing toward the series limit as levels converge at high n.",
          "Absorption from the ground state shows fewer lines than emission (excited atoms can cascade many ways).",
        ],
      },
      {
        t: "exam",
        text: "Given an energy-level diagram, compute the wavelength for a drawn transition, or match a spectrum to a set of possible transitions. Energy gaps near the nucleus are largest → highest-energy (shortest-λ) photons.",
      },
    ],
  },
};
