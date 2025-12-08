//@ts-check
import dotenv from "dotenv";
import { merge } from "webpack-merge";
import singleSpaDefaults from "webpack-config-single-spa-ts";
import HtmlWebpackPlugin from "html-webpack-plugin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import CopyWebpackPlugin from "copy-webpack-plugin";

dotenv.config();
const publicEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => key.startsWith("PUBLIC_")));
console.log("publicEnv", publicEnv);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const orgName = "Razmio";
const projectName = "root-config";

const LAYOUT_PATH = "src/routes/single-spa-layout.html"; // applications layout
const TEMPLATE_PATH = "src/index.ejs"; // root-config template
const PRODUCT = publicEnv.PUBLIC_PRODUCT ?? "product-1"; // product name

/**
 * "dev" or ""
 * - importmap.dev.json
 * - importmap.json
 */
const IMPORT_MAP_MODE = publicEnv.PUBLIC_LAYOUT_MODE || ""; // import map mode
const IMPORTMAP_PATH = `src/importmap.${IMPORT_MAP_MODE}.json`; // import map path

const read = (filePath) => {
    try {
        const content = fs.readFileSync(path.resolve(__dirname, filePath), "utf-8");
        return content;
    } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new Error(`File ${filePath} not found: ${reason}`);
    }
};

const setupMiddlewares = (middlewares, devServer) => {
    if (!devServer) return middlewares;
    devServer.app.get(/\/importmap.*\.json$/, (req, res, next) => {
        res.type("application/importmap+json");
        next();
    });
    return middlewares;
};

export default (webpackConfigEnv, argv) => {
    console.log(argv);

    const defaultConfig = singleSpaDefaults({
        orgName,
        projectName,
        webpackConfigEnv,
        argv,
        disableHtmlGeneration: true,
    });

    return merge(defaultConfig, {
        devServer: {
            /**
             * injector-importmap expect content-type application/importmap+json
             */
            setupMiddlewares,
        },
        plugins: [
            /**
             * serve importmap.*.json through the injector-importmap
             * - see index.ejs
             */
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, `src/importmap*.json`),
                        to: ".",
                    },
                ],
            }),
            /**
             * ejs templating for the index.ejs
             */
            new HtmlWebpackPlugin({
                inject: false,
                template: TEMPLATE_PATH,
                templateParameters: {
                    IMPORTMAP_PATH,
                    orgName,
                    projectName,
                    layout: read(LAYOUT_PATH),
                },
            }),
        ],
    });
};
