// @ts-nocheck
import react from "@vitejs/plugin-react";
import { type ResolvedConfig } from "vite";

export default function vitePluginReactHMR() {
    /**
     * Ensures that React Fast Refresh (HMR) is properly setup when this MFE is
     * loaded by a non-Vite root (e.g. webpack + single-spa). Since Vite is not
     * serving the HTML, the usual @vitejs/plugin-react preamble is never injected,
     * so we prepend `react.preambleCode` to all React source modules instead of
     * maintaining an explicit ENTRY_POINTS list.
     *
     * See: https://github.com/WJSoftware/vite-plugin-single-spa/issues/74#issuecomment-2315823945
     */
    // placeholder base value (set by configResolved)
    let base = "";
    return {
        name: "vite-plugin-single-spa-react-hmr",
        configResolved(resolvedConfig: ResolvedConfig) {
            base = resolvedConfig.base;
        },
        transform(code: string, id: string) {
            // Ignore Vite virtual modules and dependencies.
            if (id.startsWith("\0") || id.includes("node_modules")) return;

            // Strip query params (e.g. ?v=HASH) and only process source files.
            const [filepath] = id.split("?");
            if (!filepath.includes("/src/")) return;

            // Only apply to React source files.
            if (!filepath.match(/\.(tsx|jsx)$/)) return;

            // Only patch modules that participate in HMR / Fast Refresh.
            if (!code.includes("import.meta.hot")) return;

            console.log("ghi");
            console.log(react.preambleCode);

            return react.preambleCode.replace("__BASE__", base) + code;
        },
    };
}
