/**
 * ObjectInspector — Floating properties panel for the selected design object
 */

"use client";

import { useEditorStore } from "@/lib/store/useEditorStore";
import { Button } from "@/components/ui/Button";

export function ObjectInspector() {
  const objects = useEditorStore((s) => s.objects);
  const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
  const updateObject = useEditorStore((s) => s.updateObject);
  const removeObject = useEditorStore((s) => s.removeObject);
  const duplicateObject = useEditorStore((s) => s.duplicateObject);

  const obj = objects.find((o) => o.id === selectedObjectId);

  if (!obj) {
    return (
      <div className="w-64 shrink-0 bg-surface-container-lowest border-l border-outline-variant/10 flex flex-col items-center justify-center gap-2 text-outline text-xs p-6">
        <svg className="w-8 h-8 text-outline-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
        </svg>
        <span className="text-center">Select an object on the canvas to inspect</span>
      </div>
    );
  }

  const update = (patch: Parameters<typeof updateObject>[1]) =>
    updateObject(obj.id, patch);

  return (
    <div className="w-64 shrink-0 bg-surface-container-lowest border-l border-outline-variant/10 overflow-y-auto no-scrollbar flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-outline-variant/10 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs font-label font-bold text-outline uppercase tracking-widest">
            {obj.type}
          </p>
          <p className="text-sm font-bold text-on-surface truncate">{obj.name}</p>
        </div>
        <button
          onClick={() => removeObject(obj.id)}
          className="text-outline hover:text-error transition-colors ml-2 shrink-0"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Position */}
        <section>
          <p className="text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-2">
            Position
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] text-outline block mb-1">X</label>
              <input
                type="number"
                value={Math.round(obj.x)}
                onChange={(e) => update({ x: Number(e.target.value) })}
                className="w-full bg-surface-container border border-outline-variant/20 rounded-lg px-2 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-[9px] text-outline block mb-1">Y</label>
              <input
                type="number"
                value={Math.round(obj.y)}
                onChange={(e) => update({ y: Number(e.target.value) })}
                className="w-full bg-surface-container border border-outline-variant/20 rounded-lg px-2 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </section>

        {/* Size */}
        <section>
          <p className="text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-2">
            Size
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] text-outline block mb-1">W</label>
              <input
                type="number"
                value={Math.round(obj.width)}
                onChange={(e) => update({ width: Number(e.target.value) })}
                className="w-full bg-surface-container border border-outline-variant/20 rounded-lg px-2 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-[9px] text-outline block mb-1">H</label>
              <input
                type="number"
                value={Math.round(obj.height)}
                onChange={(e) => update({ height: Number(e.target.value) })}
                className="w-full bg-surface-container border border-outline-variant/20 rounded-lg px-2 py-1.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </section>

        {/* Rotation */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-label font-bold text-outline uppercase tracking-widest">
              Rotation
            </p>
            <span className="text-xs text-on-surface font-medium">{Math.round(obj.rotation)}°</span>
          </div>
          <input
            type="range"
            min={-180}
            max={180}
            value={obj.rotation}
            onChange={(e) => update({ rotation: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </section>

        {/* Opacity */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-label font-bold text-outline uppercase tracking-widest">
              Opacity
            </p>
            <span className="text-xs text-on-surface font-medium">{Math.round(obj.opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={obj.opacity}
            onChange={(e) => update({ opacity: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </section>

        {/* Text-specific */}
        {obj.type === "text" && (
          <section>
            <p className="text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-2">
              Text Color
            </p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={(obj as import("@/lib/types/domain").TextDesignObject).fill}
                onChange={(e) => update({ fill: e.target.value } as Partial<import("@/lib/types/domain").TextDesignObject>)}
                className="w-8 h-8 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-label text-on-surface uppercase">
                {(obj as import("@/lib/types/domain").TextDesignObject).fill}
              </span>
            </div>
          </section>
        )}

        {/* Flip (for images) */}
        {(obj.type === "image" || obj.type === "ai-generated") && (
          <section>
            <p className="text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-2">
              Flip
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => update({ flipX: !(obj as import("@/lib/types/domain").ImageDesignObject).flipX } as Partial<import("@/lib/types/domain").ImageDesignObject>)}
                className="flex-1 py-1.5 text-xs rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                Flip H
              </button>
              <button
                onClick={() => update({ flipY: !(obj as import("@/lib/types/domain").ImageDesignObject).flipY } as Partial<import("@/lib/types/domain").ImageDesignObject>)}
                className="flex-1 py-1.5 text-xs rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                Flip V
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Footer actions */}
      <div className="mt-auto p-5 border-t border-outline-variant/10 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={() => duplicateObject(obj.id)}
        >
          Duplicate
        </Button>
      </div>
    </div>
  );
}
