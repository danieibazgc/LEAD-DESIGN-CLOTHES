# Design System Strategy: The Tailored Canvas

## 1. Overview & Creative North Star
**Creative North Star: The Technical Atelier**

This design system is built for the intersection of high-end fashion and high-speed technology. We are not building a generic SaaS dashboard; we are creating a digital "Atelier"—a precise, clean, and expansive workspace where professional apparel designers can execute at scale.

To move beyond the "template" look, this system utilizes **The Technical Atelier** aesthetic: a philosophy that prioritizes high-contrast editorial typography against a "No-Line" interface. By removing structural borders and relying on tonal shifts and intentional asymmetry, we create a layout that feels fluid and premium. We lean into the "Studio" vibe—treating the UI as the background and the user's mockup content as the hero.

---

## 2. Colors & Surface Philosophy
The palette is grounded in a clinical, light neutral base, punctuated by a deep authoritative blue and a high-energy lime accent.

### The "No-Line" Rule
Standard UI relies on `1px` borders to separate sections. In this system, **solid borders for sectioning are strictly prohibited.** 
- Boundaries must be defined solely through background shifts. For example, a sidebar using `surface-container-low` should sit directly against a `surface` main stage. 
- The contrast between these tiers provides enough visual "edge" without the clutter of lines, resulting in a cleaner, faster-loading visual perception.

### Surface Hierarchy & Nesting
Treat the interface as a physical stack of materials.
- **Surface (Base):** Your primary canvas (`#f7f9fb`).
- **Surface-Container-Low:** For secondary navigation or sidebar elements.
- **Surface-Container-Lowest:** For floating cards or high-priority workspace panels.
- **Surface-Container-Highest:** Reserved for active states or deeply nested utility panels.

### The Glass & Gradient Rule
To provide a "soul" to the professional tool, use **Glassmorphism** for floating overlays (like tool palettes or property inspectors). Use a `surface-container-lowest` color at 80% opacity with a `20px` backdrop-blur. 
- **Signature Textures:** For primary action buttons or "Process Complete" states, apply a subtle linear gradient from `primary` (#004ac6) to `primary-container` (#2563eb) at a 135-degree angle. This adds a tactile depth that flat colors lack.

---

## 3. Typography: Editorial Authority
We use a dual-font approach to balance high-speed functionality with a premium brand voice.

- **Display & Headlines (Manrope):** We use Manrope for its architectural, wide-set proportions. It feels engineered yet sophisticated.
    - *Usage:* Large scale `display-lg` and `headline-md` are used for page titles and empty-state messaging. Use tight tracking (-2%) for headlines to give them a "locked-in" professional look.
- **Body & Labels (Inter):** Inter is our workhorse. It is optimized for high-readability at small sizes in complex mockup property panels.
    - *Usage:* `body-md` for standard text; `label-sm` for technical metadata (e.g., fabric type, hex codes).

The hierarchy must be aggressive. A `display-lg` headline should command the room, while `label-sm` elements should be treated as subtle "annotations" on the canvas.

---

## 4. Elevation & Depth
In a professional studio environment, depth must be functional, not just decorative.

### The Layering Principle
Forget structural lines. Depth is achieved by "stacking" the surface-container tiers. Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural lift. This mimics the way pattern paper sits on a cutting table.

### Ambient Shadows
When an element must float (e.g., a mockup preview or a context menu), use **Ambient Shadows**:
- **Shadow Token:** `0px 12px 32px rgba(25, 28, 30, 0.06)`.
- The shadow is intentionally faint and highly diffused. It uses a tint of the `on-surface` color, making the object appear as if it is naturally catching the light of the room.

### The "Ghost Border" Fallback
If a border is absolutely required for accessibility or to define a specific input field, it must be a **Ghost Border**:
- Use `outline-variant` at **20% opacity**. It should be barely visible—enough to guide the eye, but not enough to "grid" the layout.

---

## 5. Components

### Buttons
- **Primary Blue:** Standard controls. High contrast, using `primary` tokens.
- **Key Action (Lime):** Reserved exclusively for "Render," "Export," or "Finalize." Using `tertiary_fixed` (#bff365) with `on_tertiary_fixed` (#131f00). This provides a high-speed "go" signal.
- **Shape:** All buttons use the `md` (12px) roundedness to maintain a modular, modern feel.

### Input Fields
- **Styling:** No background. Use a `surface-container-high` bottom-only border (2px) that transforms into a full `primary` blue container on focus.
- **Helper Text:** Use `label-md` in `outline` color for a technical, annotated aesthetic.

### Cards & Mockup Lists
- **Rule:** **No Divider Lines.** 
- Separate list items using the `Spacing Scale (4)` (1rem). 
- Use alternating background tones (`surface` vs `surface-container-low`) for long data lists to create separation without the "prison bar" effect of lines.

### Floating Toolbars
- Use the **Glassmorphism** rule.
- Roundedness: `xl` (1.5rem) to differentiate tools from the modular `md` (0.75rem) layout.

---

## 6. Do's and Don'ts

### Do:
- **Use Asymmetry:** Place your primary canvas slightly off-center or use varying sidebar widths to create a bespoke, non-template feel.
- **Maximize White Space:** Use the `24` (6rem) spacing token for top-level section margins to let the apparel designs breathe.
- **Tonal Transitions:** Transition between `surface-container` tiers to guide the user's focus from the navigation to the workspace.

### Don't:
- **Don't use 100% Black:** Never use `#000000`. Use `on-surface` (#191c1e) for text to maintain a premium, soft-touch professional look.
- **Don't use Grid Borders:** Avoid the "Excel" look. Use space and color-blocking to define columns and rows.
- **Don't Over-shadow:** Only the primary floating canvas or modal should have a shadow. Everything else should rely on tonal layering.