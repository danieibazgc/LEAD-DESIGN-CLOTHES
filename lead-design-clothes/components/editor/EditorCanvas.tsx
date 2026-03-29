/**
 * EditorCanvas — React Konva stage for placing and manipulating design objects
 * Must be a client component due to canvas APIs.
 */

"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text as KonvaText,
  Transformer,
  Rect,
} from "react-konva";
import useImage from "use-image";
import type Konva from "konva";
import { useEditorStore } from "@/lib/store/useEditorStore";
import type {
  DesignObject,
  ImageDesignObject,
  TextDesignObject,
  AIGeneratedDesignObject,
  Garment,
  GarmentColor,
} from "@/lib/types/domain";

// ── Garment silhouette drawing helpers ─────────────────────────────────────

/** Darken/lighten a hex color by `amount` (negative = darker) */
function shadeHex(hex: string, amount: number): string {
  const clean = hex.replace("#", "").padStart(6, "0");
  const num = parseInt(clean, 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/** T-shirt silhouette path (normalized 0-1, scaled to w×h) */
function buildTshirtPath(w: number, h: number): Path2D {
  const p = new Path2D();
  // Start at collar left corner
  p.moveTo(0.36 * w, 0.07 * h);
  // Collar U-curve
  p.bezierCurveTo(0.38 * w, 0.18 * h, 0.62 * w, 0.18 * h, 0.64 * w, 0.07 * h);
  // Right shoulder
  p.lineTo(0.76 * w, 0.12 * h);
  // Right sleeve top edge
  p.bezierCurveTo(0.84 * w, 0.13 * h, 0.94 * w, 0.15 * h, 0.99 * w, 0.20 * h);
  // Right sleeve outer bottom
  p.lineTo(0.97 * w, 0.36 * h);
  // Right armpit curve
  p.bezierCurveTo(0.87 * w, 0.33 * h, 0.81 * w, 0.32 * h, 0.77 * w, 0.34 * h);
  // Right body down
  p.lineTo(0.77 * w, 0.91 * h);
  // Bottom
  p.lineTo(0.23 * w, 0.91 * h);
  // Left body up
  p.lineTo(0.23 * w, 0.34 * h);
  // Left armpit curve
  p.bezierCurveTo(0.19 * w, 0.32 * h, 0.13 * w, 0.33 * h, 0.03 * w, 0.36 * h);
  // Left sleeve outer bottom
  p.lineTo(0.01 * w, 0.20 * h);
  // Left sleeve top edge
  p.bezierCurveTo(0.06 * w, 0.15 * h, 0.16 * w, 0.13 * h, 0.24 * w, 0.12 * h);
  // Left shoulder back to collar
  p.lineTo(0.36 * w, 0.07 * h);
  p.closePath();
  return p;
}

/** Hoodie silhouette path (normalized 0-1, scaled to w×h) */
function buildHoodiePath(w: number, h: number): Path2D {
  const p = new Path2D();
  // Hood left base
  p.moveTo(0.30 * w, 0.10 * h);
  // Hood arch over top
  p.bezierCurveTo(0.28 * w, -0.02 * h, 0.72 * w, -0.02 * h, 0.70 * w, 0.10 * h);
  // Right shoulder
  p.lineTo(0.80 * w, 0.16 * h);
  // Right sleeve top
  p.bezierCurveTo(0.88 * w, 0.17 * h, 0.96 * w, 0.20 * h, 1.00 * w, 0.26 * h);
  // Right sleeve bottom
  p.lineTo(0.97 * w, 0.43 * h);
  // Right armpit
  p.bezierCurveTo(0.87 * w, 0.40 * h, 0.81 * w, 0.38 * h, 0.78 * w, 0.40 * h);
  // Right body
  p.lineTo(0.78 * w, 0.93 * h);
  // Bottom
  p.lineTo(0.22 * w, 0.93 * h);
  // Left body
  p.lineTo(0.22 * w, 0.40 * h);
  // Left armpit
  p.bezierCurveTo(0.19 * w, 0.38 * h, 0.13 * w, 0.40 * h, 0.03 * w, 0.43 * h);
  // Left sleeve bottom
  p.lineTo(0.00 * w, 0.26 * h);
  // Left sleeve top
  p.bezierCurveTo(0.04 * w, 0.20 * h, 0.12 * w, 0.17 * h, 0.20 * w, 0.16 * h);
  // Back to hood
  p.lineTo(0.30 * w, 0.10 * h);
  p.closePath();
  return p;
}

/** Renders a solid-colored garment silhouette onto an HTMLCanvasElement */
function buildGarmentCanvas(
  garmentId: string,
  colorHex: string,
  w: number,
  h: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Neutral background
  ctx.fillStyle = "#EBEBEB";
  ctx.fillRect(0, 0, w, h);

  const isHoodie = garmentId.includes("hoodie");
  const path = isHoodie ? buildHoodiePath(w, h) : buildTshirtPath(w, h);

  // Drop shadow
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.22)";
  ctx.shadowBlur = 22;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = colorHex;
  ctx.fill(path);
  ctx.restore();

  // Base color fill (no shadow)
  ctx.fillStyle = colorHex;
  ctx.fill(path);

  // Edge / crease stroke
  ctx.strokeStyle = shadeHex(colorHex, -28);
  ctx.lineWidth = 1.2;
  ctx.stroke(path);

  // Subtle lighting gradient
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "rgba(255,255,255,0.14)");
  grad.addColorStop(0.45, "rgba(255,255,255,0.00)");
  grad.addColorStop(1, "rgba(0,0,0,0.09)");
  ctx.fillStyle = grad;
  ctx.fill(path);

  return canvas;
}

