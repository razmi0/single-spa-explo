import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, UserConfigExport } from "vite";
import { ViteEjsPlugin as EjsPlugin } from "vite-plugin-ejs";
import SingleSpaPlugin from "vite-plugin-single-spa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the Vite root directory
dotenv.config({ path: path.resolve(__dirname, ".env") });

const port = 3000;

const orgName = "Razmio";
const projectName = "root-config";

const LAYOUT_PATH = "src/routes/layout.html"; // applications layout
// const PRODUCT = publicEnv.PUBLIC_PRODUCT ?? "product-1"; // product name
/**
 * "dev" or ""
 * - importmap.dev.json
 * - importmap.json
 */
const IMPORT_MAP_MODE = process.env.VITE_PUBLIC_LAYOUT_MODE ?? ""; // import map mode
const IMPORTMAP_PATH = `src/importmap.${IMPORT_MAP_MODE}.json`; // import map path

console.log(IMPORTMAP_PATH);
console.log(import.meta.env);

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
export default defineConfig(() => {
    const config: UserConfigExport = {
        base: "./",
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
        server: { port },
        preview: { port },
        // define: {
        //     "process.env": process.env,
        // },
        build: {
            minify: false,
            rollupOptions: {
                // external: ["react", "react-dom"],
            },
        },
    };
    return config;
});
