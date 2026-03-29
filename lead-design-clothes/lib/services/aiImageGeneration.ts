/**
 * aiImageGeneration.ts — AI image generation service abstraction
 *
 * MVP: Returns mock generated images from a predefined set.
 * TODO: Replace with a real generation API:
 *   - OpenAI DALL-E 3: https://platform.openai.com/docs/api-reference/images
 *   - Stability AI: https://platform.stability.ai/
 *   - Replicate: https://replicate.com/
 */

import type {
  AIGenerationRequest,
  AIGenerationResult,
} from "@/lib/types/domain";
import { nanoid } from "@/lib/utils/nanoid";

/** Mock result images (real apparel graphic URLs) */
const MOCK_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAfbcX49OBumeVG1aJAW2vFhEHRoySKF6o1Cy9A2gnbXi6rYeOTId5NrNKnoQ8wOpZFDxf4QKHvYwjQbU2NXh8nVSomtvyZr95U02e7xz88x7PvS4YXG1yjJuxeInskUdr5wo4JEY0sbs2QN06A-kQfHzesBmNVlLo1Th5BPU_KagPAgX4uovsHPaR9TF4v3SjlkjIapfWzCowvcDArKms1oJHVla4mVs90ruNi48xoQoSJncVi3p2Org7dFidzd1kjMz02tkxgidg3",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCuOMick1JeiVQSLSLKxB4AwIZkscnfEwdVF1xR20MlVQDw8MneqZdWgf45PGZ0gsZAk9OFqQqe102_2KjPsrN9ZnGCchYL1XtMX_l7msaePstNNqhGcryGbx4b3ZXzuft_5Ob3vpFXj7wa2epHgtAKChT9akq1zVy3yHx_Sy9-AFzoXKv8u0VeZIhKRkzbTvfa3GOJgnXHPoBLdrqzUMGMJ-cUjAAEmCBxMWtJejOYFMCqLH8DCeHuABGBBq74xs2m6HJmpMGEx6L4",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD5jcjxi4YwtWGT7Dq75d0bEPwO2dEPTtjmtmaFxIZuAV0btlr5tH1_MEH-jnG0Efdf6hTWvA9-VYFUlibffLrS5LybjZ06U7k4Ukk735flsA6b7O7liIt-DeCfrKKHSAc6jS_GJzbBEPpiMy5YdzEWh-vKXz4AzYQmR4qVzF-2QNsg8iUueMWKTxyANxmmz21TJ9j4WOlccT3HKDScsGgqTkZLMRtTvAolZvG8obC-Gd7C4vJgwJYGAo8fSvSG2VSzNyreeWhBDBSU",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBqVDqs0pbMAPBHlzyUXaNkTc1FLAmTn4tLOEaU-UgSoQska3E58A5CsADSrxrX1ZYEshLdQVr3QloPaileqi7t2nQ26m2BPlKPbU-wynTTvqi-6Pq07NEYaHB6mglaf5x6lzrRDGRa1nCytQ_wtjh9ct1ZA-haaaW56L8uKn5Io6rAssMEmwERfe_7FghhKcUB_j-dQpd8UAppKfwZRhycQ46OP71j8TQYgYSFpQTNjjDd1WTm6tCb1FgnYTM30syiNe7-l7TD-o6J",
];

export async function generateAIImage(
  req: AIGenerationRequest
): Promise<AIGenerationResult[]> {
  // TODO: Replace mock with real API call, e.g.:
  // const res = await fetch("https://api.openai.com/v1/images/generations", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  //   },
  //   body: JSON.stringify({
  //     model: "dall-e-3",
  //     prompt: `${req.prompt}, ${req.style} style, apparel graphic, ${req.transparentBackground ? "transparent background" : "white background"}`,
  //     n: 4,
  //     size: "1024x1024",
  //   }),
  // });

  // Mock: simulate 2s generation delay and return 4 images
  await new Promise((r) => setTimeout(r, 2000));

  return MOCK_IMAGES.map((src) => ({
    id: nanoid(),
    src,
    prompt: req.prompt,
  }));
}
