// src/main.ts
import path3 from "path";
import { fileURLToPath as fileURLToPath3 } from "url";

// src/constants.ts
var ORG_NAME = "Razmio";
var PROJECT_NAME = "root-config";
var LAYOUT_FILE = "single-spa-layout.html";
// src/ImportMapLoader.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
var sharedDir = path.dirname(fileURLToPath(import.meta.url));
var readFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`File ${filePath} not found: ${reason}`);
  }
};

class ImportMapLoader {
  FILES = {
    dev: path.join(sharedDir, "importmaps/importmap.dev.json"),
    local: path.join(sharedDir, "importmaps/importmap.local.json"),
    shared: path.join(sharedDir, "importmaps/importmap.shared.json"),
    prod: path.join(sharedDir, "importmaps/importmap.json")
  };
  options;
  constructor(options = { retrievalMode: "content", stage: "prod" }) {
    this.options = { stage: "prod", ...options };
  }
  get(key) {
    if (!Object.keys(this.FILES).includes(key)) {
      throw new Error(`Invalid key: ${key}. Expect ${Object.keys(this.FILES).join(" | ")}`);
    }
    switch (this.options.retrievalMode) {
      case "content":
        const content = readFile(this.FILES[key]);
        if (this.options.rootUrl) {
          return this.overrideRootUrl(content, this.options.rootUrl);
        }
        return content;
      case "path":
        if (this.options.rootUrl) {
          const content2 = readFile(this.FILES[key]);
          fs.writeFileSync(this.FILES[key], this.overrideRootUrl(content2, this.options.rootUrl));
        }
        return this.FILES[key];
      default:
        throw new Error(`Unknown retrievalMode: ${this.options.retrievalMode}`);
    }
  }
  shared() {
    return this.get("shared");
  }
  mfe() {
    return this.get(this.options.stage);
  }
  overrideRootUrl(content, rootUrl) {
    const importmap = JSON.parse(content);
    importmap.imports[`@${ORG_NAME}/${PROJECT_NAME}`] = new URL(`${ORG_NAME}-${PROJECT_NAME}.js`, rootUrl).href;
    return JSON.stringify(importmap, null, 4);
  }
}
// src/TemplateLoader.ts
import fs2 from "fs";
import path2 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
var sharedDir2 = path2.dirname(fileURLToPath2(import.meta.url));
var readFile2 = (filePath) => {
  try {
    return fs2.readFileSync(filePath, "utf-8");
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`File ${filePath} not found: ${reason}`);
  }
};

class TemplateLoader {
  FILES = {
    apps: path2.join(sharedDir2, "templates/single-spa-layout.html"),
    root: path2.join(sharedDir2, "templates/main.ejs")
  };
  options;
  constructor(options = { retrievalMode: "content" }) {
    this.options = options;
  }
  get(key) {
    switch (this.options.retrievalMode) {
      case "content":
        return readFile2(this.FILES[key]);
      case "path":
        return this.FILES[key];
      default:
        throw new Error(`Unknown retrievalMode: ${this.options.retrievalMode}`);
    }
  }
}
// src/main.ts
var sharedDir3 = path3.dirname(fileURLToPath3(import.meta.url));
var copyPlugin = (instance) => {
  return new instance({
    patterns: [
      { from: "importmaps/*", context: sharedDir3, to: "[name][ext]" },
      { from: "styles/index.css", context: sharedDir3, to: "shared.css" },
      { from: "templates/single-spa-layout.html", context: sharedDir3, to: "single-spa-layout.html" }
    ]
  });
};
var htmlPlugin = (tech, instance, templateParams) => {
  return new instance({
    inject: false,
    template: path3.join(sharedDir3, "templates/main.ejs"),
    templateParameters: {
      tech,
      projectName: PROJECT_NAME,
      orgName: ORG_NAME,
      ...templateParams
    }
  });
};
var devServer = (port) => ({
  hot: true,
  port: Number(port),
  setupMiddlewares: (middlewares, devServer2) => {
    if (!devServer2)
      return middlewares;
    devServer2.app.get(/\/importmap.*\.json$/, (_req, res, next) => {
      res.type("application/importmap+json");
      next();
    });
    return middlewares;
  }
});
var loadEnv = (dotenvConfig, mode) => {
  switch (mode) {
    case "dev":
      dotenvConfig({ path: `.env.dev`, override: true });
      break;
    case "prod":
      dotenvConfig({ path: `.env.prod`, override: true });
      break;
    case "shared":
      dotenvConfig({ path: `.env.dev`, override: true });
      break;
    case "local":
      dotenvConfig({ path: `.env.dev`, override: true });
      break;
    case "test":
      dotenvConfig({ path: `.env.test`, override: true });
      break;
    default:
      dotenvConfig();
      break;
  }
};
export {
  loadEnv,
  htmlPlugin,
  devServer,
  copyPlugin,
  TemplateLoader,
  PROJECT_NAME,
  ORG_NAME,
  LAYOUT_FILE,
  ImportMapLoader
};
