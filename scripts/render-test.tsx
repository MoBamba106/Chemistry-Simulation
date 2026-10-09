/**
 * render-test.tsx — renders every page with react-dom/server to catch
 * render-time crashes (bad destructuring, undefined lookups, throwing
 * data helpers) without a browser. Run via scripts/render-test.sh.
 *
 * Pages that read route params are mounted under real <Routes> so
 * useParams/useSearchParams behave exactly like in the app.
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Simulations from "@/pages/Simulations";
import SimWorkspace from "@/pages/SimWorkspace";
import CurriculumHome from "@/pages/CurriculumHome";
import LessonPage from "@/pages/LessonPage";
import ConceptPage from "@/pages/ConceptPage";
import NotFound from "@/pages/NotFound";
import { TOPIC_INDEX } from "@/curriculum/units";
import { CONCEPTS } from "@/curriculum/concepts";
import { SIMS } from "@/sims/registry";

let failures = 0;
let count = 0;

function render(name: string, path: string, el: React.ReactElement) {
  count++;
  try {
    const html = renderToStaticMarkup(<MemoryRouter initialEntries={[path]}>{el}</MemoryRouter>);
    if (html.length < 200) {
      failures++;
      console.log(`FAIL: ${name} rendered suspiciously little markup (${html.length} chars)`);
    }
  } catch (e) {
    failures++;
    console.log(`FAIL: ${name} threw: ${(e as Error).message.split("\n")[0]}`);
  }
}

/* ---- simple pages ---- */
render("Home", "/", <Home onOpenSearch={() => {}} />);
render("Simulations", "/sims", <Simulations />);
render("CurriculumHome", "/curriculum", <CurriculumHome />);
render("CurriculumHome[unit]", "/curriculum?unit=thermodynamics", <CurriculumHome />);
render("NotFound", "/nope", <NotFound />);

/* ---- routed pages: params populated exactly like the app ---- */
const simRoutes = (
  <Routes>
    <Route path="/sims/:simId" element={<SimWorkspace />} />
  </Routes>
);
for (const sim of SIMS) {
  const preset = sim.presets[0];
  render(
    `SimWorkspace[${sim.id}${preset ? `?${preset.id}` : ""}]`,
    `/sims/${sim.id}${preset ? `?preset=${preset.id}` : ""}`,
    simRoutes
  );
  if (preset) {
    // also render with an invalid preset to prove graceful fallback
    render(`SimWorkspace[${sim.id}?bad-preset]`, `/sims/${sim.id}?preset=__nope__`, simRoutes);
  }
}
render("SimWorkspace[unknown-id]", "/sims/not-a-sim", simRoutes);

const lessonRoutes = (
  <Routes>
    <Route path="/curriculum/:unit/:topic" element={<LessonPage />} />
  </Routes>
);
for (const [id, entry] of TOPIC_INDEX) {
  render(`Lesson[${id}]`, `/curriculum/${entry.unit.id}/${id}`, lessonRoutes);
}
render("Lesson[unknown]", "/curriculum/atomic-structure/99.99", lessonRoutes);

const conceptRoutes = (
  <Routes>
    <Route path="/concept/:conceptId" element={<ConceptPage />} />
  </Routes>
);
for (const c of CONCEPTS) {
  render(`Concept[${c.id}]`, `/concept/${c.id}`, conceptRoutes);
}
render("Concept[unknown]", "/concept/not-a-concept", conceptRoutes);

if (failures === 0) {
  console.log(`\nALL ${count} RENDER CHECKS PASSED ✔`);
} else {
  console.log(`\n${failures} of ${count} RENDER CHECKS FAILED ✘`);
  process.exit(1);
}
