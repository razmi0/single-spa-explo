import path from "path";
import { fileURLToPath } from "url";
import { ORG_NAME, PROJECT_NAME } from "./constants.js";

const sharedDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Copy shared assets to dist */
export const copyPlugin = (instance: any) => {
    return new instance({
        patterns: [
            { from: "importmaps/*", context: sharedDir, to: "[name][ext]" },
            { from: "styles/index.css", context: sharedDir, to: "shared.css" },
            { from: "templates/single-spa-layout.html", context: sharedDir, to: "single-spa-layout.html" },
        ],
    });
};

/**
 * ejs templating
 */
export const htmlPlugin = (tech: string, instance: any, templateParams: Record<string, any>) => {
    return new instance({
        inject: false,
        template: path.join(sharedDir, "templates/main.ejs"),
        templateParameters: {
            tech,
            projectName: PROJECT_NAME,
            orgName: ORG_NAME,
            ...templateParams,
        },
    });
};

export const devServer = (env: { PORT: string }) => ({
    hot: true,
    port: Number(env.PORT),

    setupMiddlewares: (middlewares: any, devServer: any) => {
        if (!devServer) return middlewares;
        devServer.app.get(/\/importmap.*\.json$/, (_req: any, res: any, next: any) => {
            res.type("application/importmap+json");
            next();
        });
        return middlewares;
    },
});
