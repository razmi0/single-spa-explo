import { getAppNames, getAppStatus, registerApplication, start } from "single-spa";
import { constructApplications, constructLayoutEngine, constructRoutes } from "single-spa-layout";
import type { LoadedApp, MfeDefaultProps, MfeRegistry, RootConfigInfo } from "../shared/index";

console.log("Root config [webpack]");

// Root Config Information
const rootConfig: RootConfigInfo = {
    name: "@Razmio/root-config",
    tech: "webpack",
    mode: (process.env.NODE_ENV as "development" | "production") || "development",
    version: "1.0.0",
};

// MFE Registry - All known microfrontends
const mfeRegistry: MfeRegistry[] = [
    { name: "@Razmio/navbar", route: "/" },
    { name: "@Razmio/sidebar", route: "/" },
    { name: "@Razmio/vite", route: "/mfe/vite" },
    { name: "@Razmio/webpack", route: "/mfe/webpack" },
    { name: "@Razmio/rspack", route: "/mfe/rspack" },
    { name: "@Razmio/dashboard", route: "/mfe/dashboard" },
];

// Helper to get loaded apps with status
const getLoadedApps = (): LoadedApp[] => {
    return getAppNames().map((name) => ({
        name,
        status: getAppStatus(name) as LoadedApp["status"],
    }));
};

// Layout & Application Setup
const routes = constructRoutes(document.querySelector("#single-spa-layout"));

const applications = constructApplications({
    routes,
    loadApp({ name }) {
        console.log(`[webpack] Loading: ${name}`);
        return import(/* webpackIgnore: true */ name);
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

if (process.env.NODE_ENV === "development") {
    console.log("[webpack] Applications:", getAppNames());
    console.log("[webpack] Root Config:", rootConfig);
}
