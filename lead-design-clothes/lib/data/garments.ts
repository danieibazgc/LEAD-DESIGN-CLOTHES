/**
 * garments.ts — Static garment catalog data (mock for MVP)
 * Replace with a database/API call in production.
 */

import type { Garment } from "@/lib/types/domain";

export const GARMENTS: Garment[] = [
  {
    id: "classic-tee",
    name: "Polo Classic",
    category: "tops",
    colors: [
      {
        id: "white",
        name: "White",
        hex: "#FFFFFF",
        sideImages: {
          front: "/garments/polo/white-front.png",
          back: "/garments/polo/white-back.png",
        },
      },
      {
        id: "black",
        name: "Black",
        hex: "#191c1e",
        sideImages: {
          front: "/garments/polo/black-front.png",
          back: "/garments/polo/black-back.png",
        },
      },
      {
        id: "sky-blue",
        name: "Sky Blue",
        hex: "#6bb7ff",
        sideImages: {
          front: "/garments/polo/sky-blue-front.png",
          back: "/garments/polo/sky-blue-back.png",
        },
      },
      {
        id: "light-pink",
        name: "Light Pink",
        hex: "#f4b6cf",
        sideImages: {
          front: "/garments/polo/light-pink-front.png",
          back: "/garments/polo/light-pink-back.png",
        },
      },
    ],
    sides: {
      front: "/garments/polo/white-front.png",
      back: "/garments/polo/white-back.png",
    },
    printableArea: {
      front: { x: 0.28, y: 0.2, width: 0.44, height: 0.55 },
      back: { x: 0.28, y: 0.2, width: 0.44, height: 0.55 },
    },
    printAreas: 2,
    thumbnailUrl: "/garments/polo/white-front.png",
  },
  {
    id: "oversized-hoodie",
    name: "Oversized Cotton Hoodie",
    category: "tops",
    colors: [
      { id: "black", name: "Black", hex: "#191c1e" },
      { id: "white", name: "White", hex: "#FFFFFF" },
      { id: "navy", name: "Navy", hex: "#000080" },
      { id: "forest-green", name: "Forest Green", hex: "#228b22" },
      { id: "ash", name: "Ash Grey", hex: "#b2b2b2" },
      { id: "maroon", name: "Maroon", hex: "#800000" },
      { id: "royal", name: "Royal", hex: "#4169e1" },
      { id: "natural", name: "Natural", hex: "#f5f5dc" },
    ],
    sides: {
      front:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAIYoIgcrbOkT4ifzfNXLSZOJ1_G2QrTOgGz-G3F0uXkPTmKUGhd-1ZU-UN0pd9XmsUU0GrwN8FEhPUYzxiRcdZZ5kKW1xROTW3BkKC1-taiKQSTYYCli2vGvME3YI5tbB4bb93gYFOt6RQsYsHuWvPYiR1lHNxyhY_TjS1TYna5BjvxF8uvplQsqnQQXEf5hJab4rVDCwElViRwJEQuAupJA2nk0W00zQwdSbDnakVvG3OX2QqsPlrrz0lVg5pCk0UBOn9HRXDz9UR",
      back: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZK6pGSP0qbZP_RJjVJVMn_c5pWLcqfeMDEr-qO3xEkBgbkql9fDawxRaZeWAJNfLrXw0h11HwBcmmYfGDoscMieeCShmiTbYqiE8Pu_hd-OyzEeQR7XZRmWsCo8nyamLFCy9q6gU3nOe4Z73lM66utBgU_LixEdtSvA1GhUGJ2qiuT7LCTboTr7O5aO_GPrsYGKUTBjegwg1z9j0thejUkHrDWH1ak18EVsDGIAwuZFV5SFg6CA0_44fsI2ITwuXjmkfto3KTS9H_D",
    },
    printableArea: {
      front: { x: 0.3, y: 0.22, width: 0.4, height: 0.5 },
      back: { x: 0.3, y: 0.22, width: 0.4, height: 0.5 },
    },
    printAreas: 3,
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAIYoIgcrbOkT4ifzfNXLSZOJ1_G2QrTOgGz-G3F0uXkPTmKUGhd-1ZU-UN0pd9XmsUU0GrwN8FEhPUYzxiRcdZZ5kKW1xROTW3BkKC1-taiKQSTYYCli2vGvME3YI5tbB4bb93gYFOt6RQsYsHuWvPYiR1lHNxyhY_TjS1TYna5BjvxF8uvplQsqnQQXEf5hJab4rVDCwElViRwJEQuAupJA2nk0W00zQwdSbDnakVvG3OX2QqsPlrrz0lVg5pCk0UBOn9HRXDz9UR",
  },
  {
    id: "essential-crewneck",
    name: "Essential Crewneck",
    category: "tops",
    colors: [
      { id: "heather-grey", name: "Heather Grey", hex: "#9ca3af" },
      { id: "black", name: "Black", hex: "#191c1e" },
      { id: "white", name: "White", hex: "#FFFFFF" },
      { id: "navy", name: "Navy", hex: "#000080" },
      { id: "sand", name: "Sand", hex: "#c2b280" },
      { id: "burgundy", name: "Burgundy", hex: "#800020" },
    ],
    sides: {
      front:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDJBCI60LBrMnrb6TDulo3hOVcMtb8yaoPLJHqkMbtFN9cfFne3kuJH77zcNDHNVx9x6ZRz_urm1uVlxny3MvKRRCtviTnynDqRtK9-OjPgxR5oBlDKjtwLohtggFMHQ4XzqEzQLHChaKutgpaNvfCKjav3IvS8DKfwT5H6FUsu_WQ1AO86M05eFJLlvw6CnfVu6I1fAE7I3yjor-rq__funeGZqXXbMATs3vJ7uDEQVsDxCwq5bhUWVUpjQt15CsgRFitLa3bYKFfh",
      back: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEyk_qMpWs9l1eGvyI1lohx-3RTV9itvup4BAWkGUD3oOW5amSiYF2_DXmT30mxvOlczilkVkrvLOcKw6pjS79BXVkIfoW38-XuNwhR4AAFJ3XSyHapZjy8d80ST_KsLo07JShBR_18jcd2w5hhr8-vxjhz_FUuZ5yqWkYf_-RRlu7lfZ-NQi2eItebO-W0RNSqwH_NmiTDrCOeTncDRnX4MtM9BpBxZ8W4D2GGg3xqBsiO_A6SShws2r6MhWVOApmnOuUgULmKpuM",
    },
    printableArea: {
      front: { x: 0.27, y: 0.22, width: 0.46, height: 0.52 },
      back: { x: 0.27, y: 0.22, width: 0.46, height: 0.52 },
    },
    printAreas: 2,
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJBCI60LBrMnrb6TDulo3hOVcMtb8yaoPLJHqkMbtFN9cfFne3kuJH77zcNDHNVx9x6ZRz_urm1uVlxny3MvKRRCtviTnynDqRtK9-OjPgxR5oBlDKjtwLohtggFMHQ4XzqEzQLHChaKutgpaNvfCKjav3IvS8DKfwT5H6FUsu_WQ1AO86M05eFJLlvw6CnfVu6I1fAE7I3yjor-rq__funeGZqXXbMATs3vJ7uDEQVsDxCwq5bhUWVUpjQt15CsgRFitLa3bYKFfh",
  },
];
