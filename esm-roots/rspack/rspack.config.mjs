//@ts-check
import { mergeWithRules, CustomizeRule } from "webpack-merge";
import singleSpaDefaults from "webpack-config-single-spa";
import { rspack } from "@rspack/core";
import { TsCheckerRspackPlugin } from "ts-checker-rspack-plugin";
import {
    createReader,
    getSharedDir,
    getImportmapPath,
    getMfeImportmap,
    LAYOUT_FILE,
    ORG_NAME as orgName,
    PROJECT_NAME as projectName,
    copyPlugin,
    htmlPlugin,
    devServer,
} from "../shared/main.js";

const { CopyRspackPlugin, HtmlRspackPlugin } = rspack;

const SHARED_DIR = getSharedDir(import.meta.url);
const read = createReader(import.meta.url);
const prod = process.env.NODE_ENV === "production";

// Custom merge that replaces module.rules by test pattern
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
 * @param {import("@rspack/core").Configuration & { PORT: string , MODE: "dev" | "prod" }} env
 */
export default (env, argv) => {
    // Use base config (not -ts) to avoid ForkTsCheckerWebpackPlugin
    const defaultConfig = singleSpaDefaults({
        orgName,
        projectName,
        webpackConfigEnv: env,
        argv,
        disableHtmlGeneration: true,
    });

    return merge(defaultConfig, {
        // Override entry to use .ts extension
        entry: defaultConfig.entry + ".ts",
        devServer: devServer(env),

        // Use rspack's built-in tsConfig resolution + add TS extensions
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"],
            tsConfig: {
                configFile: "./tsconfig.json",
            },
        },

        module: {
            rules: [
                // Override babel-loader with builtin:swc-loader for TS/JS files
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
                                    development: !prod,
                                    refresh: !prod,
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

        plugins: [
            new TsCheckerRspackPlugin(),
            copyPlugin(CopyRspackPlugin, SHARED_DIR),
            htmlPlugin(
                "Rspack",
                HtmlRspackPlugin,
                {
                    icon: "https://assets.rspack.rs/rspack/favicon-128x128.png",
                    sharedImportmap: read(`${SHARED_DIR}/importmap.shared.json`),
                    mfeImportmap: getMfeImportmap(read, SHARED_DIR, getImportmapPath(env.MODE === "dev"), env.PORT),
                    mode: env.MODE || "prod",
                    layout: read(`${SHARED_DIR}/${LAYOUT_FILE}`),
                },
                `${SHARED_DIR}/main.ejs`
            ),
        ],
    });
};
