# `@nolus/web-components`

Vue 3 design-system component library for Nolus Protocol frontends. Atomic-design primitives (atoms / molecules / organisms) — buttons, inputs, dialogs, tables, asset/lease/proposal cards — sharing a single Tailwind v4 token theme.

This is a **presentational** library: no stores, no fetch layer, no chain or wallet code, no i18n. Consumers (e.g. [`nolus-protocol/webapp`](https://github.com/nolus-protocol/webapp)) own data, signing, and translation.

## Install

The package is **not published to npm**. Consume it via a GitHub git ref or tag:

```sh
npm install nolus-protocol/web-components#v2.0.66
```

`vue ^3.5.22` (peer) and `motion-v ^1.9.0` are required runtime peers — install them in the consuming app.

## Usage

```ts
import { Button, Dialog, Table } from "web-components";
import "web-components/theme.css";
```

The library and the theme are separate imports — both are required. Apply the theme by adding `class="dark"` or `class="sync"` to `<html>` for dark mode (no JS toggle is provided).

Component documentation lives in **Storybook**:

```sh
npm run storybook   # http://localhost:6006
```

## Development

Requires Node `>=22` (see `.nvmrc`).

```sh
npm install         # also runs a full build via the prepare hook
npm run dev         # local playground at index.html + src/App.vue
npm run storybook   # component preview / docs
npm run typecheck   # vue-tsc type check
npm run build       # library bundle to dist/ (auto-runs icon codegen)
npm run format      # prettier
```

Adding or renaming an icon under `src/assets/icons/` triggers a regeneration of the `IconNames` literal type. The `prebuild` hook handles this automatically; for live editor feedback run `npm run generate-icon-types` manually.

## Architecture at a glance

```
lib/main.ts                Public entry — re-exports + theme SCSS side-effect
src/components/
  atoms/                   Button, Input, Dropdown, Checkbox, SvgIcon, …
  molecules/               Dialog, Popover, Alert, Toast, Slider, Stepper, Proposal, …
  organisms/               Lease, Table
src/assets/styles/
  theme.css                Single source of design tokens (CSS custom properties)
  index.scss               Bundled SCSS root (fonts, icons, base styles)
.storybook/                Storybook config (light / dark / sync theme decorators)
```

## Releases

Patch versions are auto-published on every push to `main` by `.github/workflows/auto-release.yaml`. The workflow bumps `package.json`, commits, tags, and creates a GitHub Release. Consumers pin via tag.

Minor / major bumps must be made manually (`npm version minor && git push`).

## Contributing

PRs land on `main`. Conventional commit prefixes (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`) are used but not enforced. Stories are the only behavioural test surface — add a story for any new component or new prop.
