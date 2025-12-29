export { LAYOUT_FILE, ORG_NAME, PROJECT_NAME } from "./constants.js";
export { default as ImportMapManager } from "./ImportMapManager.js";
export { default as LayoutManager } from "./LayoutManager.js";
export type { ImportMapFiles, ImportMapKey, ImportMapMode, ImportMapPath, LayoutFiles, LayoutKey, LayoutPath, } from "./types.js";
/** Copy shared assets to dist */
export declare const copyPlugin: (instance: any) => any;
/**
 * ejs templating
 */
export declare const htmlPlugin: (tech: string, instance: any, templateParams: Record<string, any>) => any;
export declare const devServer: (port: number) => {
    hot: boolean;
    port: number;
    setupMiddlewares: (middlewares: any, devServer: any) => any;
};
export declare const loadEnv: (dotenvConfig: any, mode: string) => void;
