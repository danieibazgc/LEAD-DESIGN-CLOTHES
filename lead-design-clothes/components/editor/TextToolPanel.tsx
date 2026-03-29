/**
 * TextToolPanel — Add and configure text design objects
 */

"use client";

import { useState } from "react";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const FONT_FAMILIES = ["Manrope", "Inter", "Georgia", "Courier New", "Impact"];
const PRESETS = [
  { label: "Headline", fontFamily: "Manrope", fontSize: 64, fontStyle: "bold" as const },
  { label: "Subtitle", fontFamily: "Inter", fontSize: 32, fontStyle: "normal" as const },
  { label: "Body", fontFamily: "Inter", fontSize: 18, fontStyle: "normal" as const },
];

export function TextToolPanel() {
  const addObject = useEditorStore((s) => s.addObject);
  const activeSide = useEditorStore((s) => s.activeSide);
  const canvasSize = useEditorStore((s) => s.canvasSize);

  const [text, setText] = useState("Your Text");
  const [fontFamily, setFontFamily] = useState("Manrope");
  const [fontSize, setFontSize] = useState(48);
  const [fontStyle, setFontStyle] = useState<"normal" | "bold" | "italic" | "bold italic">("bold");
  const [fill, setFill] = useState("#191c1e");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center");

  const handleAdd = () => {
    if (!text.trim()) return;
    addObject({
      type: "text",
      side: activeSide,
      name: `Text: ${text.slice(0, 20)}`,
      text,
      fontFamily,
      fontSize,
      fontStyle,
      fill,
      textAlign,
      letterSpacing: 0,
      lineHeight: 1.2,
      textDecoration: "",
      x: canvasSize.width / 2 - 100,
      y: canvasSize.height / 2 - fontSize / 2,
      width: 200,
      height: fontSize * 1.5,
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
          Text Tool
        </h3>
        <p className="text-xs text-on-surface-variant">
          Add text elements to the garment canvas.
        </p>
      </div>

      {/* Presets */}
      <div className="flex gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setFontFamily(p.fontFamily);
              setFontSize(p.fontSize);
              setFontStyle(p.fontStyle);
            }}
            className="flex-1 py-2 text-xs rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors font-medium text-on-surface-variant"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Text input */}
      <div>
        <label className="text-[10px] font-label font-bold text-outline uppercase tracking-widest block mb-1.5">
          Text Content
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-3 py-2 text-sm text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition"
        />
      </div>

      {/* Font family */}
      <div>
        <label className="text-[10px] font-label font-bold text-outline uppercase tracking-widest block mb-1.5">
          Font
        </label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Font size */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[10px] font-label font-bold text-outline uppercase tracking-widest">
            Size
          </label>
          <span className="text-xs text-on-surface font-medium">{fontSize}px</span>
        </div>
        <input
          type="range"
          min={10}
          max={200}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      {/* Style toggles */}
      <div>
        <label className="text-[10px] font-label font-bold text-outline uppercase tracking-widest block mb-1.5">
          Style
        </label>
        <div className="flex gap-2">
          {(["normal", "bold", "italic", "bold italic"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFontStyle(s)}
              className={cn(
                "flex-1 py-1.5 text-xs rounded-lg capitalize font-medium transition-colors",
                fontStyle === s
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Align */}
      <div>
        <label className="text-[10px] font-label font-bold text-outline uppercase tracking-widest block mb-1.5">
          Align
        </label>
        <div className="flex gap-2">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              onClick={() => setTextAlign(a)}
              className={cn(
                "flex-1 py-1.5 text-xs rounded-lg capitalize font-medium transition-colors",
                textAlign === a
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="text-[10px] font-label font-bold text-outline uppercase tracking-widest block mb-1.5">
          Color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={fill}
            onChange={(e) => setFill(e.target.value)}
            className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
          />
          <span className="text-sm font-label text-on-surface">{fill.toUpperCase()}</span>
        </div>
      </div>

      <Button variant="primary" size="md" className="w-full mt-auto" onClick={handleAdd}>
        Add to Canvas
      </Button>
    </div>
  );
}
