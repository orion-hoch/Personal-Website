import type { TileType } from '../engine/tiles';
import type { BuildingDef } from '../engine/types';

export const MAP_SIZE = 25;

// Building definitions with 3D properties.
// Visual placement uses anchorCol/anchorRow to keep the interactive buildings
// on a cleaner ring around the lighthouse while the grid footprint still marks
// occupied ground tiles.

export const buildings: BuildingDef[] = [
  // ─── CENTER LANDMARK: Lighthouse ───
  {
    id: 'lighthouse',
    type: 'lighthouse',
    label: 'THE LIGHTHOUSE',
    gridCol: 11,
    gridRow: 11,
    width: 3,
    height: 3,
    url: '/about',
    description: 'The lighthouse — beacon of the wasteland.',
    focusOffset: [5, 4, 5],
    boxSize: [3, 8, 3],
    color: '#8A8580',
    modelFile: 'lighthouse.glb',
    decorative: true,
  },

  // ─── SW: Camp (About Me) ───
  {
    id: 'about',
    type: 'camp',
    label: 'ABOUT ME',
    gridCol: 7,
    gridRow: 16,
    anchorCol: 6.41,
    anchorRow: 10.52,
    width: 3,
    height: 3,
    url: '/about',
    description: 'A makeshift camp — who I am and what I do.',
    focusOffset: [4, 2.5, 4],
    boxSize: [5, 2.5, 5],
    color: '#7A7570',
    modelFile: 'camp.glb',
  },

  // ─── NW: Power Plant (Projects) ───
  {
    id: 'projects',
    type: 'power_plant',
    label: 'PROJECTS',
    gridCol: 11,
    gridRow: 5,
    anchorCol: 12.5,
    anchorRow: 6.1,
    width: 3,
    height: 3,
    url: '/projects',
    description: 'Technical projects, research, and field work.',
    focusOffset: [4, 3, 4],
    boxSize: [5, 3.5, 5],
    color: '#5A5A60',
    modelFile: 'power_plant.glb',
  },

  // ─── NE: Radio Tower (Contact & Links) ───
  {
    id: 'contact',
    type: 'radiotower',
    label: 'CONTACT & LINKS',
    gridCol: 17,
    gridRow: 9,
    anchorCol: 18.59,
    anchorRow: 10.52,
    width: 3,
    height: 3,
    url: '/contact',
    description: 'Radio tower — reach out and find me elsewhere.',
    focusOffset: [5, 5, 5],
    boxSize: [3, 7, 3],
    color: '#5A5A60',
    modelFile: 'radiotower.glb',
    modelNodeName: 'Mesh1.001',
  },

  // ─── S: Bunker (Experiences) ───
  {
    id: 'resume',
    type: 'bunker',
    label: 'EXPERIENCES',
    gridCol: 7,
    gridRow: 16,
    anchorCol: 8.74,
    anchorRow: 17.68,
    width: 3,
    height: 3,
    url: '/resume',
    description: 'The bunker — credentials and experience.',
    focusOffset: [4, 3, 4],
    boxSize: [5, 4, 5],
    color: '#8A8580',
    modelFile: 'bunker.glb',
  },

  // ─── SE: Ferris Wheel (Fun Games) ───
  {
    id: 'games',
    type: 'ferriswheel',
    label: 'CREATIVE WORK',
    gridCol: 15,
    gridRow: 15,
    anchorCol: 16.26,
    anchorRow: 17.68,
    width: 3,
    height: 3,
    url: '/games',
    description: 'Creative web work and interactive experiments.',
    focusOffset: [5, 4, 5],
    boxSize: [5, 6, 5],
    color: '#6A4A3A',
    modelFile: 'ferriswheel.glb',
    modelNodeName: 'Mesh_0',
  },
];

// Light source positions — lighthouse is the primary source, town is brighter overall
export const lightSources: Array<{ col: number; row: number; color: string; intensity: number }> = [
  // ─── LIGHTHOUSE — primary beacon ───
  { col: 12.5, row: 12.5, color: '#F0D890', intensity: 1.3 },
  { col: 12.5, row: 12.5, color: '#D4A040', intensity: 0.72 },

  // ─── Building lights (matched to new positions) ───
  { col: 6.41, row: 10.52, color: '#D4A040', intensity: 0.5 },   // camp (about)
  { col: 12.5, row: 6.1, color: '#40D080', intensity: 0.62 },    // power plant
  { col: 18.59, row: 10.52, color: '#D04040', intensity: 0.45 }, // radio tower
  { col: 8.74, row: 17.68, color: '#D4A040', intensity: 0.5 },   // bunker
  { col: 9.65, row: 16.45, color: '#E0BE74', intensity: 0.62 },  // bunker front light
  { col: 16.26, row: 17.68, color: '#D08030', intensity: 0.55 }, // ferris wheel
];

/** Generate tile map procedurally */
export function generateMap(): TileType[][] {
  const map: TileType[][] = [];
  for (let row = 0; row < MAP_SIZE; row++) {
    const rowTiles: TileType[] = [];
    for (let col = 0; col < MAP_SIZE; col++) {
      rowTiles.push(getTileAt(col, row));
    }
    map.push(rowTiles);
  }
  return map;
}

function getTileAt(col: number, row: number): TileType {
  const distFromEdge = Math.min(col, row, MAP_SIZE - 1 - col, MAP_SIZE - 1 - row);
  if (distFromEdge === 0) {
    return pseudoRandom(col, row) > 0.5 ? 'void_edge_crumble' : 'void_edge';
  }
  if (distFromEdge === 1) {
    return pseudoRandom(col, row) > 0.7 ? 'void_edge' : 'ground_scorched';
  }

  for (const b of buildings) {
    if (col >= b.gridCol && col < b.gridCol + b.width &&
        row >= b.gridRow && row < b.gridRow + b.height) {
      return 'ground';
    }
  }

  // Road network
  if (col === 12 && row >= 4 && row <= 20) {
    if (row === 12 || row === 8 || row === 16) return 'road_cross';
    return 'road_ns';
  }
  if (row === 12 && col >= 4 && col <= 20) {
    if (col === 12 || col === 8 || col === 16) return 'road_cross';
    return 'road_ew';
  }
  if (row === 8 && col >= 5 && col <= 18) {
    if (col === 12 || col === 8 || col === 16) return 'road_cross';
    return 'road_ew';
  }
  if (col === 8 && row >= 6 && row <= 17) {
    if (row === 8 || row === 12 || row === 16) return 'road_cross';
    return 'road_ns';
  }
  if (col === 16 && row >= 6 && row <= 17) {
    if (row === 8 || row === 12 || row === 16) return 'road_cross';
    return 'road_ns';
  }
  if (row === 16 && col >= 6 && col <= 18) {
    if (col === 8 || col === 12 || col === 16) return 'road_cross';
    return 'road_ew';
  }

  const r = pseudoRandom(col, row);
  if (r < 0.08) return 'puddle';
  if (r < 0.2) return 'rubble';
  if (r < 0.3) return 'rubble2';
  if (r < 0.5) return 'ground_dead_grass';
  if (r < 0.6) return 'ground_scorched';
  return 'ground';
}

function pseudoRandom(col: number, row: number): number {
  const n = Math.sin(col * 127.1 + row * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
