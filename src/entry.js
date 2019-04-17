const fs = require("fs-extra");
const config = require("./config");
const { cwd } = require("./util");

const getClientEntry = opt => `
  import "@babel/polyfill";
  import navaid from "navaid";
  import React from "react";
  import { hydrate, render } from "react-dom";
  import App from "../${opt.basePath}/_app";

  const root = document.getElementById("app");
  const router = navaid();

  function handle(params) {
    return async function(Page) {
      Page = Page.default;
      const initialProps = Page.getInitialProps ? await Page.getInitialProps(params) : {};
      const content = <App><Page {...initialProps} /></App>;
      if (window.__hydrate) {
        window.__hydrate = false;
        hydrate(content, root);
      } else {
        render(content, root);
      }
    };
  }

  ${opt.routes.map(
    r => `
      router.on("${r.path}", ({ params }) => {
        import("../${opt.basePath}/${r.file}").then(handle(params));
      })
    `
  )}

  router.listen();
`;

const getServerEntry = opt => `
  ${opt.routes.map(
    r => `
      require("../${opt.basePath}/${r.file}");
    `
  )}
`;

const getUniversalEntry = opt => `
  if (typeof document === 'undefined') {
    require("./server-entry");
  } else {
    import("./client-entry").then(() => {});
  }
`;

module.exports = async function(opt) {
  opt = await config(opt);
  await fs.outputFile(
    cwd(opt.outputDir, "server-entry.js"),
    getServerEntry(opt)
  );
  await fs.outputFile(
    cwd(opt.outputDir, "client-entry.js"),
    getClientEntry(opt)
  );
};
