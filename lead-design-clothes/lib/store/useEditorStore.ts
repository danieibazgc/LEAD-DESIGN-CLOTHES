/**
 * useEditorStore — Zustand editor state store
 *
 * Manages all design editor state: objects, selected item,
 * active side (front/back), garment config, canvas size, and active panel.
 */

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  DesignObject,
  TextDesignObject,
  ImageDesignObject,
  AIGeneratedDesignObject,
  GarmentSide,
  ActivePanel,
  Garment,
  EditorState,
} from "@/lib/types/domain";
import { nanoid } from "@/lib/utils/nanoid";

interface EditorActions {
  // ─── Garment / config ───
  setGarment: (garment: Garment) => void;
  setSelectedColor: (colorId: string) => void;
  setActiveSide: (side: GarmentSide) => void;
  setActivePanel: (panel: ActivePanel) => void;
  setCanvasSize: (size: { width: number; height: number }) => void;

  // ─── Object CRUD ────────
  addObject: (
    obj:
      | (Omit<ImageDesignObject, "id" | "side"> & { side?: GarmentSide })
      | (Omit<TextDesignObject, "id" | "side"> & { side?: GarmentSide })
      | (Omit<AIGeneratedDesignObject, "id" | "side"> & { side?: GarmentSide })
  ) => void;
  updateObject: (id: string, patch: Partial<DesignObject>) => void;
  removeObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  duplicateObject: (id: string) => void;

  // ─── Layer ordering ─────
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;

  // ─── Visibility / lock ──
  toggleVisibility: (id: string) => void;
  toggleLock: (id: string) => void;

  // ─── Side helpers ───────
  getObjectsForSide: (side: GarmentSide) => DesignObject[];

  // ─── Reset ──────────────
  resetEditor: () => void;
}

const CANVAS_DEFAULT = { width: 600, height: 700 };

const initialState: EditorState = {
  garment: null,
  selectedColorId: null,
  activeSide: "front",
  objects: [],
  selectedObjectId: null,
  canvasSize: CANVAS_DEFAULT,
  activePanel: "upload",
};

export const useEditorStore = create<EditorState & EditorActions>()(
  immer((set, get) => ({
    ...initialState,

    // ─── Garment / config ─────────────────────────────────────────────────
    setGarment: (garment) =>
      set((state) => {
        state.garment = garment;
        state.selectedColorId = garment.colors[0]?.id ?? null;
      }),

    setSelectedColor: (colorId) =>
      set((state) => {
        state.selectedColorId = colorId;
      }),

    setActiveSide: (side) =>
      set((state) => {
        state.activeSide = side;
        // Deselect any object from the other side
        const current = state.objects.find(
          (o) => o.id === state.selectedObjectId
        );
        if (current && current.side !== side) {
          state.selectedObjectId = null;
        }
      }),

    setActivePanel: (panel) =>
      set((state) => {
        state.activePanel = panel;
      }),

    setCanvasSize: (size) =>
      set((state) => {
        state.canvasSize = size;
      }),

    // ─── Object CRUD ──────────────────────────────────────────────────────
    addObject: (obj) =>
      set((state) => {
        const newObj = {
          ...obj,
          id: nanoid(),
          side: obj.side ?? state.activeSide,
        } as DesignObject;
        state.objects.push(newObj);
        state.selectedObjectId = newObj.id;
      }),

    updateObject: (id, patch) =>
      set((state) => {
        const idx = state.objects.findIndex((o) => o.id === id);
        if (idx === -1) return;
        Object.assign(state.objects[idx], patch);
      }),

    removeObject: (id) =>
      set((state) => {
        state.objects = state.objects.filter((o) => o.id !== id);
        if (state.selectedObjectId === id) state.selectedObjectId = null;
      }),

    selectObject: (id) =>
      set((state) => {
        state.selectedObjectId = id;
      }),

    duplicateObject: (id) =>
      set((state) => {
        const original = state.objects.find((o) => o.id === id);
        if (!original) return;
        const clone = {
          ...original,
          id: nanoid(),
          x: original.x + 20,
          y: original.y + 20,
          name: `${original.name} (copy)`,
        } as DesignObject;
        state.objects.push(clone);
        state.selectedObjectId = clone.id;
      }),

    // ─── Layer ordering ───────────────────────────────────────────────────
    bringForward: (id) =>
      set((state) => {
        const idx = state.objects.findIndex((o) => o.id === id);
        if (idx < state.objects.length - 1) {
          [state.objects[idx], state.objects[idx + 1]] = [
            state.objects[idx + 1],
            state.objects[idx],
          ];
        }
      }),

    sendBackward: (id) =>
      set((state) => {
        const idx = state.objects.findIndex((o) => o.id === id);
        if (idx > 0) {
          [state.objects[idx], state.objects[idx - 1]] = [
            state.objects[idx - 1],
            state.objects[idx],
          ];
        }
      }),

    bringToFront: (id) =>
      set((state) => {
        const idx = state.objects.findIndex((o) => o.id === id);
        if (idx === -1) return;
        const [obj] = state.objects.splice(idx, 1);
        state.objects.push(obj);
      }),

    sendToBack: (id) =>
      set((state) => {
        const idx = state.objects.findIndex((o) => o.id === id);
        if (idx === -1) return;
        const [obj] = state.objects.splice(idx, 1);
        state.objects.unshift(obj);
      }),

    // ─── Visibility / lock ────────────────────────────────────────────────
    toggleVisibility: (id) =>
      set((state) => {
        const obj = state.objects.find((o) => o.id === id);
        if (obj) obj.visible = !obj.visible;
      }),

    toggleLock: (id) =>
      set((state) => {
        const obj = state.objects.find((o) => o.id === id);
        if (obj) obj.locked = !obj.locked;
      }),

    // ─── Side helpers ─────────────────────────────────────────────────────
    getObjectsForSide: (side) => get().objects.filter((o) => o.side === side),

    // ─── Reset ────────────────────────────────────────────────────────────
    resetEditor: () => set(() => ({ ...initialState })),
  }))
);
