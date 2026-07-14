// Shared types for the 3D wasteland scene

export type BuildingType = 'bunker' | 'lighthouse' | 'ferriswheel' | 'radiotower' | 'power_plant' | 'camp';

export interface BuildingDef {
  id: string;
  type: BuildingType;
  label: string;
  gridCol: number;
  gridRow: number;
  /** Optional visual anchor in grid space for precise scene placement. */
  anchorCol?: number;
  anchorRow?: number;
  /** Footprint in grid tiles */
  width: number;
  height: number;
  /** Content section or URL */
  url: string;
  description: string;
  /** Camera offset when zoomed into this building [x, y, z] relative to building center */
  focusOffset: [number, number, number];
  /** 3D box dimensions for placeholder [width, height, depth] */
  boxSize: [number, number, number];
  /** Base color for placeholder material */
  color: string;
  /** GLB model filename (without path). If omitted, placeholder geometry is used. */
  modelFile?: string;
  /** Optional node name within the GLB scene to render (helps exclude bundled extras). */
  modelNodeName?: string;
  /** If true, this building is not clickable (decorative only) */
  decorative?: boolean;
}
