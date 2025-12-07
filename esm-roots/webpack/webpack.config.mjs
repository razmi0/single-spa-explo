import { merge } from "webpack-merge";
import singleSpaDefaults from "webpack-config-single-spa-ts";
import HtmlWebpackPlugin from "html-webpack-plugin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const read = (filePath) => {
    const content = fs.readFileSync(path.resolve(__dirname, filePath), "utf-8");
    if (!content) throw new Error(`File ${filePath} not found`);
    console.log(content);
    return content;
};

export default (webpackConfigEnv, argv) => {
    const orgName = "Razmio";
    const defaultConfig = singleSpaDefaults({
        orgName,
        projectName: "root-config",
        webpackConfigEnv,
        argv,
        disableHtmlGeneration: true,
    });

    return merge(defaultConfig, {
        // modify the webpack config however you'd like to by adding to this object
        plugins: [
            new HtmlWebpackPlugin({
                inject: false,
                template: "src/index.ejs",
                templateParameters: {
                    isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
                    orgName,
                    layout: read("src/routes/single-spa-layout.html"),
                },
            }),
        ],
    });
};
