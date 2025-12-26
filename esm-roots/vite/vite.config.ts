import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { ViteEjsPlugin as ejsPlugin } from "vite-plugin-ejs";
import singleSpaPlugin from "vite-plugin-single-spa";
import ImportMapManager from "../shared/dist/ImportMapManager.js";
import LayoutManager from "../shared/dist/LayoutManager.js";
import { ORG_NAME, PROJECT_NAME } from "../shared/dist/constants.js";
import type { ImportMapKey } from "../shared/src/types";

const port = 2998;
const envLoader = (mode: string) => loadEnv(mode, process.cwd(), "VITE_");

// Vite uses "path" mode - singleSpaPlugin reads the files itself
const importMapManager = new ImportMapManager("path");
// EJS needs content for templating
const layoutManager = new LayoutManager("content");

export default defineConfig(({ mode }) => {
    const stage = (envLoader(mode).VITE_IMPORTMAP_TYPE || "prod") as ImportMapKey;

    // singleSpaPlugin expects file paths (not content)
    const importmaps = [importMapManager.mfe(stage), importMapManager.shared()];

    return {
        plugins: [
            react(),
            singleSpaPlugin({
                type: "root",
                importMaps: {
                    type: "importmap",
                    dev: importmaps,
                    build: importmaps,
                },
            }),
            ejsPlugin(() => ({
                tech: "Vite",
                mode,
                orgName: ORG_NAME,
                projectName: PROJECT_NAME,
                layout: layoutManager.get("apps"),
            })),
        ],
        server: { port },
        preview: { port },
        build: { minify: false },
    };
});
