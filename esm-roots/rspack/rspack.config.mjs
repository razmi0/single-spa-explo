//@ts-check
import { merge } from "webpack-merge";
import singleSpaDefaults from "webpack-config-single-spa-ts";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { rspack } from "@rspack/core";
const { CopyRspackPlugin, HtmlRspackPlugin } = rspack;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const orgName = "Razmio";
const projectName = "root-config";

const LAYOUT_PATH = "src/routes/single-spa-layout.html"; // applications layout
const TEMPLATE_PATH = "src/index.ejs"; // root-config template

const read = (filePath) => {
    try {
        const content = fs.readFileSync(path.resolve(__dirname, filePath), "utf-8");
        return content;
    } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new Error(`File ${filePath} not found: ${reason}`);
    }
};

export default (env, argv) => {
    const defaultConfig = singleSpaDefaults({
        orgName,
        projectName,
        env,
        argv,
        disableHtmlGeneration: true,
    });

    return merge(defaultConfig, {
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: [/node_modules/],
                    loader: "builtin:swc-loader",
                    options: {
                        jsc: {
                            parser: {
                                syntax: "typescript",
                            },
                        },
                    },
                    type: "javascript/auto",
                },
            ],
        },
        devServer: {
            hot: true,
            port: Number(env.PORT) || 3000,

            setupMiddlewares: (middlewares, devServer) => {
                if (!devServer) return middlewares;
                /**
                 * injector-importmap expect content-type application/importmap+json
                 */
                devServer.app.get(/\/importmap.*\.json$/, (_req, res, next) => {
                    res.type("application/importmap+json");
                    next();
                });
                return middlewares;
            },
        },
        plugins: [
            /**
             * serve importmap.*.json through the injector-importmap
             * - see index.ejs
             */
            new CopyRspackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, `src/importmap*.json`),
                        to: ".",
                    },
                ],
            }),
            /**
             * ejs templating
             */
            new HtmlRspackPlugin({
                inject: false,
                template: TEMPLATE_PATH,
                templateParameters: {
                    tech: "Rspack",
                    IMPORTMAP_PATH: `./src/importmap.${env.MODE || ""}.json`,
                    orgName,
                    projectName,
                    layout: read(LAYOUT_PATH),
                },
            }),
        ],
    });
};
