#!/usr/bin/env node

import { spawn, exec } from "child_process";
import { writeFileSync, readFileSync, mkdirSync, existsSync, unlinkSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = resolve(__dirname, "results/dashboard");
const BENCH_PORT = 4678;

// Bundler configurations
const bundlers = {
    vite: {
        name: "Vite",
        cwd: resolve(__dirname, "../esm-roots/vite"),
        devCommand: ["npm", ["run", "dev", "--", "--port", String(BENCH_PORT)]],
        buildCommand: "npm run build",
        // Pattern: "VITE v5.4.21  ready in 112 ms"
        readyPattern: /ready in (\d+)\s*ms/i,
    },
    rspack: {
        name: "Rspack",
        cwd: resolve(__dirname, "../esm-roots/rspack"),
        devCommand: ["npm", ["run", "serve", "--", "--env", `PORT=${BENCH_PORT}`]],
        buildCommand: "npm run build",
        // Pattern: "Rspack compiled successfully in 228 ms"
        readyPattern: /compiled successfully in (\d+)\s*ms/i,
    },
    webpack: {
        name: "Webpack",
        cwd: resolve(__dirname, "../esm-roots/webpack"),
        devCommand: ["npm", ["run", "serve", "--", "--env", `PORT=${BENCH_PORT}`]],
        buildCommand: "npm run build",
        // Pattern: "webpack 5.103.0 compiled successfully in 452 ms"
        readyPattern: /compiled successfully in (\d+)\s*ms/i,
    },
};

// Parse CLI arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        bundler: "all",
        mode: "all",
        runs: 5,
        warmup: 2,
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case "--bundler":
            case "-b":
                options.bundler = args[++i];
                break;
            case "--mode":
            case "-m":
                options.mode = args[++i];
                break;
            case "--runs":
            case "-r":
                options.runs = parseInt(args[++i], 10);
                break;
            case "--warmup":
            case "-w":
                options.warmup = parseInt(args[++i], 10);
                break;
            case "--help":
            case "-h":
                printHelp();
                process.exit(0);
        }
    }

    return options;
}

function printHelp() {
    console.log(`
Bundler Benchmark Tool

Usage: node benchmark.mjs [options]

Options:
  --bundler, -b <name>   Bundler to benchmark: vite, rspack, webpack, all (default: all)
  --mode, -m <mode>      Benchmark mode: dev, build, all (default: all)
  --runs, -r <number>    Number of benchmark runs (default: 5)
  --warmup, -w <number>  Number of warmup runs for builds (default: 2)
  --help, -h             Show this help message

Examples:
  node benchmark.mjs                        # Run all benchmarks
  node benchmark.mjs --bundler vite         # Benchmark only Vite
  node benchmark.mjs --mode dev             # Only dev server benchmarks
  node benchmark.mjs --bundler rspack -r 10 # 10 runs for Rspack
`);
}

// Benchmark dev server startup by parsing self-reported time
function benchmarkDevServer(bundlerKey, runs) {
    return new Promise((resolve) => {
        const bundler = bundlers[bundlerKey];
        const times = [];
        let currentRun = 0;

        console.log(`\n⚡ Dev Server Benchmark: ${bundler.name}`);
        console.log(`   Running ${runs} iterations...`);

        function runOnce() {
            if (currentRun >= runs) {
                resolve(times);
                return;
            }

            const [cmd, args] = bundler.devCommand;
            const proc = spawn(cmd, args, {
                cwd: bundler.cwd,
                shell: true,
                stdio: ["ignore", "pipe", "pipe"],
            });

            let output = "";
            let found = false;
            const delay = 10000;
            const timeout = setTimeout(() => {
                if (!found) {
                    console.log(`   Run ${currentRun + 1}: TIMEOUT (${delay / 1000}s)`);
                    proc.kill("SIGTERM");
                    currentRun++;
                    setTimeout(runOnce, 500);
                }
            }, delay);

            const handleData = (data) => {
                output += data.toString();

                const match = output.match(bundler.readyPattern);
                if (match && !found) {
                    found = true;
                    clearTimeout(timeout);

                    const timeMs = parseInt(match[1], 10);
                    times.push(timeMs);
                    console.log(`   Run ${currentRun + 1}: ${timeMs} ms`);

                    // Kill the server
                    proc.kill("SIGTERM");

                    currentRun++;
                    // Small delay before next run to ensure port is freed
                    setTimeout(runOnce, 1000);
                }
            };

            proc.stdout.on("data", handleData);
            proc.stderr.on("data", handleData);

            proc.on("error", (err) => {
                console.error(`   Run ${currentRun + 1}: ERROR - ${err.message}`);
                clearTimeout(timeout);
                currentRun++;
                setTimeout(runOnce, 500);
            });
        }

        runOnce();
    });
}

