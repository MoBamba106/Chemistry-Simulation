/**
 * MoleculeView — the shared 3D renderer for any Species.
 *
 * Renders ball-and-stick atoms (sized by covalent radius, CPK colors),
 * single/double/triple bonds as parallel cylinders, lone pairs as electron
 * dots, and optional dipole arrows. Atoms and bonds are clickable.
 *
 * Used by the Molecule Builder, VSEPR lab, polarity explorer, the molecule
 * library viewer, lesson embeds, and concept popovers — one renderer
 * everywhere, as required.
 */
import * as React from "react";
import { useMemo, useState } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Species, SpeciesAnalysis } from "@/chem/lewis";
import { analyzeSpecies } from "@/chem/lewis";
import { Layout3DResult, layout3D } from "@/chem/layout";
import type { Vec3 } from "@/chem/vsepr";
import { computeDipole } from "@/chem/bonding";
import { Arrow, Cylinder, midpoint, vlen } from "./primitives";

export function atomRadius(symbol: string, rCov: number): number {
  return Math.max(0.3, Math.min(1.05, rCov * 0.78));
}

export interface MoleculeViewProps {
  species: Species;
  analysis?: SpeciesAnalysis;
  layout?: Layout3DResult;
  showLonePairs?: boolean;
  showLabels?: boolean;
  showDipoles?: boolean;
  showNetDipole?: boolean;
  selectedAtomId?: string | null;
  selectedBondId?: string | null;
  highlightAtomIds?: string[];
  dimmedAtomIds?: string[];
  onSelectAtom?: (id: string | null) => void;
  onSelectBond?: (id: string | null) => void;
  interactive?: boolean;
  /** Extra markers rendered at atom positions (e.g. partial charge labels). */
  atomAnnotations?: Map<string, string>;
}

