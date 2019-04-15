const config = require("./config");
const Parcel = require("parcel-bundler");
const { cwd } = require("./util");

module.exports = async function(opt) {
  opt = await config(opt);
  const parcel = new Parcel(cwd(opt.outputDir, "entry.js"), {
    outFile: cwd(opt.outputDir, "index.js")
  });
  await parcel.bundle();
};
