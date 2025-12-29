import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ORG_NAME, PROJECT_NAME } from "./constants.js";
import type { ImportMapFiles, ImportMapKey, ImportMapMode, ImportMapOptions } from "./types";

// about importmap import type that differ from bundlers :
// "content" mode is used by webpack/ rspack essentially
// "path" mode is used by vite

// Resolve relative to the bundled file location (./shared/index.js)
// When bundled, import.meta.url points to the output location
const sharedDir = path.dirname(fileURLToPath(import.meta.url));

const readFile = (filePath: string): string => {
    try {
        const content = fs.readFileSync(filePath, "utf-8");
        return content;
    } catch (error: unknown) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new Error(`File ${filePath} not found: ${reason}`);
    }
};

export default class ImportMapManager {
    private FILES = {
        dev: path.join(sharedDir, "importmaps/importmap.dev.json"),
        local: path.join(sharedDir, "importmaps/importmap.local.json"),
        shared: path.join(sharedDir, "importmaps/importmap.shared.json"),
        prod: path.join(sharedDir, "importmaps/importmap.json"),
    } as ImportMapFiles;

    private options: ImportMapOptions = { stage: "prod" };

    constructor() {}

    /**
     * Return the shared importmap
     * - content: return the importmap content
     * - path: return the importmap file path
     */
    shared(mode: ImportMapMode) {
        switch (mode) {
            case "content":
                return readFile(this.FILES.shared);
            case "path":
                return this.FILES.shared;
            default:
                throw new Error(`Unknown mode: ${mode}`);
        }
    }

    /**
     * If given, the root url will be overridden in the importmap
     */
    withRootUrl(rootUrl: string | undefined) {
        this.options.rootUrl = rootUrl;
        return this;
    }

    withStage(stage: ImportMapKey) {
        this.options.stage = stage;
        return this;
    }

    /**
     * Return the mfe importmap
     * - content: return the importmap content
     * - path: return the importmap file path
     */
    mfe(mode: ImportMapMode) {
        if (!Object.keys(this.FILES).includes(this.options.stage)) {
            throw new Error(`Invalid stage: ${this.options.stage}. Expect ${Object.keys(this.FILES).join("| ")}\n`);
        }

        switch (mode) {
            case "content":
                const content = readFile(this.FILES[this.options.stage]);
                if (this.options.rootUrl) return this.overrideRootUrl(content, this.options.rootUrl);
                return content;
            case "path":
                if (this.options.rootUrl) {
                    const content = readFile(this.FILES[this.options.stage]);
                    if (this.options.rootUrl)
                        fs.writeFileSync(
                            this.FILES[this.options.stage],
                            this.overrideRootUrl(content, this.options.rootUrl)
                        );
                }
                return this.FILES[this.options.stage];
            default:
                throw new Error(`Unknown mode: ${mode}`);
        }
    }

    private overrideRootUrl(content: string, rootUrl: string): string {
        const importmap = JSON.parse(content);
        importmap.imports[`@${ORG_NAME}/${PROJECT_NAME}`] = new URL(`${ORG_NAME}-${PROJECT_NAME}.js`, rootUrl).href;
        return JSON.stringify(importmap, null, 4);
    }
}