// ── Garment base: solid-colored canvas silhouette ───────────────────────────

function GarmentBase({
  garment,
  selectedColor,
  side,
}: {
  garment: Garment;
  selectedColor: GarmentColor | undefined;
  side: "front" | "back";
}) {
  const canvasSize = useEditorStore((s) => s.canvasSize);
  const colorHex = selectedColor?.hex ?? "#FFFFFF";
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    const colorSideImage =
      selectedColor?.sideImages?.[side] ??
      (garment.sides[side].startsWith("/") ? garment.sides[side] : null);

    img.onload = () => setImage(img);

    if (colorSideImage) {
      img.src = colorSideImage;
      return;
    }

    const cvs = buildGarmentCanvas(
      garment.id,
      colorHex,
      canvasSize.width,
      canvasSize.height
    );
    img.src = cvs.toDataURL();
  }, [
    garment.id,
    garment.sides,
    selectedColor?.sideImages,
    side,
    colorHex,
    canvasSize.width,
    canvasSize.height,
  ]);

  return image ? (
    <KonvaImage
      image={image}
      x={0}
      y={0}
      width={canvasSize.width}
      height={canvasSize.height}
      listening={false}
    />
  ) : null;
}

// ── Printable area overlay ──────────────────────────────────────────────────

function PrintableAreaRect({
  garment,
  side,
  canvasW,
  canvasH,
}: {
  garment: Garment;
  side: "front" | "back";
  canvasW: number;
  canvasH: number;
}) {
  const area = garment.printableArea[side];
  return (
    <Rect
      x={area.x * canvasW}
      y={area.y * canvasH}
      width={area.width * canvasW}
      height={area.height * canvasH}
      stroke="#004ac6"
      strokeWidth={1.5}
      dash={[6, 4]}
      opacity={0.5}
      listening={false}
      fill="transparent"
    />
  );
}

// ── Image/AI object ─────────────────────────────────────────────────────────

