/**
 * AIBackgroundRemovalPanel — Remove image backgrounds using @imgly/background-removal
 * Runs 100% in the browser via ONNX/WebAssembly. Free, no API key needed.
 */

"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import type { ImageDesignObject, AIGeneratedDesignObject } from "@/lib/types/domain";

type Toggle = {
  label: string;
  key: "autoDetect" | "refineEdges" | "keepTransparency";
};

const TOGGLES: Toggle[] = [
  { label: "Auto detect subject", key: "autoDetect" },
  { label: "Refine edges", key: "refineEdges" },
  { label: "Keep transparency", key: "keepTransparency" },
];

export function AIBackgroundRemovalPanel() {
  const objects = useEditorStore((s) => s.objects);
  const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
  const updateObject = useEditorStore((s) => s.updateObject);

  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultSrc, setResultSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  const [toggles, setToggles] = useState({
    autoDetect: true,
    refineEdges: false,
    keepTransparency: true,
  });

  // Get the selected image object (if any)
  const selectedObj = objects.find(
    (o) =>
      o.id === selectedObjectId &&
      (o.type === "image" || o.type === "ai-generated")
  ) as ImageDesignObject | AIGeneratedDesignObject | undefined;

  const originalSrc = selectedObj?.src ?? null;

  const handleRemoveBg = useCallback(async () => {
    if (!originalSrc) return;
    setProcessing(true);
    setProgress(0);
    setError(null);
    setResultSrc(null);
    setApplied(false);

    try {
      // Dynamic import — loads WASM + model only when needed
      const { removeBackground } = await import("@imgly/background-removal");

      const blob = await fetch(originalSrc).then((r) => r.blob());

      const result = await removeBackground(blob, {
        model: "isnet_quint8",
        output: { format: "image/png" },
        progress: (key: string, current: number, total: number) => {
          if (total > 0) setProgress(Math.round((current / total) * 100));
        },
      });

      const url = URL.createObjectURL(result);
      setResultSrc(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Background removal failed");
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  }, [originalSrc]);

  const handleApply = useCallback(() => {
    if (!selectedObjectId || !resultSrc) return;
    updateObject(selectedObjectId, { src: resultSrc, backgroundRemoved: true });
    setApplied(true);
  }, [selectedObjectId, resultSrc, updateObject]);

  const toggleValue = (key: "autoDetect" | "refineEdges" | "keepTransparency") => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-5 flex flex-col gap-5 h-full overflow-y-auto no-scrollbar">
      {/* Header */}
      <div>
        <h3 className="text-xs font-label font-bold text-outline uppercase tracking-widest mb-1">
          AI Background Removal
        </h3>
        <p className="text-xs text-on-surface-variant">
          Remove image backgrounds instantly using on-device AI. No API key required.
        </p>
      </div>

      {/* No image selected state */}
      {!selectedObj && (
        <div className="flex flex-col items-center justify-center gap-3 py-8 px-4 bg-surface-container rounded-xl text-center">
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
            <svg className="w-6 h-6 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75 7.5 10.5l3 3 4.5-6 6 8.25" />
              <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm font-medium text-on-surface">No image selected</p>
          <p className="text-xs text-outline leading-relaxed">
            Upload an image and select it on the canvas, then come back here to remove its background.
          </p>
        </div>
      )}

      {/* Preview comparison */}
      {selectedObj && (
        <>
          <div>
            <p className="text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-2">
              Preview Comparison
            </p>
            <div className="grid grid-cols-2 gap-2">
              {/* Original */}
              <div className="relative rounded-xl overflow-hidden aspect-square bg-surface-container">
                <Image
                  src={originalSrc!}
                  alt="Original"
                  fill
                  className="object-contain"
                  unoptimized
                />
                <span className="absolute bottom-1 left-1 text-[9px] font-label uppercase bg-black/60 text-white px-1.5 py-0.5 rounded">
                  Original
                </span>
              </div>

              {/* Result */}
              <div
                className={cn(
                  "relative rounded-xl overflow-hidden aspect-square",
                  resultSrc
                    ? "bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGBg+M9AMiAFAAA4AAH/H4UjAAAAAABJRU5ErkJggg==')] bg-repeat bg-[length:16px_16px]"
                    : "bg-surface-container"
                )}
              >
                {processing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-container/90 z-10">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-label text-primary font-bold">
                      {progress > 0 ? `${progress}%` : "Loading…"}
                    </span>
                  </div>
                )}
                {resultSrc && !processing && (
                  <Image
                    src={resultSrc}
                    alt="Removed background"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                )}
                {!resultSrc && !processing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] text-outline font-label uppercase">Result</span>
                  </div>
                )}
                {applied && (
                  <div className="absolute top-1 right-1 bg-green-500 text-white text-[9px] font-label uppercase px-1.5 py-0.5 rounded">
                    Applied
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Remove Background button */}
          <Button
            variant="primary"
            size="md"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleRemoveBg}
            disabled={processing}
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
                Remove Background
              </>
            )}
          </Button>

          {error && (
            <p className="text-xs text-error bg-error-container/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {/* Toggles */}
          <div className="flex flex-col gap-0.5">
            {TOGGLES.map((t) => (
              <label
                key={t.key}
                className="flex items-center justify-between py-2.5 border-b border-outline-variant/10 cursor-pointer"
              >
                <span className="text-sm text-on-surface">{t.label}</span>
                <button
                  role="switch"
                  aria-checked={toggles[t.key]}
                  onClick={() => toggleValue(t.key)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                    toggles[t.key] ? "bg-primary" : "bg-outline-variant/40"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
                      toggles[t.key] ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </label>
            ))}
          </div>

          {/* Apply to Design */}
          {resultSrc && (
            <Button
              variant={applied ? "secondary" : "key-action"}
              size="md"
              className="w-full"
              onClick={handleApply}
              disabled={applied}
            >
              {applied ? "✓ Applied to Design" : "Apply to Design →"}
            </Button>
          )}
        </>
      )}

      {/* Info box */}
      <div className="mt-auto p-3 bg-surface-container rounded-xl flex gap-2 items-start">
        <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        <p className="text-[11px] text-on-surface-variant leading-relaxed">
          Powered by <span className="font-bold text-on-surface">@imgly/background-removal</span> — runs fully in your browser using WebAssembly AI. 100% free, no data sent to any server.
        </p>
      </div>
    </div>
  );
}
