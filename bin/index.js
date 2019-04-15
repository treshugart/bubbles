#!/usr/bin/env node

const meow = require("meow");
const path = require("path");

const cli = meow(`
  Usage
    $ spa <command> <args>
  
  Commands:
    [none] Alias for \`dev\`.
     build Builds client and server code.
       dev Builds for development and runs a dev server.
      prod Builds for production and runs a production server.
`);

(async () => {
  try {
    const res = await require(path.join(__dirname, cli.input[0] || "default"))(
      cli.flags
    );
    if (res != null) {
      console.log(res);
    }
  } catch (e) {
    console.error(e);
  }
})();
