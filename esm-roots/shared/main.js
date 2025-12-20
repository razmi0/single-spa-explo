var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
/**
 * Creates __dirname equivalent for ESM modules
 * @param importMetaUrl - import.meta.url from the calling module
 */
export function getDirname(importMetaUrl) {
    var __filename = fileURLToPath(importMetaUrl);
    var __dirname = path.dirname(__filename);
    return { __filename: __filename, __dirname: __dirname };
}
/**
 * Reads a file synchronously from the filesystem
 * @param basePath - The base directory path
 * @param filePath - The relative path to the file
 * @returns The file contents
 * @throws If the file cannot be read
 */
export function readFile(basePath, filePath) {
    try {
        var content = fs.readFileSync(path.resolve(basePath, filePath), "utf-8");
        return content;
    }
    catch (error) {
        var reason = error instanceof Error ? error.message : String(error);
        throw new Error("File ".concat(filePath, " not found: ").concat(reason));
    }
}
/**
 * Creates a read function bound to a specific directory
 * @param importMetaUrl - import.meta.url from the calling module
 * @returns A function that reads files relative to the module's directory
 */
export function createReader(importMetaUrl) {
    var __dirname = getDirname(importMetaUrl).__dirname;
    return function (filePath) { return readFile(__dirname, filePath); };
}
/**
 * Resolves the shared directory path relative to a config file
 * @param importMetaUrl - import.meta.url from the calling module
 */
export function getSharedDir(importMetaUrl) {
    var __dirname = getDirname(importMetaUrl).__dirname;
    return path.resolve(__dirname, "../shared");
}
// Common constants
export var ORG_NAME = "Razmio";
export var PROJECT_NAME = "root-config";
export var LAYOUT_FILE = "single-spa-layout.html";
/**
 * Returns the importmap filename based on mode
 * @param isDev - whether in development mode
 */
export function getImportmapPath(isDev) {
    return isDev ? "importmap.dev.json" : "importmap.json";
}
/**
 * Copy shared importmap files
 * - see index.ejs
 */
export var copyPlugin = function (instance, sharedDir) {
    return new instance({
        patterns: [
            { from: "importmap*.json", context: sharedDir, to: "[name][ext]" },
            { from: "index.css", context: sharedDir, to: "shared.css" },
            { from: "single-spa-layout.html", context: sharedDir, to: "single-spa-layout.html" },
        ],
    });
};
/**
 * ejs templating
 */
export var htmlPlugin = function (tech, instance, templateParams, template) {
    return new instance({
        inject: false,
        template: template || "./src/index.ejs",
        templateParameters: __assign({ tech: tech, projectName: PROJECT_NAME, orgName: ORG_NAME }, templateParams),
    });
};
export var devServer = function (env) { return ({
    hot: true,
    port: Number(env.PORT),
    setupMiddlewares: function (middlewares, devServer) {
        if (!devServer)
            return middlewares;
        devServer.app.get(/\/importmap.*\.json$/, function (_req, res, next) {
            res.type("application/importmap+json");
            next();
        });
        return middlewares;
    },
}); };
