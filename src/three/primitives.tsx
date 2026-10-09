/**
 * Reusable Three.js primitives: bond cylinders, arrows, glow markers.
 */
import * as React from "react";
import { useMemo } from "react";
import * as THREE from "three";
import type { Vec3 } from "@/chem/vsepr";

const UP = new THREE.Vector3(0, 1, 0);

export function dirQuaternion(from: Vec3, to: Vec3): THREE.Quaternion {
  const dir = new THREE.Vector3(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
  const q = new THREE.Quaternion();
  q.setFromUnitVectors(UP, dir.clone().normalize());
  return q;
}

export function midpoint(a: Vec3, b: Vec3): Vec3 {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
}

export function vlen(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

export interface CylinderProps {
  from: Vec3;
  to: Vec3;
  radius?: number;
  color?: string;
  opacity?: number;
}

/** A cylinder stretched between two points. */
export function Cylinder({ from, to, radius = 0.09, color = "#b8c4dd", opacity = 1 }: CylinderProps) {
  const { pos, quat, length } = useMemo(() => {
    const m = midpoint(from, to);
    return {
      pos: m,
      quat: dirQuaternion(from, to),
      length: vlen(from, to),
    };
  }, [from[0], from[1], from[2], to[0], to[1], to[2]]);

  return (
    <mesh position={pos} quaternion={quat}>
      <cylinderGeometry args={[radius, radius, Math.max(length, 0.001), 14]} />
      <meshStandardMaterial
        color={color}
        roughness={0.35}
        metalness={0.1}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}

export interface ArrowProps {
  from: Vec3;
  to: Vec3;
  color?: string;
  radius?: number;
  headLength?: number;
  headWidth?: number;
  opacity?: number;
}

/** 3D arrow (shaft + cone head) between two points. */
export function Arrow({
  from,
  to,
  color = "#ff5fa2",
  radius = 0.045,
  headLength = 0.28,
  headWidth = 0.16,
  opacity = 1,
}: ArrowProps) {
  const len = vlen(from, to);
  if (len < 1e-4) return null;
  const dir: Vec3 = [(to[0] - from[0]) / len, (to[1] - from[1]) / len, (to[2] - from[2]) / len];
  const shaftLen = Math.max(0.01, len - headLength);
  const quat = dirQuaternion([0, 0, 0], dir);
  const shaftMid: Vec3 = [
    from[0] + dir[0] * (shaftLen / 2),
    from[1] + dir[1] * (shaftLen / 2),
    from[2] + dir[2] * (shaftLen / 2),
  ];
  const headBase: Vec3 = [
    from[0] + dir[0] * shaftLen,
    from[1] + dir[1] * shaftLen,
    from[2] + dir[2] * shaftLen,
  ];
  const headMid: Vec3 = [
    headBase[0] + dir[0] * (headLength / 2),
    headBase[1] + dir[1] * (headLength / 2),
    headBase[2] + dir[2] * (headLength / 2),
  ];

  return (
    <group>
      <mesh position={shaftMid} quaternion={quat}>
        <cylinderGeometry args={[radius, radius, shaftLen, 10]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      <mesh position={headMid} quaternion={quat}>
        <coneGeometry args={[headWidth, headLength, 14]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
    </group>
  );
}

/** Soft glowing sprite used for electrons and highlights. */
export function GlowDot({
  position,
  color = "#7dd8ff",
  size = 0.12,
}: {
  position: Vec3;
  color?: string;
  size?: number;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 14, 14]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

export function useLerp(target: number, speed = 0.15): number {
  const ref = React.useRef(target);
  ref.current += (target - ref.current) * speed;
  return ref.current;
}
