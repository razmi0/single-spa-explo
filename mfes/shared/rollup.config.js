import dts from "rollup-plugin-dts";

export default {
    input: "dist/main.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
    // Mark node built-ins as external to avoid warnings
    external: ["path", "url", "fs"],
};
