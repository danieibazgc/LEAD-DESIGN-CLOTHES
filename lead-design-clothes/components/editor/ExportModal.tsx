/**
 * ExportModal — Export configuration + download trigger
 */

"use client";

import { useState, useRef } from "react";
import type Konva from "konva";
import { Button } from "@/components/ui/Button";
import { exportMockup } from "@/lib/services/mockupExport";
import type { ExportConfig } from "@/lib/types/domain";
import { cn } from "@/lib/utils/cn";

interface ExportModalProps {
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frontStageRef: React.RefObject<Konva.Stage | null>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  backStageRef: React.RefObject<Konva.Stage | null>;
  garmentName: string;
}

type Format = "png" | "jpg";
type Resolution = "standard" | "high" | "ultra";
type Side = "front" | "back" | "both";

export function ExportModal({
  onClose,
  frontStageRef,
  backStageRef,
  garmentName,
}: ExportModalProps) {
  const [format, setFormat] = useState<Format>("png");
  const [resolution, setResolution] = useState<Resolution>("high");
  const [side, setSide] = useState<Side>("both");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    setProgress(10);
    const sides: Array<"front" | "back"> =
      side === "both" ? ["front", "back"] : [side];

    for (let i = 0; i < sides.length; i++) {
      const currentSide = sides[i];
      const ref = currentSide === "front" ? frontStageRef : backStageRef;
      setProgress(20 + (i / sides.length) * 60);
      try {
        const config: ExportConfig = {
          format,
          resolution,
          side: currentSide,
          includeGarment: true,
        };
        const result = await exportMockup(ref, config);
        // Slight delay between downloads
        await new Promise((r) => setTimeout(r, 200));
        const link = document.createElement("a");
        link.href = result.dataUrl;
        link.download = result.fileName;
        link.click();
      } catch (err) {
        console.error("Export failed for side", currentSide, err);
      }
      setProgress(20 + ((i + 1) / sides.length) * 60);
    }
    setProgress(100);
    setDone(true);
    setLoading(false);
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

  const SIDES: { id: Side; label: string }[] = [
    { id: "front", label: "Front only" },
    { id: "back", label: "Back only" },
    { id: "both", label: "Both sides" },
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
              Export Mockup
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

        {/* Sides */}
        <div>
          <p className="text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-2">
            Sides to Export
          </p>
          <div className="grid grid-cols-3 gap-2">
            {SIDES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSide(s.id)}
                className={cn(
                  "py-2 rounded-xl text-xs font-medium transition-all",
                  side === s.id
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                )}
              >
                {s.label}
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
              Rendering… {Math.round(progress)}%
            </p>
          </div>
        )}

        {done && (
          <div className="flex items-center gap-2 text-sm text-on-surface bg-tertiary-fixed/20 px-4 py-2.5 rounded-xl">
            <svg className="w-4 h-4 text-tertiary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Download complete!
          </div>
        )}

        <div className="flex gap-3 mt-2">
          <Button variant="secondary" size="md" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="key-action"
            size="md"
            className="flex-1"
            loading={loading}
            onClick={handleExport}
          >
            {done ? "Download Again" : "Download"}
          </Button>
        </div>
      </div>
    </div>
  );
}
