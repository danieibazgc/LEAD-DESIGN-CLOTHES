# LEAD Design Clothes

AI-powered apparel mockup studio to design, customize, and export garment previews from the browser.

## Overview

LEAD Design Clothes is a full-stack web experience for creating apparel mockups with AI-assisted workflows. It combines a canvas editor, garment catalog, front/back design support, layer management, and export features in one product.

Target users include independent designers, print-on-demand stores, and apparel teams that need fast visual prototypes without external design software.

## Main Features

### Editor and Workflow
- Canvas-based editing with drag, resize, rotate, duplicate, and delete actions
- Independent front and back composition per garment
- Printable-area guidance for safer placement
- Final review screen before export

### Creative Tools
- Upload image/logo assets and place them on canvas
- Text tool with typography controls
- Layers panel for ordering, visibility, and locking
- Garment color switching

### AI Features
- Browser-side background removal using `@imgly/background-removal`
- Prompt-to-image generation through `/api/ai-generate`
- Enhanced prompt generation via OpenRouter before image URL creation

### Export
- PNG export for front, back, or both sides
- Export modal integrated into review flow

## Routes

- `/` -> landing page
- `/studio` -> garment catalog/dashboard
- `/studio/[garmentId]` -> editor studio
- `/studio/[garmentId]/review` -> final review and export

## Repository Structure

```text
LEAD-DESIGN-CLOTHES/
├── README.md
├── Mockups/                    # Static UI concept files
└── lead-design-clothes/        # Next.js application
    ├── app/
    │   ├── api/ai-generate/
    │   └── studio/
    ├── components/
    │   ├── editor/
    │   ├── providers/
    │   └── ui/
    ├── lib/
    │   ├── data/
    │   ├── i18n/
    │   ├── services/
    │   ├── store/
    │   ├── types/
    │   └── utils/
    └── public/
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Canvas | Konva + React Konva |
| State | Zustand |
| AI (text/prompt) | OpenRouter |
| AI (image URLs) | Pollinations |
| Background removal | `@imgly/background-removal` |

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install and Run

```bash
git clone https://github.com/danieibazgc/LEAD-DESIGN-CLOTHES.git
cd LEAD-DESIGN-CLOTHES/lead-design-clothes
npm install
npm run dev
```

Open http://localhost:3000.

## Environment Variables

Create a `.env.local` file inside `lead-design-clothes/`.

```env
OPENROUTER_API_KEY=your_key_here
# Optional alternative key name supported by the API route
INK_OPENROUTER_API_KEY=your_key_here
```

Notes:
- AI generation requires one of the keys above.
- Background removal runs in-browser and does not require an external API key.

## Roadmap

- [x] Canvas editor and object transforms
- [x] Front/back garment workflow
- [x] Layer management
- [x] Text editing tools
- [x] AI background removal
- [x] AI image generation pipeline
- [x] PNG export flow
- [ ] PDF export
- [ ] Better mobile editor ergonomics
- [ ] Saved projects and user accounts

## Team

Built at Sundai Latam Hack (March 29, 2026).

| Name | GitHub |
|---|---|
| Matthew Zegarra | https://github.com/Matthewzegarra0312 |
| Daniel Ibanez | https://github.com/danieibazgc |
| Marcio Zinanyuca | (add profile) |
| Joaquin Chaparro | (add profile) |
| Jonathan Tuppia | (add profile) |

## Hackathon Context

This project was created during Sundai Latam Hack (online edition), a 24-hour build focused on practical AI products for Latin America.

Challenge: build an AI-powered tool for a real creative-industry workflow.

Project response: make professional apparel mockup design faster and more accessible.
