const build = require("./build");
const { start } = require("..");

module.exports = async function(opt) {
  await build({ env: "production", ...opt });
  await start(opt);
};
