export type Mode = "content" | "path";
export type ImportMapOptions = {
    mode: Mode;
    rootUrl?: string | undefined;
};

// --------

export type ImportMapKey = "dev" | "local" | "prod" | "shared";
export type ImportMapPath = `./importmaps/importmap${`.${Exclude<ImportMapKey, "prod">}` | ""}.json`;
export type ImportMapFiles = Record<ImportMapKey, ImportMapPath>;

// --------

export type LayoutKey = "apps" | "root";
export type LayoutPath = `./templates/single-spa-layout.html` | `./templates/main.ejs`;
export type LayoutFiles = Record<LayoutKey, LayoutPath>;
