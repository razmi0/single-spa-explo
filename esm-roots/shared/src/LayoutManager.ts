import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { LayoutFiles, LayoutKey, Mode } from "./types";

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

export default class LayoutManager {
    private FILES = {
        apps: path.join(sharedDir, "templates/single-spa-layout.html"),
        root: path.join(sharedDir, "templates/main.ejs"),
    } as LayoutFiles;

    constructor(private mode: Mode = "content") {}

    get(key: LayoutKey) {
        switch (this.mode) {
            case "content":
                return readFile(this.FILES[key]);
            case "path":
                return this.FILES[key];
            default:
                throw new Error(`Unknown mode: ${this.mode}`);
        }
    }
}
