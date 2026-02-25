# Tailwind v4 Migration Plan

## The Problem

The webapp imports pre-compiled Tailwind CSS from web-components, then runs its own separate Tailwind build. This produces **two independent sets of utility classes** in the final CSS. Because they're independent, duplicate classes like `.w-full` appear twice — and the second copy (from the webapp's build) lands after responsive variants like `md:w-96` (from web-components' build). At equal specificity, last-in-source-order wins, so the webapp's `.w-full` overrides `md:w-96`.

**Current CSS output order in webapp:**
```
Position 131K: .w-full { width: 100% }           ← from web-components.css
Position 149K: .md\:w-auto { width: auto }        ← from web-components.css  (correct order internally)
Position 162K: .w-full { width: 100% }            ← from webapp's Tailwind   (OVERRIDES md:w-96!)
Position 175K: .md\:w-auto { width: auto }        ← from webapp's Tailwind
```

Additionally, `md:w-96` only exists in `web-components.css` — the webapp's Tailwind never generates it because its `content` config doesn't scan web-components source files.

## The Solution: Migrate to Tailwind v4

Tailwind v4 uses native CSS `@layer` by default, which resolves conflicts by layer order rather than source order. But more importantly, we adopt the **shadcn-style single-build architecture**: the library ships a theme file and component source — the consumer runs **one** Tailwind build that covers everything.

**New flow:**
```
web-components: ships theme.css + CSS variables + component .vue files
webapp: imports theme.css → uses @source to scan web-components → ONE Tailwind build
```

## Decision: Two-Phase Approach

**Phase 1: Tailwind v4 migration** — Migrate both repos to Tailwind v4. Keep `@apply` in SCSS files working via the library's own Tailwind build (`@tailwindcss/vite`). Validate that everything looks correct in Storybook and the webapp.

**Phase 2: Eliminate `@apply`** — Once Phase 1 is stable, replace all 60 `@apply` occurrences in web-components with raw CSS properties. This removes the Tailwind build dependency from the library entirely and is the cleaner long-term architecture.

---

# Phase 1: Tailwind v4 Migration

Goal: Get both repos on Tailwind v4 with the single-build architecture. `@apply` stays for now, resolved by the library's own `@tailwindcss/vite` plugin at build time.

## Phase 1A: web-components

### 1. Update dependencies

```bash
npm uninstall tailwindcss postcss autoprefixer
npm install -D @tailwindcss/vite tailwindcss@latest
```

Remove from `package.json` devDependencies:
- `autoprefixer` (v4 handles this)
- `postcss` (v4 Vite plugin replaces PostCSS pipeline)
- `prettier-plugin-tailwindcss` (check if v4-compatible version exists)

### 2. Replace `tailwind.config.cjs` with `src/assets/styles/theme.css`

The JS config goes away entirely. Create a CSS-based theme file.

**Current** `tailwind.config.cjs` maps to:

```css
/* src/assets/styles/theme.css */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* === Font === */
  --font-sans: "Garet Variable", "Garet", "Helvetica", "Arial", sans-serif;

  /* === Static color scales (hardcoded, not themed) === */
  --color-neutral-50: #f7f9fc;
  --color-neutral-100: #ebeff5;
  --color-neutral-200: #c1cad7;
  --color-neutral-300: #a4b2c5;
  --color-neutral-400: #8396b1;
  --color-neutral-500: #66768e;
  --color-neutral-600: #566479;
  --color-neutral-700: #4c5a6e;
  --color-neutral-800: #384354;
  --color-neutral-900: #273141;
  --color-neutral-950: #171c25;
  /* ... same pattern for blue, red, green, yellow, orange ... */

  /* === Semantic tokens (CSS-variable-backed, themed via _root.scss) === */
  --color-neutral-bg-50: var(--color-background-50);
  --color-neutral-bg-100: var(--color-background-100);
  --color-neutral-bg-200: var(--color-background-200);
  --color-neutral-bg-300: var(--color-background-300);
  --color-neutral-bg-1: var(--color-background-level-1);
  --color-neutral-bg-2: var(--color-background-level-2);
  --color-neutral-bg-3: var(--color-background-level-3);
  --color-neutral-bg-4: var(--color-background-level-4);
  --color-neutral-bg-inverted-2: var(--color-background-level-inverted-2);
  --color-neutral-bg-inverted-1: var(--color-background-level-inverted-1);

  --color-typography-default: var(--color-typography-default);
  --color-typography-secondary: var(--color-typography-secondary);
  /* ... all typography-*, icon-*, primary-*, secondary-*, danger-*, etc. ... */

  /* === Font sizes === */
  --text-xs: 0.8125rem;
  --text-xs--line-height: 1rem;
  --text-sm: 0.875rem;
  --text-sm--line-height: 1.25rem;
  /* ... rest of font size scale ... */
  /* NOTE: numeric font sizes like text-10, text-12, text-14 etc. need --text-10, --text-12, etc. */

  /* === Box shadows === */
  --shadow-small: 0px 1px 2px 0px var(--color-shadow-default);
  --shadow-medium: 0px 4px 6px -1px var(--color-shadow-default), 0px 2px 4px -2px var(--color-shadow-default);
  --shadow-larger: 0px 12px 20px 0px var(--color-shadow-light), 0px 2px 4px 0px var(--color-shadow-lighter);
  --shadow-dialog: 0 8px 48px #072d6326;
  --shadow-field-heavy: 0px 8px 48px 0px rgba(7, 45, 99, 0.15);
  --shadow-field-normal: 0px 12px 32px 0px rgba(7, 45, 99, 0.06);
}

/* === Custom text-shadow utility (replaces the v3 plugin) === */
@utility text-shadow-password {
  text-shadow: 0 0 0 var(--color-typography-200);
}
```

### 3. Update `src/assets/styles/index.scss`

**Current:**
```scss
@use "fonts";
@use "icons";
@use "root";
@use "custom";
@use "variables";
@use "button";
@use "inputs";
@use "tables";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

**New:**
```scss
@use "fonts";
@use "icons";
@use "root";
@use "custom";
@use "variables";
@use "button";
@use "inputs";
@use "tables";

/* No @tailwind directives — the consumer's single Tailwind build handles this */
```

The library no longer ships compiled Tailwind utilities. It only ships:
- CSS variable definitions (`_root.scss` — light/dark theme)
- Base styles (`_fonts.scss`, `_icons.scss`)
- Component-level styles (`_button.scss`, `_inputs.scss`, `_tables.scss`, `_custom.scss`)
- The theme file (imported separately by consumers)

### 4. Update `_root.scss`

**Current:** wraps everything in `@layer base { ... }`

**Change:** Remove the `@layer base` wrapper. In v4, Tailwind owns the `base` layer name. The CSS variables should just be plain `:root` / `:root[class~="dark"]` / `:root[class~="sync"]` selectors without an explicit layer.

### 5. `@apply` — keep working via `@tailwindcss/vite` (Phase 1 only)

In Phase 1, the library keeps `@tailwindcss/vite` in its Vite config. This resolves all 60 `@apply` occurrences at library build time. The compiled CSS ships with the resolved component styles (`.button`, `.field`, etc.) but **without** Tailwind utility classes.

This means `@apply` in SCSS files and `<style scoped>` blocks will still work as-is during Phase 1. No changes to these files yet.

**Files with `@apply` (to be converted in Phase 2):**
- `src/assets/styles/_button.scss` — 21 occurrences (heaviest)
- `src/assets/styles/_inputs.scss` — 12 occurrences
- `src/assets/styles/_custom.scss` — 2 occurrences
- `src/assets/styles/_tables.scss` — 1 occurrence
- `src/assets/app.scss` — 3 occurrences
- `src/components/atoms/tooltip/Tooltip.vue` — 7 occurrences (some commented out)
- `src/components/molecules/slider/Slider.vue` — 6 occurrences
- `src/components/atoms/label/Label.vue` — 5 occurrences
- `src/components/atoms/toggle/Toggle.vue` — 1 occurrence
- `src/components/atoms/input/Input.vue` — 1 occurrence
- `src/components/organisms/lease/Lease.vue` — 1 occurrence

### 6. Rename deprecated utility classes

| v3 class | v4 class | Occurrences | Files |
|----------|----------|-------------|-------|
| `outline-none` | `outline-hidden` | 7 | `_inputs.scss`, `_button.scss`, `_custom.scss`, `Toggle.vue`, `Radio.vue`, `AdvancedFormControl.vue` |

That's it. No other v3→v4 class renames are needed. The codebase doesn't use `shadow-sm`, `rounded-sm`, `blur-sm`, `bg-gradient-to-*`, `flex-shrink`, `flex-grow`, opacity utilities, or bracket-based CSS variable syntax.

### 7. Update `vite.config.ts`

Add the Tailwind v4 Vite plugin:

```ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    tailwindcss(),    // ← new
    dts({ ... })
  ],
  // ...
});
```

### 8. Update build entry points

Remove `tailwind.config.cjs` from the Vite library entry:

```ts
// vite.config.ts build.lib.entry
entry: {
  main: "lib/main.ts",
  // REMOVE: "tailwind.config": "tailwind.config.cjs"
}
```

Add `theme.css` to the package exports instead (or ship it alongside the dist CSS).

### 9. Delete files

- `tailwind.config.cjs` — replaced by `theme.css`
- `postcss.config.js` — no longer needed with `@tailwindcss/vite`

### 10. Validate with Storybook

Run `npm run storybook` and visually verify every component. Key things to check:
- Button variants (primary, secondary, tertiary, danger) — styles come from `_button.scss` `@apply`
- Input/form controls — styles from `_inputs.scss` `@apply`
- Dark mode toggle — CSS variables still applied correctly
- Responsive layouts — `md:`, `lg:` breakpoints working
- Tooltip positioning, Slider thumb styles — scoped `@apply` in Vue components

---

## Phase 1B: webapp

Only start this after Phase 1A is validated in Storybook.

### 1. Update dependencies

```bash
npm uninstall tailwindcss postcss autoprefixer
npm install -D @tailwindcss/vite tailwindcss@latest
```

### 2. Update `vite.config.ts`

```ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    // ...
  ],
});
```

### 3. Rewrite `src/index.scss`

**Current:**
```scss
@use "web-components/dist/assets/web-components.css";
@tailwind base;
@tailwind components;
@layer webapp-utilities {
  @tailwind utilities;
}
```

**New:**
```scss
@import "tailwindcss";
@import "web-components/dist/theme.css";
@import "web-components/dist/assets/web-components.css";
@source "../node_modules/web-components/src";

