/**
 * LessonView — renders a Lesson's structured blocks into the reading layout:
 * headings, prose with wiki-style references, KaTeX equations, key-term
 * boxes, worked examples, misconception & exam callouts, tables, embedded
 * simulations, and inline rotatable 3-D molecules.
 */
import * as React from "react";
import { Suspense, lazy, useMemo } from "react";
import type { Block, Lesson } from "./lessonTypes";
import { LessonText, Math } from "./LessonText";
import { SimEmbed } from "./SimEmbed";
import { MOLECULE_MAP, moleculeToSpecies } from "@/chem/molecules";
import { Callout } from "@/components/ui";

const LazyMolecule = lazy(() => import("@/components/MoleculeCanvas3D"));

export function LessonView({ lesson }: { lesson: Lesson }) {
  return (
    <article className="lesson-body">
      {lesson.blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </article>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.t) {
    case "h":
      return (
        <h2 className="lesson-h">
          <LessonText text={block.text} />
        </h2>
      );
    case "p":
      return (
        <p className="lesson-p">
          <LessonText text={block.text} />
        </p>
      );
    case "list":
      return block.ordered ? (
        <ol className="lesson-list">
          {block.items.map((it, i) => (
            <li key={i}><LessonText text={it} /></li>
          ))}
        </ol>
      ) : (
        <ul className="lesson-list">
          {block.items.map((it, i) => (
            <li key={i}><LessonText text={it} /></li>
          ))}
        </ul>
      );
    case "key":
      return (
        <div className="key-term anim-fade-up">
          <span className="key-term-name">{block.term}</span>
          <span className="key-term-text"><LessonText text={block.text} /></span>
        </div>
      );
    case "eq":
      return (
        <figure className="eq-block">
          <Math latex={block.latex} display />
          {block.caption && <figcaption className="tiny muted">{block.caption}</figcaption>}
        </figure>
      );
    case "example":
      return (
        <div className="worked-example anim-fade-up">
          <div className="worked-title">✏️ {block.title ?? "Worked example"}</div>
          <ol className="worked-steps">
            {block.steps.map((s, i) => (
              <li key={i}><LessonText text={s} /></li>
            ))}
          </ol>
          {block.answer && (
            <div className="worked-answer">
              <b>Answer:</b> <LessonText text={block.answer} />
            </div>
          )}
        </div>
      );
    case "misconception":
      return (
        <Callout tone="warning" title="Common misconception" icon="🚨">
          <LessonText text={block.text} />
        </Callout>
      );
    case "exam":
      return (
        <Callout tone="violet" title="On the AP Exam" icon="📝">
          <LessonText text={block.text} />
        </Callout>
      );
    case "callout":
      return (
        <Callout tone={block.tone ?? "info"} title={block.title}>
          <LessonText text={block.text} />
        </Callout>
      );
    case "table":
      return (
        <figure className="lesson-table-wrap">
          <table className="lesson-table">
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i}><LessonText text={h} /></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}><LessonText text={cell} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {block.caption && <figcaption className="tiny muted">{block.caption}</figcaption>}
        </figure>
      );
    case "sim":
      return <SimEmbed simId={block.sim} presetId={block.preset} caption={block.caption} />;
    case "molecule":
      return <MoleculeBlock id={block.id} caption={block.caption} />;
  }
}

function MoleculeBlock({ id, caption }: { id: string; caption?: string }) {
  const content = useMemo(() => {
    const def = MOLECULE_MAP.get(id);
    if (!def) return null;
    return { def, species: moleculeToSpecies(def) };
  }, [id]);

  if (!content) {
    return <Callout tone="danger">Unknown molecule “{id}” referenced in lesson content.</Callout>;
  }

  return (
    <figure className="molecule-inset anim-fade-up">
      <div className="molecule-inset-canvas">
        <Suspense fallback={null}>
          <LazyMolecule species={content.species} />
        </Suspense>
      </div>
      <figcaption>
        <b>{content.def.name}</b>
        {caption ? ` — ${caption}` : ` — ${content.def.note}`}
      </figcaption>
    </figure>
  );
}
