//@ts-check
import { config } from "dotenv";
import { mergeWithRules, CustomizeRule } from "webpack-merge";
import singleSpaDefaults from "webpack-config-single-spa";
import { rspack } from "@rspack/core";
import { TsCheckerRspackPlugin } from "ts-checker-rspack-plugin";
import {
    ORG_NAME,
    PROJECT_NAME,
    copyPlugin,
    htmlPlugin,
    devServer,
    loadEnv,
    getImportMap,
    getTemplate,
    DEFAULT_PORTS,
    DEFAULT_ROOTS,
} from "./shared/index.js";
const { CopyRspackPlugin, HtmlRspackPlugin, DefinePlugin } = rspack;

const merge = mergeWithRules({
    module: {
        rules: {
            test: CustomizeRule.Match,
            use: CustomizeRule.Replace,
            loader: CustomizeRule.Replace,
            options: CustomizeRule.Replace,
        },
    },
});

/**
 * @param {import("@rspack/core").Configuration & { PORT: string , STAGE: "dev" | "prod" | "" | undefined }} env
 */
export default (env, argv) => {
    const stage = env.STAGE || "prod";
    loadEnv(config, stage);

    const { ROOT_PORT = DEFAULT_PORTS.rspack, ROOT_URL } = process.env;

    const shared = getImportMap("shared");
    const mfes = getImportMap(stage, { rootUrl: ROOT_URL });
    const apps = getTemplate("apps");

    const defaultConfig = singleSpaDefaults({
        orgName: ORG_NAME,
        projectName: PROJECT_NAME,
        webpackConfigEnv: env,
        argv,
        disableHtmlGeneration: true,
    });

    return merge(defaultConfig, {
        plugins: [
            new TsCheckerRspackPlugin(),
            copyPlugin(CopyRspackPlugin),
            htmlPlugin("Rspack", HtmlRspackPlugin, {
                icon: "https://assets.rspack.rs/rspack/favicon-128x128.png",
                sharedImportmap: shared,
                mfeImportmap: mfes,
                mode: stage,
                layout: apps,
            }),
            // Inject constants at build time for browser access
            new DefinePlugin({
                __DEFAULT_ROOTS__: JSON.stringify(DEFAULT_ROOTS),
                "process.env.NODE_ENV": JSON.stringify(stage === "prod" ? "production" : "development"),
            }),
        ],

        entry: defaultConfig.entry + ".ts",
        devServer: devServer(Number(ROOT_PORT)),
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"],
            tsConfig: {
                configFile: "./tsconfig.json",
            },
        },

        module: {
            rules: [
                {
                    test: /\.(js|ts)x?$/,
                    exclude: [/[\\/]node_modules[\\/]/],
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
                                    development: env.STAGE !== "prod",
                                    refresh: env.STAGE !== "prod",
                                },
                            },
                            externalHelpers: true,
                        },
                        env: {
                            targets: "Chrome >= 87, Firefox >= 78, Safari >= 14, Edge >= 88",
                        },
                    },
                },
            ],
        },
    });
};