@custom-variant dark (&:where(.dark, .dark *));
```

Key changes:
- Single `@import "tailwindcss"` — one build, correct class ordering
- `@source` tells Tailwind to scan web-components' Vue files for utility classes
- No more `@layer webapp-utilities` hack — v4 layers handle this natively
- Remove `@tailwind base/components/utilities` directives

### 4. Delete `tailwind.config.js`

The preset pattern (`presets: [require("web-components/dist/tailwind.config.js")]`) is gone. Theme tokens come from the CSS `@theme` import instead.

### 5. Delete `postcss.config.js`

Replaced by `@tailwindcss/vite`.

### 6. Rename deprecated utility classes

| v3 class | v4 class | Files |
|----------|----------|-------|
| `shadow-sm` | `shadow-xs` | `Sidebar.vue`, `MobileMenu.vue`, `DesktopMenu.vue` |
| `rounded-sm` | `rounded-xs` | same 3 files |

### 7. `@apply` in webapp (36 occurrences, 13 files)

These will continue to work since the webapp runs its own Tailwind build via `@tailwindcss/vite`. No changes needed.

### 8. Validate

Run `npm run serve` and test:
- Verify the CSS override bug is gone (`md:w-96` on Table search input works correctly)
- Dark mode / sync mode
- All pages with Table, Dialog, Popover, Toast, AdvancedFormControl
- Mobile responsive layouts

### 9. Tag release

Bump web-components to `v3.0.0` (breaking change in how CSS is consumed). Update webapp's `package.json` to reference the new tag.

---

# Phase 2: Eliminate `@apply`

Goal: Replace all `@apply` in web-components with raw CSS properties. This removes the Tailwind build dependency from the library, making it a pure CSS + Vue component package.

**Only start Phase 2 after Phase 1 is stable and deployed.**

### Why

- Library becomes framework-agnostic for styling — no Tailwind needed at build time
- Eliminates potential `@apply` resolution issues across Tailwind versions
- Simpler build pipeline (no `@tailwindcss/vite` in the library)
- Aligns with shadcn model where component styles are plain CSS

### What to convert

60 `@apply` occurrences across 11 files. Convert each to equivalent CSS properties.

**SCSS files (global component styles):**

| File | Count | Notes |
|------|-------|-------|
| `src/assets/styles/_button.scss` | 21 | All button variants: primary, secondary, tertiary, danger, loading, badge. Uses `&-primary`, `&-secondary` SCSS nesting. |
| `src/assets/styles/_inputs.scss` | 12 | Field container, label, input base styles, error text. |
| `src/assets/styles/_custom.scss` | 2 | Focus-visible outline, cursor-pointer. |
| `src/assets/styles/_tables.scss` | 1 | Table row reset. |
| `src/assets/app.scss` | 3 | Body background. |

**Vue component `<style scoped>` blocks:**

| File | Count | Notes |
|------|-------|-------|
| `src/components/atoms/tooltip/Tooltip.vue` | 7 | Tooltip visibility, arrow positioning (some commented out). |
| `src/components/molecules/slider/Slider.vue` | 6 | Slider track, thumb, tooltip positioning. |
| `src/components/atoms/label/Label.vue` | 5 | Label variant colors (default, info, success, warning, error). |
| `src/components/atoms/toggle/Toggle.vue` | 1 | Focus-visible outline. |
| `src/components/atoms/input/Input.vue` | 1 | SVG fill color. |
| `src/components/organisms/lease/Lease.vue` | 1 | Progress bar dimensions. |

### Conversion approach

For each `@apply`, expand to the equivalent CSS. Reference:

```scss
/* Common patterns and their CSS equivalents: */

