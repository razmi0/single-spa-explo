import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ORG_NAME, PROJECT_NAME } from "./constants.js";
import type { ImportMapFiles, ImportMapKey, ImportMapOptions } from "./types";

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

    constructor(private options: ImportMapOptions = { mode: "content" }) {}

    shared() {
        switch (this.options.mode) {
            case "content":
                return readFile(this.FILES.shared);
            case "path":
                return this.FILES.shared;
            default:
                throw new Error(`Unknown mode: ${this.options.mode}`);
        }
    }

    mfe(stage: ImportMapKey = "prod", port?: string | number) {
        if (!Object.keys(this.FILES).includes(stage)) {
            throw new Error(`Invalid stage: ${stage}. Expect ${Object.keys(this.FILES).join("| ")}\n`);
        }

        switch (this.options.mode) {
            case "content":
                const content = readFile(this.FILES[stage]);
                if (port) return this.overridePort(content, port);
                if (this.options.rootUrl) return this.overrideRootUrl(content, this.options.rootUrl);
                return content;
            case "path":
                if (port || this.options.rootUrl) {
                    const content = readFile(this.FILES[stage]);
                    if (port) fs.writeFileSync(this.FILES[stage], this.overridePort(content, port));
                    if (this.options.rootUrl)
                        fs.writeFileSync(this.FILES[stage], this.overrideRootUrl(content, this.options.rootUrl));
                }
                return this.FILES[stage];
            default:
                throw new Error(`Unknown mode: ${this.options.mode}`);
        }
    }

    private overridePort(content: string, port: string | number): string {
        const importmap = JSON.parse(content);
        importmap.imports[`@${ORG_NAME}/${PROJECT_NAME}`] = `http://localhost:${port}/${ORG_NAME}-${PROJECT_NAME}.js`;
        return JSON.stringify(importmap, null, 4);
    }

    private overrideRootUrl(content: string, rootUrl: string): string {
        const importmap = JSON.parse(content);
        importmap.imports[`@${ORG_NAME}/${PROJECT_NAME}`] = `${rootUrl}${ORG_NAME}-${PROJECT_NAME}.js`;
        return JSON.stringify(importmap, null, 4);
    }
}
