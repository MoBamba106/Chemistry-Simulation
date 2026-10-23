/**
 * App — route table + shell.
 *
 * Routes:
 *   /                          Home (launchpad)
 *   /sims                      Simulation library (search + categories)
 *   /sims/:simId               Full simulation workspace (?preset=...)
 *   /curriculum                Curriculum home (9 units) + search
 *   /periodic-table            Full interactive 118-element reference
 *   /curriculum/:unit/:topic   Lesson page (topic = CED id like "3.4")
 *   /concept/:conceptId        Concept page (wiki-style entry)
 */
import * as React from "react";
import { Suspense, lazy, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import { Spinner } from "./components/ui";

const Home = lazy(() => import("./pages/Home"));
const Simulations = lazy(() => import("./pages/Simulations"));
const SimWorkspace = lazy(() => import("./pages/SimWorkspace"));
const CurriculumHome = lazy(() => import("./pages/CurriculumHome"));
const PeriodicTablePage = lazy(() => import("./pages/PeriodicTablePage"));
const LessonPage = lazy(() => import("./pages/LessonPage"));
const ConceptPage = lazy(() => import("./pages/ConceptPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageFallback() {
  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "50vh" }}>
      <Spinner label="Loading…" />
    </div>
  );
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <AppShell searchOpen={searchOpen} setSearchOpen={setSearchOpen}>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home onOpenSearch={() => setSearchOpen(true)} />} />
          <Route path="/sims" element={<Simulations />} />
          <Route path="/sims/:simId" element={<SimWorkspace />} />
          <Route path="/curriculum" element={<CurriculumHome />} />
          <Route path="/periodic-table" element={<PeriodicTablePage />} />
          <Route path="/curriculum/:unit/:topic" element={<LessonPage />} />
          <Route path="/concept/:conceptId" element={<ConceptPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