@apply flex items-center justify-center
/* → */ display: flex; align-items: center; justify-content: center;

@apply gap-1
/* → */ gap: 0.25rem;

@apply shadow-medium
/* → */ box-shadow: 0px 4px 6px -1px var(--color-shadow-default), 0px 2px 4px -2px var(--color-shadow-default);

@apply transition duration-150 ease-out
/* → */ transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-duration: 150ms; transition-timing-function: cubic-bezier(0, 0, 0.2, 1);

@apply text-14 font-medium
/* → */ font-size: 14px; line-height: 20px; font-weight: 500;

@apply rounded-md
/* → */ border-radius: 0.375rem;

@apply border-[1px] border-border-default
/* → */ border-width: 1px; border-color: var(--color-border-default);

@apply bg-primary-default text-static-light
/* → */ background-color: var(--color-primary-default); color: var(--color-static-light);

@apply hover:bg-primary-hover
/* → */ &:hover { background-color: var(--color-primary-hover); }

@apply disabled:bg-disabled disabled:text-typography-disabled
/* → */ &:disabled { background-color: var(--color-disabled); color: var(--color-typography-disabled); }

@apply focus-visible:outline focus-visible:outline-offset-1 focus-visible:outline-primary-hover
/* → */ &:focus-visible { outline-style: solid; outline-offset: 1px; outline-color: var(--color-primary-hover); }

