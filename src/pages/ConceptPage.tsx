/**
 * ConceptPage — wiki-style entry for one concept from the registry:
 * definition, detail, equation, 3-D molecule preview (when relevant),
 * links out to the lessons that teach it and the simulations that
 * demonstrate it, plus related concepts.
 */
import * as React from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getConcept, CONCEPTS } from "@/curriculum/concepts";
import { getSim } from "@/sims/registry";
import { TOPIC_INDEX } from "@/curriculum/units";
import { MoleculePreview } from "@/components/ConceptPopover";
import { Math } from "@/curriculum/LessonText";
import { EmptyState, Badge } from "@/components/ui";

export default function ConceptPage() {
  const { conceptId } = useParams();
  const concept = conceptId ? getConcept(conceptId) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [conceptId]);

  if (!concept) {
    return (
      <div className="page page-narrow">
        <EmptyState
          icon="💡"
          title="Concept not found"
          hint={`No concept with id “${conceptId ?? ""}”.`}
          action={<Link to="/curriculum" className="btn btn-primary">Back to curriculum</Link>}
        />
      </div>
    );
  }

  const related = (concept.related ?? []).map(getConcept).filter(Boolean);
  const sims = (concept.sims ?? []).map(getSim).filter(Boolean);
  const lessons = (concept.lessons ?? [])
    .map((id) => ({ id, entry: TOPIC_INDEX.get(id) }))
    .filter((l) => l.entry);

  return (
    <div className="page page-narrow">
      <Link to="/curriculum" className="concept-back">← Curriculum</Link>

      <header className="concept-hero anim-fade-up">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <Badge tone="violet">Concept</Badge>
          {concept.aliases?.map((a) => (
            <Badge key={a}>aka “{a}”</Badge>
          ))}
        </div>
        <h1>{concept.term}</h1>
        <p className="concept-short">{concept.short}</p>
      </header>

      <div className="concept-body">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {concept.detail && (
            <section className="panel anim-fade-up">
              <div className="panel-header"><span className="panel-title">In depth</span></div>
              <div className="panel-body">
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: "var(--text-1)" }}>
                  {concept.detail}
                </p>
              </div>
            </section>
          )}

          {concept.equation && (
            <section className="panel anim-fade-up">
              <div className="panel-header"><span className="panel-title">Key equation</span></div>
              <div className="panel-body">
                <div className="eq-block" style={{ margin: 0 }}>
                  <Math latex={concept.equation} display />
                </div>
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="panel anim-fade-up">
              <div className="panel-header"><span className="panel-title">Related concepts</span></div>
              <div className="panel-body concept-grid">
                {related.map((c) => (
                  <Link key={c!.id} to={`/concept/${c!.id}`} className="btn btn-outline btn-sm">
                    {c!.term}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {concept.molecule && (
            <section className="panel molecule-inset">
              <div className="panel-header"><span className="panel-title">3-D model</span></div>
              <div className="panel-body">
                <MoleculePreview id={concept.molecule} height={180} />
                <p className="tiny muted" style={{ margin: "8px 0 0" }}>
                  Simplified ball-and-stick model — a representation, not a photograph.
                </p>
              </div>
            </section>
          )}

          {sims.length > 0 && (
            <section className="panel">
              <div className="panel-header"><span className="panel-title">🧪 Explore in a simulation</span></div>
              <div className="panel-body link-list">
                {sims.map((s) => (
                  <Link key={s!.id} to={`/sims/${s!.id}`}>
                    <span aria-hidden>{s!.icon}</span>
                    <span>
                      {s!.name}
                      <span className="tiny muted" style={{ display: "block" }}>{s!.tagline}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {lessons.length > 0 && (
            <section className="panel">
              <div className="panel-header"><span className="panel-title">📖 Taught in</span></div>
              <div className="panel-body link-list">
                {lessons.map((l) => (
                  <Link key={l.id} to={`/curriculum/${l.entry!.unit.id}/${l.id}`}>
                    <span className="mono tiny">{l.id}</span> {l.entry!.topic.title}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="panel">
            <div className="panel-header"><span className="panel-title">Browse concepts</span></div>
            <div className="panel-body link-list" style={{ maxHeight: 260, overflowY: "auto" }}>
              {CONCEPTS.filter((c) => c.id !== concept.id)
                .slice(0, 60)
                .map((c) => (
                  <Link key={c.id} to={`/concept/${c.id}`}>
                    {c.term}
                  </Link>
                ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
