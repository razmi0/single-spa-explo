import { getAppNames, getAppStatus, registerApplication, start } from "single-spa";
import { constructApplications, constructLayoutEngine, constructRoutes } from "single-spa-layout";
import type { LoadedApp, MfeDefaultProps, MfeRegistry, RootConfigInfo } from "../shared/index";
import "../shared/styles/index.css";

console.log("Root config [vite]");

// Root Config Information
const rootConfig: RootConfigInfo = {
    name: "@Razmio/root-config",
    tech: "vite",
    mode: import.meta.env.MODE as "development" | "production" | "local",
    version: "1.0.0",
};

// MFE Registry - All known microfrontends
const mfeRegistry: MfeRegistry[] = [
    { name: "@Razmio/navbar", route: "/" },
    { name: "@Razmio/vite", route: "/" },
    { name: "@Razmio/webpack", route: "/" },
];

// Helper to get loaded apps with status
const getLoadedApps = (): LoadedApp[] => {
    return getAppNames().map((name) => ({
        name,
        status: getAppStatus(name) as LoadedApp["status"],
    }));
};

// Layout & Application Setup
const rootLayout = document.querySelector("#single-spa-layout")!;
const routes = constructRoutes(rootLayout);

const applications = constructApplications({
    routes,
    loadApp: ({ name }) => {
        console.log(`[vite] Loading: ${name}`);
        try {
            return import(/* @vite-ignore */ name);
        } catch (error) {
            console.error(`Failed to load ${name}, falling back to no-op lifecycle`, error);
            throw error;
        }
    },
});

// Custom Props Factory - Injected into all MFEs
const createCustomProps = (appName: string): MfeDefaultProps => ({
    rootConfig,
    getLoadedApps,
    mfeRegistry,
    name: appName,
    defaultRoots: __DEFAULT_ROOTS__,
});

// Register applications with custom props
applications.forEach((app) => {
    registerApplication({
        ...app,
        customProps: createCustomProps(app.name),
    });
});

const layoutEngine = constructLayoutEngine({ routes, applications });
layoutEngine.activate();
start();

if (import.meta.env.DEV) {
    console.log("[vite] Applications:", getAppNames());
    console.log("[vite] Root Config:", rootConfig);
}
