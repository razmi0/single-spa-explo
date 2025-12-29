//@ts-check
import { config } from "dotenv";
import { merge } from "webpack-merge";
import singleSpaDefaults from "webpack-config-single-spa-ts";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import {
    ORG_NAME,
    PROJECT_NAME,
    copyPlugin,
    htmlPlugin,
    devServer,
    loadEnv,
    ImportMapManager,
    LayoutManager,
} from "./shared/index.js";

/**
 * @param {import("webpack").Configuration & { PORT: string , STAGE: "dev" | "prod" | "shared" | "" | undefined }} env
 */
export default (env, argv) => {
    const stage = env.STAGE || "prod";
    loadEnv(config, stage);
    const importMapManager = new ImportMapManager({ mode: "content", rootUrl: process.env.ROOT_URL });
    const layoutManager = new LayoutManager("content");

    const defaultConfig = singleSpaDefaults({
        orgName: ORG_NAME,
        projectName: PROJECT_NAME,
        webpackConfigEnv: env,
        argv,
        disableHtmlGeneration: true,
    });

    return merge(defaultConfig, {
        devServer: devServer(env),
        plugins: [
            copyPlugin(CopyWebpackPlugin),
            htmlPlugin("Webpack", HtmlWebpackPlugin, {
                icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fseekicon.com%2Ffree-icon-download%2Fwebpack_2.png&f=1&nofb=1&ipt=cc402c94a69bf1bcb3e7cbdc5a8245060fa635d88597e80b1b029a1267af28e1",
                sharedImportmap: importMapManager.shared(),
                mfeImportmap: importMapManager.mfe(stage, env.PORT),
                mode: stage,
                layout: layoutManager.get("apps"),
            }),
        ],
    });
};
