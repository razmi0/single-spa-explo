# Important data about the project

It is a POC project and focus on comparing different bundlers for single-spa micro-frontends or roots-configs. Different technologies, preferably modern, should be used for the entire project with an accent on simplicity, homogenous cross repository setup on root side and mfes side. Experimental stuff is this project.

## Razmio ESM Roots and MFEs

### List of roots-config and mfes-config

**roots:** (./esm-roots)

- vite: "./esm-roots/vite"
- webpack: "./esm-roots/webpack"
- rspack: "./esm-roots/rspack"

**mfes:** (./mfes)

- vite: "./mfes/vite"
- webpack: "./mfes/webpack"
- navbar-vite: "./mfes/navbar"
- sidebar-rspack: "./mfes/sidebar"

### Special directory

**shared**: (./esm-roots/shared)
    - contains shared configs, templates, importmaps, functions, constants, types
    - it runs with Bun [package.json](./esm-roots/shared/package.json) and "sync", copy all content in each root's shared directory
    - you must changes code inside this [directory](./esm-roots/shared) because it is the source of truth for all roots.
