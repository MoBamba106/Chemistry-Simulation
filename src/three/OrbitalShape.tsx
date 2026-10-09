/**
 * OrbitalShape — schematic 3D renderings of s, p, and d orbitals.
 *
 * These are boundary-surface representations (the shape containing ~90% of
 * the electron probability density), not literal electron paths. The UI
 * always says so.
 */
import * as React from "react";

export type OrbitalKind =
  | "s"
  | "px" | "py" | "pz"
  | "dxy" | "dyz" | "dxz" | "dx2y2" | "dz2";

export interface OrbitalShapeProps {
  kind: OrbitalKind;
  color?: string;
  color2?: string;
  opacity?: number;
  scale?: number;
}

const AXIS: Record<string, [number, number, number]> = {
  px: [1, 0, 0],
  py: [0, 1, 0],
  pz: [0, 0, 1],
};

export function OrbitalShape({
  kind,
  color = "#4cc3ff",
  color2 = "#ff7ab8",
  opacity = 0.5,
  scale = 1,
}: OrbitalShapeProps) {
  if (kind === "s") {
    return (
      <group scale={scale}>
        <mesh>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={opacity}
            roughness={0.5}
            side={2}
            depthWrite={false}
          />
        </mesh>
      </group>
    );
  }

  if (kind.startsWith("p")) {
    const axis = AXIS[kind];
    return (
      <group scale={scale}>
        <Lobe position={axis.map((v) => v * 0.62) as [number, number, number]} axis={axis} color={color} opacity={opacity} />
        <Lobe position={axis.map((v) => v * -0.62) as [number, number, number]} axis={axis} color={color2} opacity={opacity} />
        <mesh>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    );
  }

  // d orbitals
  if (kind === "dz2") {
    return (
      <group scale={scale}>
        <Lobe position={[0, 0, 0.85]} axis={[0, 0, 1]} color={color} opacity={opacity} lobScale={1.15} />
        <Lobe position={[0, 0, -0.85]} axis={[0, 0, 1]} color={color} opacity={opacity} lobScale={1.15} />
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.52, 0.16, 16, 48]} />
          <meshStandardMaterial color={color2} transparent opacity={opacity} roughness={0.5} depthWrite={false} side={2} />
        </mesh>
      </group>
    );
  }

  const dLobes: Record<string, Array<[number, number, number]>> = {
    dxy: [[0.62, 0.62, 0], [-0.62, -0.62, 0], [0.62, -0.62, 0], [-0.62, 0.62, 0]],
    dxz: [[0.62, 0, 0.62], [-0.62, 0, -0.62], [0.62, 0, -0.62], [-0.62, 0, 0.62]],
    dyz: [[0, 0.62, 0.62], [0, -0.62, -0.62], [0, 0.62, -0.62], [0, -0.62, 0.62]],
    dx2y2: [[0.88, 0, 0], [-0.88, 0, 0], [0, 0.88, 0], [0, -0.88, 0]],
  };
  const lobes = dLobes[kind] ?? dLobes.dxy;
  return (
    <group scale={scale}>
      {lobes.map((pos, i) => (
        <Lobe key={i} position={pos} axis={norm(pos)} color={i < 2 ? color : color2} opacity={opacity} lobScale={0.8} />
      ))}
      <mesh>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function norm(v: [number, number, number]): [number, number, number] {
  const m = Math.hypot(...v) || 1;
  return [v[0] / m, v[1] / m, v[2] / m];
}

function Lobe({
  position,
  axis,
  color,
  opacity,
  lobScale = 1,
}: {
  position: [number, number, number];
  axis: [number, number, number];
  color: string;
  opacity: number;
  lobScale?: number;
}) {
  // elongated sphere along the axis
  const euler: [number, number, number] =
    axis[0] === 1 ? [0, 0, Math.PI / 2] :
    axis[1] === 1 ? [0, 0, 0] :
    axis[2] === 1 ? [Math.PI / 2, 0, 0] :
    axis[0] !== 0 && axis[1] !== 0 && axis[2] === 0 ? [0, 0, Math.PI / 4] :
    axis[0] !== 0 && axis[2] !== 0 && axis[1] === 0 ? [0, -Math.PI / 4, Math.PI / 2] :
    axis[1] !== 0 && axis[2] !== 0 && axis[0] === 0 ? [Math.PI / 4, 0, 0] :
    [0, 0, 0];
  return (
    <mesh position={position} rotation={euler} scale={lobScale}>
      <sphereGeometry args={[0.34, 24, 24]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        roughness={0.5}
        depthWrite={false}
        side={2}
      />
    </mesh>
  );
}

/** Scale factor per axis so the sphere stretches along it. */
export function orbitalScaleFor(axis: [number, number, number]): [number, number, number] {
  return [
    1 + Math.abs(axis[0]) * 0.9,
    1 + Math.abs(axis[1]) * 0.9,
    1 + Math.abs(axis[2]) * 0.9,
  ];
}
