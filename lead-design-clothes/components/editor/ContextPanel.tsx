/**
 * ContextPanel — Renders the correct panel based on the active tool selection
 */

"use client";

import { useEditorStore } from "@/lib/store/useEditorStore";
import { UploadPanel } from "./UploadPanel";
import { ColorPanel } from "./ColorPanel";
import { LayersPanel } from "./LayersPanel";
import { TextToolPanel } from "./TextToolPanel";
import { AIGeneratorPanel } from "./AIGeneratorPanel";
import { AIBackgroundRemovalPanel } from "./AIBackgroundRemovalPanel";

export function ContextPanel() {
  const activePanel = useEditorStore((s) => s.activePanel);

  if (!activePanel) return null;

  return (
    <div className="w-72 shrink-0 bg-surface-container-lowest border-r border-outline-variant/10 overflow-hidden flex flex-col">
      {activePanel === "upload" && <UploadPanel />}
      {activePanel === "colors" && <ColorPanel />}
      {activePanel === "layers" && <LayersPanel />}
      {activePanel === "text" && <TextToolPanel />}
      {activePanel === "ai" && <AIGeneratorPanel />}
      {activePanel === "bg-remove" && <AIBackgroundRemovalPanel />}
    </div>
  );
}
