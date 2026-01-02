declare const ORG_NAME = "Razmio";
declare const PROJECT_NAME = "root-config";
declare const LAYOUT_FILE = "single-spa-layout.html";
declare const DEFAULT_PORTS: {
    webpack: number;
    rspack: number;
    vite: number;
};
declare const DEFAULT_URLS_PROD: {
    webpack: string;
    rspack: string;
    vite: string;
};
declare const DEFAULT_URLS_DEV: {
    webpack: string;
    rspack: string;
    vite: string;
};
declare const DEFAULT_ROOTS: {
    webpack: {
        dev: string;
        prod: string;
    };
    rspack: {
        dev: string;
        prod: string;
    };
    vite: {
        dev: string;
        prod: string;
    };
};

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
interface RootConfigInfo {
    /** Name of the root config (e.g., "@Razmio/root-config") */
    name: string;
    /** Build tool used (vite, webpack, rspack) */
    tech: "vite" | "webpack" | "rspack";
    /** Current environment mode */
    mode: "development" | "production" | "local";
    /** Version of the root config */
    version?: string;
}
interface LoadedApp {
    /** Application name (e.g., "@Razmio/navbar") */
    name: string;
    /** Current status of the application */
    status: "NOT_LOADED" | "LOADING_SOURCE_CODE" | "NOT_BOOTSTRAPPED" | "BOOTSTRAPPING" | "NOT_MOUNTED" | "MOUNTING" | "MOUNTED" | "UNMOUNTING" | "UNLOADING" | "SKIP_BECAUSE_BROKEN" | "LOAD_ERROR";
}
interface MfeRegistry {
    /** Application name */
    name: string;
    /** Route path where this MFE is mounted */
    route?: string;
}
/** URLs for different environments per bundler */
interface RootUrls {
    dev: string;
    prod: string;
}
/** All available root config URLs */
interface DefaultRoots {
    webpack: RootUrls;
    rspack: RootUrls;
    vite: RootUrls;
}
/**
 * Default props injected into every microfrontend application
 * These are passed via single-spa's customProps
 */
interface MfeDefaultProps {
    /** Single-spa application name (auto-injected) */
    name: string;
    /** Information about the root config orchestrating this MFE */
    rootConfig: RootConfigInfo;
    /** Function to get currently loaded applications */
    getLoadedApps: () => LoadedApp[];
    /** Registry of all known MFEs in the system */
    mfeRegistry: MfeRegistry[];
    /** URLs to all root configs (injected at build time) */
    defaultRoots: DefaultRoots;
}

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

export { DEFAULT_PORTS, DEFAULT_ROOTS, DEFAULT_URLS_DEV, DEFAULT_URLS_PROD, LAYOUT_FILE, ORG_NAME, PROJECT_NAME, copyPlugin, devServer, getImportMap, getTemplate, htmlPlugin, loadEnv };
export type { DefaultRoots, ImportMapFiles, ImportMapKey, ImportMapLoaderOptions, ImportMapPath, LayoutFiles, LayoutKey, LayoutPath, LoadedApp, MfeDefaultProps, MfeRegistry, RetrievalMode, RetrievalOptions, RootConfigInfo, RootUrls, TemplateFiles, TemplateKey, TemplateLoaderOptions, TemplatePath };