function ImageObject({
  obj,
  isSelected,
  onSelect,
  onChange,
}: {
  obj: ImageDesignObject | AIGeneratedDesignObject;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<DesignObject>) => void;
}) {
  const [img] = useImage(obj.src, "anonymous");
  const shapeRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  if (!img) return null;

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={img}
        x={obj.x}
        y={obj.y}
        width={obj.width}
        height={obj.height}
        rotation={obj.rotation}
        scaleX={obj.scaleX * (obj.flipX ? -1 : 1)}
        scaleY={obj.scaleY * (obj.flipY ? -1 : 1)}
        opacity={obj.opacity}
        visible={obj.visible}
        draggable={!obj.locked}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({ x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current!;
          onChange({
            x: node.x(),
            y: node.y(),
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY(),
            rotation: node.rotation(),
            scaleX: 1,
            scaleY: 1,
          });
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {isSelected && <Transformer ref={transformerRef} rotateEnabled keepRatio={false} />}
    </>
  );
}

// ── Text object ─────────────────────────────────────────────────────────────

function TextObject({
  obj,
  isSelected,
  onSelect,
  onChange,
}: {
  obj: TextDesignObject;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<DesignObject>) => void;
}) {
  const shapeRef = useRef<Konva.Text>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaText
        ref={shapeRef}
        x={obj.x}
        y={obj.y}
        width={obj.width}
        rotation={obj.rotation}
        text={obj.text}
        fontSize={obj.fontSize}
        fontFamily={obj.fontFamily}
        fontStyle={obj.fontStyle}
        fill={obj.fill}
        align={obj.textAlign}
        opacity={obj.opacity}
        visible={obj.visible}
        draggable={!obj.locked}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({ x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current!;
          onChange({
            x: node.x(),
            y: node.y(),
            width: node.width() * node.scaleX(),
            rotation: node.rotation(),
            scaleX: 1,
            scaleY: 1,
          });
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled
          enabledAnchors={["middle-left", "middle-right"]}
        />
      )}
    </>
  );
}

// ── Main canvas ─────────────────────────────────────────────────────────────

interface EditorCanvasProps {
  stageRef: React.RefObject<Konva.Stage | null>;
  /** When set, overrides the store's activeSide (used in review page for side-by-side) */
  forceSide?: "front" | "back";
  /** When true, hides the printable area overlay (used in review/export) */
  readOnly?: boolean;
}

export function EditorCanvas({ stageRef, forceSide, readOnly = false }: EditorCanvasProps) {
  const garment = useEditorStore((s) => s.garment);
  const activeSide = useEditorStore((s) => s.activeSide);
  const objects = useEditorStore((s) => s.objects);
  const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
  const selectedColorId = useEditorStore((s) => s.selectedColorId);
  const canvasSize = useEditorStore((s) => s.canvasSize);
  const selectObject = useEditorStore((s) => s.selectObject);
  const updateObject = useEditorStore((s) => s.updateObject);

  // forceSide lets the review page pin each canvas to front or back independently
  const side = forceSide ?? activeSide;

  const sideObjects = objects.filter((o) => o.side === side);
  const selectedColor = garment?.colors.find((c) => c.id === selectedColorId);

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | Event>) => {
      if (readOnly) return;
      if (e.target === e.target.getStage()) {
        selectObject(null);
      }
    },
    [selectObject, readOnly]
  );

  return (
    <div className="canvas-dots rounded-2xl overflow-hidden ambient-shadow">
      <Stage
        ref={stageRef as React.RefObject<Konva.Stage>}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleStageClick}
        onTap={handleStageClick}
      >
        <Layer>
          {/* Garment base */}
          {garment && (
            <GarmentBase
              garment={garment}
              selectedColor={selectedColor}
              side={side}
            />
          )}

          {/* Design objects */}
          {sideObjects.map((obj) => {
            const isSelected = obj.id === selectedObjectId;
            const patch = (p: Partial<DesignObject>) => updateObject(obj.id, p);

            if (obj.type === "text") {
              return (
                <TextObject
                  key={obj.id}
                  obj={obj as TextDesignObject}
                  isSelected={isSelected}
                  onSelect={() => selectObject(obj.id)}
                  onChange={patch}
                />
              );
            }
            return (
              <ImageObject
                key={obj.id}
                obj={obj as ImageDesignObject | AIGeneratedDesignObject}
                isSelected={isSelected}
                onSelect={() => selectObject(obj.id)}
                onChange={patch}
              />
            );
          })}

          {/* Printable area dashed overlay — hidden in read-only/review mode */}
          {garment && !readOnly && (
            <PrintableAreaRect
              garment={garment}
              side={side}
              canvasW={canvasSize.width}
              canvasH={canvasSize.height}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
