/**
 * LayersPanel — Stacked list of design objects with reorder / hide / lock controls
 */

"use client";

import { useEditorStore } from "@/lib/store/useEditorStore";
import { cn } from "@/lib/utils/cn";

export function LayersPanel() {
  const activeSide = useEditorStore((s) => s.activeSide);
  const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
  const selectObject = useEditorStore((s) => s.selectObject);
  const removeObject = useEditorStore((s) => s.removeObject);
  const toggleVisibility = useEditorStore((s) => s.toggleVisibility);
  const toggleLock = useEditorStore((s) => s.toggleLock);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);
  const getObjectsForSide = useEditorStore((s) => s.getObjectsForSide);

  const objects = getObjectsForSide(activeSide).slice().reverse(); // top layer first

  return (
    <div className="p-5 flex flex-col gap-4 h-full overflow-y-auto no-scrollbar">
      <div>
        <h3 className="text-xs font-label font-bold text-outline uppercase tracking-widest mb-1">
          Layers
        </h3>
        <p className="text-xs text-on-surface-variant">
          {objects.length} object{objects.length !== 1 ? "s" : ""} on{" "}
          <span className="font-bold">{activeSide}</span>
        </p>
      </div>

      {objects.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-outline py-12">
          <svg className="w-10 h-10 text-outline-variant mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
          </svg>
          <p className="text-sm font-medium">No layers yet</p>
          <p className="text-xs mt-1">Upload an image or add text</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {objects.map((obj) => (
            <div
              key={obj.id}
              onClick={() => selectObject(obj.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer select-none transition-all group",
                obj.id === selectedObjectId
                  ? "bg-primary/10 ring-1 ring-primary/30"
                  : "hover:bg-surface-container"
              )}
            >
              {/* Type icon */}
              <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                {obj.type === "text" ? (
                  <svg className="w-3.5 h-3.5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path strokeLinecap="round" d="m21 15-5-5L5 21" />
                  </svg>
                )}
              </div>

              {/* Name */}
              <span className={cn(
                "flex-1 min-w-0 text-xs font-medium truncate",
                !obj.visible ? "opacity-40" : ""
              )}>
                {obj.name}
              </span>

              {/* Controls */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Visibility */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleVisibility(obj.id); }}
                  title={obj.visible ? "Hide" : "Show"}
                  className="w-5 h-5 flex items-center justify-center text-outline hover:text-on-surface transition-colors"
                >
                  {obj.visible ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>

                {/* Lock */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLock(obj.id); }}
                  title={obj.locked ? "Unlock" : "Lock"}
                  className="w-5 h-5 flex items-center justify-center text-outline hover:text-on-surface transition-colors"
                >
                  {obj.locked ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  )}
                </button>

                {/* Delete */}
                <button
                  onClick={(e) => { e.stopPropagation(); removeObject(obj.id); }}
                  title="Delete"
                  className="w-5 h-5 flex items-center justify-center text-outline hover:text-error transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Layer order controls (only when something selected) */}
      {selectedObjectId && (
        <div className="mt-auto pt-4 border-t border-outline-variant/10">
          <p className="text-[10px] text-outline font-label uppercase tracking-widest mb-2">Layer Order</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Bring Forward", action: () => bringForward(selectedObjectId) },
              { label: "Send Backward", action: () => sendBackward(selectedObjectId) },
            ].map(({ label, action }) => (
              <button
                key={label}
                onClick={action}
                className="text-[11px] py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high font-medium text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
