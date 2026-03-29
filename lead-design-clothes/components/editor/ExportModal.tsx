/**
 * ExportModal — Export as ZIP with 4 images (front/back × mockup/print)
 */

"use client";

import { useState } from "react";
import type Konva from "konva";
import { Button } from "@/components/ui/Button";
import { exportAsZip, downloadBlob } from "@/lib/services/mockupExport";
import { cn } from "@/lib/utils/cn";

interface ExportModalProps {
  onClose: () => void;
  frontStageRef: React.RefObject<Konva.Stage | null>;
  backStageRef: React.RefObject<Konva.Stage | null>;
  garmentName: string;
}

type Format = "png" | "jpg";
type Resolution = "standard" | "high" | "ultra";

export function ExportModal({
  onClose,
  frontStageRef,
  backStageRef,
  garmentName,
}: ExportModalProps) {
  const [format, setFormat] = useState<Format>("png");
  const [resolution, setResolution] = useState<Resolution>("high");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setDone(false);
    setError(null);
    setProgress(0);
    try {
      const { blob, fileName } = await exportAsZip(
        frontStageRef,
        backStageRef,
        { format, resolution },
        (pct) => setProgress(pct)
      );
      downloadBlob(blob, fileName);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setLoading(false);
    }
  };

  const FORMATS: { id: Format; label: string; desc: string }[] = [
    { id: "png", label: "PNG", desc: "Lossless, supports transparency" },
    { id: "jpg", label: "JPG", desc: "Smaller file, no transparency" },
  ];

  const RESOLUTIONS: { id: Resolution; label: string; desc: string }[] = [
    { id: "standard", label: "Standard", desc: "1×  (~600px)" },
    { id: "high", label: "High", desc: "2×  (~1200px)" },
    { id: "ultra", label: "Ultra 4K", desc: "4×  (~2400px)" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md glass-panel rounded-3xl ambient-shadow p-8 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-headline font-extrabold tracking-tight">
              Export Design
            </h2>
            <p className="text-xs text-outline mt-0.5">{garmentName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ZIP contents info */}
        <div className="bg-surface-container rounded-2xl p-4 flex flex-col gap-2">
          <p className="text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-1">
            Package contents (4 files)
          </p>
          {[
            { icon: "🎽", name: "front-mockup", desc: "Full front view (polo + diseño)" },
            { icon: "🖼̆", name: "front-print",  desc: "Solo estampado frontal" },
            { icon: "🎽", name: "back-mockup",  desc: "Full back view (polo + diseño)" },
            { icon: "🖼̆", name: "back-print",   desc: "Solo estampado trasero" },
          ].map((f) => (
            <div key={f.name} className="flex items-center gap-2">
              <span className="text-base">{f.icon}</span>
              <span className="text-xs font-mono text-primary font-bold">{f.name}.{format}</span>
              <span className="text-[11px] text-outline">— {f.desc}</span>
            </div>
          ))}
        </div>

        {/* Format */}
        <div>
          <p className="text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-2">
            Format
          </p>
          <div className="grid grid-cols-2 gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={cn(
                  "p-3 rounded-xl text-left transition-all",
                  format === f.id
                    ? "ring-2 ring-primary bg-primary/5"
                    : "bg-surface-container hover:bg-surface-container-high"
                )}
              >
                <p className="text-sm font-bold text-on-surface">{f.label}</p>
                <p className="text-[10px] text-outline mt-0.5">{f.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Resolution */}
        <div>
          <p className="text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-2">
            Resolution
          </p>
          <div className="grid grid-cols-3 gap-2">
            {RESOLUTIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setResolution(r.id)}
                className={cn(
                  "p-3 rounded-xl text-left transition-all",
                  resolution === r.id
                    ? "ring-2 ring-primary bg-primary/5"
                    : "bg-surface-container hover:bg-surface-container-high"
                )}
              >
                <p className="text-xs font-bold text-on-surface">{r.label}</p>
                <p className="text-[9px] text-outline mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        {loading && (
          <div>
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-outline mt-1.5 font-label uppercase tracking-widest">
              Generating ZIP… {Math.round(progress)}%
            </p>
          </div>
        )}

        {error && (
          <p className="text-xs text-error bg-error-container/20 rounded-xl px-3 py-2">{error}</p>
        )}

        {done && (
          <div className="flex items-center gap-2 text-sm text-on-surface bg-tertiary-fixed/20 px-4 py-2.5 rounded-xl">
            <svg className="w-4 h-4 text-tertiary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            ZIP descargado — 4 imágenes listas para imprimir 🎉
          </div>
        )}

        <div className="flex gap-3 mt-2">
          <Button variant="secondary" size="md" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="key-action"
            size="md"
            className="flex-1 flex items-center justify-center gap-2"
            loading={loading}
            onClick={handleExport}
          >
            {!loading && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            )}
            {done ? "Descargar de nuevo" : "Descargar ZIP"}
          </Button>
        </div>
      </div>
    </div>
  );
}

