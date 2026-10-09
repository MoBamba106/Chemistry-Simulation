/**
 * Simulations — searchable library of every simulation, grouped by category.
 * Search matches names, taglines, descriptions, categories, keywords
 * (including alternative terminology from the registry) and related concepts.
 */
import * as React from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SIMS, SIM_CATEGORIES } from "@/sims/registry";
import type { SimMeta } from "@/sims/types";
import { search } from "@/search/engine";
import { SearchInput, EmptyState, Badge } from "@/components/ui";

function simMatchesQuery(sim: SimMeta, q: string): boolean {
  if (!q) return true;
  const tokens = q.toLowerCase().split(/[\s,]+/).filter(Boolean);
  const haystack = [
    sim.name,
    sim.tagline,
    sim.description,
    sim.keywords.join(" "),
    SIM_CATEGORIES.find((c) => c.id === sim.category)?.label ?? "",
    sim.presets.map((p) => `${p.id} ${p.label}`).join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return tokens.every((t) => haystack.includes(t));
}

function SimCard({ sim }: { sim: SimMeta }) {
  return (
    <Link
      to={`/sims/${sim.id}`}
      className="sim-card anim-fade-up"
      style={{ ["--sim-accent" as string]: sim.accent }}
    >
      <div className="sim-card-top">
        <span className="sim-card-icon" aria-hidden>{sim.icon}</span>
        <div>
          <h3>{sim.name}</h3>
          <span className="sim-card-cat">
            {SIM_CATEGORIES.find((c) => c.id === sim.category)?.label}
          </span>
        </div>
      </div>
      <p>{sim.tagline}</p>
      <div className="sim-card-foot">
        {sim.units.map((u) => (
          <Badge key={u}>Unit {u}</Badge>
        ))}
        {sim.presets.length > 0 && <Badge tone="violet">{sim.presets.length} presets</Badge>}
      </div>
    </Link>
  );
}

export default function Simulations() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  // For fuzzy/conceptual queries fall back to the global engine (matches
  // concept terms, unit names, alternative wording), then intersect with sims.
  const results = useMemo(() => {
    const q = query.trim();
    let list = SIMS.filter((s) => simMatchesQuery(s, q));
    if (q && list.length === 0) {
      const global = search(q, "sim", 12).map((r) => r.id);
      list = global.map((id) => SIMS.find((s) => s.id === id)!).filter(Boolean);
    }
    if (category) list = list.filter((s) => s.category === category);
    return list;
  }, [query, category]);

  const grouped = useMemo(() => {
    const order = category
      ? SIM_CATEGORIES.filter((c) => c.id === category)
      : SIM_CATEGORIES;
    return order
      .map((c) => ({ cat: c, sims: results.filter((s) => s.category === c.id) }))
      .filter((g) => g.sims.length > 0);
  }, [results, category]);

  return (
    <div className="page">
      <div className="page-title-row">
        <div>
          <h1 className="page-title">Simulations</h1>
          <p className="page-subtitle">
            {SIMS.length} interactive 3-D workbenches covering the AP Chemistry particle
            world — atoms, electrons, bonds, molecules, forces, and reactions.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search simulations — try “geometry”, “dipole”, “build a molecule”, “boiling point”…"
        />
      </div>

      <div className="cat-row" role="tablist" aria-label="Categories">
        <button
          className={`cat-chip${category === null ? " active" : ""}`}
          onClick={() => setCategory(null)}
        >
          All
        </button>
        {SIM_CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`cat-chip${category === c.id ? " active" : ""}`}
            onClick={() => setCategory(category === c.id ? null : c.id)}
            title={c.label}
          >
            {c.label.split(" & ")[0]}
          </button>
        ))}
      </div>

      {grouped.length === 0 && (
        <EmptyState
          icon="🔎"
          title={`No simulations match “${query}”`}
          hint="Try broader terms like “atom”, “bond”, “polarity”, or clear the category filter."
        />
      )}

      {grouped.map((g) => (
        <section key={g.cat.id} style={{ marginBottom: 28 }}>
          <div className="section-head" style={{ margin: "0 0 12px" }}>
            <h2 style={{ fontSize: 16 }}>{g.cat.label}</h2>
          </div>
          <div className="sim-grid">
            {g.sims.map((s) => (
              <SimCard key={s.id} sim={s} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
