// Shared retrieval options for loaders
export type RetrievalMode = "content" | "path";
export type RetrievalOptions = {
    retrievalMode?: RetrievalMode;
};

// --------
// ImportMap types

export type ImportMapKey = "dev" | "local" | "prod" | "shared";
export type ImportMapPath = `./importmaps/importmap${`.${Exclude<ImportMapKey, "prod">}` | ""}.json`;
export type ImportMapFiles = Record<ImportMapKey, ImportMapPath>;

export type ImportMapLoaderOptions = RetrievalOptions & {
    rootUrl?: string;
};

// --------
// Template types

export type TemplateKey = "apps" | "root";
export type TemplatePath = `./templates/single-spa-layout.html` | `./templates/main.ejs`;
export type TemplateFiles = Record<TemplateKey, TemplatePath>;

export type TemplateLoaderOptions = RetrievalOptions;

// Legacy aliases (deprecated)
export type LayoutKey = TemplateKey;
export type LayoutPath = TemplatePath;
export type LayoutFiles = TemplateFiles;

// --------
// MFE Props types - Shared props injected into all microfrontends

export interface RootConfigInfo {
    /** Name of the root config (e.g., "@Razmio/root-config") */
    name: string;
    /** Build tool used (vite, webpack, rspack) */
    tech: "vite" | "webpack" | "rspack";
    /** Current environment mode */
    mode: "development" | "production" | "local";
    /** Version of the root config */
    version?: string;
}

export interface LoadedApp {
    /** Application name (e.g., "@Razmio/navbar") */
    name: string;
    /** Current status of the application */
    status:
        | "NOT_LOADED"
        | "LOADING_SOURCE_CODE"
        | "NOT_BOOTSTRAPPED"
        | "BOOTSTRAPPING"
        | "NOT_MOUNTED"
        | "MOUNTING"
        | "MOUNTED"
        | "UNMOUNTING"
        | "UNLOADING"
        | "SKIP_BECAUSE_BROKEN"
        | "LOAD_ERROR";
}

export interface MfeRegistry {
    /** Application name */
    name: string;
    /** Route path where this MFE is mounted */
    route?: string;
}

/** URLs for different environments per bundler */
export interface RootUrls {
    dev: string;
    prod: string;
}

/** All available root config URLs */
export interface DefaultRoots {
    webpack: RootUrls;
    rspack: RootUrls;
    vite: RootUrls;
}

/**
 * Default props injected into every microfrontend application
 * These are passed via single-spa's customProps
 */
export interface MfeDefaultProps {
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
