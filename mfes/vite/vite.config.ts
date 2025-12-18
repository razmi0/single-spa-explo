import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import vitePluginSingleSpa from "vite-plugin-single-spa";
import vitePluginReactHMR from "../../configs/plugin-react-hmr";

console.log("vitePluginReactHMR", vitePluginReactHMR);

const ENTRY_POINTS = ["src/Razmio-welcome.tsx"];
const PORT = Number(process.env.PORT) || 3003;
const BASE_URL_DEPLOYMENT = `http://localhost:${PORT}/`;

export default defineConfig(({ command }) => ({
    // the base url is injected into any assets to ensure they're http references in production (not relative paths)
    base: command === "serve" ? "/" : BASE_URL_DEPLOYMENT,
    resolve: {
        alias: {
            "/Razmio-welcome.js": "/src/Razmio-welcome.tsx",
        },
    },
    plugins: [
        react(),
        command === "serve" && vitePluginReactHMR(),
        vitePluginSingleSpa({
            type: "mife",
            serverPort: Number(process.env.PORT) || 3003,
            spaEntryPoints: ENTRY_POINTS,
        }),
    ],
    esbuild: {},
    build: {
        minify: false,
        rollupOptions: { external: ["react", "react-dom"] },
    },
}));
