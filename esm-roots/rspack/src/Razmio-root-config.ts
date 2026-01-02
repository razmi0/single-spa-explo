import { getAppNames, getAppStatus, registerApplication, start } from "single-spa";
import { constructApplications, constructLayoutEngine, constructRoutes } from "single-spa-layout";
import { type LoadedApp, type MfeDefaultProps, type MfeRegistry, type RootConfigInfo } from "../shared/index";

console.log("Root config [rspack]");

// Root Config Information
const rootConfig: RootConfigInfo = {
    name: "@Razmio/root-config",
    tech: "rspack",
    mode: (process.env.NODE_ENV as "development" | "production") || "development",
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
const routes = constructRoutes(document.querySelector("#single-spa-layout"));

const applications = constructApplications({
    routes,
    loadApp({ name }) {
        console.log(`[rspack] Loading: ${name}`);
        return import(/* webpackIgnore: true */ name);
    },
});

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
    console.log("[rspack] Applications:", getAppNames());
    console.log("[rspack] Root Config:", rootConfig);
}
