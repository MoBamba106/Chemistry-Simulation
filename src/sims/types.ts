/**
 * Types shared by all simulations.
 *
 * Every simulation is one React component with the SAME props whether it is
 * rendered on the Simulations page (full workspace), embedded in a lesson,
 * or opened from a concept page. Lessons pass a `presetId` defined in the
 * simulation's registry entry so it opens with lesson-appropriate content.
 */
import * as React from "react";

export interface SimProps {
  /** Preset id from the simulation's registry entry. */
  presetId?: string | null;
  /** Compact presentation when embedded inside lesson content. */
  embedded?: boolean;
}

export type SimComponent = React.ComponentType<SimProps>;

export interface SimPreset {
  id: string;
  label: string;
  description?: string;
}

export interface SimMeta {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  /** Extra search keywords & alternative terminology. */
  keywords: string[];
  icon: string;
  presets: SimPreset[];
  /** AP units this simulation supports. */
  units: number[];
  /** Concept ids (see curriculum/concepts) related to this simulation. */
  concepts: string[];
  accent: string;
  load: () => Promise<{ default: SimComponent }>;
}
