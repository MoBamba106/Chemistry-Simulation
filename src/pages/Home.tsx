/**
 * Home — launchpad: hero, featured simulations, curriculum overview.
 */
import * as React from "react";
import { Link } from "react-router-dom";
import { SIMS, SIM_CATEGORIES } from "@/sims/registry";
import { UNITS } from "@/curriculum/units";
import { getAllLessons } from "@/curriculum/lessons";
import { CONCEPTS } from "@/curriculum/concepts";

const FEATURED = ["molecule-builder", "vsepr-lab", "electron-config", "imf-lab"];

export default function Home({ onOpenSearch }: { onOpenSearch: () => void }) {
  const featured = FEATURED.map((id) => SIMS.find((s) => s.id === id)!).filter(Boolean);
  const topicCount = UNITS.reduce((n, u) => n + u.topics.length, 0);

  return (
    <div className="page">
      <section className="home-hero anim-fade-up">
        <h1>
          Build atoms. Shape molecules. <span className="grad">Understand the why.</span>
        </h1>
        <p>
          An interactive AP Chemistry workspace: {SIMS.length} real-time 3-D simulations and the
          complete 9-unit course, wired together — every lesson links the concepts, models, and
          simulations that explain them.
        </p>
        <div className="home-hero-actions">
          <Link to="/sims" className="btn btn-primary btn-lg">🧪 Explore simulations</Link>
          <Link to="/curriculum" className="btn btn-outline btn-lg">📚 Browse the curriculum</Link>
          <Link to="/periodic-table" className="btn btn-ghost btn-lg">⚛️ Periodic table</Link>
          <button className="btn btn-ghost btn-lg" onClick={onOpenSearch}>🔍 Search everything</button>
        </div>
        <div className="home-stats">
          <div className="home-stat"><b>{SIMS.length}</b><span>interactive simulations</span></div>
          <div className="home-stat"><b>{topicCount}</b><span>lessons across 9 units</span></div>
          <div className="home-stat"><b>{CONCEPTS.length}</b><span>clickable concept entries</span></div>
          <div className="home-stat"><b>100%</b><span>offline · no account</span></div>
        </div>
      </section>

      <div className="section-head">
        <h2>Featured simulations</h2>
        <Link to="/sims">All {SIMS.length} simulations →</Link>
      </div>
      <div className="sim-grid">
        {featured.map((s) => (
          <Link
            key={s.id}
            to={`/sims/${s.id}`}
            className="sim-card anim-fade-up"
            style={{ ["--sim-accent" as string]: s.accent }}
          >
            <div className="sim-card-top">
              <span className="sim-card-icon" aria-hidden>{s.icon}</span>
              <div>
                <h3>{s.name}</h3>
                <span className="sim-card-cat">{SIM_CATEGORIES.find((c) => c.id === s.category)?.label}</span>
              </div>
            </div>
            <p>{s.tagline}</p>
            <div className="sim-card-foot">
              {s.units.map((u) => (
                <span key={u} className="badge">Unit {u}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <div className="section-head">
        <h2>The AP Chemistry course</h2>
        <Link to="/curriculum">Full curriculum →</Link>
      </div>
      <div className="unit-grid">
        {UNITS.slice(0, 3).map((u) => (
          <Link
            key={u.num}
            to={`/curriculum?unit=${u.id}`}
            className="unit-card anim-fade-up"
            style={{ ["--unit-color" as string]: u.color }}
          >
            <div className="unit-card-top">
              <span className="unit-num">{u.num}</span>
              <div>
                <h3>{u.title}</h3>
              </div>
            </div>
            <p className="blurb">{u.blurb}</p>
            <div className="unit-card-meta">
              <span className="exam-weight">{u.examWeight} MCQ</span>
              <span>{u.topics.length} topics</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="section-head">
        <h2>How to use ChemLab</h2>
      </div>
      <div className="panel anim-fade-up" style={{ padding: 20 }}>
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10, fontSize: 14, color: "var(--text-1)" }}>
          <li><b style={{ color: "var(--text-0)" }}>Learn</b> — read a lesson; every highlighted term opens a wiki-style popover with a definition, equation, and often a 3-D model.</li>
          <li><b style={{ color: "var(--text-0)" }}>Explore</b> — simulations are embedded right inside lessons with the right preset already loaded, and open in a full workspace with one click.</li>
          <li><b style={{ color: "var(--text-0)" }}>Experiment</b> — build molecules, strip electrons, heat a box of fluids. Invalid chemistry is blocked with an explanation, so you learn the rules by testing them.</li>
          <li><b style={{ color: "var(--text-0)" }}>Understand why</b> — worked examples, misconceptions, and exam-style questions close every lesson; {getAllLessons().length} topics total, from moles to electrolytic cells.</li>
        </ol>
      </div>
    </div>
  );
}
