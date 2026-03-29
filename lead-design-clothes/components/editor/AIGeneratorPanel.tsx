/**
 * AIGeneratorPanel — Prompt-based AI image generation for apparel designs
 *
 * Features:
 *  - Generate 4 variations via Gemini (OpenRouter) + Pollinations.ai
 *  - Select individual images or all 4 to add to canvas
 *  - Regenerate at any time (edit prompt → click Regenerate)
 */

"use client";

import { useState, useCallback } from "react";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { generateAIImage } from "@/lib/services/aiImageGeneration";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import type { AIStylePreset, AIGenerationResult } from "@/lib/types/domain";

const STYLE_PRESETS: { label: string; value: AIStylePreset }[] = [
  { label: "Minimal", value: "minimal" },
  { label: "Streetwear", value: "streetwear" },
  { label: "Vintage", value: "vintage" },
  { label: "Corporate", value: "corporate" },
  { label: "Graffiti", value: "graffiti" },
  { label: "Illustration", value: "illustration" },
];

export function AIGeneratorPanel() {
  const addObject = useEditorStore((s) => s.addObject);
  const activeSide = useEditorStore((s) => s.activeSide);
  const canvasSize = useEditorStore((s) => s.canvasSize);

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<AIStylePreset>("illustration");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIGenerationResult[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set());
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setSelected(new Set());
    setAddedIds(new Set());
    setLoadedIds(new Set());
    setErrorIds(new Set());
    try {
      const resultList = await generateAIImage({
        prompt,
        style,
        transparentBackground: true,
        highFidelity: false,
      });
      setResults(resultList);
    } catch {
      setError("Error al generar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const placeOnCanvas = useCallback(
    (result: AIGenerationResult) => {
      const size = Math.min(canvasSize.width * 0.4, 240);
      addObject({
        type: "ai-generated",
        side: activeSide,
        name: `AI: ${prompt.slice(0, 20)}`,
        src: result.src,
        prompt: result.prompt,
        backgroundRemoved: false,
        flipX: false,
        flipY: false,
        x: canvasSize.width / 2 - size / 2,
        y: canvasSize.height / 2 - size / 2,
        width: size,
        height: size,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        visible: true,
        locked: false,
      });
      setAddedIds((prev) => new Set(prev).add(result.id));
    },
    [addObject, activeSide, canvasSize, prompt]
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddSelected = () => {
    results.filter((r) => selected.has(r.id)).forEach(placeOnCanvas);
    setSelected(new Set());
  };

  const handleAddAll = () => {
    results.forEach(placeOnCanvas);
    setSelected(new Set());
  };

  const hasResults = results.length > 0;
  const selectedCount = selected.size;

  return (
    <div className="p-5 flex flex-col gap-5 overflow-y-auto no-scrollbar">
      <div>
        <h3 className="text-xs font-label font-bold text-outline uppercase tracking-widest mb-1">
          AI Art Generator
        </h3>
        <p className="text-xs text-on-surface-variant">
          Describe a design and generate AI artwork for your garment.
        </p>
      </div>

      {/* Prompt */}
      <div>
        <label className="text-[10px] font-label font-bold text-outline uppercase tracking-widest block mb-1.5">
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleGenerate();
          }}
          rows={3}
          placeholder="e.g. A wolf howling at the moon, vintage poster style…"
          className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-3 py-2 text-sm text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition"
        />
        <p className="text-[9px] text-outline mt-1">Ctrl+Enter to generate</p>
      </div>

      {/* Style */}
      <div>
        <label className="text-[10px] font-label font-bold text-outline uppercase tracking-widest block mb-1.5">
          Style
        </label>
        <div className="flex flex-wrap gap-2">
          {STYLE_PRESETS.map((s) => (
            <button
              key={s.value}
              onClick={() => setStyle(s.value)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full font-medium transition-colors",
                style === s.value
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate / Regenerate */}
      <Button
        variant="key-action"
        size="md"
        className="w-full flex items-center justify-center gap-2"
        loading={loading}
        onClick={handleGenerate}
        disabled={!prompt.trim()}
      >
        {!loading && hasResults && (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        )}
        {loading ? "Generating…" : hasResults ? "Regenerate" : "Generate 4 Variations"}
      </Button>

      {error && (
        <p className="text-xs text-error bg-error-container/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Results grid */}
      {hasResults && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-label font-bold text-outline uppercase tracking-widest">
              4 Variations
            </p>
            <p className="text-[9px] text-outline">
              {selectedCount > 0 ? `${selectedCount} selected` : "Tap to select"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {results.map((result, i) => {
              const isSelected = selected.has(result.id);
              const wasAdded = addedIds.has(result.id);
              const isLoaded = loadedIds.has(result.id);
              const hasError = errorIds.has(result.id);
              return (
                <button
                  key={result.id}
                  onClick={() => toggleSelect(result.id)}
                  className={cn(
                    "relative aspect-square rounded-xl overflow-hidden bg-surface-container transition-all",
                    isSelected
                      ? "ring-2 ring-primary scale-[0.97]"
                      : "hover:ring-1 hover:ring-outline-variant"
                  )}
                >
                  {/* Skeleton shimmer while loading */}
                  {!isLoaded && !hasError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-container">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-[9px] text-outline">Generating…</span>
                    </div>
                  )}

                  {/* Error state */}
                  {hasError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-surface-container text-error">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                      </svg>
                      <span className="text-[9px]">Failed to load</span>
                    </div>
                  )}

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.src}
                    alt={`AI variation ${i + 1}`}
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                      isLoaded ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => setLoadedIds((prev) => new Set(prev).add(result.id))}
                    onError={() => setErrorIds((prev) => new Set(prev).add(result.id))}
                  />

                  {/* Selection checkmark */}
                  <div
                    className={cn(
                      "absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all",
                      isSelected
                        ? "bg-primary text-on-primary scale-100"
                        : "bg-surface-container/70 text-on-surface-variant scale-90 opacity-60"
                    )}
                  >
                    {isSelected ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="9" />
                      </svg>
                    )}
                  </div>

                  {/* "Added" badge */}
                  {wasAdded && !isSelected && (
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-tertiary/90 text-on-tertiary text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                      Added ✓
                    </div>
                  )}

                  {/* Variation number */}
                  <div className="absolute bottom-1.5 left-1.5 bg-on-surface/40 text-surface text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {i + 1}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 text-xs"
              onClick={handleAddAll}
            >
              Add All 4
            </Button>
            <Button
              variant="key-action"
              size="sm"
              className="flex-1 text-xs"
              disabled={selectedCount === 0}
              onClick={handleAddSelected}
            >
              {selectedCount > 0 ? `Add ${selectedCount} Selected` : "Select Images"}
            </Button>
          </div>

          <p className="text-[9px] text-outline text-center">
            Edit the prompt above and click <strong>Regenerate</strong> to get new variations
          </p>
        </div>
      )}
    </div>
  );
}
