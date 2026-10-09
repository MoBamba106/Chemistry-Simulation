/**
 * Standard scene wrapper: Canvas with consistent camera, lighting, and
 * orbit controls. Every 3D view in the app renders inside one of these.
 */
import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Vec3 } from "@/chem/vsepr";

export interface SceneCanvasProps {
  children: React.ReactNode;
  cameraPosition?: Vec3;
  fov?: number;
  controls?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  maxDistance?: number;
  minDistance?: number;
  className?: string;
  style?: React.CSSProperties;
  onCreated?: () => void;
}

export function SceneCanvas({
  children,
  cameraPosition = [3.2, 2.2, 4.6],
  fov = 42,
  controls = true,
  autoRotate = false,
  autoRotateSpeed = 0.8,
  maxDistance = 40,
  minDistance = 1.2,
  className,
  style,
}: SceneCanvasProps) {
  return (
    <div className={className} style={{ position: "relative", width: "100%", height: "100%", ...style }}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: cameraPosition, fov }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 9, 6]} intensity={1.15} />
        <directionalLight position={[-6, -3, -6]} intensity={0.35} color="#8ab4ff" />
        {children}
        {controls && (
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.12}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            maxDistance={maxDistance}
            minDistance={minDistance}
          />
        )}
      </Canvas>
    </div>
  );
}
