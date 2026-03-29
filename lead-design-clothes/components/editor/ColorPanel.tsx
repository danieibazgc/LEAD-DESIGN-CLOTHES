/**
 * ColorPanel — Garment colour picker
 */

"use client";

import { useEditorStore } from "@/lib/store/useEditorStore";
import { cn } from "@/lib/utils/cn";

export function ColorPanel() {
  const garment = useEditorStore((s) => s.garment);
  const selectedColorId = useEditorStore((s) => s.selectedColorId);
  const setSelectedColor = useEditorStore((s) => s.setSelectedColor);

  if (!garment) {
    return (
      <div className="p-5 text-sm text-outline">No garment selected.</div>
    );
  }

  const selected = garment.colors.find((c) => c.id === selectedColorId);

  return (
    <div className="p-5 flex flex-col gap-5">
      <div>
        <h3 className="text-xs font-label font-bold text-outline uppercase tracking-widest mb-1">
          Garment Color
        </h3>
        <p className="text-xs text-on-surface-variant">
          Select the base fabric colour for your garment.
        </p>
      </div>

      {/* Selected swatch large preview */}
      {selected && (
        <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl">
          <span
            className="w-10 h-10 rounded-xl ring-2 ring-primary shrink-0"
            style={{ backgroundColor: selected.hex }}
          />
          <div>
            <p className="text-sm font-bold text-on-surface">{selected.name}</p>
            <p className="text-[11px] text-outline font-label uppercase">{selected.hex}</p>
          </div>
        </div>
      )}

      {/* Swatch grid */}
      <div className="grid grid-cols-4 gap-3">
        {garment.colors.map((c) => (
          <button
            key={c.id}
            title={c.name}
            onClick={() => setSelectedColor(c.id)}
            className={cn(
              "group flex flex-col items-center gap-1.5",
            )}
          >
            <span
              className={cn(
                "w-10 h-10 rounded-xl ring-2 transition-all",
                c.id === selectedColorId
                  ? "ring-primary scale-110"
                  : "ring-outline-variant/20 hover:ring-primary/60 hover:scale-105"
              )}
              style={{ backgroundColor: c.hex }}
            />
            <span className="text-[9px] text-outline font-label uppercase text-center leading-none">
              {c.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
