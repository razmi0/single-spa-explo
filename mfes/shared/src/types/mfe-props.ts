/**
 * MFE Default Props - Types for props injected by the root config
 * These mirror the types from @esm-roots/shared
 */

import type { AppProps } from "single-spa";

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
export interface MfeDefaultProps extends AppProps {
    /** Application name (e.g., "@Razmio/sidebar") */
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

