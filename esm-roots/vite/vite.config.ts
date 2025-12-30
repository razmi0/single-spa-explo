import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { ViteEjsPlugin as ejsPlugin } from "vite-plugin-ejs";
import singleSpaPlugin from "vite-plugin-single-spa";
import { ImportMapLoader, ORG_NAME, PROJECT_NAME, TemplateLoader, type ImportMapKey } from "./shared/index.js";

const DEFAULT_PORT = 2998;

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "VITE_");
    const { VITE_IMPORTMAP_TYPE, VITE_ROOT_URL, VITE_PORT } = env;
    const stage = (VITE_IMPORTMAP_TYPE || "prod") as ImportMapKey;
    const rootUrl = VITE_ROOT_URL;
    const port = Number(VITE_PORT || DEFAULT_PORT);

    // Vite uses "path" mode - singleSpaPlugin reads the files itself
    const importMapLoader = new ImportMapLoader({ retrievalMode: "path", stage, rootUrl });
    const templateLoader = new TemplateLoader({ retrievalMode: "content" });
    const mfes = importMapLoader.get(stage);
    const shared = importMapLoader.get("shared");
    const apps = templateLoader.get("apps");

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
                layout: apps,
            })),
        ],
        server: { port },
        preview: { port },
        build: { minify: false },
    };
});
