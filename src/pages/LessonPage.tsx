/**
 * LessonPage — one CED topic rendered in full: breadcrumb, objectives,
 * lesson blocks (via LessonView), an aside with related simulations and
 * key concepts, and prev/next navigation across the whole course.
 */
import * as React from "react";
import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { UNITS, TOPIC_INDEX } from "@/curriculum/units";
import { getLesson } from "@/curriculum/lessons";
import { getSim } from "@/sims/registry";
import { getConcept } from "@/curriculum/concepts";
import { LessonView } from "@/curriculum/LessonView";
import { Badge, EmptyState } from "@/components/ui";

/** every topic in course order, for prev/next navigation */
const FLAT_TOPICS: { unit: (typeof UNITS)[number]; topicId: string; title: string }[] =
  UNITS.flatMap((u) => u.topics.map((t) => ({ unit: u, topicId: t.id, title: t.title })));

export default function LessonPage() {
  const { unit: unitSlug, topic } = useParams();
  const entry = topic ? TOPIC_INDEX.get(topic) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [topic]);

  const lesson = topic ? getLesson(topic) : undefined;

  const { prev, next } = useMemo(() => {
    const idx = FLAT_TOPICS.findIndex((t) => t.topicId === topic);
    return {
      prev: idx > 0 ? FLAT_TOPICS[idx - 1] : null,
      next: idx >= 0 && idx < FLAT_TOPICS.length - 1 ? FLAT_TOPICS[idx + 1] : null,
    };
  }, [topic]);

  if (!entry || !lesson) {
    return (
      <div className="page">
        <EmptyState
          icon="📖"
          title="Lesson not found"
          hint={`No lesson with topic id “${topic ?? ""}” in unit “${unitSlug ?? ""}”.`}
          action={<Link to="/curriculum" className="btn btn-primary">Back to curriculum</Link>}
        />
      </div>
    );
  }

  const { unit } = entry;
  const lessonUrl = (u: typeof unit, id: string) => `/curriculum/${u.id}/${id}`;
  const relatedSims = (lesson.relatedSims ?? []).map(getSim).filter(Boolean);

  return (
    <div className="page" style={{ maxWidth: 1280 }}>
      <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: 14 }}>
        <Link to="/curriculum">Curriculum</Link>
        <span aria-hidden>›</span>
        <Link to={`/curriculum?unit=${unit.id}`}>
          Unit {unit.num}: {unit.title}
        </Link>
        <span aria-hidden>›</span>
        <span>{topic}</span>
      </nav>

      <header style={{ marginBottom: 22 }} className="anim-fade-up">
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
          <Badge tone="accent" style={{ background: `${unit.color}22`, color: unit.color }}>
            {unit.icon} Unit {unit.num}
          </Badge>
          <span className="mono muted" style={{ fontSize: 12.5 }}>{lesson.id}</span>
          <Badge tone={entry.topic.depth === "full" ? "good" : "default"}>
            {entry.topic.depth === "full" ? "in-depth lesson" : "concise lesson"}
          </Badge>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px" }}>{lesson.title}</h1>
        <p className="muted" style={{ marginTop: 6, maxWidth: 720, fontSize: 14 }}>
          {entry.topic.summary}
        </p>
      </header>

      <div className="lesson-layout">
        <article>
          {lesson.objectives.length > 0 && (
            <section className="panel lesson-objectives anim-fade-up" style={{ marginBottom: 18 }}>
              <div className="panel-header">
                <span className="panel-title">🎯 Learning objectives</span>
              </div>
              <div className="panel-body">
                <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 5, fontSize: 13.8 }}>
                  {lesson.objectives.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          <LessonView lesson={lesson} />

          <nav className="lesson-nav" aria-label="Lesson navigation">
            {prev ? (
              <Link to={lessonUrl(prev.unit, prev.topicId)} className="btn btn-ghost">
                ← <span><span className="tiny muted" style={{ display: "block" }}>{prev.topicId}</span>{prev.title}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link to={lessonUrl(next.unit, next.topicId)} className="btn btn-ghost" style={{ textAlign: "right" }}>
                <span><span className="tiny muted" style={{ display: "block" }}>{next.topicId}</span>{next.title}</span> →
              </Link>
            ) : <span />}
          </nav>
        </article>

        <aside className="lesson-aside">
          {relatedSims.length > 0 && (
            <section className="panel">
              <div className="panel-header"><span className="panel-title">🧪 Related simulations</span></div>
              <div className="panel-body link-list">
                {relatedSims.map((s) => (
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

          {lesson.keyTerms.length > 0 && (
            <section className="panel">
              <div className="panel-header"><span className="panel-title">💡 Key concepts</span></div>
              <div className="panel-body link-list">
                {lesson.keyTerms.map((cid) => {
                  const c = getConcept(cid);
                  if (!c) return null;
                  return (
                    <Link key={cid} to={`/concept/${cid}`}>
                      {c.term}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {lesson.seeAlso && lesson.seeAlso.length > 0 && (
            <section className="panel">
              <div className="panel-header"><span className="panel-title">🔗 See also</span></div>
              <div className="panel-body link-list">
                {lesson.seeAlso.map((cid) => {
                  const c = getConcept(cid);
                  if (!c) return null;
                  return (
                    <Link key={cid} to={`/concept/${cid}`}>
                      {c.term}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <section className="panel">
            <div className="panel-header"><span className="panel-title">📚 In this unit</span></div>
            <div className="panel-body link-list" style={{ maxHeight: 300, overflowY: "auto" }}>
              {unit.topics.map((t) => (
                <Link
                  key={t.id}
                  to={lessonUrl(unit, t.id)}
                  style={t.id === topic ? { color: "var(--accent)", fontWeight: 700 } : undefined}
                >
                  <span className="mono tiny">{t.id}</span> {t.title}
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
