// src/main.ts
import path3 from "path";
import { fileURLToPath as fileURLToPath3 } from "url";

// src/constants.ts
var ORG_NAME = "Razmio";
var PROJECT_NAME = "root-config";
var LAYOUT_FILE = "single-spa-layout.html";
// src/ImportMapManager.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
var sharedDir = path.dirname(fileURLToPath(import.meta.url));
var readFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return content;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`File ${filePath} not found: ${reason}`);
  }
};

class ImportMapManager {
  options;
  FILES = {
    dev: path.join(sharedDir, "importmaps/importmap.dev.json"),
    local: path.join(sharedDir, "importmaps/importmap.local.json"),
    shared: path.join(sharedDir, "importmaps/importmap.shared.json"),
    prod: path.join(sharedDir, "importmaps/importmap.json")
  };
  constructor(options = { mode: "content" }) {
    this.options = options;
  }
  shared() {
    switch (this.options.mode) {
      case "content":
        return readFile(this.FILES.shared);
      case "path":
        return this.FILES.shared;
      default:
        throw new Error(`Unknown mode: ${this.options.mode}`);
    }
  }
  mfe(stage = "prod", port) {
    if (!Object.keys(this.FILES).includes(stage)) {
      throw new Error(`Invalid stage: ${stage}. Expect ${Object.keys(this.FILES).join("| ")}
`);
    }
    switch (this.options.mode) {
      case "content":
        const content = readFile(this.FILES[stage]);
        if (port)
          return this.overridePort(content, port);
        if (this.options.rootUrl)
          return this.overrideRootUrl(content, this.options.rootUrl);
        return content;
      case "path":
        if (port || this.options.rootUrl) {
          const content2 = readFile(this.FILES[stage]);
          if (port)
            fs.writeFileSync(this.FILES[stage], this.overridePort(content2, port));
          if (this.options.rootUrl)
            fs.writeFileSync(this.FILES[stage], this.overrideRootUrl(content2, this.options.rootUrl));
        }
        return this.FILES[stage];
      default:
        throw new Error(`Unknown mode: ${this.options.mode}`);
    }
  }
  overridePort(content, port) {
    const importmap = JSON.parse(content);
    importmap.imports[`@${ORG_NAME}/${PROJECT_NAME}`] = `http://localhost:${port}/${ORG_NAME}-${PROJECT_NAME}.js`;
    return JSON.stringify(importmap, null, 4);
  }
  overrideRootUrl(content, rootUrl) {
    const importmap = JSON.parse(content);
    importmap.imports[`@${ORG_NAME}/${PROJECT_NAME}`] = `${rootUrl}${ORG_NAME}-${PROJECT_NAME}.js`;
    return JSON.stringify(importmap, null, 4);
  }
}
// src/LayoutManager.ts
import fs2 from "fs";
import path2 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
var sharedDir2 = path2.dirname(fileURLToPath2(import.meta.url));
var readFile2 = (filePath) => {
  try {
    const content = fs2.readFileSync(filePath, "utf-8");
    return content;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`File ${filePath} not found: ${reason}`);
  }
};

class LayoutManager {
  mode;
  FILES = {
    apps: path2.join(sharedDir2, "templates/single-spa-layout.html"),
    root: path2.join(sharedDir2, "templates/main.ejs")
  };
  constructor(mode = "content") {
    this.mode = mode;
  }
  get(key) {
    switch (this.mode) {
      case "content":
        return readFile2(this.FILES[key]);
      case "path":
        return this.FILES[key];
      default:
        throw new Error(`Unknown mode: ${this.mode}`);
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
var devServer = (env) => ({
  hot: true,
  port: Number(env.PORT),
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
  PROJECT_NAME,
  ORG_NAME,
  LayoutManager,
  LAYOUT_FILE,
  ImportMapManager
};
