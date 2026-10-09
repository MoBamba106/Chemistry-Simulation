/**
 * Search engine — one small, fast, dependency-free index over simulations,
 * units, topics, lessons, and concepts. Built once on first use from the
 * same data modules that drive the UI (single source of truth), scored by
 * token matching with field weights.
 */
import { SIMS } from "@/sims/registry";
import { UNITS, getTopic } from "@/curriculum/units";
import { CONCEPTS, getConcept } from "@/curriculum/concepts";
import { getAllLessons, getLesson } from "@/curriculum/lessons";
import { plainText } from "@/curriculum/LessonText";
import type { Lesson, Block } from "@/curriculum/lessonTypes";

export type ResultKind = "sim" | "lesson" | "topic" | "unit" | "concept";

export interface SearchDoc {
  kind: ResultKind;
  id: string;
  title: string;
  subtitle: string;
  breadcrumb: string[];
  /** fields with weights already applied at query time */
  haystacks: Array<{ text: string; weight: number }>;
  /** sim ids related to this result */
  sims?: string[];
}

let index: SearchDoc[] | null = null;

function blocksToText(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.t) {
        case "h":
        case "p":
        case "misconception":
        case "exam":
          return plainText(b.text);
        case "list":
          return b.items.map(plainText).join(" ");
        case "key":
          return `${b.term} ${plainText(b.text)}`;
        case "example":
          return `${b.title ?? ""} ${b.steps.map(plainText).join(" ")} ${b.answer ? plainText(b.answer) : ""}`;
        case "callout":
          return `${b.title ?? ""} ${plainText(b.text)}`;
        case "table":
          return [...b.headers, ...b.rows.flat()].map(plainText).join(" ");
        case "eq":
          return b.caption ?? "";
        default:
          return "";
      }
    })
    .join(" ");
}

function lessonDoc(lesson: Lesson): SearchDoc {
  const topic = getTopic(lesson.id);
  const unit = topic?.unit;
  return {
    kind: "lesson",
    id: lesson.id,
    title: `${lesson.id} ${lesson.title}`,
    subtitle: topic?.topic.summary ?? lesson.objectives[0] ?? "",
    breadcrumb: unit ? [`Unit ${unit.num}: ${unit.title}`, lesson.id] : [lesson.id],
    haystacks: [
      { text: lesson.title.toLowerCase(), weight: 10 },
      { text: lesson.keyTerms.map((t) => getConcept(t)?.term ?? t).join(" ").toLowerCase(), weight: 6 },
      { text: lesson.objectives.join(" ").toLowerCase(), weight: 4 },
      { text: blocksToText(lesson.blocks).toLowerCase(), weight: 1.4 },
      { text: (lesson.relatedSims ?? []).map((s) => SIMS.find((x) => x.id === s)?.keywords.join(" ") ?? "").join(" ").toLowerCase(), weight: 2 },
    ],
    sims: lesson.relatedSims,
  };
}

