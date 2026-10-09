/**
 * Lesson content model.
 *
 * Lessons are DATA, not components: structured blocks that the LessonView
 * renders consistently (typography, math, references, embedded simulations).
 * This keeps content separate from UI and makes adding a lesson a pure
 * content task.
 *
 * Inline text syntax (parsed by LessonText):
 *   [[concept-id]]            → wiki-style reference using the concept's term
 *   [[concept-id|Label]]      → wiki-style reference with custom label
 *   $E = mc^2$                → inline KaTeX math
 *   **bold**                  → emphasis
 */

export type Block =
  | { t: "h"; text: string }
  | { t: "p"; text: string }
  | { t: "list"; ordered?: boolean; items: string[] }
  | { t: "key"; term: string; text: string } // key-definition box
  | { t: "eq"; latex: string; caption?: string } // display equation
  | { t: "example"; title?: string; steps: string[]; answer?: string }
  | { t: "misconception"; text: string }
  | { t: "exam"; text: string } // how the AP exam tests this
  | { t: "callout"; tone?: "info" | "violet" | "warning" | "success"; title?: string; text: string }
  | { t: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { t: "sim"; sim: string; preset?: string; caption?: string } // embedded simulation
  | { t: "molecule"; id: string; caption?: string }; // inline rotatable 3-D model

export interface Lesson {
  /** CED topic number, e.g. "1.5" — also the route id. */
  id: string;
  unit: number;
  title: string;
  objectives: string[];
  /** concept ids central to this lesson (drives search + related links). */
  keyTerms: string[];
  blocks: Block[];
  relatedSims?: string[];
  /** concept ids for "see also" */
  seeAlso?: string[];
}
