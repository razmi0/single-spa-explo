import { merge } from "webpack-merge";
import singleSpaDefaults from "webpack-config-single-spa-react-ts";

export default (webpackConfigEnv, argv) => {
    const defaultConfig = singleSpaDefaults({
        orgName: "Razmio",
        projectName: "rnd-2",
        webpackConfigEnv,
        argv,
        outputSystemJS: false,
    });

    return merge(defaultConfig, {
        externals: {
            react: "react",
            "react-dom": "react-dom",
            "react-dom/client": "react-dom/client",
        },
    });
};
