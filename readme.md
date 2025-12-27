# Micro-Frontend Bundler Exploration

Comparing **Vite**, **Webpack**, and **Rspack** as bundlers for a [single-spa](https://single-spa.js.org/) micro-frontend architecture with React and ESM.

## Structure

```text
├── esm-roots/          # Root configs (orchestrators)
│   ├── vite/           # Vite root-config
│   ├── webpack/        # Webpack root-config
│   ├── rspack/         # Rspack root-config
│   └── shared/         # Shared configs, templates, importmaps
├── mfes/               # Micro-frontends
│   ├── vite/           # Vite MFE
│   └── webpack/        # Webpack MFE
└── bench/              # Benchmark tooling
```

## Quick Start

```bash
# 1. Build shared utilities first
cd esm-roots/shared && npm run build
```

## Running Locally

Pick a root config and run with the corresponding MFE(s).

### Roots

```bash
cd esm-roots/<bundler> && npm start      # Root: http://localhost:<port>
```

### MFEs

```bash
cd mfes/<bundler> && npm start # MFE: http://localhost:<port>
```

### Production Previews

```bash
cd mfes/<bundler> && npm run build && npm run preview       # MFE:  http://localhost:3001
cd esm-roots/<bundler> && npm run build && npm run preview  # Root: http://localhost:2999
```

## Benchmarks

Bnechmarks are run using [hyperfine](https://github.com/sharkdp/hyperfine) and cover devserver and build benchmarks. You can visualize the results in the `bench/results/dashboard/` directory.

```bash
cd bench && node benchmark.mjs
cd bench/results/dashboard && npm install && npm run dev
```

For more options, see `bench/benchmark.mjs` :

Options: `--bundler <vite|rspack|webpack>`, `--mode <dev|build>`, `--runs <n>`

Results saved to `bench/results/benchmarks.json` and visualized in `bench/results/dashboard/`.

---
