You are a senior full-stack engineer and product-minded frontend architect. y estas en la cima

Help me build a production-style MVP for an AI apparel mockup web application using Next.js, React, TypeScript, and a clean scalable component architecture.

Project goal:
Build a web app where a user can upload an image/logo, automatically remove its background, place it on a realistic garment mockup, add custom text, manage layers, switch between front and back garment views, generate artwork with AI, and export the final mockup.

Important:
I already created the UI mockups in Stitch and the project is based on these screens:
- landing page
- product selection dashboard
- apparel mockup studio editor
- color selection panel
- image preview modal
- AI background removal panel
- text tool editor
- AI image generator panel
- layers management panel
- garment editor front view
- garment editor back view
- final design review
- export design modal

I want you to help me implement this as a real web app.

Tech stack requirements:
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Zustand or another lightweight state manager for editor state
- React Konva or Fabric.js for design canvas editing
- Clean reusable component structure
- Server actions or API routes where useful
- Modular architecture, maintainable and scalable
- Desktop-first, but responsive
- Focus on clean code and good folder organization

Main product features:
1. Landing page
2. Product selection dashboard
3. Main editor page
4. Garment color selection
5. Upload image/logo
6. Image preview before adding
7. AI background removal button/flow
8. Add text to design
9. Layers management
10. Switch between front and back of the garment
11. AI image generation from prompt
12. Final review page
13. Export modal / export flow

Core editor behavior:
- A garment has at least two editable sides: front and back
- Each side has its own independent design objects
- Design objects can be:
  - uploaded image
  - text
  - AI-generated image
- Users can:
  - add objects
  - select objects
  - move objects
  - resize objects
  - duplicate objects
  - delete objects
  - reorder layers
  - hide/show layers
  - lock/unlock layers
- The editor should preserve state while switching between front and back
- The printable area should be visually bounded
- The design should be positioned inside the printable area
- The mockup preview should feel realistic, even if the initial MVP uses a simpler overlay technique

Object editing controls needed:
- move
- resize
- duplicate
- delete
- flip horizontally
- bring forward / send backward
- center align on printable area

Background removal feature:
- The uploaded image can be processed by an AI background removal action
- For the MVP, abstract this behind a service function so it can later connect to a real API
- Design the code so I can later integrate an external remove-background API

AI image generation feature:
- The user can enter a prompt and generate image options
- For MVP, create a service abstraction and mock response data first
- The architecture must make it easy to later plug in OpenAI image generation or another provider

Export feature:
- Export front, back, or both
- Prefer PNG export first for MVP
- Structure code so PDF export can be added later

What I need from you:
1. First, propose the full project folder structure
2. Then define the main app routes
3. Then define the shared types/interfaces for:
   - garment
   - garment side
   - design object
   - text object
   - image object
   - AI generated object
   - layer state
   - editor state
4. Then define the Zustand store shape and actions
5. Then define the list of React components needed
6. Then generate the code for the base layout and route scaffolding
7. Then generate the code for the editor page
8. Then generate the code for the left toolbar
9. Then generate the code for the editable canvas area
10. Then generate the code for the front/back switch logic
11. Then generate the code for the layers panel
12. Then generate the code for the text tool panel
13. Then generate the code for the upload panel
14. Then generate the code for the AI image generator panel
15. Then generate the code for the export modal
16. Then generate mock service files for:
   - background removal
   - AI image generation
   - mockup export
17. Then suggest improvements and next engineering steps

Implementation instructions:
- Do not jump straight into a giant monolithic code dump
- Work step by step
- At each step, explain the reasoning briefly and then output the code
- Use strict TypeScript types
- Keep components small and composable
- Avoid overengineering, but keep the design scalable
- Use realistic naming conventions
- Prefer server-safe architecture where appropriate
- Include TODO comments where a real API integration will later happen
- If a library choice must be made, explain the tradeoff briefly and choose the best MVP option
- If a feature is not fully implementable in one pass, provide a clean placeholder implementation

UI/UX direction:
- Professional AI mockup editor
- Clean modern SaaS feel
- Left vertical toolbar
- Contextual tool panel
- Center garment preview/editor area
- Front/back toggle
- Floating object actions or a side inspector
- Clean export/review flow
- Similar to a t-shirt customization studio for print-on-demand businesses

Please start by giving me:
A. the recommended technical architecture
B. the folder structure
C. the shared TypeScript domain model
Do not skip directly to final code for everything at once.