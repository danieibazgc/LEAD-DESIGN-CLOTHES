/**
 * mockupExport.ts — Export service abstraction
 *
 * MVP: Uses Konva's toDataURL to export canvas as PNG.
 * TODO: Add PDF export via jsPDF, multi-view export, watermarking, etc.
 */

import type { ExportConfig } from "@/lib/types/domain";

export interface ExportResult {
  fileName: string;
  dataUrl: string;
  format: string;
}

/**
 * Exports a Konva stage as a PNG data URL.
 * Call from the browser — not a server action.
 *
 * @param stageRef - React ref to the Konva Stage node
 * @param config - Export configuration
 */
export async function exportMockup(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stageRef: React.RefObject<any>,
  config: ExportConfig
): Promise<ExportResult> {
  if (!stageRef.current) {
    throw new Error("Stage ref is not available");
  }

  const pixelRatioMap: Record<ExportConfig["resolution"], number> = {
    standard: 1,
    high: 2,
    ultra: 4, // TODO: 4K render
  };

  const pixelRatio = pixelRatioMap[config.resolution];

  // TODO: For PDF export, use jsPDF:
  // import jsPDF from "jspdf";
  // const pdf = new jsPDF({ ... });
  // pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
  // pdf.save(fileName);

  const dataUrl: string = stageRef.current.toDataURL({
    mimeType: config.format === "jpg" ? "image/jpeg" : "image/png",
    quality: 1,
    pixelRatio,
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  const fileName = `lead-design-${config.side}-${timestamp}.${config.format}`;

  return { fileName, dataUrl, format: config.format };
}

/** Triggers a browser download from a data URL */
export function downloadDataUrl(dataUrl: string, fileName: string): void {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}
