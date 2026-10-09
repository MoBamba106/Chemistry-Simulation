/**
 * BohrAtom — animated Bohr-model atom: nucleus of protons/neutrons with
 * electrons on quantized shells. Used by the Atom Builder simulation.
 *
 * NOTE (shown in the UI): the Bohr model is a teaching approximation. Real
 * electrons live in probability clouds (orbitals), not on ring "orbits".
 */
import * as React from "react";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { bohrShells } from "@/chem/electronConfig";

export interface BohrAtomProps {
  protons: number;
  neutrons: number;
  electrons: number;
  /** Highlight (amber) the outermost shell electrons. */
  highlightValence?: boolean;
  spinSpeed?: number;
}

/** Deterministic PRNG so nuclei look the same every render. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PROTON_COLOR = "#ff6b5e";
const NEUTRON_COLOR = "#9fb0cf";

export function BohrAtom({
  protons,
  neutrons,
  electrons,
  highlightValence = true,
  spinSpeed = 1,
}: BohrAtomProps) {
  const shells = useMemo(() => bohrShells(Math.max(0, electrons)), [electrons]);

  const nucleons = useMemo(() => {
    const rnd = mulberry32(protons * 1000 + neutrons);
    const total = protons + neutrons;
    const radius = total <= 1 ? 0.18 : 0.2 + 0.135 * Math.cbrt(total);
    const items: Array<{ pos: [number, number, number]; proton: boolean; r: number }> = [];
    // Fibonacci-ish sphere packing with jitter
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < total; i++) {
      const y = total <= 1 ? 0 : 1 - (i / (total - 1)) * 2;
      const rHoriz = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      const jitter = () => (rnd() - 0.5) * 0.12 * radius;
      const pos: [number, number, number] = [
        Math.cos(theta) * rHoriz * radius + jitter(),
        y * radius + jitter(),
        Math.sin(theta) * rHoriz * radius + jitter(),
      ];
      items.push({ pos, proton: i < protons, r: 0.085 });
    }
    // shuffle so protons/neutrons interleave visually
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return { items, radius };
  }, [protons, neutrons]);

  return (
    <group>
      {/* Nucleus */}
      <group>
        {nucleons.items.map((n, i) => (
          <mesh key={i} position={n.pos}>
            <sphereGeometry args={[n.r, 12, 12]} />
            <meshStandardMaterial
              color={n.proton ? PROTON_COLOR : NEUTRON_COLOR}
              roughness={0.4}
              emissive={n.proton ? "#5e1712" : "#1a2338"}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
        <pointLight position={[0, 0, 0]} intensity={0.4} distance={3} color="#ffd9a0" />
      </group>

      {/* Electron shells */}
      {shells.map((count, si) => {
        const n = si + 1;
        const radius = 0.85 + 0.72 * n;
        const isValence = highlightValence && si === shells.length - 1;
        return (
          <ElectronShell
            key={`${n}-${count}`}
            shellNumber={n}
            count={count}
            radius={radius}
            color={isValence ? "#ffc94d" : "#7dd8ff"}
            spinSpeed={spinSpeed * (0.55 / Math.sqrt(n)) * (si % 2 === 0 ? 1 : -1)}
            tilt={[(n * 37) % 90, (n * 53) % 120, 0]}
          />
        );
      })}
    </group>
  );
}

function ElectronShell({
  count,
  radius,
  color,
  spinSpeed,
  tilt,
}: {
  shellNumber: number;
  count: number;
  radius: number;
  color: string;
  spinSpeed: number;
  tilt: [number, number, number];
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * spinSpeed;
  });

  const electrons = useMemo(() => {
    const out: Array<[number, number, number]> = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      out.push([Math.cos(a) * radius, Math.sin(a) * radius, 0]);
    }
    return out;
  }, [count, radius]);

  const tiltRad: [number, number, number] = [
    (tilt[0] * Math.PI) / 180,
    (tilt[1] * Math.PI) / 180,
    0,
  ];

  return (
    <group rotation={tiltRad}>
      {/* orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.008, 8, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.28} />
      </mesh>
      <group ref={group}>
        {electrons.map((p, i) => (
          <group key={i} position={p}>
            <mesh>
              <sphereGeometry args={[0.065, 12, 12]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.13, 12, 12]} />
              <meshBasicMaterial color={color} transparent opacity={0.18} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
