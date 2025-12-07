I'll scan the `weird/` root-config and one example route MFE to infer how Vite, React, TS, and single-spa-style responsibilities are split, then synthesize up to 10 dense “knowledge” bullets.

[10 tools called]

## High-level knowledge about the `weird/` Vite + TS + React microfrontend setup

### Overall architecture & responsibilities

- **Root-config as single-spa orchestrator**: The `root-config` Vite app is not a feature UI but the orchestrator. It owns the HTML layout, routing, and import maps, and dynamically loads each microfrontend (`import(/* @vite-ignore */ name)`) using `single-spa-layout` and `single-spa`.

- **Microfrontends as independent Vite apps**: Each MFE (e.g. `route-welcome`) is its own Vite+React+TS project with its own `vite.config.ts`, dev server port, and build output. They are deployed and versioned independently, but composed at runtime by the root via import maps.

- **Import maps as the “wiring layer”**: The root-config uses `vite-plugin-single-spa` with `importMaps` for dev and build to define URLs for MFEs (`@demo/route-welcome`) and shared utilities (`@demo/partials`). MFEs reference each other and shared libs only via these import map names, never by hard-coded URLs.

- **Declarative layout vs imperative routing**: The root’s `microfrontend-layout.html` is a declarative single-spa layout: routes (`<route default>`, `<route path="blog">`) and `<application name="...">` tags describe where MFEs render. Code in `src/main.tsx` simply turns this layout into `routes`, `applications`, and a `layoutEngine`, keeping routing and placement configuration-driven instead of buried in JS logic.

- **Single-spa lifecycles wrap React rendering**: MFEs implement `spa.tsx` using `single-spa-react` and `cssLifecycleFactory`. They export `bootstrap`, `mount`, and `unmount` arrays that single-spa calls. Internally, these lifecycles create a React root (via `ReactDOMClient`) and render the MFE’s `App` into a DOM element decided at runtime.

- **DOM targeting and isolation per MFE**: The `domElementGetter` in an MFE (e.g. `route-welcome`) dynamically creates or finds a container element based on the application name and ID patterns inside the single-spa layout. This ensures each MFE renders only inside its own slot, avoiding clashes with other MFEs or the host DOM.

- **Shared utilities as microfrontends, not libraries**: The `partials` project is a special “utility” MFE. Its `spa.tsx` uses `single-spa-react` but has `rootComponent: () => null` and instead exports shared functions/components (e.g. `DummyComponent`, `title`). Other MFEs import from `@demo/partials` through the import map, treating it like a runtime-shared package instead of bundling duplicates.

- **Vite plugins define root vs MFE behavior**: Root-config uses `vite-plugin-single-spa` with `type: "root"` and import-map overrides (`imo`) support, plus plain React plugin. MFEs use `vite-plugin-single-spa` with `type: "mife"`, `spaEntryPoints`, and `serverPort`, plus `vite-plugin-react-single-spa-hmr` for dev HMR and `vite-plugin-externalize-dependencies` to mark other MFEs and core libs (`react`, `react-dom`) as externals.

- **Standalone MFE mode intentionally disabled**: In `route-welcome`, `src/main.tsx` exists but is effectively a placeholder explaining standalone mode is disabled. This MFE expects to be loaded only via single-spa and the root’s import map, ensuring that module resolution and shared dependencies always go through the orchestrator rather than bundling everything locally.

- **Externals & build strategy for shared runtime**: MFEs configure Vite `build.rollupOptions.external` to exclude both other MFEs (`@demo/partials`) and core NPM dependencies (`react`, `react-dom`) from their bundles. Combined with the root’s import maps, this centralizes shared dependency instances, reduces bundle size, and ensures all MFEs run against the same React runtime, improving consistency and avoiding version conflicts.
