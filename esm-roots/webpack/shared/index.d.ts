declare const ORG_NAME = "Razmio";
declare const PROJECT_NAME = "root-config";
declare const LAYOUT_FILE = "single-spa-layout.html";

type RetrievalMode = "content" | "path";
type RetrievalOptions = {
    retrievalMode?: RetrievalMode;
};
type ImportMapKey = "dev" | "local" | "prod" | "shared";
type ImportMapPath = `./importmaps/importmap${`.${Exclude<ImportMapKey, "prod">}` | ""}.json`;
type ImportMapFiles = Record<ImportMapKey, ImportMapPath>;
type ImportMapLoaderOptions = RetrievalOptions & {
    rootUrl?: string;
};
type TemplateKey = "apps" | "root";
type TemplatePath = `./templates/single-spa-layout.html` | `./templates/main.ejs`;
type TemplateFiles = Record<TemplateKey, TemplatePath>;
type TemplateLoaderOptions = RetrievalOptions;
type LayoutKey = TemplateKey;
type LayoutPath = TemplatePath;
type LayoutFiles = TemplateFiles;

declare const getImportMap: (type?: ImportMapKey, options?: ImportMapLoaderOptions) => string;

/**
 * Get a template by key
 * @param key - "apps" for single-spa-layout.html or "root" for main.ejs
 * @param options - retrieval options (content or path mode)
 * @returns Template content (string) or file path based on retrievalMode
 */
declare const getTemplate: (key: TemplateKey, { retrievalMode }?: TemplateLoaderOptions) => string;

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

export { LAYOUT_FILE, ORG_NAME, PROJECT_NAME, copyPlugin, devServer, getImportMap, getTemplate, htmlPlugin, loadEnv };
export type { ImportMapFiles, ImportMapKey, ImportMapLoaderOptions, ImportMapPath, LayoutFiles, LayoutKey, LayoutPath, RetrievalMode, RetrievalOptions, TemplateFiles, TemplateKey, TemplateLoaderOptions, TemplatePath };
