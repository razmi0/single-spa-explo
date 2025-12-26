import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ORG_NAME, PROJECT_NAME } from "./constants.js";
import type { ImportMapFiles, ImportMapKey, Mode } from "./types";

const sharedDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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

    constructor(private mode: Mode = "content") {}

    shared() {
        switch (this.mode) {
            case "content":
                return readFile(this.FILES.shared);
            case "path":
                return this.FILES.shared;
            default:
                throw new Error(`Unknown mode: ${this.mode}`);
        }
    }

    mfe(stage: ImportMapKey = "prod", port?: string | number) {
        if (!Object.keys(this.FILES).includes(stage)) {
            throw new Error(`Invalid stage: ${stage}. Expect ${Object.keys(this.FILES).join("| ")}\n`);
        }

        switch (this.mode) {
            case "content":
                const content = readFile(this.FILES[stage]);
                if (!port) return content;
                return this.overridePort(content, port);
            case "path":
                return this.FILES[stage];
            default:
                throw new Error(`Unknown mode: ${this.mode}`);
        }
    }

    private overridePort(content: string, port: string | number): string {
        const importmap = JSON.parse(content);
        importmap.imports[`@${ORG_NAME}/${PROJECT_NAME}`] = `http://localhost:${port}/${ORG_NAME}-${PROJECT_NAME}.js`;
        return JSON.stringify(importmap, null, 4);
    }
}
