import type { ImportMapKey, ImportMapMode } from "./types";
export default class ImportMapManager {
    private FILES;
    private options;
    constructor();
    /**
     * Return the shared importmap
     * - content: return the importmap content
     * - path: return the importmap file path
     */
    shared(mode: ImportMapMode): string;
    /**
     * If given, the root url will be overridden in the importmap
     */
    withRootUrl(rootUrl: string | undefined): this;
    withStage(stage: ImportMapKey): this;
    /**
     * Return the mfe importmap
     * - content: return the importmap content
     * - path: return the importmap file path
     */
    mfe(mode: ImportMapMode): string;
    private overrideRootUrl;
}
