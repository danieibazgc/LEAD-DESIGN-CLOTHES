/**
 * backgroundRemoval.ts — Background removal service abstraction
 *
 * MVP: Simulates a delay and returns the original image.
 * TODO: Replace with a real remove-bg API call:
 *   - Remove.bg API: https://www.remove.bg/api
 *   - Clipdrop: https://clipdrop.co/apis/docs/remove-background
 *   - Local: rembg Python service
 */

import type {
  BackgroundRemovalRequest,
  BackgroundRemovalResult,
} from "@/lib/types/domain";

export async function removeBackground(
  req: BackgroundRemovalRequest
): Promise<BackgroundRemovalResult> {
  // TODO: Swap this mock with an actual API call, e.g.:
  // const formData = new FormData();
  // formData.append("image_url", req.imageSrc);
  // const res = await fetch("https://api.remove.bg/v1.0/removebg", {
  //   method: "POST",
  //   headers: { "X-Api-Key": process.env.REMOVE_BG_API_KEY! },
  //   body: formData,
  // });
  // const blob = await res.blob();
  // const resultSrc = URL.createObjectURL(blob);

  // Mock: simulate 1.5s processing delay
  await new Promise((r) => setTimeout(r, 1500));

  return {
    resultSrc: req.imageSrc, // MVP: return original unchanged
  };
}
