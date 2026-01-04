# Bundler Benchmarks

Benchmarks for comparing Vite, Rspack, and Webpack performance.

# ESM Roots Statistics

Comparison of package counts and bundle sizes across different bundler implementations.

## Package Counts

| Root | Direct Dependencies | Total Installed Packages |
|------|---------------------|--------------------------|
| **Vite** | 17 | 228 |
| **Rspack** | 12 | 816 |
| **Webpack** | 20 | 881 |

## Direct Dependencies Breakdown

### Vite (`esm-roots/vite`)

- **devDependencies**: 13
- **dependencies**: 4

### Rspack (`esm-roots/rspack`)

- **devDependencies**: 10
- **dependencies**: 2

### Webpack (`esm-roots/webpack`)

- **devDependencies**: 18
- **dependencies**: 2

## How It Works

### Dev Server Benchmarks

Parses the **self-reported startup time** from each bundler's output:

- Vite: `VITE v5.4.21 ready in 112 ms`
- Rspack: `Rspack compiled successfully in 228 ms`
- Webpack: `webpack 5.103.0 compiled successfully in 452 ms`

### Build Benchmarks

Uses [hyperfine](https://github.com/sharkdp/hyperfine) for accurate external timing of production builds.

## Prerequisites

```bash
brew install hyperfine
```

## Usage

```bash
# Run all benchmarks for all bundlers
node bench/benchmark.mjs

# Run specific bundler
node bench/benchmark.mjs --bundler vite
node bench/benchmark.mjs --bundler rspack
node bench/benchmark.mjs --bundler webpack

# Run specific benchmark mode
node bench/benchmark.mjs --mode dev      # Only dev server benchmarks
node bench/benchmark.mjs --mode build    # Only build benchmarks

# Customize number of runs
node bench/benchmark.mjs --runs 10

# Combine options
node bench/benchmark.mjs --bundler vite --mode dev --runs 10
```

## CLI Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--bundler` | `-b` | Bundler to benchmark: `vite`, `rspack`, `webpack`, `all` | `all` |
| `--mode` | `-m` | Benchmark mode: `dev`, `build`, `all` | `all` |
| `--runs` | `-r` | Number of benchmark runs | `5` |
| `--warmup` | `-w` | Warmup runs for builds | `2` |
| `--help` | `-h` | Show help message | - |

## Results

Benchmark results are saved to `bench/results/dashboard/benchmarks.json` as a consolidated JSON file containing all benchmark data for all bundlers.

The benchmark script saves intermediate build JSON files temporarily but cleans them up after consolidating the results.

## Dashboard

View results visually:

```bash
cd bench/dashboard
npm install
npm run dev
```

Open <http://localhost:5173> to see the benchmark dashboard.

The dashboard reads benchmark data from `bench/results/dashboard/benchmarks.json`.
