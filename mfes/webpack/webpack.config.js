//@ts-check
import { merge } from "webpack-merge";
import singleSpaDefaults from "webpack-config-single-spa-react-ts";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";

export default (webpackConfigEnv, argv) => {
    // Check both NODE_ENV and argv.mode for reliable dev detection
    const isDev = process.env.NODE_ENV === "development" || argv.mode !== "production";

    const defaultConfig = singleSpaDefaults({
        orgName: "Razmio",
        projectName: "rnd-2",
        webpackConfigEnv,
        argv,
        outputSystemJS: false,
    });

    return merge(defaultConfig, {
        devServer: {
            hot: true,
            allowedHosts: "all",
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        },
        plugins: [
            isDev &&
                new ReactRefreshWebpackPlugin({
                    overlay: false, // Recommended for single-spa
                }),
        ].filter(Boolean),
        // Only externalize React in production - in dev, bundle it for React Refresh to work

        // ⚠️ Note: In dev mode, globally, you'll now have 2 React instances (bundled + CDN).
        // This is fine for HMR testing but could cause issues if you need to share React context across MFEs.
        // The production build still uses the shared CDN React.
        // Mismatch version of cdn react and bundled react can cause issues

        externals: isDev
            ? {}
            : {
                  react: "react",
                  "react-dom": "react-dom",
                  "react-dom/client": "react-dom/client",
              },
    });
};
