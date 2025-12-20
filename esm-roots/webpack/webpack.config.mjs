//@ts-check
import { merge } from "webpack-merge";
import singleSpaDefaults from "webpack-config-single-spa-ts";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import {
    createReader,
    getSharedDir,
    getImportmapPath,
    LAYOUT_FILE,
    ORG_NAME as orgName,
    PROJECT_NAME as projectName,
    copyPlugin,
    htmlPlugin,
    devServer,
} from "../shared/main.js";

const SHARED_DIR = getSharedDir(import.meta.url);
const read = createReader(import.meta.url);

/**
 * @param {import("webpack").Configuration & { PORT: string , MODE: "dev" | "prod" }} env
 */
export default (env, argv) => {
    const defaultConfig = singleSpaDefaults({
        orgName,
        projectName,
        webpackConfigEnv: env,
        argv,
        disableHtmlGeneration: true,
    });

    return merge(defaultConfig, {
        devServer: devServer(env),
        plugins: [
            /**
             * Copy shared importmap files
             */
            copyPlugin(CopyWebpackPlugin, SHARED_DIR),
            /**
             * ejs templating for the index.ejs
             */
            htmlPlugin(
                "Webpack",
                HtmlWebpackPlugin,
                {
                    IMPORTMAP_PATH: getImportmapPath(env.MODE === "dev"),
                    mode: env.MODE || "prod",
                    sharedImportmap: read(`${SHARED_DIR}/importmap.shared.json`) || "",
                    layout: read(`${SHARED_DIR}/${LAYOUT_FILE}`),
                },
                `${SHARED_DIR}/main.ejs`
            ),
        ],
    });
};
