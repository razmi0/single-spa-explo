import { getAppNames, registerApplication, start } from "single-spa";
import { constructApplications, constructLayoutEngine, constructRoutes } from "single-spa-layout";
import "../../shared/styles/index.css";

const rootLayout = document.querySelector("#single-spa-layout")!;
const routes = constructRoutes(rootLayout);

const applications = constructApplications({
    routes,
    loadApp: ({ name }) => {
        console.log(name);
        try {
            return import(/* @vite-ignore */ name);
        } catch (error) {
            console.error(`Failed to load ${name}, falling back to no-op lifecycle`, error);
            throw error;
        }
    },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

applications.map(registerApplication);

layoutEngine.activate();
start();

if (process.env.NODE_ENV === "development") {
    console.log("Applications", getAppNames());
}
