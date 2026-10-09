/**
 * SimEmbed — embeds a simulation INSIDE lesson content.
 *
 * Uses the exact same simulation component as the Simulations page (single
 * source of truth), passing `embedded` for compact presentation and a
 * `presetId` so it opens on lesson-appropriate content. The header offers
 * "Open full workspace", which preserves the preset via query string.
 */
import * as React from "react";
import { Suspense, lazy, useMemo } from "react";
import { Link } from "react-router-dom";
import { getSim } from "@/sims/registry";
import { Badge, Spinner } from "@/components/ui";

const componentCache = new Map<string, React.LazyExoticComponent<React.ComponentType<any>>>();

export function SimEmbed({
  simId,
  presetId,
  caption,
  height,
}: {
  simId: string;
  presetId?: string;
  caption?: string;
  height?: number;
}) {
  const meta = getSim(simId);

  const Component = useMemo(() => {
    if (!meta) return null;
    if (!componentCache.has(meta.id)) {
      componentCache.set(meta.id, lazy(meta.load));
    }
    return componentCache.get(meta.id)!;
  }, [meta]);

  if (!meta || !Component) {
    return (
      <div className="callout callout-danger">
        <div className="callout-icon">⛔</div>
        <div>Unknown simulation “{simId}” referenced in lesson content.</div>
      </div>
    );
  }

  const preset = meta.presets.find((p) => p.id === presetId);
  const workspaceLink = `/sims/${meta.id}${presetId ? `?preset=${encodeURIComponent(presetId)}` : ""}`;

  return (
    <div
      className="panel sim-embed anim-fade-up"
      style={{ margin: "18px 0", overflow: "hidden" }}
    >
      <div className="panel-header" style={{ background: "linear-gradient(90deg, rgba(76,195,255,0.07), transparent)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span style={{ fontSize: 19 }}>{meta.icon}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-0)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {meta.name}
            </div>
            <div className="tiny muted" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {preset ? preset.label : meta.tagline}
            </div>
          </div>
          <Badge tone="accent" className="hide-narrow">interactive</Badge>
        </div>
        <Link to={workspaceLink}>
          <button className="btn btn-outline btn-sm" title="Open the same simulation full-size, with this preset">
            ⤢ Open full workspace
          </button>
        </Link>
      </div>
      <div style={{ height: height ?? 640, padding: 12, minHeight: 420 }}>
        <Suspense fallback={<Spinner label={`Loading ${meta.name}…`} />}>
          <Component presetId={presetId ?? null} embedded />
        </Suspense>
      </div>
      {caption && (
        <div className="tiny muted" style={{ padding: "0 16px 12px", lineHeight: 1.55 }}>
          {caption}
        </div>
      )}
    </div>
  );
}
