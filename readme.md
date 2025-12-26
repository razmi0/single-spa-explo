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
# Build shared utilities
cd esm-roots/shared && npm run build

# Run any root + MFE combo (e.g., Webpack)
cd esm-roots/webpack && npm run serve   # Port 2999
cd mfes/webpack && npm start            # Port 3001
```

## Benchmarks

```bash
cd bench && node benchmark.mjs
```

Options: `--bundler <vite|rspack|webpack>`, `--mode <dev|build>`, `--runs <n>`

Results saved to `bench/results/benchmarks.json` and visualized in `bench/results/dashboard/`.

## Related

[Full implementation without Webpack root](https://github.com/razmi0/vite-singlespa-react-esm-poc)
