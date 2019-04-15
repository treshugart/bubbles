const path = require("path");

function cwd(...paths) {
  return path.join(process.cwd(), ...paths);
}

module.exports = { cwd };
