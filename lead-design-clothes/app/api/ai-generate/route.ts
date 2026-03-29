import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "@/lib/utils/nanoid";

export const maxDuration = 30;

const OR_BASE = "https://openrouter.ai/api/v1";
const TEXT_MODEL = "google/gemini-2.0-flash-lite:free";
const SEEDS = [42, 137, 888, 512];

const OR_HEADERS = (apiKey: string) => ({
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "https://lead-design-clothes.vercel.app",
  "X-Title": "LEAD Design Clothes",
});

async function buildEnhancedPrompts(
  prompt: string,
  style: string,
  apiKey: string
): Promise<string[]> {
  const system = `You are a creative director for apparel graphic design.
Given a concept and style, write 4 distinct image-generation prompts for an AI model.
Rules:
- Each optimized for t-shirt printing (isolated subject, plain white background)
- Each differs in composition and colour palette
- Match the requested style
- 1-2 sentences, vivid — no filler
Return ONLY a valid JSON array of exactly 4 strings. No markdown, no explanation.`;

  try {
    const res = await fetch(`${OR_BASE}/chat/completions`, {
      method: "POST",
      headers: OR_HEADERS(apiKey),
      body: JSON.stringify({
        model: TEXT_MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: `Concept: "${prompt}"\nStyle: ${style}` },
        ],
        temperature: 0.9,
        max_tokens: 600,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const raw: string = data.choices?.[0]?.message?.content ?? "";
      const cleaned = raw.replace(/```json?\s*/gi, "").replace(/```/g, "").trim();
      const parsed: unknown = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length >= 4) return parsed as string[];
    }
  } catch {
    // fall through
  }

  const styleMap: Record<string, string> = {
    minimal: "clean minimal line art, monochrome, bold geometric shapes",
    streetwear: "bold streetwear graphic, urban, high contrast shadows",
    vintage: "retro vintage poster, muted earth tones, distressed texture",
    corporate: "professional flat icon, clean lines, limited palette",
    graffiti: "vibrant graffiti mural, spray-paint drips, wild style",
    illustration: "detailed digital illustration, rich colours, character art",
  };
  const s = styleMap[style] ?? style;
  return [
    `${prompt}, ${s}, apparel graphic, white background`,
    `${prompt}, ${s}, symmetrical composition, t-shirt design, isolated`,
    `${prompt}, ${s}, bold colours, transparent background, print-ready`,
    `${prompt}, ${s}, high contrast, centered motif, garment graphic`,
  ];
}

/**
 * Returns a Pollinations.ai URL.
 * The image is generated lazily when the browser first requests the URL.
 * This avoids server-side rate limits and lets 4 images load in parallel in the browser.
 */
function buildPollinationsUrl(prompt: string, seed: number): string {
  const suffix =
    ", isolated on white background, t-shirt print quality, no text, no watermark";
  return (
    "https://image.pollinations.ai/prompt/" +
    encodeURIComponent(prompt + suffix) +
    `?width=512&height=512&nologo=true&model=flux&seed=${seed}`
  );
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { prompt?: string; style?: string };
  const prompt = body.prompt?.trim() ?? "";
  const style = body.style ?? "illustration";

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const apiKey =
    process.env.OPENROUTER_API_KEY ?? process.env.INK_OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenRouter API key not configured" },
      { status: 500 }
    );
  }

  // Step 1: Enhance prompt into 4 variations via Gemini (fast, ~1-2s)
  const enhancedPrompts = await buildEnhancedPrompts(prompt, style, apiKey);

  // Step 2: Build Pollinations URLs (instant — browser fetches them when <img> renders)
  const images = enhancedPrompts.slice(0, 4).map((p, i) => ({
    id: nanoid(),
    src: buildPollinationsUrl(p, SEEDS[i]),
    prompt: p,
  }));

  return NextResponse.json(images);
}
