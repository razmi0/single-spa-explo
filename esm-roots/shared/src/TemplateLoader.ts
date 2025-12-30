import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { TemplateFiles, TemplateKey, TemplateLoaderOptions } from "./types";

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

export default class TemplateLoader {
    private FILES: TemplateFiles = {
        apps: path.join(sharedDir, "templates/single-spa-layout.html"),
        root: path.join(sharedDir, "templates/main.ejs"),
    } as TemplateFiles;

    private options: TemplateLoaderOptions;

    constructor(options: TemplateLoaderOptions = { retrievalMode: "content" }) {
        this.options = options;
    }

    /**
     * Get a template by key
     * @param key - "apps" for single-spa-layout.html or "root" for main.ejs
     * @returns Template content (string) or file path based on retrievalMode
     */
    get(key: TemplateKey): string {
        switch (this.options.retrievalMode) {
            case "content":
                return readFile(this.FILES[key]);
            case "path":
                return this.FILES[key];
            default:
                throw new Error(`Unknown retrievalMode: ${this.options.retrievalMode}`);
        }
    }
}

