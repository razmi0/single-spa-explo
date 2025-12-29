import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { ViteEjsPlugin as ejsPlugin } from "vite-plugin-ejs";
import singleSpaPlugin from "vite-plugin-single-spa";
import { ImportMapManager, LayoutManager, ORG_NAME, PROJECT_NAME, type ImportMapKey } from "./shared/index.js";

const port = 2998;
const envLoader = (mode: string) => loadEnv(mode, process.cwd(), "VITE_");

export default defineConfig(({ mode }) => {
    const stage = (envLoader(mode).VITE_IMPORTMAP_TYPE || "prod") as ImportMapKey;
    const rootUrl = envLoader(mode).VITE_ROOT_URL;

    // Vite uses "path" mode - singleSpaPlugin reads the files itself
    const importMapManager = new ImportMapManager({ mode: "path", rootUrl });
    const layoutManager = new LayoutManager("content");
    const mfes = importMapManager.mfe(stage, port);
    const shared = importMapManager.shared();

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
