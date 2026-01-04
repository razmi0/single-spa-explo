//@ts-check
import { rspack } from "@rspack/core";
import ReactRefreshPlugin from "@rspack/plugin-react-refresh";
import singleSpaDefaults from "webpack-config-single-spa-react-ts";
import { merge } from "webpack-merge";

const ORG_NAME = "Razmio";
const PROJECT_NAME = "sidebar";
const DEFAULT_PORT = 3005;

/**
 * @param {Record<string, any>} env
 * @param {{ mode?: string }} argv
 * @returns {import("@rspack/core").Configuration}
 */
export default (env, argv) => {
    const isDev = argv.mode !== "production";

    /** @type {any} */
    const config = singleSpaDefaults({
        orgName: ORG_NAME,
        projectName: PROJECT_NAME,
        webpackConfigEnv: env,
        argv: argv,
        outputSystemJS: false,
    });

    // Remove CSS rules from base config - we use style-loader
    if (config.module?.rules) {
        config.module.rules = config.module.rules.filter((/** @type {any} */ rule) => {
            if (typeof rule === "object" && rule !== null && "test" in rule) {
                if (rule.test instanceof RegExp && rule.test.test(".css")) {
                    return false;
                }
            }
            return true;
        });
    }

    return merge(config, {
        entry: `./src/${ORG_NAME}-${PROJECT_NAME}.tsx`,

        devServer: {
            port: DEFAULT_PORT,
            hot: true,
            allowedHosts: "all",
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        },

        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },

        // React externals: bundled in dev for HMR, external in prod for shared CDN
        externals: isDev ? {} : ["react", "react-dom", "react-dom/client"],

        module: {
            rules: [
                // TypeScript/JSX via builtin:swc-loader (replaces babel-loader)
                {
                    test: /\.(j|t)sx?$/,
                    exclude: /node_modules/,
                    loader: "builtin:swc-loader",
                    options: {
                        jsc: {
                            parser: {
                                syntax: "typescript",
                                tsx: true,
                            },
                            transform: {
                                react: {
                                    runtime: "automatic",
                                    development: isDev,
                                    refresh: isDev,
                                },
                            },
                            externalHelpers: true,
                        },
                        env: {
                            targets: "Chrome >= 87, Firefox >= 78, Safari >= 14, Edge >= 88",
                        },
                    },
                },
                // CSS with style-loader (injects <style> tags on import)
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                    type: "javascript/auto",
                },
                // Native asset modules (replaces file-loader/url-loader)
                {
                    test: /\.(png|jpe?g|gif|svg|webp)$/i,
                    type: "asset/resource",
                },
            ],
        },

        plugins: [
            // React Fast Refresh for HMR (dev only)
            isDev && new ReactRefreshPlugin({ overlay: false }),
            // Define environment
            new rspack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify(isDev ? "development" : "production"),
            }),
        ].filter(Boolean),
    });
};