export function MoleculeView({
  species,
  analysis: analysisProp,
  layout: layoutProp,
  showLonePairs = true,
  showLabels = true,
  showDipoles = false,
  showNetDipole = false,
  selectedAtomId = null,
  selectedBondId = null,
  highlightAtomIds = [],
  dimmedAtomIds = [],
  onSelectAtom,
  onSelectBond,
  interactive = true,
  atomAnnotations,
}: MoleculeViewProps) {
  const analysis = useMemo(
    () => analysisProp ?? analyzeSpecies(species),
    [analysisProp, species]
  );
  const layout = useMemo(
    () => layoutProp ?? layout3D(species),
    [layoutProp, species]
  );
  const dipole = useMemo(
    () => (showDipoles || showNetDipole ? computeDipole(species, analysis, layout) : null),
    [showDipoles, showNetDipole, species, analysis, layout]
  );
  const [hovered, setHovered] = useState<string | null>(null);

  const highlightSet = useMemo(() => new Set(highlightAtomIds), [highlightAtomIds]);
  const dimSet = useMemo(() => new Set(dimmedAtomIds), [dimmedAtomIds]);

  return (
    <group>
      {/* Bonds */}
      {species.bonds.map((bond) => {
        const pa = layout.positions.get(bond.a);
        const pb = layout.positions.get(bond.b);
        if (!pa || !pb) return null;
        const selected = selectedBondId === bond.id;
        return (
          <BondGroup
            key={bond.id}
            pa={pa}
            pb={pb}
            order={bond.order}
            color={selected ? "#32968f" : "#9a8775"}
            interactive={interactive && !!onSelectBond}
            onClick={() => onSelectBond?.(selected ? null : bond.id)}
          />
        );
      })}

      {/* Atoms */}
      {species.atoms.map((atom) => {
        const pos = layout.positions.get(atom.id);
        const info = analysis.byId.get(atom.id);
        if (!pos || !info) return null;
        const r = atomRadius(atom.element, info.element.rCov);
        const isSelected = selectedAtomId === atom.id;
        const isHighlighted = highlightSet.has(atom.id);
        const isDimmed = dimSet.has(atom.id);
        const isHovered = hovered === atom.id;
        return (
          <group key={atom.id} position={pos}>
            <mesh
              onClick={(e) => {
                if (!interactive) return;
                e.stopPropagation();
                onSelectAtom?.(isSelected ? null : atom.id);
              }}
              onPointerOver={(e) => {
                if (!interactive) return;
                e.stopPropagation();
                setHovered(atom.id);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setHovered(null);
                document.body.style.cursor = "";
              }}
            >
              <sphereGeometry args={[r, 32, 32]} />
              <meshStandardMaterial
                color={info.element.color}
                roughness={0.32}
                metalness={0.08}
                emissive={
                  isSelected ? "#32968f" : isHighlighted ? "#b18445" : isHovered ? "#7b6758" : "#000000"
                }
                emissiveIntensity={isSelected ? 0.35 : isHighlighted ? 0.35 : isHovered ? 0.28 : 0}
                transparent={isDimmed}
                opacity={isDimmed ? 0.28 : 1}
              />
            </mesh>
            {(showLabels || atomAnnotations) && (
              <Html center distanceFactor={9} style={{ pointerEvents: "none" }}>
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#4e3f4f",
                    textShadow: "0 0 4px rgba(244,230,210,0.95), 0 1px 1px rgba(244,230,210,0.95)",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                    transform: `translateY(${-(r * 26 + 6)}px)`,
                  }}
                >
                  {atom.element}
                  {atomAnnotations?.get(atom.id) ?? ""}
                </div>
              </Html>
            )}
            {isHovered && interactive && (
              <Html center distanceFactor={9} style={{ pointerEvents: "none" }}>
                <div
                  style={{
                    background: "rgba(244,230,210,0.97)",
                    border: "1px solid #c4a984",
                    borderRadius: 6,
                    padding: "5px 9px",
                    fontSize: 11.5,
                    color: "#4e3f4f",
                    whiteSpace: "nowrap",
                    transform: `translateY(${r * 30 + 22}px)`,
                    boxShadow: "0 4px 12px rgba(66,47,34,0.16)",
                  }}
                >
                  <b>{info.element.name}</b>
                  {info.formalCharge !== 0 && (
                    <span> · FC {info.formalCharge > 0 ? `+${info.formalCharge}` : `−${Math.abs(info.formalCharge)}`}</span>
                  )}
                  <span> · {info.lonePairs} lone pair{info.lonePairs === 1 ? "" : "s"}</span>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Lone pairs */}
      {showLonePairs &&
        layout.lonePairs.map((lp, i) => {
          const atomPos = layout.positions.get(lp.atomId);
          const info = analysis.byId.get(lp.atomId);
          if (!atomPos || !info) return null;
          const r = atomRadius(info.element.symbol, info.element.rCov);
          const dist = r + 0.3;
          const base: Vec3 = [
            atomPos[0] + lp.dir[0] * dist,
            atomPos[1] + lp.dir[1] * dist,
            atomPos[2] + lp.dir[2] * dist,
          ];
          // perpendicular spread direction
          const perp = perpendicular(lp.dir);
          const s = 0.11;
          const e1: Vec3 = [base[0] + perp[0] * s, base[1] + perp[1] * s, base[2] + perp[2] * s];
          const e2: Vec3 = [base[0] - perp[0] * s, base[1] - perp[1] * s, base[2] - perp[2] * s];
          const dim = dimSet.has(lp.atomId);
          return (
            <group key={`lp-${i}`} visible={!dim}>
              <LonePairDot position={e1} />
              <LonePairDot position={e2} />
            </group>
          );
        })}

      {/* Bond dipoles */}
      {showDipoles &&
        dipole?.bondDipoles.map((bd) => {
          const m = midpoint(bd.from, bd.to);
          const len = Math.hypot(...bd.vector);
          if (len < 1e-3) return null;
          const unit: Vec3 = [bd.vector[0] / len, bd.vector[1] / len, bd.vector[2] / len];
          const half = Math.min(len * 0.55, 0.55);
          const from: Vec3 = [m[0] - unit[0] * half, m[1] - unit[1] * half, m[2] - unit[2] * half];
          const to: Vec3 = [m[0] + unit[0] * half, m[1] + unit[1] * half, m[2] + unit[2] * half];
          return (
            <Arrow
              key={bd.bondId}
              from={from}
              to={to}
              color="#ffb648"
              radius={0.035}
              headLength={0.2}
              headWidth={0.11}
              opacity={0.95}
            />
          );
        })}

      {/* Net dipole */}
      {showNetDipole && dipole && dipole.polar && <NetDipoleArrow species={species} layout={layout} dipole={dipole} />}
    </group>
  );
}

function NetDipoleArrow({
  species,
  layout,
  dipole,
}: {
  species: Species;
  layout: Layout3DResult;
  dipole: NonNullable<ReturnType<typeof computeDipole>>;
}) {
  const center = useMemo(() => {
    const pts = species.atoms.map((a) => layout.positions.get(a.id)!).filter(Boolean);
    if (!pts.length) return [0, 0, 0] as Vec3;
    const c = pts.reduce((s, p) => [s[0] + p[0], s[1] + p[1], s[2] + p[2]] as Vec3, [0, 0, 0] as Vec3);
    return [c[0] / pts.length, c[1] / pts.length, c[2] / pts.length] as Vec3;
  }, [species, layout]);
  const mag = dipole.netMagnitude;
  const unit: Vec3 = [
    dipole.netVector[0] / (mag || 1),
    dipole.netVector[1] / (mag || 1),
    dipole.netVector[2] / (mag || 1),
  ];
  const arrowLen = Math.min(1.1 + mag * 0.5, 2.4);
  const to: Vec3 = [
    center[0] + unit[0] * arrowLen,
    center[1] + unit[1] * arrowLen,
    center[2] + unit[2] * arrowLen,
  ];
  return (
    <group>
      <Arrow from={center} to={to} color="#ff5fa2" radius={0.055} headLength={0.3} headWidth={0.18} />
      <Html position={to} center distanceFactor={9} style={{ pointerEvents: "none" }}>
        <div style={{ color: "#ff8fc0", fontWeight: 700, fontSize: 12, textShadow: "0 1px 4px #000", transform: "translateY(-16px)" }}>
          δ− net dipole
        </div>
      </Html>
    </group>
  );
}

function LonePairDot({ position }: { position: Vec3 }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.075, 12, 12]} />
      <meshStandardMaterial color="#8ec9ff" emissive="#3d7ec2" emissiveIntensity={0.7} roughness={0.4} />
    </mesh>
  );
}

