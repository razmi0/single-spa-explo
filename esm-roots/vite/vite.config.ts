import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { ViteEjsPlugin as ejsPlugin } from "vite-plugin-ejs";
import singleSpaPlugin from "vite-plugin-single-spa";
import { ImportMapManager, LayoutManager, ORG_NAME, PROJECT_NAME, type ImportMapKey } from "./shared/index.js";

const DEFAULT_PORT = 2998;

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "VITE_");
    const { VITE_IMPORTMAP_TYPE, VITE_ROOT_URL, VITE_PORT } = env;
    const stage = (VITE_IMPORTMAP_TYPE || "prod") as ImportMapKey;
    const rootUrl = VITE_ROOT_URL;
    const port = Number(VITE_PORT || DEFAULT_PORT);

    // Vite uses "path" mode - singleSpaPlugin reads the files itself
    const importMapManager = new ImportMapManager().withStage(stage).withRootUrl(rootUrl);
    const layoutManager = new LayoutManager("content");
    const mfes = importMapManager.mfe("path");
    const shared = importMapManager.shared("path");

    return {
        plugins: [
            react(),
            singleSpaPlugin({
                type: "root",
                importMaps: {
                    type: "importmap",
                    dev: [mfes, shared],
                    build: [mfes, shared],
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