@apply invisible opacity-0
/* → */ visibility: hidden; opacity: 0;

@apply pointer-events-none
/* → */ pointer-events: none;
```

### After Phase 2 is complete

Remove `@tailwindcss/vite` from web-components `devDependencies` — the library no longer needs Tailwind at build time. Only the webapp (the consumer) runs Tailwind.

### Validate

Same as Phase 1 validation — run Storybook, check every component visually, then test in the webapp.

---

## Risk Summary

### What should NOT break (either phase)

- Component templates (`<template>`) — utility class names unchanged (except 7 `outline-none` renames)
- CSS variable theming — completely unchanged, `_root.scss` just loses the `@layer base` wrapper
- TypeScript types, component props, exports — zero impact
- `motion-v` animations — unrelated to Tailwind
- Scoped SCSS in `<style scoped>` — processed by Vite/Sass, not Tailwind
- All custom color tokens — already CSS-variable-based, exactly what v4 wants

### What could break

| Risk | Phase | Severity | Mitigation |
|------|-------|----------|------------|
| `@theme` token naming doesn't match existing utility class names | 1 | High | Test each token produces the correct class (e.g., `bg-neutral-bg-1`) |
| `@apply` resolution fails with v4 | 1 | Medium | Library keeps its own `@tailwindcss/vite` build to resolve `@apply` |
| `@layer base` in `_root.scss` conflicts with v4 | 1 | Medium | Remove the wrapper, test CSS variable injection |
| Custom text-shadow plugin doesn't work as `@utility` | 1 | Low | Simple rewrite, easy to test |
| Storybook v10 incompatible with `@tailwindcss/vite` | 1 | Medium | Check Storybook Vite config, may need plugin ordering |
| `@apply` → raw CSS conversion introduces visual regressions | 2 | Medium | Convert one file at a time, visual diff each component in Storybook |
| Missing/incorrect CSS property equivalents for `@apply` | 2 | Medium | Use browser devtools to inspect computed styles before/after |
