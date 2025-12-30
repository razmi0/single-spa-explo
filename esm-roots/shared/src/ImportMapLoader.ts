import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ORG_NAME, PROJECT_NAME } from "./constants.js";
import type { ImportMapFiles, ImportMapKey, ImportMapLoaderOptions } from "./types";

// about importmap retrieval mode that differ from bundlers:
// "content" mode is used by webpack/rspack essentially
// "path" mode is used by vite

// Resolve relative to the bundled file location (./shared/index.js)
// When bundled, import.meta.url points to the output location
const sharedDir = path.dirname(fileURLToPath(import.meta.url));

const readFile = (filePath: string): string => {
    try {
        return fs.readFileSync(filePath, "utf-8");
    } catch (error: unknown) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new Error(`File ${filePath} not found: ${reason}`);
    }
};

export default class ImportMapLoader {
    private FILES: ImportMapFiles = {
        dev: path.join(sharedDir, "importmaps/importmap.dev.json"),
        local: path.join(sharedDir, "importmaps/importmap.local.json"),
        shared: path.join(sharedDir, "importmaps/importmap.shared.json"),
        prod: path.join(sharedDir, "importmaps/importmap.json"),
    } as ImportMapFiles;

    private options: ImportMapLoaderOptions;

    constructor(options: ImportMapLoaderOptions = { retrievalMode: "content", stage: "prod" }) {
        this.options = { stage: "prod", ...options };
    }

    /**
     * Get an importmap by key
     * @param key - "dev" | "local" | "prod" | "shared"
     * @returns ImportMap content (string) or file path based on retrievalMode
     */
    get(key: ImportMapKey): string {
        if (!Object.keys(this.FILES).includes(key)) {
            throw new Error(`Invalid key: ${key}. Expect ${Object.keys(this.FILES).join(" | ")}`);
        }

        switch (this.options.retrievalMode) {
            case "content":
                const content = readFile(this.FILES[key]);
                if (this.options.rootUrl) {
                    return this.overrideRootUrl(content, this.options.rootUrl);
                }
                return content;
            case "path":
                if (this.options.rootUrl) {
                    const content = readFile(this.FILES[key]);
                    fs.writeFileSync(this.FILES[key], this.overrideRootUrl(content, this.options.rootUrl));
                }
                return this.FILES[key];
            default:
                throw new Error(`Unknown retrievalMode: ${this.options.retrievalMode}`);
        }
    }

    /**
     * Get the shared importmap (convenience method)
     * @returns Shared importmap content or path
     */
    shared(): string {
        return this.get("shared");
    }

    /**
     * Get the MFE importmap based on configured stage (convenience method)
     * @returns MFE importmap content or path for the configured stage
     */
    mfe(): string {
        return this.get(this.options.stage!);
    }

    private overrideRootUrl(content: string, rootUrl: string): string {
        const importmap = JSON.parse(content);
        importmap.imports[`@${ORG_NAME}/${PROJECT_NAME}`] = new URL(`${ORG_NAME}-${PROJECT_NAME}.js`, rootUrl).href;
        return JSON.stringify(importmap, null, 4);
    }
}
