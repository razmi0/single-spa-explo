## Vite React HMR when loaded from a webpack root-config

### Problem

- The root-config (`orchestrator/`) is a webpack + single-spa app that loads the Vite MFE (`weird/route-welcome`) via import maps, e.g. `@Razmio/Fed-2 -> http://localhost:3001/src/spa.tsx`.
- Because the HTML is served by webpack (not Vite), the normal `@vitejs/plugin-react` Fast Refresh **preamble script is never injected** into the page.
- React source modules like `src/App.tsx` and `src/utils.tsx` were transformed by `@vitejs/plugin-react` and contained this check:
  - `if (import.meta.hot && !window.$RefreshReg$) throw new Error("@vitejs/plugin-react can't detect preamble. Something is wrong.");`
- When these modules were executed (before any preamble ran), `window.$RefreshReg$` was undefined, causing the runtime error:
  - `application '@Razmio/Fed-2' died in status LOADING_SOURCE_CODE: @vitejs/plugin-react can't detect preamble. Something is wrong.`

### Decision

- Keep using React Fast Refresh for the MFE, but **manually ensure the preamble runs for all relevant React modules**, since Vite’s HTML pipeline is bypassed.
- Instead of maintaining a fragile `ENTRY_POINTS` list for each React file, introduce a **generalized HMR plugin** that automatically prepends the preamble to any `src/*.tsx|jsx` module that participates in HMR.
- Keep `ENTRY_POINTS` only for `vite-plugin-single-spa`’s `spaEntryPoints` (the single-spa lifecycle entry), not for HMR.

### Changes in `weird/route-welcome/vite.config.ts`

- Replaced the old `vitePluginReactHMR(entryPoints)` with a no-arg, generalized plugin:
  - Captures `base` in `configResolved`.
  - In `transform(code, id)`:
    - Skips Vite virtual modules (`id.startsWith("\0")`) and anything in `node_modules`.
    - Strips query parameters from `id` and only considers files under `/src/`.
    - Only matches files ending in `.tsx` or `.jsx`.
    - Requires `code` to contain `import.meta.hot` (i.e. modules transformed for Fast Refresh).
    - For matching modules, returns `react.preambleCode.replace("__BASE__", base) + code`, effectively injecting the preamble at the top of each React source file.
- Updated the config wiring:
  - `const ENTRY_POINTS = ["src/spa.tsx"];` – now used **only** for `vitePluginSingleSpa({ spaEntryPoints: ENTRY_POINTS, ... })`.
  - In `plugins`, changed:
    - From: `command === "serve" && vitePluginReactHMR(ENTRY_POINTS)`
    - To: `command === "serve" && vitePluginReactHMR()`
- Result:
  - Any new React TSX/JSX module under `src/` that participates in HMR automatically gets the React Refresh preamble when served by the Vite dev server, even though the page itself is rendered by the webpack root-config.
  - The `@vitejs/plugin-react can't detect preamble` error no longer appears when loading the MFE through the orchestrator.
