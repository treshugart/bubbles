const fs = require("fs-extra");
const config = require("./config");
const { cwd } = require("./util");

module.exports = async function(opt) {
  opt = await config(opt);
  await fs.outputFile(
    cwd(opt.outputDir, "entry.js"),
    `
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
    `
  );
};
