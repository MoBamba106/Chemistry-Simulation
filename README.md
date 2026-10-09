# ChemLab — Interactive AP Chemistry Workspace

A complete, self-contained learning app for AP Chemistry: **11 interactive 3-D simulations** and the **full 9-unit course** (all 92 CED topics), wired together so every lesson links the concepts, models, and simulations that explain it. Runs entirely locally — no cloud, no accounts, no internet required at runtime.

## Quick start

```bash
npm install
npm run dev        # → http://localhost:5173
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server (binds 0.0.0.0, accepts proxied hosts) |
| `npm run build` | Production bundle to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | Strict TypeScript check |
| `bash scripts/smoke.sh` | Data/logic integrity: lesson coverage, cross-references, molecule analysis, search queries |
| `bash scripts/render-test.sh` | Server-renders every page/route (all 92 lessons, all concepts, all sims) to catch render crashes |

## What's inside

### Simulations (`/sims`)
Atomic structure, electron configurations & orbitals, periodic trends, ionic bonding, Lewis structures, a **molecule builder** (element library, single/double/triple bonds, add/remove electrons → ions, live Lewis + 3-D + formula + geometry), VSEPR geometry lab, bond polarity, molecular polarity, intermolecular forces, and a particulate reaction viewer. Chemically invalid operations are **blocked with an explanation**, never silently allowed. Searchable library with category filters and alternative-terminology keywords.

### Curriculum (`/curriculum`)
All 9 AP units and 92 topics. Each lesson has objectives, prose with **wiki-style concept links** (hover/click popovers with definitions, equations, and 3-D models), worked examples with reasoning, tables, misconception callouts, exam-style notes, and **embedded simulations with lesson-appropriate presets** — the same components as the Simulations page (never duplicated), each with an "Open full workspace" link that preserves the preset. 41 topics are full-depth lessons; the remaining 51 are concise but complete (badged as such in the UI).

### Concepts (`/concept/:id`)
177-entry concept registry powering popovers, search, and standalone pages that link back to lessons and simulations.

### Search (⌘K / Ctrl+K anywhere)
One palette over simulations, units, topics, lesson full text, and concept definitions with weighted scoring, plural stemming, and stop words. Curriculum results show their place in the hierarchy plus associated simulations.

## Architecture

```
src/
  chem/        pure chemistry logic & data (elements Z=1–56, electron configs,
               Lewis analysis, VSEPR, 3-D/2-D layout, bonding metrics, ~46 molecule presets)
  three/       reusable React-Three-Fiber renderers (scene, molecule view, Bohr atom, orbitals)
  components/  UI kit, Lewis diagram, periodic table, concept popovers
  sims/        simulation components + registry (single source of truth for
               presets, keywords, categories, lazy loading)
  curriculum/  units/topics metadata, lesson type system, block renderer,
               concept registry, sim embeds, lessons/unit1..9.ts (content as data)
  search/      weighted full-text index over all content
  pages/       route-level views; styles/ design system (dark "lab-night" theme)
```

Content lives in structured TypeScript data (lesson blocks, molecule definitions, element tables, concept entries) — extending the app means adding data objects, not editing UI code. Three.js, KaTeX fonts, and all data are bundled: **core features work fully offline**.

## Known limitations

- Element database covers Z = 1–56 (through barium); a few lanthanides/actinides and late transition metals aren't selectable.
- 3-D molecular geometry is computed from VSEPR/electron-group templates rather than quantum-mechanical optimization; bond lengths/angles are typical values, not per-molecule computed.
- Electron orbital visualizations are boundary-surface *models* — labeled as such in-app — not literal electron paths.
- `concise` lessons are complete but compact; `full` lessons carry the deepest worked-example treatment.
- IMF phase behavior in the IMF Lab is a qualitative particle simulation, not a quantitative thermodynamic model.
