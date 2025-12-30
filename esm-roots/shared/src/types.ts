// Shared retrieval options for loaders
export type RetrievalMode = "content" | "path";
export type RetrievalOptions = {
    retrievalMode: RetrievalMode;
};

// --------
// ImportMap types

export type ImportMapKey = "dev" | "local" | "prod" | "shared";
export type ImportMapPath = `./importmaps/importmap${`.${Exclude<ImportMapKey, "prod">}` | ""}.json`;
export type ImportMapFiles = Record<ImportMapKey, ImportMapPath>;

export type ImportMapLoaderOptions = RetrievalOptions & {
    rootUrl?: string;
    stage?: ImportMapKey;
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
