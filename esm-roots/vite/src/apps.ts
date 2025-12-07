/** this is a list of all applications micro-frontends that are accessible by the root config */
import { RegisterApplicationConfig } from "single-spa";

export default [
    {
        name: "@demo/mf-home",
        activeWhen: "/",
    },
    { name: "@demo/mf-blog", activeWhen: "/blog" },
] as Omit<RegisterApplicationConfig, "app">[];
