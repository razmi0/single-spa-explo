import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, UserConfigExport } from "vite";
import { ViteEjsPlugin as EjsPlugin } from "vite-plugin-ejs";
import SingleSpaPlugin from "vite-plugin-single-spa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 2998;

const orgName = "Razmio";
const projectName = "root-config";

const read = (filePath: string) => {
    try {
        const content = fs.readFileSync(path.resolve(__dirname, filePath), "utf-8");
        return content;
    } catch (error: unknown) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new Error(`File ${filePath} not found: ${reason}`);
    }
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    /**
     * "dev" or ""
     * - importmap.dev.json
     * - importmap.json
     */
    const IMPORTMAP_PATH = `src/importmap${mode === "dev" ? ".dev" : ""}.json`; // import map path
    const LAYOUT_PATH = "src/routes/layout.html"; // applications layout

    const config: UserConfigExport = {
        // base: "./",
        plugins: [
            react(),
            EjsPlugin((viteConfig) => {
                return {
                    root: viteConfig.root,
                    title: "Vite - Root Config",
                    orgName,
                    projectName,
                    layout: read(LAYOUT_PATH),
                };
            }),
            SingleSpaPlugin({
                type: "root",
                imo: "5.1.1",
                // imo: () => `https://my.cdn.example.com/import-map-overrides@5.1.1`,
                importMaps: {
                    // Import maps are split into:
                    // - dev: for Vite dev server (points at local dev servers /src/spa.tsx)
                    // - build: for production/previews (points at built spa.js bundles)
                    dev: [IMPORTMAP_PATH, "src/importmap.shared.json"],
                    build: [IMPORTMAP_PATH, "src/importmap.shared.json"],
                },
            }),
        ],
        // optimizeDeps: {
        //     entries: [],
        // },
        server: { port },
        preview: { port },
        // define: {
        //     "process.env": process.env,
        // },
        build: {
            minify: false,
        },
    };
    return config;
});
