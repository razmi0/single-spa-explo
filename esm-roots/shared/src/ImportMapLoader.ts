import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ORG_NAME, PROJECT_NAME } from "./constants.js";
import type { ImportMapFiles, ImportMapKey, ImportMapLoaderOptions } from "./types.js";

// about importmap retrieval mode that differ from bundlers:
// "content" mode is used by webpack/rspack essentially
// "path" mode is used by vite because of the plugin we used that read them

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

const FILES: ImportMapFiles = {
    dev: path.join(sharedDir, "importmaps/importmap.dev.json"),
    local: path.join(sharedDir, "importmaps/importmap.local.json"),
    shared: path.join(sharedDir, "importmaps/importmap.shared.json"),
    prod: path.join(sharedDir, "importmaps/importmap.json"),
} as ImportMapFiles;

const getImportMap = (type: ImportMapKey = "prod", options?: ImportMapLoaderOptions): string => {
    const { retrievalMode = "content", rootUrl } = options ?? {};
    throwIfInvalid(type);

    switch (retrievalMode) {
        case "content":
            const content = readFile(FILES[type]);
            if (rootUrl) {
                return overrideRootUrl(content, rootUrl);
            }
            return content;
        case "path":
            if (rootUrl) {
                const content = readFile(FILES[type]);
                fs.writeFileSync(FILES[type], overrideRootUrl(content, rootUrl));
            }
            return FILES[type];
        default:
            throw new Error(`Unknown retrievalMode: ${retrievalMode}`);
    }
};

const throwIfInvalid = (type: ImportMapKey) => {
    if (!Object.keys(FILES).includes(type)) {
        throw new Error(`Invalid key: ${type}. Expect ${Object.keys(FILES).join(" | ")}`);
    }
};

const overrideRootUrl = (content: string, rootUrl: string): string => {
    const importmap = JSON.parse(content);
    importmap.imports[`@${ORG_NAME}/${PROJECT_NAME}`] = new URL(`${ORG_NAME}-${PROJECT_NAME}.js`, rootUrl).href;
    return JSON.stringify(importmap, null, 4);
};

export default getImportMap;
