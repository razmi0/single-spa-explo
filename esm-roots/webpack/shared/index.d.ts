declare const ORG_NAME = "Razmio";
declare const PROJECT_NAME = "root-config";
declare const LAYOUT_FILE = "single-spa-layout.html";

type RetrievalMode = "content" | "path";
type RetrievalOptions = {
    retrievalMode: RetrievalMode;
};
type ImportMapKey = "dev" | "local" | "prod" | "shared";
type ImportMapPath = `./importmaps/importmap${`.${Exclude<ImportMapKey, "prod">}` | ""}.json`;
type ImportMapFiles = Record<ImportMapKey, ImportMapPath>;
type ImportMapLoaderOptions = RetrievalOptions & {
    rootUrl?: string;
    stage?: ImportMapKey;
};
type TemplateKey = "apps" | "root";
type TemplatePath = `./templates/single-spa-layout.html` | `./templates/main.ejs`;
type TemplateFiles = Record<TemplateKey, TemplatePath>;
type TemplateLoaderOptions = RetrievalOptions;
type LayoutKey = TemplateKey;
type LayoutPath = TemplatePath;
type LayoutFiles = TemplateFiles;

declare class ImportMapLoader {
    private FILES;
    private options;
    constructor(options?: ImportMapLoaderOptions);
    /**
     * Get an importmap by key
     * @param key - "dev" | "local" | "prod" | "shared"
     * @returns ImportMap content (string) or file path based on retrievalMode
     */
    get(key: ImportMapKey): string;
    /**
     * Get the shared importmap (convenience method)
     * @returns Shared importmap content or path
     */
    shared(): string;
    /**
     * Get the MFE importmap based on configured stage (convenience method)
     * @returns MFE importmap content or path for the configured stage
     */
    mfe(): string;
    private overrideRootUrl;
}

declare class TemplateLoader {
    private FILES;
    private options;
    constructor(options?: TemplateLoaderOptions);
    /**
     * Get a template by key
     * @param key - "apps" for single-spa-layout.html or "root" for main.ejs
     * @returns Template content (string) or file path based on retrievalMode
     */
    get(key: TemplateKey): string;
}

/** Copy shared assets to dist */
declare const copyPlugin: (instance: any) => any;
/**
 * ejs templating
 */
declare const htmlPlugin: (tech: string, instance: any, templateParams: Record<string, any>) => any;
declare const devServer: (port: number) => {
    hot: boolean;
    port: number;
    setupMiddlewares: (middlewares: any, devServer: any) => any;
};
declare const loadEnv: (dotenvConfig: any, mode: string) => void;

export { ImportMapLoader, LAYOUT_FILE, ORG_NAME, PROJECT_NAME, TemplateLoader, copyPlugin, devServer, htmlPlugin, loadEnv };
export type { ImportMapFiles, ImportMapKey, ImportMapLoaderOptions, ImportMapPath, LayoutFiles, LayoutKey, LayoutPath, RetrievalMode, RetrievalOptions, TemplateFiles, TemplateKey, TemplateLoaderOptions, TemplatePath };
