/**
 * MoleculeCanvas3D — a small self-contained 3-D viewer for one species.
 * Lazy-loaded so concept popovers and lesson insets only pay the Three.js
 * cost when they're actually shown.
 */
import * as React from "react";
import { useMemo, Suspense } from "react";
import type { Species } from "@/chem/lewis";
import { analyzeSpecies } from "@/chem/lewis";
import { layout3D } from "@/chem/layout";
import { SceneCanvas } from "@/three/SceneCanvas";
import { MoleculeView } from "@/three/MoleculeView";

export default function MoleculeCanvas3D({
  species,
  showLonePairs = true,
  autoRotate = true,
  cameraDistance = 5.5,
}: {
  species: Species;
  showLonePairs?: boolean;
  autoRotate?: boolean;
  cameraDistance?: number;
}) {
  const analysis = useMemo(() => analyzeSpecies(species), [species]);
  const layout = useMemo(() => layout3D(species), [species]);

  return (
    <SceneCanvas
      cameraPosition={[0, cameraDistance * 0.28, cameraDistance]}
      autoRotate={autoRotate}
      autoRotateSpeed={1.2}
    >
      <Suspense fallback={null}>
        <MoleculeView
          species={species}
          analysis={analysis}
          layout={layout}
          showLabels={false}
          showLonePairs={showLonePairs}
          interactive={false}
        />
      </Suspense>
    </SceneCanvas>
  );
}
