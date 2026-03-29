/**
 * aiImageGeneration.ts — Real AI image generation via OpenRouter + Pollinations.ai
 *
 * Flow:
 *  1. POST to /api/ai-generate (server-side Next.js route)
 *  2. Route calls OpenRouter (google/gemini-2.0-flash-lite) to create 4 enhanced prompts
 *  3. Route returns 4 Pollinations.ai image URLs built from those prompts
 */

import type {
  AIGenerationRequest,
  AIGenerationResult,
} from "@/lib/types/domain";

export async function generateAIImage(
  req: AIGenerationRequest
): Promise<AIGenerationResult[]> {
  const res = await fetch("/api/ai-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: req.prompt, style: req.style }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "AI generation failed");
  }

  return res.json() as Promise<AIGenerationResult[]>;
}
