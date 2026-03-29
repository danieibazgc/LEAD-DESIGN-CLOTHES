/**
 * UploadPanel — Drag-and-drop / file picker for image designs
 */

"use client";

import { useRef, useState, useCallback } from "react";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { Button } from "@/components/ui/Button";
import { removeBackground } from "@/lib/services/backgroundRemoval";
import { cn } from "@/lib/utils/cn";

export function UploadPanel() {
  const addObject = useEditorStore((s) => s.addObject);
  const activeSide = useEditorStore((s) => s.activeSide);
  const canvasSize = useEditorStore((s) => s.canvasSize);

  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [bgRemoving, setBgRemoving] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File, autoBgRemove = false) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        let src = e.target?.result as string;
        const imgEl = new window.Image();
        imgEl.src = src;

        await new Promise<void>((resolve) => {
          imgEl.onload = () => resolve();
        });

        const aspectRatio = imgEl.naturalWidth / imgEl.naturalHeight;
        const targetW = Math.min(canvasSize.width * 0.4, 240);
        const targetH = targetW / aspectRatio;

        if (autoBgRemove) {
          setBgRemoving(true);
          try {
            const result = await removeBackground({ imageSrc: src });
            if (result.resultSrc) {
              src = result.resultSrc;
            }
          } finally {
            setBgRemoving(false);
          }
        }

        addObject({
          type: "image",
          side: activeSide,
          src,
          originalSrc: src,
          backgroundRemoved: autoBgRemove,
          flipX: false,
          flipY: false,
          x: canvasSize.width / 2 - targetW / 2,
          y: canvasSize.height / 2 - targetH / 2,
          width: targetW,
          height: targetH,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          visible: true,
          locked: false,
          name: file.name.replace(/\.[^.]+$/, ""),
        });
        setLastAdded(file.name.replace(/\.[^.]+$/, ""));
      };
      reader.readAsDataURL(file);
    },
    [addObject, activeSide, canvasSize]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="p-5 flex flex-col gap-5 h-full overflow-y-auto no-scrollbar">
      <div>
        <h3 className="text-xs font-label font-bold text-outline uppercase tracking-widest mb-1">
          Upload
        </h3>
        <p className="text-xs text-on-surface-variant">
          Add PNG, JPG, SVG, or WEBP graphics to your design.
        </p>
      </div>

      {/* Drop zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
          dragging
            ? "border-primary bg-primary/5"
            : "border-outline-variant/40 hover:border-primary/50 hover:bg-primary/5"
        )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div className="w-10 h-10 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-3">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <p className="text-sm font-medium text-on-surface">
          {dragging ? "Drop to upload" : "Drag & drop or click to upload"}
        </p>
        <p className="text-[11px] text-outline mt-1">PNG, JPG, SVG, WEBP up to 20MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) processFile(f);
            e.target.value = "";
          }}
        />
      </div>

      {/* AI bg removal option */}
      <div className="p-4 bg-surface-container rounded-xl flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-on-tertiary-fixed" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-on-surface mb-0.5">AI Background Removal</p>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            Automatically remove backgrounds when uploading.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-2"
            loading={bgRemoving}
            onClick={() => inputRef.current?.click()}
          >
            Upload + Remove BG
          </Button>
        </div>
      </div>

      {/* Last added feedback */}
      {lastAdded && (
        <div className="px-4 py-3 bg-surface-container-low rounded-xl flex items-center gap-2">
          <svg className="w-4 h-4 text-tertiary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          <span className="text-xs text-on-surface truncate">Added: <strong>{lastAdded}</strong></span>
        </div>
      )}
    </div>
  );
}
