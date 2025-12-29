import type { ImportMapKey, ImportMapOptions } from "./types";
export default class ImportMapManager {
    private options;
    private FILES;
    constructor(options?: ImportMapOptions);
    shared(): string;
    mfe(stage?: ImportMapKey, port?: string | number): string;
    private overridePort;
    private overrideRootUrl;
}
