/**
 * CurriculumHome — the full AP Chemistry course: 9 units, every CED topic,
 * and a curriculum-scoped search that shows each hit's place in the
 * hierarchy plus its associated simulations.
 *
 * `?unit=<slug>` expands one unit and scrolls to it.
 */
import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { UNITS } from "@/curriculum/units";
import { getLesson } from "@/curriculum/lessons";
import { getSim } from "@/sims/registry";
import { search, type ScoredResult } from "@/search/engine";
import { SearchInput, EmptyState, Badge } from "@/components/ui";

export default function CurriculumHome() {
  const [searchParams, setSearchParams] = useSearchParams();
  const openUnit = searchParams.get("unit");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(openUnit);
  const openRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openUnit) {
      setExpanded(openUnit);
      requestAnimationFrame(() =>
        openRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      );
    }
  }, [openUnit]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    const out: ScoredResult[] = [];
    for (const r of search(q, undefined, 40)) {
      if (r.kind === "lesson" || r.kind === "topic" || r.kind === "unit" || r.kind === "concept") {
        out.push(r);
      }
    }
    // de-duplicate lesson/topic pairs with the same id
    const seen = new Set<string>();
    return out.filter((r) => {
      const key = `${r.kind === "topic" ? "lesson" : r.kind}:${r.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [query]);

  const searching = query.trim().length > 0;

  return (
    <div className="page">
      <div className="page-title-row">
        <div>
          <h1 className="page-title">AP Chemistry Curriculum</h1>
          <p className="page-subtitle">
            The complete course in the College Board's nine units — every topic is a lesson with
            worked examples, misconceptions, exam-style questions, concept popovers, and embedded
            simulations.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search the curriculum — “buffers”, “photoelectron spectroscopy”, “unit 7 equilibrium”…"
        />
      </div>

      {searching && (
        <section>
          {results.length === 0 && (
            <EmptyState
              icon="🔎"
              title={`Nothing in the curriculum matches “${query}”`}
              hint="Try a concept name, a unit number, or a topic like “rate law”."
            />
          )}
          <div className="panel" style={{ padding: 8 }}>
            {results.map((r) => {
              const href =
                r.kind === "unit"
                  ? `/curriculum?unit=${UNITS.find((u) => u.num === Number(r.id))?.id ?? ""}`
                  : r.kind === "concept"
                    ? `/concept/${r.id}`
                    : `/curriculum/${unitSlugForTopic(r.id)}/${r.id}`;
              const entry = r.kind !== "unit" && r.kind !== "concept" ? getTopicEntry(r.id) : null;
              const lesson = r.kind !== "unit" && r.kind !== "concept" ? getLesson(r.id) : null;
              const simIds = lesson?.relatedSims ?? r.sims ?? [];
              return (
                <Link key={`${r.kind}:${r.id}`} to={href} className="topic-row" style={{ alignItems: "flex-start" }}>
                  <span className="topic-id">{r.kind === "unit" ? `U${r.id}` : r.kind === "concept" ? "💡" : r.id}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="topic-title" style={{ display: "block" }}>{r.title}</span>
                    <span className="tiny muted" style={{ display: "block" }}>
                      {r.breadcrumb.join(" › ")}
                    </span>
                    {simIds.length > 0 && (
                      <span style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                        {simIds.slice(0, 4).map((sid) => {
                          const s = getSim(sid);
                          return s ? <Badge key={sid}>{s.icon} {s.name}</Badge> : null;
                        })}
                      </span>
                    )}
                    {entry && (
                      <Badge tone={entry.topic.depth === "full" ? "good" : "default"} className="tiny" >
                        {entry.topic.depth === "full" ? "full lesson" : "concise lesson"}
                      </Badge>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {!searching && (
        <div className="unit-grid">
          {UNITS.map((u) => {
            const isOpen = expanded === u.id;
            return (
              <div
                key={u.num}
                ref={isOpen ? openRef : undefined}
                style={{ gridColumn: isOpen ? "1 / -1" : undefined }}
              >
                <div
                  className="unit-card anim-fade-up"
                  style={{ ["--unit-color" as string]: u.color, cursor: "pointer" }}
                  onClick={() => {
                    const next = isOpen ? null : u.id;
                    setExpanded(next);
                    if (next) setSearchParams({ unit: u.id }, { replace: true });
                    else setSearchParams({}, { replace: true });
                  }}
                  role="button"
                  aria-expanded={isOpen}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setExpanded(isOpen ? null : u.id);
                    }
                  }}
                >
                  <div className="unit-card-top">
                    <span className="unit-num">{u.num}</span>
                    <div style={{ flex: 1 }}>
                      <h3>
                        {u.icon} {u.title}
                      </h3>
                    </div>
                    <span className="muted" aria-hidden style={{ fontSize: 12 }}>
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>
                  <p className="blurb">{u.blurb}</p>
                  <div className="unit-card-meta">
                    <span className="exam-weight">{u.examWeight} MCQ</span>
                    <span>{u.topics.length} topics</span>
                    <span>
                      {u.topics.filter((t) => t.depth === "full").length} in-depth ·{" "}
                      {u.topics.filter((t) => t.depth !== "full").length} concise
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="panel anim-fade" style={{ marginTop: 10, padding: 10 }}>
                    <div className="topic-list">
                      {u.topics.map((t) => {
                        const lesson = getLesson(t.id);
                        const sims = lesson?.relatedSims ?? [];
                        return (
                          <Link key={t.id} to={`/curriculum/${u.id}/${t.id}`} className="topic-row">
                            <span className="topic-id">{t.id}</span>
                            <span className="topic-title">{t.title}</span>
                            <span className="topic-summary">{t.summary}</span>
                            <span style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
                              {sims.slice(0, 3).map((sid) => {
                                const s = getSim(sid);
                                return s ? (
                                  <span key={sid} title={s.name} aria-label={`Uses ${s.name}`}>
                                    {s.icon}
                                  </span>
                                ) : null;
                              })}
                              <Badge tone={t.depth === "full" ? "good" : "default"}>
                                {t.depth === "full" ? "full" : "concise"}
                              </Badge>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function unitSlugForTopic(topicId: string): string {
  const num = Number(topicId.split(".")[0]);
  return UNITS.find((u) => u.num === num)?.id ?? `unit-${num}`;
}

function getTopicEntry(topicId: string) {
  const num = Number(topicId.split(".")[0]);
  const unit = UNITS.find((u) => u.num === num);
  const topic = unit?.topics.find((t) => t.id === topicId);
  return unit && topic ? { unit, topic } : null;
}
