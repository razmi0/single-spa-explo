//@ts-ignore
import { registerApplication, start } from "single-spa";
import { constructApplications, constructLayoutEngine, constructRoutes } from "single-spa-layout";
import "./index.css";

const routes = constructRoutes(document.querySelector("#single-spa-layout"));
const applications = constructApplications({
    routes,
    loadApp({ name }) {
        return import(/* webpackIgnore: true */ name);
    },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

console.log(applications);
console.log(routes);

applications.forEach(registerApplication);
layoutEngine.activate();
start();