function BondGroup({
  pa,
  pb,
  order,
  color,
  interactive,
  onClick,
}: {
  pa: Vec3;
  pb: Vec3;
  order: number;
  color: string;
  interactive: boolean;
  onClick: () => void;
}) {
  const len = vlen(pa, pb);
  const offsets = useMemo(() => {
    if (order <= 1) return [[0, 0, 0] as Vec3];
    const dir: Vec3 = [(pb[0] - pa[0]) / len, (pb[1] - pa[1]) / len, (pb[2] - pa[2]) / len];
    let perp = cross(dir, [0, 1, 0] as Vec3);
    if (Math.hypot(...perp) < 0.01) perp = cross(dir, [1, 0, 0] as Vec3);
    const m = Math.hypot(...perp) || 1;
    perp = [perp[0] / m, perp[1] / m, perp[2] / m];
    const gap = 0.16;
    if (order === 2)
      return [
        [perp[0] * gap * 0.5, perp[1] * gap * 0.5, perp[2] * gap * 0.5] as Vec3,
        [-perp[0] * gap * 0.5, -perp[1] * gap * 0.5, -perp[2] * gap * 0.5] as Vec3,
      ];
    return [
      [0, 0, 0] as Vec3,
      [perp[0] * gap, perp[1] * gap, perp[2] * gap] as Vec3,
      [-perp[0] * gap, -perp[1] * gap, -perp[2] * gap] as Vec3,
    ];
  }, [pa, pb, order, len]);

  const radius = order === 1 ? 0.085 : 0.062;
  const mid = midpoint(pa, pb);

  return (
    <group>
      {offsets.map((off, i) => {
        const from: Vec3 = [pa[0] + off[0], pa[1] + off[1], pa[2] + off[2]];
        const to: Vec3 = [pb[0] + off[0], pb[1] + off[1], pb[2] + off[2]];
        return <Cylinder key={i} from={from} to={to} radius={radius} color={color} />;
      })}
      {interactive && (
        <mesh
          position={mid}
          quaternion={quatFromTo(pa, pb)}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "";
          }}
        >
          <cylinderGeometry args={[radius + 0.09, radius + 0.09, len, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

function quatFromTo(a: Vec3, b: Vec3): THREE.Quaternion {
  const dir = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize();
  return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function perpendicular(dir: Vec3): Vec3 {
  let p = cross(dir, [0, 1, 0]);
  if (Math.hypot(...p) < 0.01) p = cross(dir, [1, 0, 0]);
  const m = Math.hypot(...p) || 1;
  return [p[0] / m, p[1] / m, p[2] / m];
}

/** Pick a readable label color for a given atom color (dark labels on light atoms). */
function labelColorFor(atomColor: string): string {
  const c = new THREE.Color(atomColor);
  const lum = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
  return lum > 0.55 ? "#10141f" : "#f4f7ff";
}