export function buildIndex(): SearchDoc[] {
  if (index) return index;
  const docs: SearchDoc[] = [];

  // Simulations
  for (const sim of SIMS) {
    docs.push({
      kind: "sim",
      id: sim.id,
      title: sim.name,
      subtitle: sim.tagline,
      breadcrumb: ["Simulations", sim.name],
      haystacks: [
        { text: sim.name.toLowerCase(), weight: 12 },
        { text: sim.keywords.join(" ").toLowerCase(), weight: 7 },
        { text: sim.tagline.toLowerCase(), weight: 4 },
        { text: sim.description.toLowerCase(), weight: 1.5 },
        { text: sim.presets.map((p) => `${p.label} ${p.description ?? ""}`).join(" ").toLowerCase(), weight: 3 },
        { text: sim.concepts.map((c) => getConcept(c)?.term ?? "").join(" ").toLowerCase(), weight: 3 },
      ],
    });
  }

  // Units & topics
  for (const unit of UNITS) {
    docs.push({
      kind: "unit",
      id: String(unit.num),
      title: `Unit ${unit.num}: ${unit.title}`,
      subtitle: unit.blurb,
      breadcrumb: ["Curriculum", `Unit ${unit.num}`],
      haystacks: [
        { text: unit.title.toLowerCase(), weight: 10 },
        { text: unit.blurb.toLowerCase(), weight: 3 },
        { text: unit.topics.map((t) => t.title).join(" ").toLowerCase(), weight: 4 },
      ],
    });
    for (const topic of unit.topics) {
      const lesson = getLesson(topic.id);
      docs.push({
        kind: "topic",
        id: topic.id,
        title: `${topic.id} ${topic.title}`,
        subtitle: topic.summary,
        breadcrumb: [`Unit ${unit.num}: ${unit.title}`, topic.title],
        haystacks: [
          { text: topic.title.toLowerCase(), weight: 9 },
          { text: topic.summary.toLowerCase(), weight: 4 },
          ...(lesson
            ? [
                { text: lesson.keyTerms.map((t) => getConcept(t)?.term ?? t).join(" ").toLowerCase(), weight: 5 },
                { text: lesson.objectives.join(" ").toLowerCase(), weight: 2.5 },
              ]
            : []),
        ],
        sims: lesson?.relatedSims,
      });
    }
  }

  // Lessons (full text)
  for (const lesson of getAllLessons()) {
    docs.push(lessonDoc(lesson));
  }

  // Concepts
  for (const c of CONCEPTS) {
    docs.push({
      kind: "concept",
      id: c.id,
      title: c.term,
      subtitle: c.short.length > 150 ? c.short.slice(0, 150) + "…" : c.short,
      breadcrumb: ["Concept", c.term],
      haystacks: [
        { text: c.term.toLowerCase(), weight: 12 },
        { text: (c.aliases ?? []).join(" ").toLowerCase(), weight: 9 },
        { text: c.short.toLowerCase(), weight: 3 },
        { text: (c.detail ?? "").toLowerCase(), weight: 1.5 },
        { text: (c.related ?? []).map((r) => getConcept(r)?.term ?? "").join(" ").toLowerCase(), weight: 2 },
      ],
      sims: c.sims,
    });
  }

  index = docs;
  return docs;
}

export interface ScoredResult extends SearchDoc {
  score: number;
  matchedIn: string;
}

/** substring match with light plural stemming ("molecules" → "molecule") */
function tokenIn(text: string, tok: string): boolean {
  if (text.includes(tok)) return true;
  if (tok.length > 3 && tok.endsWith("s") && text.includes(tok.slice(0, -1))) return true;
  return false;
}

const STOP = new Set(["the", "a", "an", "of", "and", "or", "in", "on", "to", "for", "with", "what", "is", "are", "how", "vs"]);

export function search(query: string, kind?: ResultKind, limit = 24): ScoredResult[] {
  const q = query.toLowerCase().trim();
  if (q.length < 1) return [];
  const tokens = q.split(/[\s,]+/).filter((t) => t && !STOP.has(t));
  if (tokens.length === 0) return [];

  const docs = buildIndex();
  const results: ScoredResult[] = [];

  for (const doc of docs) {
    if (kind && doc.kind !== kind) continue;
    let score = 0;
    let matchedIn = "";
    // exact full-query bonus on title
    if (doc.title.toLowerCase().includes(q)) {
      score += 14;
      matchedIn = doc.title;
    }
    for (const tok of tokens) {
      let tokenBest = 0;
      for (const h of doc.haystacks) {
        if (tokenIn(h.text, tok)) {
          const s = h.weight * (h.text === tok ? 2 : h.text.startsWith(tok) ? 1.25 : 1);
          tokenBest = Math.max(tokenBest, s);
        }
      }
      if (tokenBest === 0) {
        score -= 6; // missing token penalty
      } else {
        score += tokenBest;
      }
    }
    if (score > 2) {
      results.push({ ...doc, score, matchedIn: matchedIn || doc.title });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
