/**
 * AIGeneratorPanel — Prompt-based AI image generation for apparel designs
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { generateAIImage } from "@/lib/services/aiImageGeneration";
import { Button } from "@/components/ui/Button";
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
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const resultList = await generateAIImage({
        prompt,
        style,
        transparentBackground: true,
        highFidelity: false,
      });
      setResults(resultList);
    } catch {
      setError("Unexpected error during generation");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCanvas = (result: AIGenerationResult) => {
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
  };

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
          rows={3}
          placeholder="e.g. A wolf howling at the moon, vintage poster style…"
          className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-3 py-2 text-sm text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition"
        />
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
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                style === s.value
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="key-action"
        size="md"
        className="w-full"
        loading={loading}
        onClick={handleGenerate}
        disabled={!prompt.trim()}
      >
        {loading ? "Generating…" : "Generate 4 Variations"}
      </Button>

      {error && (
        <p className="text-xs text-error bg-error-container/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Results grid */}
      {results.length > 0 && (
        <div>
          <p className="text-[10px] font-label font-bold text-outline uppercase tracking-widest mb-3">
            Results — click to add
          </p>
          <div className="grid grid-cols-2 gap-3">
            {results.map((result, i) => (
              <button
                key={result.id}
                onClick={() => handleAddToCanvas(result)}
                className="relative aspect-square rounded-xl overflow-hidden bg-surface-container hover:ring-2 hover:ring-primary/60 transition-all group"
              >
                <Image
                  src={result.src}
                  alt={`AI result ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  unoptimized
                />
                <div className="absolute inset-0 bg-on-surface/0 group-hover:bg-on-surface/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-on-primary bg-primary/80 px-2 py-1 rounded-lg">
                    Add to canvas
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
