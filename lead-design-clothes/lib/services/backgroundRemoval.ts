/**
 * backgroundRemoval.ts — Background removal powered by @imgly/background-removal
 * Runs entirely in the browser via WebAssembly + ONNX. No API key required.
 */

import type {
  BackgroundRemovalRequest,
  BackgroundRemovalResult,
} from "@/lib/types/domain";

export async function removeBackground(
  req: BackgroundRemovalRequest
): Promise<BackgroundRemovalResult> {
  // Dynamically import so the heavy WASM bundle is only loaded when needed
  const { removeBackground: imglyRemoveBg } = await import(
    "@imgly/background-removal"
  );

  // Convert data-URL string to a Blob so imgly can process it
  const blob = await fetch(req.imageSrc).then((r) => r.blob());

  const resultBlob = await imglyRemoveBg(blob, {
    // isnet_quint8 is the smallest/fastest variant available
    model: "isnet_quint8",
    output: { format: "image/png" },
  });

  const resultSrc = URL.createObjectURL(resultBlob);
  return { resultSrc };
}
