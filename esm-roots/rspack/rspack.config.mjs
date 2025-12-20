//@ts-check
import { merge } from "webpack-merge";
import singleSpaDefaults from "webpack-config-single-spa-ts";
import { rspack } from "@rspack/core";
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
const { CopyRspackPlugin, HtmlRspackPlugin } = rspack;

const SHARED_DIR = getSharedDir(import.meta.url);
const read = createReader(import.meta.url);

/**
 * @param {import("@rspack/core").Configuration & { PORT: string , MODE: "dev" | "prod" }} env
 */
export default (env, argv) => {
    const defaultConfig = singleSpaDefaults({
        orgName,
        projectName,
        env,
        argv,
        disableHtmlGeneration: true,
    });

    return merge(defaultConfig, {
        devServer: devServer(env),
        plugins: [
            /**
             * Copy shared importmap files
             * - see index.ejs
             */
            copyPlugin(CopyRspackPlugin, SHARED_DIR),

            /**
             * ejs templating
             */
            htmlPlugin(
                "Rspack",
                HtmlRspackPlugin,
                {
                    icon  : "https://assets.rspack.rs/rspack/favicon-128x128.png",
                    IMPORTMAP_PATH: getImportmapPath(env.MODE === "dev"),
                    sharedImportmap: read(`${SHARED_DIR}/importmap.shared.json`),
                    mode: env.MODE || "prod",
                    layout: read(`${SHARED_DIR}/${LAYOUT_FILE}`),
                },
                `${SHARED_DIR}/main.ejs`
            ),
        ],
    });
};
