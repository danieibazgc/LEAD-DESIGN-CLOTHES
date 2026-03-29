/**
 * LEAD Design Clothes — Core Domain Types
 * All shared interfaces/types used across the editor, store, and services.
 */

// ─── Garment ─────────────────────────────────────────────────────────────────

export type GarmentCategory = "tops" | "bottoms" | "outerwear" | "accessories";

export interface Garment {
  id: string;
  name: string;
  category: GarmentCategory;
  /** Available color variants */
  colors: GarmentColor[];
  /** Front and back base image URLs (blank, per color) */
  sides: {
    front: string;
    back: string;
  };
  /** Printable area bounds as % of image dimensions (0–1) */
  printableArea: {
    front: PrintableArea;
    back: PrintableArea;
  };
  printAreas: number;
  thumbnailUrl: string;
}

export interface GarmentColor {
  id: string;
  name: string;
  hex: string;
  /** Overridden side image URLs when color changes the base image */
  sideImages?: {
    front?: string;
    back?: string;
  };
}

export interface PrintableArea {
  /** Top-left X offset as fraction of canvas width (0–1) */
  x: number;
  /** Top-left Y offset as fraction of canvas height (0–1) */
  y: number;
  /** Width as fraction of canvas width (0–1) */
  width: number;
  /** Height as fraction of canvas height (0–1) */
  height: number;
}

// ─── Design Objects ───────────────────────────────────────────────────────────

export type DesignObjectType = "image" | "text" | "ai-generated";
export type GarmentSide = "front" | "back";

/** Base shape all design objects extend */
export interface BaseDesignObject {
  id: string;
  type: DesignObjectType;
  /** Canvas X position in pixels */
  x: number;
  /** Canvas Y position in pixels */
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  /** Which garment side this object belongs to */
  side: GarmentSide;
  name: string;
}

export interface ImageDesignObject extends BaseDesignObject {
  type: "image";
  /** Data URL or remote URL of the image */
  src: string;
  /** Whether background has been removed */
  backgroundRemoved: boolean;
  /** Original src before bg removal (for undo) */
  originalSrc?: string;
  flipX: boolean;
  flipY: boolean;
}

export interface TextDesignObject extends BaseDesignObject {
  type: "text";
  text: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: "normal" | "bold" | "italic" | "bold italic";
  textAlign: "left" | "center" | "right";
  fill: string;
  letterSpacing: number;
  lineHeight: number;
  textDecoration: "" | "underline" | "line-through";
}

export interface AIGeneratedDesignObject extends BaseDesignObject {
  type: "ai-generated";
  src: string;
  prompt: string;
  backgroundRemoved: boolean;
  flipX: boolean;
  flipY: boolean;
}

export type DesignObject =
  | ImageDesignObject
  | TextDesignObject
  | AIGeneratedDesignObject;

// ─── Editor State ─────────────────────────────────────────────────────────────

export interface EditorState {
  /** Current garment config */
  garment: Garment | null;
  /** Selected color variant */
  selectedColorId: string | null;
  /** Which side is currently shown in the canvas */
  activeSide: GarmentSide;
  /** All design objects across both sides */
  objects: DesignObject[];
  /** ID of currently selected object (or null) */
  selectedObjectId: string | null;
  /** Pixel dimensions of the canvas stage */
  canvasSize: { width: number; height: number };
  /** Active tool panel shown in the left toolbar */
  activePanel: ActivePanel;
}

export type ActivePanel =
  | "blank"
  | "colors"
  | "upload"
  | "text"
  | "layers"
  | "ai"
  | null;

// ─── Layer ────────────────────────────────────────────────────────────────────

/** Thin view model used by the Layers panel to render layer items */
export interface LayerItem {
  id: string;
  name: string;
  type: DesignObjectType;
  thumbnailSrc?: string;
  visible: boolean;
  locked: boolean;
  side: GarmentSide;
}

// ─── AI Services ──────────────────────────────────────────────────────────────

export type AIStylePreset =
  | "minimal"
  | "streetwear"
  | "vintage"
  | "corporate"
  | "graffiti"
  | "illustration";

export interface AIGenerationRequest {
  prompt: string;
  style: AIStylePreset;
  transparentBackground: boolean;
  highFidelity: boolean;
}

export interface AIGenerationResult {
  id: string;
  src: string;
  prompt: string;
}

export interface BackgroundRemovalRequest {
  /** Data URL or file URL */
  imageSrc: string;
}

export interface BackgroundRemovalResult {
  /** Data URL of the processed image with bg removed */
  resultSrc: string;
}

// ─── Export ───────────────────────────────────────────────────────────────────

export type ExportFormat = "png" | "jpg" | "pdf";
export type ExportResolution = "standard" | "high" | "ultra";
export type ExportSide = "front" | "back" | "both";

export interface ExportConfig {
  side: ExportSide;
  format: ExportFormat;
  resolution: ExportResolution;
  includeGarment: boolean;
}

// ─── Print Readiness ──────────────────────────────────────────────────────────

export interface PrintReadinessCheck {
  label: string;
  status: "optimal" | "passed" | "warning" | "error";
  detail: string;
}
