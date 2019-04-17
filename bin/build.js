const { clean, client, config, entry, server } = require("..");

module.exports = async function(opt) {
  opt = await config(opt);
  process.env.NODE_ENV = opt.env;
  await clean(opt);
  await entry(opt);
  await Promise.all([client(opt), server(opt)]);
};
