import { defineConfig, loadEnv } from "vite";
import vitePluginSingleSpa from "vite-plugin-single-spa";

const ORG_NAME = "Razmio";
const PROJECT_NAME = "dashboard";
const ENTRY_FILE = `${ORG_NAME}-${PROJECT_NAME}`;
const ALIAS = {
    [`/${ENTRY_FILE}.js`]: `/src/${ENTRY_FILE}.js`,
};
const ENTRY_POINTS = [`src/${ENTRY_FILE}.js`];
const DEFAULT_PORT = 3006;
const DEFAULT_URL = `http://localhost:${DEFAULT_PORT}`;

const envLoader = (mode) => loadEnv(mode, process.cwd(), "VITE_");

export default defineConfig(({ command, mode }) => {
    const { VITE_BASE_URL = DEFAULT_URL, VITE_PORT = DEFAULT_PORT } = envLoader(mode);
    const port = Number(VITE_PORT || DEFAULT_PORT);
    const baseUrl = VITE_BASE_URL;
    const base = command === "serve" ? "/" : baseUrl;

    return {
        base,
        resolve: {
            alias: ALIAS,
        },
        plugins: [
            vitePluginSingleSpa({
                type: "mife",
                serverPort: port,
                spaEntryPoints: ENTRY_POINTS,
            }),
        ],
        build: {
            minify: false,
        },
    };
});
