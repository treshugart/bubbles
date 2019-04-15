const fs = require("fs-extra");
const config = require("./config");
const { cwd } = require("./util");

module.exports = async function(opt) {
  opt = await config(opt);
  await fs.remove(cwd(opt.outputDir));
};
