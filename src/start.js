const Koa = require("koa");
const KoaRouter = require("koa-router");
const koaStatic = require("koa-static");
const { createElement } = require("react");
const { renderToString } = require("react-dom/server");
const config = require("./config");
const { cwd } = require("./util");

async function getInitialProps(Comp, ctx) {
  return Comp.getInitialProps ? await Comp.getInitialProps(ctx) : {};
}

async function handleRoute(ctx, next, opt, route) {
  const requirePath = `${opt.outputDir}/node/${opt.basePath}`;
  const App = require(`../${requirePath}/_app`).default;
  const Doc = require(`../${requirePath}/_doc`).default;
  const Page = require(cwd(opt.outputDir, "node", opt.basePath, route.file))
    .default;

  if (!Page) {
    throw new Error(`Could not handle route for "${route.page}".`);
  }

  const initialProps = await getInitialProps(Page, ctx);
  const documentString = renderToString(
    createElement(Doc, {
      children: createElement(App, {
        children: createElement(Page, initialProps)
      })
    })
  );

  ctx.body = `<!DOCTYPE html>${documentString}`;
}

module.exports = async opt => {
  opt = await config(opt);
  const app = new Koa();
  const router = new KoaRouter({
    prefix: opt.baseUrl
  });

  for (const route of opt.routes) {
    router.get(route.path, async (ctx, next) => {
      await handleRoute(ctx, next, opt, route);
    });
  }

  app.use(router.routes());
  app.use(koaStatic(cwd(opt.outputDir)));

  if (opt.port) {
    app.listen(opt.port);
  }

  console.log(`Listening on ${opt.port}`);
};
