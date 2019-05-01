const execa = require("execa");
const path = require("path");
const config = require("./config");
const { cwd } = require("./util");

module.exports = async function(opt) {
  opt = await config(opt);

  // Copy over defaults.
  await execa("babel", [
    path.join(__dirname, "..", "..", "pages"),
    "--out-dir",
    cwd(opt.outputDir, "node", opt.basePath)
  ]);

  // Then user code.
  await execa("babel", [
    cwd(opt.basePath),
    "--out-dir",
    cwd(opt.outputDir, "node", opt.basePath)
  ]);
};
