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
                    icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fseekicon.com%2Ffree-icon-download%2Fwebpack_2.png&f=1&nofb=1&ipt=cc402c94a69bf1bcb3e7cbdc5a8245060fa635d88597e80b1b029a1267af28e1",
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
