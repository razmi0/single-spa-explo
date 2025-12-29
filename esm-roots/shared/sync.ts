#!/usr/bin/env bun
/**
 * Sync script for @esm-roots/shared
 * Bundles TypeScript and copies assets to each root's local /shared/ folder
 *
 * Usage:
 *   bun run sync.ts        # One-time sync
 *   bun run sync.ts --watch # Watch mode
 */

import { $ } from "bun";
import { watch } from "fs";
import { readdir } from "fs/promises";
import { join, relative } from "path";

const SHARED_DIR = import.meta.dir;

const TARGETS = [
    join(SHARED_DIR, "../webpack/shared"),
    join(SHARED_DIR, "../rspack/shared"),
    join(SHARED_DIR, "../vite/shared"),
];

const WATCH_DIRS = ["src", "styles", "importmaps", "templates"];

const ASSET_DIRS = ["styles", "importmaps", "templates"];

async function bundle(): Promise<boolean> {
    const result = await Bun.build({
        entrypoints: [join(SHARED_DIR, "src/main.ts")],
        outdir: join(SHARED_DIR, "dist"),
        format: "esm",
        target: "node",
        minify: false,
        splitting: false,
        sourcemap: "none",
    });

    if (!result.success) {
        console.error("❌ Bundle failed:");
        for (const log of result.logs) {
            console.error(log);
        }
        return false;
    }

    console.log("📦 Bundled src/ → dist/main.js");
    return true;
}

async function generateDeclarations(): Promise<boolean> {
    // Generate .d.ts files using tsc (via bunx for Bun compatibility)
    const tscResult = await $`bunx tsc --emitDeclarationOnly --declaration --outDir ${join(
        SHARED_DIR,
        "dist"
    )}`.quiet();

    if (tscResult.exitCode !== 0) {
        console.error("❌ Declaration generation failed:");
        console.error(tscResult.stderr.toString());
        return false;
    }

    console.log("📝 Generated TypeScript declarations → dist/*.d.ts");
    return true;
}

async function copyAssets(targetDir: string): Promise<void> {
    // Ensure target directory exists
    await $`mkdir -p ${targetDir}`;

    // Copy bundled JS
    const bundledFile = join(SHARED_DIR, "dist/main.js");
    const targetIndex = join(targetDir, "index.js");
    await Bun.write(targetIndex, Bun.file(bundledFile));

    // Copy declaration files
    const distDir = join(SHARED_DIR, "dist");
    const distFiles = await readdir(distDir);
    const dtsFiles = distFiles.filter((f) => f.endsWith(".d.ts"));

    for (const dtsFile of dtsFiles) {
        const srcPath = join(distDir, dtsFile);
        // Rename main.d.ts to index.d.ts, keep others as-is
        const destName = dtsFile === "main.d.ts" ? "index.d.ts" : dtsFile;
        const destPath = join(targetDir, destName);
        await Bun.write(destPath, Bun.file(srcPath));
    }

    // Copy asset directories
    for (const dir of ASSET_DIRS) {
        const srcDir = join(SHARED_DIR, dir);
        const destDir = join(targetDir, dir);

        // Remove existing and copy fresh
        await $`rm -rf ${destDir}`.quiet();
        await $`cp -r ${srcDir} ${destDir}`;
    }
}

async function syncAll(): Promise<void> {
    const start = performance.now();

    const bundleSuccess = await bundle();
    if (!bundleSuccess) return;

    const declSuccess = await generateDeclarations();
    if (!declSuccess) return;

    for (const target of TARGETS) {
        await copyAssets(target);
        const relativePath = relative(join(SHARED_DIR, ".."), target);
        console.log(`✅ Synced → ${relativePath}/`);
    }

    const duration = (performance.now() - start).toFixed(0);
    console.log(`⏱️  Done in ${duration}ms\n`);
}

function startWatcher(): void {
    console.log("👀 Watching for changes...\n");

    for (const dir of WATCH_DIRS) {
        const watchPath = join(SHARED_DIR, dir);

        watch(watchPath, { recursive: true }, async (event, filename) => {
            console.log(`🔄 ${event}: ${dir}/${filename}`);
            await syncAll();
        });
    }
}

// Main
async function main(): Promise<void> {
    const isWatch = process.argv.includes("--watch");

    console.log("🚀 @esm-roots/shared sync\n");

    // Initial sync
    await syncAll();

    if (isWatch) {
        startWatcher();
    }
}

main().catch(console.error);
