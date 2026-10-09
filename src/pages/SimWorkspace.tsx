/**
 * SimWorkspace — full-size page for a single simulation.
 *
 * Renders the SAME component that lessons embed (single source of truth);
 * only the frame differs. Reads `?preset=<id>` so "Open full workspace"
 * links from lessons preserve the preset. The side rail offers presets,
 * related concepts, AP unit links, and navigation to other simulations.
 */
import * as React from "react";
import { Suspense, lazy, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getSim, SIMS, SIM_CATEGORIES } from "@/sims/registry";
import { getConcept } from "@/curriculum/concepts";
import { UNITS } from "@/curriculum/units";
import { Badge, Spinner, EmptyState } from "@/components/ui";

const componentCache = new Map<string, React.LazyExoticComponent<React.ComponentType<any>>>();

export default function SimWorkspace() {
  const { simId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const meta = simId ? getSim(simId) : undefined;
  const presetId = searchParams.get("preset");

  const Component = useMemo(() => {
    if (!meta) return null;
    if (!componentCache.has(meta.id)) {
      componentCache.set(meta.id, lazy(meta.load));
    }
    return componentCache.get(meta.id)!;
  }, [meta]);

  // scroll to top when switching sims
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [simId]);

  if (!meta || !Component) {
    return (
      <div className="page">
        <EmptyState
          icon="🧪"
          title="Simulation not found"
          hint={`No simulation with id “${simId ?? ""}”.`}
          action={
            <Link to="/sims" className="btn btn-primary">Back to library</Link>
          }
        />
      </div>
    );
  }

  const preset = meta.presets.find((p) => p.id === presetId);
  const category = SIM_CATEGORIES.find((c) => c.id === meta.category);
  const others = SIMS.filter((s) => s.id !== meta.id);

  function selectPreset(id: string) {
    if (id === "") {
      searchParams.delete("preset");
    } else {
      searchParams.set("preset", id);
    }
    setSearchParams(searchParams, { replace: true });
  }

  return (
    <div className="page" style={{ maxWidth: 1440 }}>
      <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: 12 }}>
        <Link to="/sims">Simulations</Link>
        <span aria-hidden>›</span>
        <span>{category?.label ?? meta.category}</span>
      </nav>

      <div className="sim-workspace">
        <div className="sim-hero anim-fade" style={{ ["--sim-accent" as string]: meta.accent }}>
          <div className="sim-hero-head">
            <span style={{ fontSize: 24 }} aria-hidden>{meta.icon}</span>
            <div style={{ minWidth: 0 }}>
              <h1>{meta.name}</h1>
              <div className="tagline">{meta.tagline}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {meta.units.map((u) => (
                <Link key={u} to={`/curriculum?unit=${unitSlug(u)}`} style={{ textDecoration: "none" }}>
                  <Badge tone="accent">Unit {u}</Badge>
                </Link>
              ))}
            </div>
          </div>
          <div className="sim-hero-body">
            <Suspense
              fallback={
                <div style={{ display: "grid", placeItems: "center", width: "100%", minHeight: 420 }}>
                  <Spinner label={`Starting ${meta.name}…`} />
                </div>
              }
            >
              {/* key forces a fresh sim instance per preset selection */}
              <Component key={`${meta.id}:${presetId ?? "default"}`} presetId={presetId} embedded={false} />
            </Suspense>
          </div>
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <section className="panel">
            <div className="panel-header"><span className="panel-title">About</span></div>
            <div className="panel-body">
              <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)", lineHeight: 1.55 }}>
                {meta.description}
              </p>
            </div>
          </section>

          {meta.presets.length > 0 && (
            <section className="panel">
              <div className="panel-header">
                <span className="panel-title">Presets</span>
                {preset && <Badge tone="accent">{preset.label}</Badge>}
              </div>
              <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {meta.presets.map((p) => (
                  <button
                    key={p.id}
                    className={`btn ${p.id === presetId ? "btn-primary" : "btn-ghost"} btn-sm`}
                    style={{ justifyContent: "flex-start", textAlign: "left" }}
                    onClick={() => selectPreset(p.id)}
                  >
                    <span>
                      {p.label}
                      {p.description && (
                        <span className="tiny" style={{ display: "block", color: "var(--text-3)" }}>
                          {p.description}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {meta.concepts.length > 0 && (
            <section className="panel">
              <div className="panel-header"><span className="panel-title">Key concepts</span></div>
              <div className="panel-body link-list">
                {meta.concepts.map((cid) => {
                  const c = getConcept(cid);
                  if (!c) return null;
                  return (
                    <Link key={cid} to={`/concept/${cid}`}>
                      💡 {c.term}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <section className="panel">
            <div className="panel-header"><span className="panel-title">More simulations</span></div>
            <div className="panel-body link-list" style={{ maxHeight: 280, overflowY: "auto" }}>
              {others.map((s) => (
                <button
                  key={s.id}
                  className="btn btn-ghost btn-sm"
                  style={{ justifyContent: "flex-start" }}
                  onClick={() => navigate(`/sims/${s.id}`)}
                >
                  <span aria-hidden>{s.icon}</span> {s.name}
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

/* unit number → curriculum slug */
function unitSlug(n: number): string {
  return UNITS.find((u) => u.num === n)?.id ?? `unit-${n}`;
}
