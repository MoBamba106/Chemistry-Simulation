# ChemLab — Interactive AP Chemistry Workspace

A self-contained AP Chemistry learning app with **12 interactive simulations**, a **118-element periodic-table reference**, and the **full 9-unit course** (all 92 CED topics). Lessons, concepts, and simulations link together; embedded labs use the same components and chemistry logic as the full workspaces. The app runs locally with no account, cloud service, runtime API, or online chemistry database. Its paper-and-ink interface and fonts are bundled for offline use.

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
| `bash scripts/smoke.sh` | Data/logic integrity: lesson coverage, cross-references, molecule analysis, periodic data, and search queries |
| `bash scripts/render-test.sh` | Server-renders every page/route (including the periodic table and bond-length lab) to catch render crashes |

## Main destinations

### Simulations (`/sims`)
Atomic structure, electron configurations and orbitals, periodic trends, ionic bonding, Lewis structures, a molecule builder, VSEPR geometry, bond polarity, **molecular bond lengths**, molecular polarity, intermolecular forces, and a particulate reaction viewer. The searchable simulation library supports category filters, presets, and alternate terminology. Chemically invalid operations are blocked or explained rather than silently accepted.

The **Molecular Bond Length Explorer** searches the built-in offline structure library, annotates each bond with a reference value or covalent-radius estimate, compares up to four selected molecules, and lets learners adjust internuclear distance along a Morse-model teaching curve. Resonance averaging illustrates equivalent intermediate-length bonds. It links to Molecule Builder for custom connectivity.

### Curriculum (`/curriculum`)
All 9 AP units and 92 topics. Lessons include objectives, wiki-style concept links and popovers, worked examples, tables, misconception callouts, exam notes, and embedded simulations with lesson-appropriate presets. Embedded and full-workspace views share simulation components and logic; each embed offers an “Open full workspace” link. 41 topics are full-depth lessons and 51 are concise lessons, labeled in the UI.

### Periodic table (`/periodic-table`)
An interactive 118-element table with searchable element names, symbols, and atomic numbers; family, electronegativity, ionization-energy, covalent-radius, valence, and physical-state coloring; element facts and electron-configuration views; and side-by-side comparison. The chemistry simulation dataset remains AP-focused (Z = 1–56); heavy-element properties in the reference table are marked as estimated, predicted, or unavailable where appropriate.

### Concepts (`/concept/:id`)
A 177-entry concept registry powering popovers, search, and standalone pages that cross-link to lessons and simulations.

### Search (⌘K / Ctrl+K anywhere)
A local search palette over simulations, reference pages, units, topics, lesson text, and concept definitions, with weighted scoring and plural stemming. Curriculum results show their place in the hierarchy and related simulations.

## Architecture

```
src/
  chem/        pure chemistry logic & data (elements Z=1–56, electron configs,
               Lewis analysis, VSEPR, 2-D/3-D layout, bonding metrics,
               molecule presets, and separate 118-element display data)
  three/       reusable React-Three-Fiber renderers (scene, molecule view,
               Bohr atom, orbitals)
  components/  shared UI kit, Lewis diagram, periodic-table grid, popovers
  sims/        simulation components + registry (single source of truth for
               presets, keywords, categories, and lazy-loaded components)
  curriculum/  units/topics metadata, lesson types and blocks, concepts,
               shared simulation embeds, and lesson content as data
  search/      weighted local index over app content
  pages/       route-level views
  styles/      paper-and-ink design system and page/simulation styles
```

Chemistry data, lessons, simulation logic, and presentation are kept modular. Three.js, KaTeX, and IBM Plex Sans, IBM Plex Mono, and Newsreader fonts are bundled. Core app features do not make external requests at runtime.

## Chemistry scope and limitations

- The main simulation element database covers Z = 1–56 (through barium). The dedicated display table covers all 118 named elements, but does not imply that the simulations can model every element.
- The Bond Length Explorer selects known structures from the built-in molecule library; it does **not** parse arbitrary molecular formulas or SMILES. A molecular formula alone cannot determine connectivity or isomer identity. Use a named library entry or the Molecule Builder to specify a custom structure. Ionic solids are better represented by the Ionic Bonding Lab than by a single isolated-molecule bond length.
- Bond-length values are typical reference values or covalent-radius estimates, not quantum-mechanical calculations for the selected molecule's environment. The Morse potential is a simplified educational model, not a measured potential-energy surface.
- 3-D molecular geometry uses VSEPR/electron-group templates rather than quantum optimization; angles and lengths are typical representations.
- Orbital visualizations are boundary-surface models, not literal electron paths. IMF phase behavior is a qualitative particle simulation, not a quantitative thermodynamic model.
- Concise lessons are complete but compact; full lessons include deeper worked-example treatment.
