export type ImportMapMode = "content" | "path";
export type Mode = ImportMapMode;
export type ImportMapOptions = {
    rootUrl?: string | undefined;
    stage: ImportMapKey;
};

// --------

export type ImportMapKey = "dev" | "local" | "prod" | "shared";
export type ImportMapPath = `./importmaps/importmap${`.${Exclude<ImportMapKey, "prod">}` | ""}.json`;
export type ImportMapFiles = Record<ImportMapKey, ImportMapPath>;

// --------

export type LayoutKey = "apps" | "root";
export type LayoutPath = `./templates/single-spa-layout.html` | `./templates/main.ejs`;
export type LayoutFiles = Record<LayoutKey, LayoutPath>;
