/**
 * smoke.ts — runtime integrity checks for the content + logic layer.
 * Bundled with esbuild and run under Node (see scripts/smoke.sh):
 *   - every CED topic has a lesson
 *   - every lesson reference (keyTerms, sims, presets, concepts) resolves
 *   - every molecule preset survives Lewis analysis without throwing
 *   - the search engine returns sane top results for representative queries
 *   - concept registry cross-links resolve
 */
import { search, buildIndex } from "@/search/engine";
import { LESSONS, getLesson } from "@/curriculum/lessons";
import { UNITS, TOPIC_INDEX } from "@/curriculum/units";
import { CONCEPTS, getConcept } from "@/curriculum/concepts";
import { SIMS, getSim } from "@/sims/registry";
import { MOLECULES, MOLECULE_MAP, moleculeToSpecies } from "@/chem/molecules";
import { analyzeSpecies } from "@/chem/lewis";
import { getElement, hasElement } from "@/chem/elements";
import { PERIODIC_ELEMENTS } from "@/chem/periodicTableData";

let failures = 0;
function check(ok: boolean, msg: string) {
  if (!ok) {
    failures++;
    console.log("FAIL:", msg);
  }
}

/* ---------- 1. lesson coverage ---------- */
for (const [id] of TOPIC_INDEX) {
  check(!!getLesson(id), `topic ${id} has no lesson`);
}
console.log(`lessons: ${Object.keys(LESSONS).length}, topics: ${TOPIC_INDEX.size}`);

/* ---------- 1b. full periodic-table data ---------- */
check(PERIODIC_ELEMENTS.length === 118, `periodic table has ${PERIODIC_ELEMENTS.length} elements, expected 118`);
check(new Set(PERIODIC_ELEMENTS.map((element) => element.symbol)).size === 118, "periodic table symbols are not unique");
for (let index = 0; index < PERIODIC_ELEMENTS.length; index++) {
  check(PERIODIC_ELEMENTS[index].z === index + 1, `periodic-table entry ${index + 1} has Z=${PERIODIC_ELEMENTS[index].z}`);
}

/* ---------- 2. lesson references ---------- */
for (const [id, lesson] of Object.entries(LESSONS)) {
  for (const kt of lesson.keyTerms) check(!!getConcept(kt), `${id}: keyTerm ${kt} missing`);
  for (const sa of lesson.seeAlso ?? []) check(!!getConcept(sa), `${id}: seeAlso ${sa} missing`);
  for (const sid of lesson.relatedSims ?? []) check(!!getSim(sid), `${id}: relatedSim ${sid} missing`);
  for (const b of lesson.blocks) {
    if (b.t === "sim") {
      const sim = getSim(b.sim);
      check(!!sim, `${id}: sim block ${b.sim} missing`);
      if (sim && b.preset) {
        check(
          sim.presets.some((p) => p.id === b.preset),
          `${id}: preset ${b.preset} missing from ${sim.id}`
        );
      }
    }
    if (b.t === "molecule") {
      check(MOLECULE_MAP.has(b.id), `${id}: molecule ${b.id} missing`);
    }
  }
}

/* ---------- 3. molecule presets analyze cleanly ---------- */
for (const def of MOLECULES) {
  try {
    const resCount = def.resonance?.length ?? 1;
    for (let r = 0; r < resCount; r++) {
      const sp = moleculeToSpecies(def, r);
      analyzeSpecies(sp);
    }
    for (const [, el] of def.atoms) {
      check(hasElement(el), `${def.id}: element ${el} not in database`);
      if (hasElement(el)) getElement(el);
    }
  } catch (e) {
    check(false, `${def.id}: analysis threw — ${(e as Error).message}`);
  }
}
console.log(`molecules analyzed: ${MOLECULES.length}`);

/* ---------- 4. concept cross-links ---------- */
for (const c of CONCEPTS) {
  for (const r of c.related ?? []) check(!!getConcept(r), `concept ${c.id}: related ${r} missing`);
  for (const s of c.sims ?? []) check(!!getSim(s), `concept ${c.id}: sim ${s} missing`);
  if (c.molecule) check(MOLECULE_MAP.has(c.molecule), `concept ${c.id}: molecule ${c.molecule} missing`);
  for (const l of c.lessons ?? []) check(TOPIC_INDEX.has(l), `concept ${c.id}: lesson ${l} missing`);
}
console.log(`concepts: ${CONCEPTS.length}, sims: ${SIMS.length}`);

/* ---------- 5. registry preset ids unique per sim ---------- */
for (const sim of SIMS) {
  const ids = sim.presets.map((p) => p.id);
  check(new Set(ids).size === ids.length, `sim ${sim.id}: duplicate preset ids`);
}

/* ---------- 6. search sanity ---------- */
const queries: Array<[string, string]> = [
  ["vsepr", "vsepr-lab"],
  ["molecular geometry", "vsepr-lab"],
  ["shape of molecules", "vsepr-lab"],
  ["hydrogen bonding", "hydrogen-bond"],
  ["boiling point", "imf-lab"],
  ["intermolecular forces", "imf-lab"],
  ["lewis structure", "lewis-studio"],
  ["electron configuration", "electron-config"],
  ["photoelectron spectroscopy", "pes"],
  ["titration", "titration"],
  ["buffer", "buffer"],
  ["oxidation number", "oxidation-number"],
  ["dipole", "bond-dipole"],
  ["ideal gas", "ideal-gas-law"],
  ["lattice energy", "lattice-energy"],
  ["build molecule", "molecule-builder"],
  ["ionic bonding", "ionic-bonding"],
  ["periodic trends", "periodic-explorer"],
  ["118 element periodic table", "periodic-table"],
  ["bond length diagram", "bond-length-lab"],
  ["morse potential bond", "bond-length-lab"],
  ["gibbs free energy", "gibbs-free-energy"],
  ["rate law", "rate-law"],
];
buildIndex();
for (const [q, expectId] of queries) {
  const results = search(q, undefined, 10);
  check(results.length > 0, `search "${q}": no results`);
  const top3 = results.slice(0, 3).map((r) => `${r.kind}:${r.id}`);
  const hit = results.slice(0, 5).some((r) => r.id === expectId || r.id.includes(expectId));
  check(hit, `search "${q}": expected ${expectId} in top 5, got ${top3.join(", ")}`);
}
// alternate terminology (registry keywords)
const alt = search("electron sea", undefined, 5);
check(alt.length > 0, 'search "electron sea": no results');
const alt2 = search("octet rule violations", undefined, 5);
check(alt2.length > 0, 'search "octet rule violations": no results');

/* ---------- done ---------- */
if (failures === 0) {
  console.log("\nALL SMOKE CHECKS PASSED ✔");
} else {
  console.log(`\n${failures} FAILURES ✘`);
  process.exit(1);
}
