/**
 * mockupExport.ts — ZIP export with 4 images per package
 *
 * ZIP contents:
 *   front-mockup.{ext}  — Full front (garment + design)
 *   front-print.{ext}   — Front design only (transparent garment)
 *   back-mockup.{ext}   — Full back (garment + design)
 *   back-print.{ext}    — Back design only (transparent garment)
 */

import type { ExportConfig } from "@/lib/types/domain";

const PIXEL_RATIO: Record<ExportConfig["resolution"], number> = {
  standard: 1,
  high: 2,
  ultra: 4,
};

/** Export a stage as a data-URL (full render: garment + design) */
export async function exportMockup(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stageRef: React.RefObject<any>,
  config: ExportConfig
): Promise<{ fileName: string; dataUrl: string; format: string }> {
  if (!stageRef.current) throw new Error("Stage ref not available");

  const dataUrl: string = stageRef.current.toDataURL({
    mimeType: config.format === "jpg" ? "image/jpeg" : "image/png",
    quality: 1,
    pixelRatio: PIXEL_RATIO[config.resolution],
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  const fileName = `lead-design-${config.side}-${timestamp}.${config.format}`;
  return { fileName, dataUrl, format: config.format };
}

/**
 * Export a stage with the garment base layer hidden (design-only, transparent bg).
 * Temporarily hides the first Konva child (GarmentBase KonvaImage) during export.
 */
function exportPrintOnly(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stageRef: React.RefObject<any>,
  config: ExportConfig
): string {
  const stage = stageRef.current;
  if (!stage) throw new Error("Stage ref not available");

  const layer = stage.getLayers()[0];
  const garmentNode = layer.getChildren()[0]; // GarmentBase is always first

  garmentNode.hide();
  layer.batchDraw();

  const dataUrl: string = stage.toDataURL({
    mimeType: config.format === "jpg" ? "image/jpeg" : "image/png",
    quality: 1,
    pixelRatio: PIXEL_RATIO[config.resolution],
  });

  garmentNode.show();
  layer.batchDraw();

  return dataUrl;
}

/** Converts a data-URL to its base64 payload (strips the header) */
function dataUrlToBase64(dataUrl: string): string {
  return dataUrl.split(",")[1];
}

/**
 * Builds a ZIP containing 4 files:
 *   front-mockup, front-print, back-mockup, back-print
 * Returns a Blob and suggested file name.
 */
export async function exportAsZip(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frontStageRef: React.RefObject<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  backStageRef: React.RefObject<any>,
  config: Pick<ExportConfig, "format" | "resolution">,
  onProgress?: (pct: number) => void
): Promise<{ blob: Blob; fileName: string }> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const ext = config.format;
  const kovaConfig = { ...config, includeGarment: true } as ExportConfig;

  onProgress?.(10);

  // 1. Front mockup (full)
  const frontMockupUrl = frontStageRef.current.toDataURL({
    mimeType: ext === "jpg" ? "image/jpeg" : "image/png",
    quality: 1,
    pixelRatio: PIXEL_RATIO[config.resolution],
  }) as string;
  zip.file(`front-mockup.${ext}`, dataUrlToBase64(frontMockupUrl), { base64: true });
  onProgress?.(30);

  // 2. Front print only (no garment)
  const frontPrintUrl = exportPrintOnly(frontStageRef, { ...kovaConfig, side: "front" });
  zip.file(`front-print.${ext}`, dataUrlToBase64(frontPrintUrl), { base64: true });
  onProgress?.(50);

  // 3. Back mockup (full)
  const backMockupUrl = backStageRef.current.toDataURL({
    mimeType: ext === "jpg" ? "image/jpeg" : "image/png",
    quality: 1,
    pixelRatio: PIXEL_RATIO[config.resolution],
  }) as string;
  zip.file(`back-mockup.${ext}`, dataUrlToBase64(backMockupUrl), { base64: true });
  onProgress?.(70);

  // 4. Back print only (no garment)
  const backPrintUrl = exportPrintOnly(backStageRef, { ...kovaConfig, side: "back" });
  zip.file(`back-print.${ext}`, dataUrlToBase64(backPrintUrl), { base64: true });
  onProgress?.(90);

  const blob = await zip.generateAsync({ type: "blob" });
  const timestamp = new Date().toISOString().slice(0, 10);
  onProgress?.(100);

  return { blob, fileName: `lead-design-clothes-${timestamp}.zip` };
}

/** Triggers a browser download from a Blob */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/** Triggers a browser download from a data URL (kept for backwards compat) */
export function downloadDataUrl(dataUrl: string, fileName: string): void {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}
