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
    ImportMapLoader,
    TemplateLoader,
} from "./shared/index.js";

const DEFAULT_PORT = 2999;

/**
 * @param {import("webpack").Configuration & { PORT: string , STAGE: "dev" | "prod" | "shared" | "" | undefined }} env
 */
export default (env, argv) => {
    const stage = env.STAGE || "prod";
    loadEnv(config, stage);

    const { ROOT_PORT = DEFAULT_PORT, ROOT_URL } = process.env;

    const importMapLoader = new ImportMapLoader({ retrievalMode: "content", stage, rootUrl: ROOT_URL });
    const templateLoader = new TemplateLoader({ retrievalMode: "content" });
    const shared = importMapLoader.get("shared");
    const mfes = importMapLoader.get(stage);
    const apps = templateLoader.get("apps");

    const defaultConfig = singleSpaDefaults({
        orgName: ORG_NAME,
        projectName: PROJECT_NAME,
        webpackConfigEnv: env,
        argv,
        disableHtmlGeneration: true,
    });

    return merge(defaultConfig, {
        devServer: devServer(Number(ROOT_PORT)),
        plugins: [
            copyPlugin(CopyWebpackPlugin),
            htmlPlugin("Webpack", HtmlWebpackPlugin, {
                icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fseekicon.com%2Ffree-icon-download%2Fwebpack_2.png&f=1&nofb=1&ipt=cc402c94a69bf1bcb3e7cbdc5a8245060fa635d88597e80b1b029a1267af28e1",
                sharedImportmap: shared,
                mfeImportmap: mfes,
                mode: stage,
                layout: apps,
            }),
        ],
    });
};
