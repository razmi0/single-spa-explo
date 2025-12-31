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
var FILES = {
  dev: path.join(sharedDir, "importmaps/importmap.dev.json"),
  local: path.join(sharedDir, "importmaps/importmap.local.json"),
  shared: path.join(sharedDir, "importmaps/importmap.shared.json"),
  prod: path.join(sharedDir, "importmaps/importmap.json")
};
var getImportMap = (type = "prod", options) => {
  const { retrievalMode = "content", rootUrl } = options ?? {};
  if (!Object.keys(FILES).includes(type)) {
    throw new Error(`Invalid key: ${type}. Expect ${Object.keys(FILES).join(" | ")}`);
  }
  switch (retrievalMode) {
    case "content":
      const content = readFile(FILES[type]);
      if (rootUrl) {
        return overrideRootUrl(content, rootUrl);
      }
      return content;
    case "path":
      if (rootUrl) {
        const content2 = readFile(FILES[type]);
        fs.writeFileSync(FILES[type], overrideRootUrl(content2, rootUrl));
      }
      return FILES[type];
    default:
      throw new Error(`Unknown retrievalMode: ${retrievalMode}`);
  }
};
var overrideRootUrl = (content, rootUrl) => {
  const importmap = JSON.parse(content);
  importmap.imports[`@${ORG_NAME}/${PROJECT_NAME}`] = new URL(`${ORG_NAME}-${PROJECT_NAME}.js`, rootUrl).href;
  return JSON.stringify(importmap, null, 4);
};
var ImportMapLoader_default = getImportMap;
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
var FILES2 = {
  apps: path2.join(sharedDir2, "templates/single-spa-layout.html"),
  root: path2.join(sharedDir2, "templates/main.ejs")
};
var getTemplate = (key, { retrievalMode = "content" } = {}) => {
  if (!Object.keys(FILES2).includes(key)) {
    throw new Error(`Invalid key: ${key}. Expect ${Object.keys(FILES2).join(" | ")}`);
  }
  switch (retrievalMode) {
    case "content":
      return readFile2(FILES2[key]);
    case "path":
      return FILES2[key];
    default:
      throw new Error(`Unknown retrievalMode: ${retrievalMode}`);
  }
};
var TemplateLoader_default = getTemplate;
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
  TemplateLoader_default as getTemplate,
  ImportMapLoader_default as getImportMap,
  devServer,
  copyPlugin,
  PROJECT_NAME,
  ORG_NAME,
  LAYOUT_FILE
};