// Benchmark build using hyperfine
function benchmarkBuild(bundlerKey, runs, warmup) {
    return new Promise((resolve, reject) => {
        const bundler = bundlers[bundlerKey];
        const outputFile = `${RESULTS_DIR}/${bundlerKey}-build.json`;

        console.log(`\n📦 Build Benchmark: ${bundler.name}`);
        console.log(`   Running ${runs} iterations with ${warmup} warmup...`);

        const hyperfineCmd = `hyperfine --warmup ${warmup} --runs ${runs} --prepare 'rm -rf dist' '${bundler.buildCommand}' --export-json '${outputFile}'`;

        exec(hyperfineCmd, { cwd: bundler.cwd }, (error, stdout, stderr) => {
            if (error) {
                console.error(`   Build benchmark failed: ${error.message}`);
                reject(error);
                return;
            }

            // Parse hyperfine output for display
            try {
                const result = JSON.parse(readFileSync(outputFile, "utf-8"));
                const mean = result.results[0].mean;
                console.log(`   Mean: ${(mean * 1000).toFixed(0)} ms`);
            } catch (e) {
                console.log(stdout);
            }

            resolve(outputFile);
        });
    });
}

// Calculate statistics from times array
function calculateStats(times) {
    if (times.length === 0) return null;

    const sorted = [...times].sort((a, b) => a - b);
    const sum = times.reduce((a, b) => a + b, 0);
    const mean = sum / times.length;

    const squaredDiffs = times.map((t) => Math.pow(t - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / times.length;
    const stddev = Math.sqrt(variance);

    const median =
        sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];

    return {
        mean: mean / 1000, // Convert to seconds for consistency with hyperfine
        stddev: stddev / 1000,
        median: median / 1000,
        min: Math.min(...times) / 1000,
        max: Math.max(...times) / 1000,
        times: times.map((t) => t / 1000),
    };
}

const allResults = {};

// Save dev server results in hyperfine-compatible format
function saveDevResults(bundlerKey, times) {
    const stats = calculateStats(times);
    if (!stats) return null;

    const result = {
        command: `${bundlers[bundlerKey].name} dev server startup`,
        mean: stats.mean,
        stddev: stats.stddev,
        median: stats.median,
        min: stats.min,
        max: stats.max,
        times: stats.times,
        exit_codes: times.map(() => 0),
    };

    // Store for consolidated output
    allResults[`${bundlerKey}Dev`] = result;

    return result;
}

// Save build results from hyperfine output
function saveBuildResults(bundlerKey, outputFile) {
    try {
        const hyperfineResult = JSON.parse(readFileSync(outputFile, "utf-8"));
        const result = hyperfineResult.results[0];
        allResults[`${bundlerKey}Build`] = result;
        return result;
    } catch (e) {
        return null;
    }
}

// Save consolidated benchmarks.json
function saveConsolidatedResults() {
    const outputFile = `${RESULTS_DIR}/benchmarks.json`;
    writeFileSync(outputFile, JSON.stringify(allResults, null, 2));
    console.log(`\n📁 Consolidated results saved: ${outputFile}`);
}

// Clean up intermediate build JSON files
function cleanupIntermediateFiles() {
    for (const bundlerKey of Object.keys(bundlers)) {
        const file = `${RESULTS_DIR}/${bundlerKey}-build.json`;
        if (existsSync(file)) {
            unlinkSync(file);
        }
    }
}

// Main execution
async function main() {
    const options = parseArgs();

    // Ensure results directory exists
    if (!existsSync(RESULTS_DIR)) {
        mkdirSync(RESULTS_DIR, { recursive: true });
    }

    console.log("==========================================");
    console.log("📊 Bundler Benchmark Tool");
    console.log("==========================================");

    const bundlersToRun = options.bundler === "all" ? Object.keys(bundlers) : [options.bundler];

    for (const bundlerKey of bundlersToRun) {
        if (!bundlers[bundlerKey]) {
            console.error(`Unknown bundler: ${bundlerKey}`);
            continue;
        }

        console.log(`\n------------------------------------------`);
        console.log(`🔧 ${bundlers[bundlerKey].name}`);
        console.log(`------------------------------------------`);

        // Dev server benchmark
        if (options.mode === "all" || options.mode === "dev") {
            try {
                const times = await benchmarkDevServer(bundlerKey, options.runs);
                if (times.length > 0) {
                    const stats = calculateStats(times);
                    console.log(`   Mean: ${(stats.mean * 1000).toFixed(0)} ms`);
                    console.log(`   Stddev: ${(stats.stddev * 1000).toFixed(0)} ms`);
                    saveDevResults(bundlerKey, times);
                }
            } catch (err) {
                console.error(`   Dev benchmark failed: ${err.message}`);
            }
        }

        // Build benchmark
        if (options.mode === "all" || options.mode === "build") {
            try {
                const outputFile = await benchmarkBuild(bundlerKey, options.runs, options.warmup);
                saveBuildResults(bundlerKey, outputFile);
            } catch (err) {
                console.error(`   Build benchmark failed: ${err.message}`);
            }
        }
    }

    // Save consolidated results and clean up intermediate files
    saveConsolidatedResults();
    cleanupIntermediateFiles();

    console.log("\n==========================================");
    console.log("✅ Benchmarks complete!");
    console.log("==========================================");
}

main().catch(console.error);
