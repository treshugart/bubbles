const cosmiconfig = require("cosmiconfig");
const decamelize = require("decamelize");
const path = require("path");
const recursiveReaddir = require("recursive-readdir");
const { cwd } = require("./util");

const defaults = {
  basePath: "pages",
  baseUrl: "",
  env: "development",
  outputDir: "dist",
  port: 3000,
  routes: [],
  urlSeparator: "-"
};

async function getDefaultRoutes(opt) {
  const base = cwd(opt.basePath);
  const dirs = await recursiveReaddir(base, ["_*", "__tests__"]);
  return dirs.map(file => {
    const relativePath = path.relative(base, file);
    const relativeBase = path.basename(relativePath);
    const relativeDirname = path.dirname(relativePath);
    const routePath =
      relativeBase.indexOf("index.") === 0
        ? relativeDirname === "."
          ? "/"
          : relativeDirname
        : relativePath;
    return {
      file: relativePath,
      path: decamelize(routePath, opt.urlSeparator)
    };
  });
}

module.exports = async function(opt) {
  opt = {
    ...defaults,
    ...((await cosmiconfig("afp").search()) || {}).config,
    ...opt
  };

  if (opt.routes.length === 0) {
    opt.routes = await getDefaultRoutes(opt);
  }

  return opt;
};
