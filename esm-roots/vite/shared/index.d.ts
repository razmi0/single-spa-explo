export { LAYOUT_FILE, ORG_NAME, PROJECT_NAME } from "./constants.js";
export { default as ImportMapManager } from "./ImportMapManager.js";
export { default as LayoutManager } from "./LayoutManager.js";
export type { ImportMapFiles, ImportMapKey, ImportMapPath, LayoutFiles, LayoutKey, LayoutPath, Mode } from "./types.js";
/** Copy shared assets to dist */
export declare const copyPlugin: (instance: any) => any;
/**
 * ejs templating
 */
export declare const htmlPlugin: (tech: string, instance: any, templateParams: Record<string, any>) => any;
export declare const devServer: (env: {
    PORT: string;
}) => {
    hot: boolean;
    port: number;
    setupMiddlewares: (middlewares: any, devServer: any) => any;
};
export declare const loadEnv: (dotenvConfig: any, mode: string) => void;
