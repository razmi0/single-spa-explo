import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { ViteEjsPlugin as ejsPlugin } from "vite-plugin-ejs";
import singleSpaPlugin from "vite-plugin-single-spa";
import { getImportMap, getTemplate, ORG_NAME, PROJECT_NAME, type ImportMapKey } from "./shared/index.js";

const DEFAULT_PORT = 2998;
const DEFAULT_URL = `http://localhost:${DEFAULT_PORT}`;
const DEFAULT_STAGE = "prod";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "VITE_");
    const { VITE_IMPORTMAP_TYPE, VITE_ROOT_URL = DEFAULT_URL, VITE_PORT = DEFAULT_PORT } = env;
    const stage = (VITE_IMPORTMAP_TYPE || DEFAULT_STAGE) as ImportMapKey;
    const rootUrl = VITE_ROOT_URL;
    const port = Number(VITE_PORT || DEFAULT_PORT);

    // Vite uses "path" mode - singleSpaPlugin reads the files itself
    const mfes = getImportMap(stage, { retrievalMode: "path", rootUrl });
    const shared = getImportMap("shared", { retrievalMode: "path" });
    const apps = getTemplate("apps");

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
