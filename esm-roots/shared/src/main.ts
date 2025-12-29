import path from "path";
import { fileURLToPath } from "url";

// Re-export everything for single entry point
export { LAYOUT_FILE, ORG_NAME, PROJECT_NAME } from "./constants.js";
export { default as ImportMapManager } from "./ImportMapManager.js";
export { default as LayoutManager } from "./LayoutManager.js";
export type { ImportMapFiles, ImportMapKey, ImportMapPath, LayoutFiles, LayoutKey, LayoutPath, Mode } from "./types.js";

// Resolve relative to the bundled file location (./shared/index.js)
// When bundled, import.meta.url points to the output location
const sharedDir = path.dirname(fileURLToPath(import.meta.url));

// Import for internal use
import { ORG_NAME, PROJECT_NAME } from "./constants.js";

/** Copy shared assets to dist */
export const copyPlugin = (instance: any) => {
    return new instance({
        patterns: [
            { from: "importmaps/*", context: sharedDir, to: "[name][ext]" },
            { from: "styles/index.css", context: sharedDir, to: "shared.css" },
            { from: "templates/single-spa-layout.html", context: sharedDir, to: "single-spa-layout.html" },
        ],
    });
};

/**
 * ejs templating
 */
export const htmlPlugin = (tech: string, instance: any, templateParams: Record<string, any>) => {
    return new instance({
        inject: false,
        template: path.join(sharedDir, "templates/main.ejs"),
        templateParameters: {
            tech,
            projectName: PROJECT_NAME,
            orgName: ORG_NAME,
            ...templateParams,
        },
    });
};

export const devServer = (env: { PORT: string }) => ({
    hot: true,
    port: Number(env.PORT),

    setupMiddlewares: (middlewares: any, devServer: any) => {
        if (!devServer) return middlewares;
        devServer.app.get(/\/importmap.*\.json$/, (_req: any, res: any, next: any) => {
            res.type("application/importmap+json");
            next();
        });
        return middlewares;
    },
});

export const loadEnv = (dotenvConfig: any, mode: string) => {
    switch (mode) {
        case "dev":
            dotenvConfig({ path: `.env.dev`, override: true });
            break;
        case "prod":
            dotenvConfig({ path: `.env.prod`, override: true });
            break;
        case "shared":
            dotenvConfig({ path: `.env.dev`, override: true });
            break;
        case "local":
            dotenvConfig({ path: `.env.dev`, override: true });
            break;
        case "test":
            dotenvConfig({ path: `.env.test`, override: true });
            break;
        default:
            dotenvConfig();
            break;
    }
};
