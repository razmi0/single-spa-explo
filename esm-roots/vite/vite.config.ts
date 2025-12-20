import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { ViteEjsPlugin as ejsPlugin } from "vite-plugin-ejs";
import singleSpaPlugin from "vite-plugin-single-spa";
import { createReader, getImportmapPath, LAYOUT_FILE, ORG_NAME, PROJECT_NAME } from "../shared/main";

const read = createReader(import.meta.url);
const port = 2998;

export default defineConfig(({ mode }) => {
    const importmaps = [`../shared/${getImportmapPath(mode === "development")}`, "../shared/importmap.shared.json"];

    console.log("importmap", importmaps);

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
                layout: read(`../shared/${LAYOUT_FILE}`),
            })),
        ],
        server: { port },
        preview: { port },
        build: { minify: false },
    };
});
