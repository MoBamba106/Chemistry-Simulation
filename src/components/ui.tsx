/**
 * Shared UI kit — buttons, panels, controls, callouts, modals, formula
 * rendering. Everything visual in the app is composed from these.
 */
import * as React from "react";
import type { FormulaPart } from "@/chem/lewis";

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type BtnVariant = "primary" | "default" | "ghost" | "outline" | "danger";

export function Button({
  variant = "default",
  size = "md",
  icon,
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}) {
  const cls = [
    "btn",
    variant === "primary" ? "btn-primary" : "",
    variant === "ghost" ? "btn-ghost" : "",
    variant === "outline" ? "btn-outline" : "",
    variant === "danger" ? "btn-danger" : "",
    size === "sm" ? "btn-sm" : "",
    size === "lg" ? "btn-lg" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={cls} {...rest}>
      {icon}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Badges                                                              */
/* ------------------------------------------------------------------ */

export function Badge({
  tone = "default",
  children,
  className = "",
  style,
}: {
  tone?: "default" | "accent" | "violet" | "good" | "warn" | "bad";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const map = {
    default: "",
    accent: "badge-accent",
    violet: "badge-violet",
    good: "badge-good",
    warn: "badge-warn",
    bad: "badge-bad",
  };
  return <span className={`badge ${map[tone]} ${className}`} style={style}>{children}</span>;
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

export function Panel({
  title,
  actions,
  children,
  className = "",
  bodyClassName = "",
  style,
}: {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`panel ${className}`} style={style}>
      {title && (
        <div className="panel-header">
          <div className="panel-title">{title}</div>
          {actions}
        </div>
      )}
      <div className={`panel-body ${bodyClassName}`}>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Segmented control                                                   */
/* ------------------------------------------------------------------ */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  accent = false,
  style,
}: {
  options: Array<{ value: T; label: React.ReactNode; title?: string }>;
  value: T;
  onChange: (v: T) => void;
  accent?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div className="seg" style={style} role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          title={o.title}
          className={`seg-item ${value === o.value ? (accent ? "active-accent" : "active") : ""}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Slider                                                              */
/* ------------------------------------------------------------------ */

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  disabled?: boolean;
}) {
  return (
    <div className="slider-row">
      <div className="slider-label">
        <span>{label}</span>
        <b>{format ? format(value) : value}</b>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stepper                                                             */
/* ------------------------------------------------------------------ */

export function Stepper({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  label,
  color,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
  color?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {label && (
        <span style={{ fontSize: 12.5, color: "var(--text-2)", fontWeight: 550, minWidth: 74 }}>
          {label}
        </span>
      )}
      <div className="stepper">
        <button
          aria-label={`Decrease ${label ?? "value"}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          −
        </button>
        <div className="stepper-value" style={color ? { color } : undefined}>
          {value}
        </div>
        <button
          aria-label={`Increase ${label ?? "value"}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Toggle                                                              */
/* ------------------------------------------------------------------ */

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="track" />
      <span>{label}</span>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Callout                                                             */
/* ------------------------------------------------------------------ */

export function Callout({
  tone = "info",
  title,
  icon,
  children,
  style,
}: {
  tone?: "info" | "success" | "warning" | "danger" | "violet";
  title?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const icons = { info: "ℹ️", success: "✅", warning: "⚠️", danger: "⛔", violet: "🔮" };
  return (
    <div className={`callout callout-${tone}`} style={style} role={tone === "danger" || tone === "warning" ? "alert" : undefined}>
      <div className="callout-icon">{icon ?? icons[tone]}</div>
      <div>
        {title && <div className="callout-title">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Search input                                                        */
/* ------------------------------------------------------------------ */

export function SearchInput({
  value,
  onChange,
  placeholder,
  autoFocus,
  onKeyDown,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  id?: string;
}) {
  return (
    <div className="search-wrap">
      <span className="search-icon" aria-hidden>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </span>
      <input
        id={id}
        className="search-input"
        type="text"
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {value && (
        <button className="search-clear" aria-label="Clear search" onClick={() => onChange("")}>
          ✕
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  wide?: boolean;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal" style={wide ? { maxWidth: 900 } : undefined}>
        <div className="modal-header">
          <h3 style={{ fontSize: 16 }}>{title}</h3>
          <Button variant="ghost" size="sm" className="btn-icon" aria-label="Close dialog" onClick={onClose}>
            ✕
          </Button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chemical formula rendering                                          */
/* ------------------------------------------------------------------ */

export function ChemFormula({
  parts,
  className,
  style,
}: {
  parts: FormulaPart[];
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={className} style={style}>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          {p.text}
          {p.sub !== undefined && <sub style={{ fontSize: "0.72em" }}>{p.sub}</sub>}
          {p.sup !== undefined && (
            <sup style={{ fontSize: "0.72em", fontWeight: 700 }}>{p.sup}</sup>
          )}
        </React.Fragment>
      ))}
    </span>
  );
}

/** Plain-text formula (unicode subscripts) — for places where JSX is heavy. */
export function FormulaText({ formula, charge }: { formula: string; charge?: number }) {
  const SUP: Record<string, string> = { "1+": "⁺", "2+": "²⁺", "3+": "³⁺", "1-": "⁻", "2-": "²⁻", "3-": "³⁻", "-": "⁻", "+": "⁺" };
  const label = charge ? SUP[`${Math.abs(charge)}${charge > 0 ? "+" : "-"}`] ?? (charge > 0 ? "+" : "−") : "";
  return (
    <span>
      {formula}
      {label && <sup style={{ fontWeight: 700 }}>{label}</sup>}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state / spinner                                               */
/* ------------------------------------------------------------------ */

export function EmptyState({ icon = "🧪", title, hint, action }: {
  icon?: string;
  title: string;
  hint?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden>{icon}</div>
      <div style={{ fontWeight: 650, color: "var(--text-1)", fontSize: 14.5 }}>{title}</div>
      {hint && <div style={{ maxWidth: 380, fontSize: 13 }}>{hint}</div>}
      {action}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: 30 }}>
      <div className="spinner" />
      {label && <span className="muted" style={{ fontSize: 13 }}>{label}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat tile                                                           */
/* ------------------------------------------------------------------ */

export function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
