import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Creates __dirname equivalent for ESM modules
 * @param importMetaUrl - import.meta.url from the calling module
 */
export function getDirname(importMetaUrl: string): { __filename: string; __dirname: string } {
    const __filename = fileURLToPath(importMetaUrl);
    const __dirname = path.dirname(__filename);
    return { __filename, __dirname };
}

/**
 * Reads a file synchronously from the filesystem
 * @param basePath - The base directory path
 * @param filePath - The relative path to the file
 * @returns The file contents
 * @throws If the file cannot be read
 */
export function readFile(basePath: string, filePath: string): string {
    try {
        const content = fs.readFileSync(path.resolve(basePath, filePath), "utf-8");
        return content;
    } catch (error: unknown) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new Error(`File ${filePath} not found: ${reason}`);
    }
}

/**
 * Creates a read function bound to a specific directory
 * @param importMetaUrl - import.meta.url from the calling module
 * @returns A function that reads files relative to the module's directory
 */
export function createReader(importMetaUrl: string): (filePath: string) => string {
    const { __dirname } = getDirname(importMetaUrl);
    return (filePath: string) => readFile(__dirname, filePath);
}

/**
 * Resolves the shared directory path relative to a config file
 * @param importMetaUrl - import.meta.url from the calling module
 */
export function getSharedDir(importMetaUrl: string): string {
    const { __dirname } = getDirname(importMetaUrl);
    return path.resolve(__dirname, "../shared");
}

// Common constants
export const ORG_NAME = "Razmio";
export const PROJECT_NAME = "root-config";
export const LAYOUT_FILE = "single-spa-layout.html";

/**
 * Returns the importmap filename based on mode
 * @param isDev - whether in development mode
 */
export function getImportmapPath(isDev: boolean): string {
    return isDev ? "importmap.dev.json" : "importmap.json";
}

/**
 * Generates the MFE import map with the correct port for root-config
 * @param readFn - function to read files
 * @param sharedDir - path to shared directory
 * @param importmapFile - name of the import map file
 * @param port - port number for root-config (optional - if not provided, uses the import map as-is)
 */
export function getMfeImportmap(
    readFn: (path: string) => string,
    sharedDir: string,
    importmapFile: string,
    port?: string | number
): string {
    const importmap = JSON.parse(readFn(`${sharedDir}/${importmapFile}`));
    if (port) {
        importmap.imports[`@${ORG_NAME}/${PROJECT_NAME}`] = `http://localhost:${port}/${ORG_NAME}-${PROJECT_NAME}.js`;
    }
    return JSON.stringify(importmap, null, 4);
}

/**
 * Copy shared importmap files
 * - see index.ejs
 */
export const copyPlugin = (instance: any, sharedDir: string) => {
    return new instance({
        patterns: [
            { from: "importmap*.json", context: sharedDir, to: "[name][ext]" },
            { from: "index.css", context: sharedDir, to: "shared.css" },
            { from: "single-spa-layout.html", context: sharedDir, to: "single-spa-layout.html" },
        ],
    });
};

/**
 * ejs templating
 */
export const htmlPlugin = (tech: string, instance: any, templateParams: Record<string, any>, template?: string) => {
    return new instance({
        inject: false,
        template: template || "./src/index.ejs",
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
