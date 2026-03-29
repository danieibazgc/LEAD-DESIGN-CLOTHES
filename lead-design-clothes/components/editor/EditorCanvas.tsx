/**
 * EditorCanvas — React Konva stage for placing and manipulating design objects
 * Must be a client component due to canvas APIs.
 */

"use client";

import { useRef, useCallback } from "react";
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
import { useEffect } from "react";

// ── Garment base image ──────────────────────────────────────────────────────

function GarmentBase({
  garment,
  selectedColor,
  side,
}: {
  garment: Garment;
  selectedColor: GarmentColor | undefined;
  side: "front" | "back";
}) {
  const url =
    selectedColor?.sideImages?.[side] ??
    garment.sides[side];
  const [img] = useImage(url, "anonymous");
  const { canvasSize } = useEditorStore.getState();

  return img ? (
    <KonvaImage
      image={img}
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
        onTransformEnd={(e) => {
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
}

export function EditorCanvas({ stageRef }: EditorCanvasProps) {
  const garment = useEditorStore((s) => s.garment);
  const activeSide = useEditorStore((s) => s.activeSide);
  const objects = useEditorStore((s) => s.objects);
  const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
  const selectedColorId = useEditorStore((s) => s.selectedColorId);
  const canvasSize = useEditorStore((s) => s.canvasSize);
  const selectObject = useEditorStore((s) => s.selectObject);
  const updateObject = useEditorStore((s) => s.updateObject);

  const sideObjects = objects.filter((o) => o.side === activeSide);
  const selectedColor = garment?.colors.find((c) => c.id === selectedColorId);

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | Event>) => {
      if (e.target === e.target.getStage()) {
        selectObject(null);
      }
    },
    [selectObject]
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
              side={activeSide}
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

          {/* Printable area dashed overlay */}
          {garment && (
            <PrintableAreaRect
              garment={garment}
              side={activeSide}
              canvasW={canvasSize.width}
              canvasH={canvasSize.height}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
