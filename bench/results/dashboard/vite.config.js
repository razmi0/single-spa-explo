import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@results": resolve(__dirname, ".."),
        },
    },
});
