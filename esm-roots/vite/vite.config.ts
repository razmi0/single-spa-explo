import react from "@vitejs/plugin-react";
import { defineConfig, UserConfigExport } from "vite";
import vitePluginSingleSpa from "vite-plugin-single-spa";

const PORT = 3000;
const server = {
    port: PORT,
};
const preview = {
    port: PORT,
};

// https://vite.dev/config/
export default defineConfig(() => {
    const config: UserConfigExport = {
        base: "./",
        plugins: [
            react(),
            vitePluginSingleSpa({
                type: "root",
                imo: "5.1.1",
                // imo: () => `https://my.cdn.example.com/import-map-overrides@5.1.1`,
                importMaps: {
                    // Import maps are split into:
                    // - dev: for Vite dev server (points at local dev servers /src/spa.tsx)
                    // - build: for production/previews (points at built spa.js bundles)
                    dev: ["src/importmap.dev.json", "src/importmap.shared.json"],
                    build: ["src/importmap.json", "src/importmap.shared.json"],
                },
            }),
        ],
        server,
        preview,
        define: {
            "process.env": process.env,
        },
        build: {
            minify: false,
            rollupOptions: {
                // external: ["react", "react-dom"],
            },
        },
    };
    return config;
});
