/**
 * Editor Page — LEAD Design Clothes
 * Route: /studio/[garmentId]
 *
 * Full canvas editor with left toolbar, context panel, canvas, and object inspector.
 */

"use client";

import { useEffect, useRef } from "react";
import { use } from "react";
import Link from "next/link";
import type Konva from "konva";
import dynamic from "next/dynamic";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { GARMENTS } from "@/lib/data/garments";
import { TopBar } from "@/components/ui/TopBar";
import { Button } from "@/components/ui/Button";
import { LeftToolbar } from "@/components/editor/LeftToolbar";
import { ContextPanel } from "@/components/editor/ContextPanel";
import { ObjectInspector } from "@/components/editor/ObjectInspector";
import { downloadDataUrl } from "@/lib/services/mockupExport";

// Dynamic import for Konva canvas (no SSR)
const EditorCanvas = dynamic(
  () =>
    import("@/components/editor/EditorCanvas").then((m) => m.EditorCanvas),
  { ssr: false }
);

interface PageProps {
  params: Promise<{ garmentId: string }>;
}

export default function EditorPage({ params }: PageProps) {
  const { garmentId } = use(params);

  const garment = useEditorStore((s) => s.garment);
  const setGarment = useEditorStore((s) => s.setGarment);
  const activeSide = useEditorStore((s) => s.activeSide);
  const setActiveSide = useEditorStore((s) => s.setActiveSide);
  const objects = useEditorStore((s) => s.objects);

  const stageRef = useRef<Konva.Stage | null>(null);

  // Load garment on mount
  useEffect(() => {
    const found = GARMENTS.find((g) => g.id === garmentId);
    if (found) setGarment(found);
  }, [garmentId, setGarment]);

  const handleQuickExport = () => {
    if (!stageRef.current) return;
    const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
    downloadDataUrl(dataUrl, `lead-design-${garmentId}-${activeSide}.png`);
  };

  const frontCount = objects.filter((o) => o.side === "front").length;
  const backCount = objects.filter((o) => o.side === "back").length;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top bar */}
      <TopBar
        title={garment?.name ?? "Editor"}
        subtitle="Studio"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={handleQuickExport}
              className="text-xs text-on-surface-variant hover:text-on-surface transition-colors font-medium"
            >
              Quick Export
            </button>
            <Link href={`/studio/${garmentId}/review`}>
              <Button variant="key-action" size="sm">
                Review & Export
              </Button>
            </Link>
          </div>
        }
      />

      {/* Main layout: toolbar | context panel | canvas | inspector */}
      <div className="flex-1 flex overflow-hidden pt-16">
        {/* Left icon toolbar */}
        <LeftToolbar />

        {/* Context panel */}
        <ContextPanel />

        {/* Canvas area */}
        <main className="flex-1 flex flex-col items-center justify-center bg-surface-container-low overflow-hidden p-8 gap-6">
          {/* Front / Back toggle */}
          <div className="flex items-center gap-2 bg-surface-container-lowest rounded-xl p-1 ambient-shadow">
            {(["front", "back"] as const).map((side) => (
              <button
                key={side}
                onClick={() => setActiveSide(side)}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors relative ${
                  activeSide === side
                    ? "bg-primary text-on-primary shadow"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {side}
                {side === "front" && frontCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[9px] font-bold flex items-center justify-center">
                    {frontCount}
                  </span>
                )}
                {side === "back" && backCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[9px] font-bold flex items-center justify-center">
                    {backCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Canvas */}
          {garment ? (
            <EditorCanvas stageRef={stageRef} />
          ) : (
            <div className="flex items-center justify-center w-[600px] h-[700px] bg-surface-container rounded-2xl">
              <div className="text-outline text-sm flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-outline-variant border-t-primary rounded-full animate-spin" />
                Loading garment…
              </div>
            </div>
          )}

          {/* Bottom hint */}
          <p className="text-[11px] text-outline font-label uppercase tracking-widest">
            Click canvas to deselect · Drag to move · Handles to resize & rotate
          </p>
        </main>

        {/* Right object inspector */}
        <ObjectInspector />
      </div>

      {/* Bottom bar */}
      <div className="h-14 bg-surface-container-lowest border-t border-outline-variant/10 flex items-center justify-between px-6">
        <Link href="/studio">
          <Button variant="ghost" size="sm">
            ← Back to Catalog
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-outline font-label">
            {objects.length} object{objects.length !== 1 ? "s" : ""}
          </span>
          <Link href={`/studio/${garmentId}/review`}>
            <Button variant="key-action" size="sm">
              Next: Review →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
