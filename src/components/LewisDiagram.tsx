/**
 * LewisDiagram — renders a species as a classic 2-D Lewis dot structure
 * (SVG): bonds as lines (double/triple parallel), lone pairs as dots,
 * formal charges and net charge as superscripts, brackets for polyatomic
 * ions. Clickable atoms when interactive.
 */
import * as React from "react";
import { useMemo } from "react";
import { Species, analyzeSpecies } from "@/chem/lewis";
import { layout2D } from "@/chem/layout";

export interface LewisDiagramProps {
  species: Species;
  width?: number;
  height?: number;
  showLonePairs?: boolean;
  showFormalCharges?: boolean;
  selectedAtomId?: string | null;
  highlightAtomIds?: string[];
  onSelectAtom?: (id: string | null) => void;
  resonanceIndex?: number;
  style?: React.CSSProperties;
}

export function LewisDiagram({
  species,
  width = 420,
  height = 300,
  showLonePairs = true,
  showFormalCharges = true,
  selectedAtomId = null,
  highlightAtomIds = [],
  onSelectAtom,
  style,
}: LewisDiagramProps) {
  const analysis = useMemo(() => analyzeSpecies(species), [species]);
  const layout = useMemo(() => layout2D(species), [species]);

  const { scale, offsetX, offsetY } = useMemo(() => {
    const pts = [...layout.positions.values()];
    if (pts.length === 0) return { scale: 60, offsetX: width / 2, offsetY: height / 2 };
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const minX = Math.min(...xs) - 1;
    const maxX = Math.max(...xs) + 1;
    const minY = Math.min(...ys) - 1;
    const maxY = Math.max(...ys) + 1;
    const s = Math.min(width / (maxX - minX), height / (maxY - minY), 95);
    return {
      scale: s,
      offsetX: width / 2 - ((minX + maxX) / 2) * s,
      offsetY: height / 2 + ((minY + maxY) / 2) * s,
    };
  }, [layout, width, height]);

  const tx = (x: number) => x * scale + offsetX;
  const ty = (y: number) => y * scale + offsetY;

  const highlightSet = useMemo(() => new Set(highlightAtomIds), [highlightAtomIds]);

  if (species.atoms.length === 0) {
    return (
      <svg width={width} height={height} style={style}>
        <text x={width / 2} y={height / 2} textAnchor="middle" fill="#5d6a8a" fontSize={13}>
          Add atoms to see the Lewis structure
        </text>
      </svg>
    );
  }

  const atomR = 0.34 * scale * 0.55; // visual gap around symbols

  return (
    <svg width={width} height={height} style={style} role="img" aria-label={`Lewis structure of ${analysis.formula}`}>
      {/* brackets for charged species */}
      {species.charge !== 0 && species.atoms.length > 1 && (
        <BracketBox
          positions={[...layout.positions.values()].map((p) => ({ x: tx(p.x), y: ty(p.y) }))}
          charge={analysis.chargeLabel}
        />
      )}

      {/* bonds */}
      {species.bonds.map((bond) => {
        const pa = layout.positions.get(bond.a);
        const pb = layout.positions.get(bond.b);
        if (!pa || !pb) return null;
        const x1 = tx(pa.x), y1 = ty(pa.y), x2 = tx(pb.x), y2 = ty(pb.y);
        const dx = x2 - x1, dy = y2 - y1;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len, uy = dy / len;
        // shorten by atom radius on both ends
        const sx = x1 + ux * atomR, sy = y1 + uy * atomR;
        const ex = x2 - ux * atomR, ey = y2 - uy * atomR;
        const px = -uy, py = ux; // perpendicular
        const gap = Math.min(4.5, scale * 0.06);
        const selected = selectedAtomId === bond.a || selectedAtomId === bond.b;
        const color = selected ? "#4cc3ff" : "#aebdda";
        const lines: Array<[number, number]> =
          bond.order === 1 ? [[0, 0]] :
          bond.order === 2 ? [[gap / 2, -gap / 2]] :
          [[0, gap], [0, -gap]];
        const offs =
          bond.order === 1 ? [0] :
          bond.order === 2 ? [gap / 2, -gap / 2] :
          [0, gap, -gap];
        void lines;
        return (
          <g key={bond.id}>
            {offs.map((o, i) => (
              <line
                key={i}
                x1={sx + px * o}
                y1={sy + py * o}
                x2={ex + px * o}
                y2={ey + py * o}
                stroke={color}
                strokeWidth={2.4}
                strokeLinecap="round"
              />
            ))}
          </g>
        );
      })}

      {/* lone pairs */}
      {showLonePairs &&
        layout.lonePairs.map((lp, i) => {
          const pos = layout.positions.get(lp.atomId);
          if (!pos) return null;
          const cx = tx(pos.x);
          const cy = ty(pos.y);
          const dist = atomR + scale * 0.24;
          const bx = cx + Math.cos(lp.angle) * dist;
          const by = cy - Math.sin(lp.angle) * dist;
          // two dots perpendicular to the lp direction
          const perpX = -Math.sin(lp.angle);
          const perpY = -Math.cos(lp.angle);
          const spread = scale * 0.11;
          const dim = highlightSet.size > 0 && !highlightSet.has(lp.atomId);
          return (
            <g key={i} opacity={dim ? 0.35 : 1}>
              <circle cx={bx + perpX * spread} cy={by + perpY * spread} r={2.6} fill="#8ec9ff" />
              <circle cx={bx - perpX * spread} cy={by - perpY * spread} r={2.6} fill="#8ec9ff" />
            </g>
          );
        })}

      {/* unpaired electrons */}
      {showLonePairs &&
        analysis.atoms
          .filter((a) => a.unpairedElectron)
          .map((a) => {
            const pos = layout.positions.get(a.id);
            if (!pos) return null;
            const lpsHere = layout.lonePairs.filter((l) => l.atomId === a.id).length;
            const angle = Math.PI / 2 + lpsHere * 1.2;
            return (
              <circle
                key={a.id}
                cx={tx(pos.x) + Math.cos(angle) * (atomR + scale * 0.24)}
                cy={ty(pos.y) - Math.sin(angle) * (atomR + scale * 0.24)}
                r={2.6}
                fill="#ffc94d"
              />
            );
          })}

      {/* atoms */}
      {species.atoms.map((atom) => {
        const pos = layout.positions.get(atom.id);
        if (!pos) return null;
        const info = analysis.byId.get(atom.id)!;
        const x = tx(pos.x);
        const y = ty(pos.y);
        const selected = selectedAtomId === atom.id;
        const highlighted = highlightSet.has(atom.id);
        const interactive = !!onSelectAtom;
        return (
          <g
            key={atom.id}
            style={{ cursor: interactive ? "pointer" : "default" }}
            onClick={() => onSelectAtom?.(selected ? null : atom.id)}
          >
            {(selected || highlighted) && (
              <circle
                cx={x}
                cy={y}
                r={atomR + 7}
                fill={highlighted ? "rgba(251,191,36,0.14)" : "rgba(76,195,255,0.14)"}
                stroke={highlighted ? "#fbbf24" : "#4cc3ff"}
                strokeWidth={1.4}
              />
            )}
            {/* white halo behind symbol so bonds don't strike through */}
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={Math.min(20, scale * 0.3)}
              fontWeight={750}
              fill={selected ? "#4cc3ff" : highlighted ? "#fbbf24" : "#eef3ff"}
              stroke="#0c1120"
              strokeWidth={4}
              paintOrder="stroke"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {atom.element}
            </text>
            {showFormalCharges && info.formalCharge !== 0 && (
              <text
                x={x + atomR * 0.95}
                y={y - atomR * 0.95}
                textAnchor="middle"
                fontSize={Math.min(13, scale * 0.19)}
                fontWeight={700}
                fill={info.formalCharge > 0 ? "#ff9d9d" : "#9dc4ff"}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {info.formalCharge > 0 ? `${info.formalCharge === 1 ? "" : info.formalCharge}+` : `${info.formalCharge === -1 ? "" : Math.abs(info.formalCharge)}−`}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function BracketBox({
  positions,
  charge,
}: {
  positions: Array<{ x: number; y: number }>;
  charge: string;
}) {
  if (positions.length === 0) return null;
  const pad = 34;
  const minX = Math.min(...positions.map((p) => p.x)) - pad;
  const maxX = Math.max(...positions.map((p) => p.x)) + pad;
  const minY = Math.min(...positions.map((p) => p.y)) - pad;
  const maxY = Math.max(...positions.map((p) => p.y)) + pad;
  const r = 10;
  const bl = 16; // bracket arm length
  const stroke = "#64749b";
  const w = 1.6;
  return (
    <g>
      {/* left bracket */}
      <path
        d={`M ${minX + bl} ${minY} L ${minX + r} ${minY} Q ${minX} ${minY} ${minX} ${minY + r}
            L ${minX} ${maxY - r} Q ${minX} ${maxY} ${minX + r} ${maxY} L ${minX + bl} ${maxY}`}
        fill="none" stroke={stroke} strokeWidth={w}
      />
      {/* right bracket */}
      <path
        d={`M ${maxX - bl} ${minY} L ${maxX - r} ${minY} Q ${maxX} ${minY} ${maxX} ${minY + r}
            L ${maxX} ${maxY - r} Q ${maxX} ${maxY} ${maxX - r} ${maxY} L ${maxX - bl} ${maxY}`}
        fill="none" stroke={stroke} strokeWidth={w}
      />
      <text
        x={maxX + 5}
        y={minY + 4}
        fontSize={17}
        fontWeight={750}
        fill="#c4b0ff"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {charge}
      </text>
    </g>
  );
}
