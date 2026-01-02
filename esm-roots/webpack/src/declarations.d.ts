declare const __DEFAULT_ROOTS__: {
    webpack: { dev: string; prod: string };
    rspack: { dev: string; prod: string };
    vite: { dev: string; prod: string };
};

declare module "*.html" {
    const rawHtmlFile: string;
    export = rawHtmlFile;
}

declare module "*.bmp" {
    const src: string;
    export default src;
}

declare module "*.gif" {
    const src: string;
    export default src;
}

declare module "*.jpg" {
    const src: string;
    export default src;
}

declare module "*.jpeg" {
    const src: string;
    export default src;
}

declare module "*.png" {
    const src: string;
    export default src;
}

declare module "*.webp" {
    const src: string;
    export default src;
}

declare module "*.svg" {
    const src: string;
    export default src;
}
