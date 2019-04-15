const build = require("./build");
const { start } = require("..");

module.exports = async function(opt) {
  await build({ env: "development", ...opt });
  await start(opt);
};
