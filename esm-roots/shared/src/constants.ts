export const ORG_NAME = "Razmio";
export const PROJECT_NAME = "root-config";
export const LAYOUT_FILE = "single-spa-layout.html";

export const DEFAULT_PORTS = {
    webpack: 2999,
    rspack: 3000,
    vite: 2998,
};

export const DEFAULT_URLS_PROD = {
    webpack: "https://single-spa-exploroot-webpack.vercel.app/",
    rspack: "https://razmi0-single-spa-explo.vercel.app/",
    vite: "https://single-spa-exploroot-vite.vercel.app/",
};

export const DEFAULT_URLS_DEV = {
    webpack: `http://localhost:${DEFAULT_PORTS.webpack}`,
    rspack: `http://localhost:${DEFAULT_PORTS.rspack}`,
    vite: `http://localhost:${DEFAULT_PORTS.vite}`,
};
export const DEFAULT_ROOTS = {
    webpack: {
        dev: DEFAULT_URLS_DEV.webpack,
        prod: DEFAULT_URLS_PROD.webpack,
    },
    rspack: {
        dev: DEFAULT_URLS_DEV.rspack,
        prod: DEFAULT_URLS_PROD.rspack,
    },
    vite: {
        dev: DEFAULT_URLS_DEV.vite,
        prod: DEFAULT_URLS_PROD.vite,
    },
};
