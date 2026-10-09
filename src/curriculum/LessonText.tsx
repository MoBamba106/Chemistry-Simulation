/**
 * LessonText — renders lesson prose with:
 *  - wiki-style concept references  [[concept-id]] / [[concept-id|Label]]
 *  - inline KaTeX math  $...$
 *  - **bold** emphasis
 */
import * as React from "react";
import { useMemo } from "react";
import katex from "katex";
import { ConceptPopoverLink } from "@/components/ConceptPopover";

export function renderMath(latex: string, display = false): string {
  try {
    return katex.renderToString(latex, {
      displayMode: display,
      throwOnError: false,
      strict: false,
      trust: false,
    });
  } catch {
    return latex;
  }
}

export function Math({ latex, display = false }: { latex: string; display?: boolean }) {
  const html = useMemo(() => renderMath(latex, display), [latex, display]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

type Token =
  | { kind: "text"; value: string }
  | { kind: "math"; value: string }
  | { kind: "ref"; concept: string; label?: string }
  | { kind: "bold"; value: string };

export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  const re = /(\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\])|(\$[^$]+\$)|(\*\*[^*]+\*\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) tokens.push({ kind: "text", value: text.slice(last, m.index) });
    if (m[2]) {
      tokens.push({ kind: "ref", concept: m[2], label: m[3] });
    } else if (m[0].startsWith("$")) {
      tokens.push({ kind: "math", value: m[0].slice(1, -1) });
    } else {
      tokens.push({ kind: "bold", value: m[0].slice(2, -2) });
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push({ kind: "text", value: text.slice(last) });
  return tokens;
}

export function LessonText({ text }: { text: string }) {
  const tokens = useMemo(() => tokenize(text), [text]);
  return (
    <>
      {tokens.map((tok, i) => {
        switch (tok.kind) {
          case "text":
            return <React.Fragment key={i}>{tok.value}</React.Fragment>;
          case "bold":
            return <strong key={i}>{tok.value}</strong>;
          case "math":
            return <Math key={i} latex={tok.value} />;
          case "ref":
            return <ConceptPopoverLink key={i} conceptId={tok.concept} label={tok.label} />;
        }
      })}
    </>
  );
}

/** Strip inline syntax → plain text (for search indexing & previews). */
export function plainText(text: string): string {
  return text
    .replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (_m, id, label) => label ?? id)
    .replace(/\$([^$]+)\$/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1");
}
