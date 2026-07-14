# Orion's Wasteland

Personal portfolio built as an interactive 3D post-apocalyptic wasteland. Each
section of the portfolio — experience, projects, creative work, contact — is a
building in the scene: a camp, a bunker, a power plant, a radio tower, a ferris
wheel. Click one to zoom in and open its content panel.

Built with **Vite + React 19 + TypeScript** and **Three.js** via
`@react-three/fiber` / `@react-three/drei`. Deployed on Vercel (auto-deploys
from `main`).

## Commands

```
npm run dev      # start dev server
npm run build    # typecheck + production build (tsc -b && vite build)
npm run lint     # ESLint
```

## Repo layout

```
├── src/
│   ├── components/       # React + R3F components (scene, buildings, UI panels)
│   │   └── visualization/  # guided walkthrough sequence components
│   ├── data/             # building placement (mapData.ts), panel content (content.ts)
│   └── engine/           # grid utilities, procedural tiles, shared types
├── public/
│   ├── models/           # GLB 3D models (meshopt-compressed)
│   ├── images/           # panel images, grouped by section
│   ├── fonts/            # RomanAntique webfonts
│   └── documents/        # resume + linked PDFs
├── docs/                 # design docs, element dictionary, visual inspiration
├── threejs-skills/       # git submodule — Three.js API reference skills
└── CLAUDE.md             # project instructions for Claude Code
```

## Notes

- Buildings live on a 25×25 grid (`src/data/mapData.ts`); `gridUtils.ts`
  converts grid coordinates to world positions.
- Ground tiles are procedurally generated pixel art with `NearestFilter` —
  no smoothing, on purpose.
- GLB models are aggressively simplified (meshopt + WebP textures via
  `@gltf-transform/cli`) for the chunky low-poly look.
- The aesthetic is deliberate: muted earth tones, flickering amber light,
  falling ash. See `docs/wasteland_design_system.md` before adding visuals.
