/**
 * ConceptPopoverLink — the Wikipedia-style reference.
 *
 * Inline lesson text writes [[concept-id]]; this renders it as a subtle
 * link. Clicking opens a popover with the concept's definition, key equation,
 * an optional rotatable 3-D molecule preview, and navigation to the full
 * concept page, related lessons, and simulations.
 */
import * as React from "react";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { getConcept } from "@/curriculum/concepts";
import { MOLECULE_MAP, moleculeToSpecies } from "@/chem/molecules";
import { getTopic } from "@/curriculum/units";
import { getSim } from "@/sims/registry";
import { Math as MathTex } from "@/curriculum/LessonText";
import { Badge } from "./ui";

export function ConceptPopoverLink({
  conceptId,
  label,
}: {
  conceptId: string;
  label?: string;
}) {
  const concept = getConcept(conceptId);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const ref = useRef<HTMLButtonElement>(null);

  if (!concept) {
    // Unknown concept id — render plain text so content never breaks
    return <span>{label ?? conceptId}</span>;
  }

  const text = label ?? concept.term;

  const toggle = () => {
    if (!open && ref.current) setRect(ref.current.getBoundingClientRect());
    setOpen(!open);
  };

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      const pop = document.getElementById("concept-popover-root");
      if (pop?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onScroll = () => setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={ref}
        className="concept-ref"
        onClick={toggle}
        aria-expanded={open}
        title={concept.short}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: "var(--accent)",
          font: "inherit",
          borderBottom: "1px dotted rgba(73,189,180,0.62)",
          transition: "background 0.12s",
          borderRadius: 2,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(73,189,180,0.12)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        {text}
      </button>
      {open && rect &&
        createPortal(
          <ConceptPopover conceptId={conceptId} rect={rect} onClose={() => setOpen(false)} />,
          document.body
        )}
    </>
  );
}

export function ConceptPopover({
  conceptId,
  rect,
  onClose,
}: {
  conceptId: string;
  rect: DOMRect;
  onClose: () => void;
}) {
  const concept = getConcept(conceptId)!;
  const WIDTH = 380;
  const MARGIN = 12;

  const pos = useMemo(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let left = rect.left + rect.width / 2 - WIDTH / 2;
    left = Math.max(MARGIN, Math.min(left, vw - WIDTH - MARGIN));
    const height = Math.min(440, vh - 24);
    let top = rect.bottom + 10;
    if (top + height > vh - MARGIN) {
      top = Math.max(MARGIN, rect.top - height - 10);
    }
    return { left, top, height };
  }, [rect]);

  const sims = (concept.sims ?? []).map(getSim).filter(Boolean);
  const lessons = (concept.lessons ?? []).map(getTopic).filter(Boolean);

  return (
    <div
      id="concept-popover-root"
      className="anim-pop"
      style={{
        position: "fixed",
        left: pos.left,
        top: pos.top,
        width: WIDTH,
        maxHeight: pos.height,
        overflowY: "auto",
        zIndex: 200,
        background: "var(--bg-2)",
        border: "1px solid var(--border-strong)",
        borderRadius: 8,
        boxShadow: "var(--shadow-3)",
        padding: "14px 16px",
      }}
      role="dialog"
      aria-label={concept.term}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 750, color: "var(--text-0)", lineHeight: 1.25 }}>
          {concept.term}
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            background: "none", border: "none", color: "var(--text-3)", cursor: "pointer",
            fontSize: 13, padding: "2px 4px", borderRadius: 5,
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text-1)", marginTop: 8 }}>
        {concept.short}
      </div>

      {concept.equation && (
        <div
          style={{
            margin: "10px 0 2px", padding: "8px 10px", background: "var(--bg-1)",
            border: "1px solid var(--border)", borderRadius: 9, textAlign: "center", overflowX: "auto",
          }}
        >
          <MathTex latex={concept.equation} display />
        </div>
      )}

      {concept.molecule && (
        <MoleculePreview id={concept.molecule} />
      )}

      {(sims.length > 0 || lessons.length > 0) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {sims.slice(0, 2).map((s) => (
            <Link key={s!.id} to={`/sims/${s!.id}`} onClick={onClose}>
              <Badge tone="accent">{s!.icon} {s!.name}</Badge>
            </Link>
          ))}
          {lessons.slice(0, 2).map((l, i) => (
            <Link key={i} to={`/curriculum/${l!.unit.num}/${l!.topic.id}`} onClick={onClose}>
              <Badge tone="violet">📖 {l!.topic.id}</Badge>
            </Link>
          ))}
        </div>
      )}

      <Link
        to={`/concept/${concept.id}`}
        onClick={onClose}
        style={{ display: "block", marginTop: 10, fontSize: 12.5, fontWeight: 600 }}
      >
        Full concept page →
      </Link>
    </div>
  );
}

/** Small lazy 3-D preview of a library molecule (concept popovers/pages). */
export function MoleculePreview({ id, height = 130 }: { id: string; height?: number }) {
  const content = useMemo(() => {
    const def = MOLECULE_MAP.get(id);
    if (!def) return null;
    return { def, species: moleculeToSpecies(def) };
  }, [id]);

  if (!content) return null;
  const Lazy = LazyMoleculeCanvas;
  return (
    <div
      style={{
        marginTop: 10, borderRadius: 10, overflow: "hidden",
        border: "1px solid var(--border)", height, position: "relative",
        background: "radial-gradient(ellipse at 50% 0%, rgba(73,189,180,0.12), transparent 70%), #f0e2ce",
      }}
    >
      <Suspense fallback={null}>
        <Lazy species={content.species} />
      </Suspense>
      <div
        style={{
          position: "absolute", bottom: 6, left: 10, fontSize: 11, color: "var(--text-3)",
          pointerEvents: "none",
        }}
      >
        {content.def.name} · drag to rotate
      </div>
    </div>
  );
}

const LazyMoleculeCanvas = React.lazy(() => import("./MoleculeCanvas3D"));
