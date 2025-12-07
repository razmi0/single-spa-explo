import react from "@vitejs/plugin-react";
import { defineConfig, ResolvedConfig } from "vite";
import vitePluginSingleSpa from "vite-plugin-single-spa";

/**
 * Ensures that React Fast Refresh (HMR) is properly setup when this MFE is
 * loaded by a non-Vite root (e.g. webpack + single-spa). Since Vite is not
 * serving the HTML, the usual @vitejs/plugin-react preamble is never injected,
 * so we prepend `react.preambleCode` to all React source modules instead of
 * maintaining an explicit ENTRY_POINTS list.
 *
 * See: https://github.com/WJSoftware/vite-plugin-single-spa/issues/74#issuecomment-2315823945
 */
const vitePluginReactHMR = () => {
    // placeholder base value (set by configResolved)
    let base = "";

    return {
        name: "vite-plugin-single-spa-react-hmr",
        configResolved(resolvedConfig: ResolvedConfig) {
            base = resolvedConfig.base;
        },
        transform(code: string, id: string) {
            console.log(id);

            // Ignore Vite virtual modules and dependencies.
            if (id.startsWith("\0") || id.includes("node_modules")) return;

            // Strip query params (e.g. ?v=HASH) and only process source files.
            const [filepath] = id.split("?");
            if (!filepath.includes("/src/")) return;

            // Only apply to React source files.
            if (!filepath.match(/\.(tsx|jsx)$/)) return;

            // Only patch modules that participate in HMR / Fast Refresh.
            if (!code.includes("import.meta.hot")) return;

            return react.preambleCode.replace("__BASE__", base) + code;
        },
    };
};

/** single-spa entry point which contains references to lifecycles and shared exports */
const ENTRY_POINTS = ["src/spa.tsx"];

/** Port for running local server and build previews (configurable via PORT env) */
const PORT = Number(process.env.PORT) || 3003;

/** These are other single-spa applications, that are imported inside this application, as dependencies.
 * These externals are made available within this application via the root config import map.
 * For more details on why this is required see here: https://github.com/WJSoftware/vite-plugin-single-spa/discussions/160  */
// const APPLICATION_EXTERNALS: string[] = ["@demo/partials"];

/** These are NPM packages, which are imported via the root config import map, in the built environment */
const NPM_EXTERNALS: string[] = ["react", "react-dom"];

// TODO: replace this with the actual CDN URL
const BASE_URL_DEPLOYMENT = `http://localhost:${PORT}/`;

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
    // the base url is injected into any assets to ensure they're http references in production (not relative paths)
    base: command === "serve" ? "/" : BASE_URL_DEPLOYMENT,
    plugins: [
        react(),
        // command === "serve" ensures this plugin is only used during development (excluded from builds)
        command === "serve" && vitePluginReactHMR(),
        vitePluginSingleSpa({
            type: "mife",
            serverPort: PORT,
            spaEntryPoints: ENTRY_POINTS,
        }),
        // externalize({ externals: APPLICATION_EXTERNALS }),
    ],
    css: {
        modules: {
            localsConvention: "camelCase",
            exportGlobals: true,
        },
    },
    build: {
        minify: false,
        rollupOptions: { external: [...NPM_EXTERNALS] },
    },
}));
