# `@nolus/web-components`

Vue 3 design-system component library for Nolus Protocol frontends. Atomic-design primitives (atoms / molecules / organisms) — buttons, inputs, dialogs, tables, asset/lease/proposal cards — sharing a single Tailwind v4 token theme.

This is a **presentational** library: no stores, no fetch layer, no chain or wallet code, no i18n. Consumers (e.g. [`nolus-protocol/webapp`](https://github.com/nolus-protocol/webapp)) own data, signing, and translation.

## Install

The package is **not published to npm**. Consume it via a GitHub git ref or tag:

```sh
npm install nolus-protocol/web-components#v2.0.66
```

`vue ^3.5.22` is the only runtime peer — install it in the consuming app. The library has no runtime dependencies of its own.

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
npm install          # also runs a full build via the prepare hook and installs the pre-commit hook
npm run dev          # local playground at index.html + src/App.vue
npm run storybook    # component preview / docs
npm run typecheck    # vue-tsc on the library, the stories, and the build and release scripts
npm run format       # prettier (format:check verifies)
npm run lint         # eslint, zero warnings
npm test             # vitest component tests and the release script tests
npm run build        # library bundle to dist/ (auto-runs icon codegen)
```

Every pull request runs the same typecheck, format check, lint, tests, build and Storybook build, fails if the build changed a committed file, and fails on high or critical `npm audit` advisories. The pre-commit hook runs the format check and lint.

Adding or renaming an icon under `src/assets/icons/` regenerates `src/components/atoms/svg-icon/icon-names.ts`. The `prebuild` hook does it automatically; commit the regenerated file with the icon, or the pull request check fails.

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

Every merge to `main` runs `.github/workflows/auto-release.yaml`. Pull requests are squash-merged with their title and description as the commit message, and the workflow releases the highest level called for by the commits merged since the last release:

| Pull request title                                          | Release |
| ----------------------------------------------------------- | ------- |
| `type!: …`, or a `BREAKING CHANGE:` line in the description | major   |
| `feat: …`                                                   | minor   |
| `fix`, `perf`, `refactor`, `revert`, `build`                | patch   |
| `docs`, `ci`, `test`, `chore`, `style`                      | none    |

It builds the merged code, commits the new version on top of it, tags that commit `vX.Y.Z` and publishes a GitHub Release; a `chore: release vX.Y.Z` pull request then records the version on `main`. Consumers pin via tag. To release by hand, run the workflow from the Actions tab and pick the level.

## Contributing

Changes land on `main` through pull requests whose titles are conventional commits (`type(optional scope): description`, types as in the table above); a check fails any other title, because the title decides the release. Stories are the only behavioural test surface — add a story for any new component or new prop.
