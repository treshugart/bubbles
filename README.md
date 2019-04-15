# Bubbles

> A React SSR SPA framework built on top of Parcel.

Current features:

- 📦 Builds via Parcel.
- ⚾ Pre-fetch using a _non-blocking_ `getInitialProps()` on the client.
- 🖥️ Server uses [`koa`](https://github.com/koajs/koa) and [`koa-router`](https://github.com/ZijianHe/koa-router).
- 👤 Client router uses [`navaid`](https://github.com/lukeed/navaid).
- 📄 Auto-generated routes from `./pages` _or_ custom parameterized routing (see "Configuring").

Future plans:

- Use Parcel to build the server files (currently uses Babel) to get seamless universal features (like `.mdx` in SSR mode).
- Hot-reloading / watching. Will come with full Parcel support.
- Implement [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp) when matching routes.
- Monorepo / workspaces support.
- Custom route handlers (for redirects, 404s etc at the routing level).

## Installing

**_This is currently under development and isn't installable via NPM yet._**

You can install it as a local package by cloning the repo and running `npm i ../path-to-clone` from another directory.

## Using

**_Since this isn't published yet, you're must install as a local package or by running the pages contained in the repo itself, for now._**

To run the local pages run `node ./bin`. If you've installed it locally, you can run it via `bubbles` for now.

## Configuring

We use [`cosmiconfig`](https://github.com/davidtheclark/cosmiconfig) for configuration which means you can use any sort of configuration that it supports.

- `basePath` - The base path where all pages are located. Defaults to `"pages"`.
- `baseUrl` - The base URL used for route matching. Defaults to `""`.
- `env` - The environment to use for building. Defaults to `development`.
- `outputDir` - The directory where build artifacts are output. Defaults to `dist`.
- `port` - The port to run the server on. Defaults to `3000`.
- `routes` - Custom routes. If none are specified, routes are automatically genreated from the files in the `basePath`. Defaults to `[]`.
- `urlSeparator` - When generating routes from the `basePath`, this is used when `decamelizing` from the file path relative to `basePath`. Defaults to `"-"`.

### Pages

Pages are modules that export a `default` class that handles the route it corresponds to. Pages can have a `static getInitialProps()` method that does data-prefetching, just like in NextJS.

_It is different from NextJS in that it will not block rendering until it resolves when client-side-rendering. Instead, it will render with `static defaultProps` and then re-render when `getInitialProps` resolves. This makes using loading states much simpler and not require any manual hanlding / rendering in lifecycles. When rendering on the server, `getInitialProps` is awaited and rendered once it resolves._

Here's a sample page:

```js
import React from "react";

export default class extends React.Component {
  static async getInitialProps() {
    return new Promise(res => {
      // Simulates a fetch.
      setTimeout(() => {
        res({ name: "You" });
      }, 1000);
    });
  }
  static get defaultProps() {
    // Could be empty and you could display "Loading..." instead, if you
    // wanted to.
    return { name: "World" };
  }
  render() {
    return <>Hello, {this.props.name}!</>;
  }
}
```

### Automatic routing

When routes are automatically genreated from the `basePath`, the file paths go through a transformation:

1. The complete path, including `basePath` is stripped from the file name.
2. The suffix is removed.
3. The path is decamelized using [`decamelize`](https://github.com/sindresorhus/decamelize) and `urlSeparator` is used as the `separator` argument.
4. If `index` is the last part of the path, it is removed.

Here are some examples of how things are transformed with a `basePath` of `pages` and a `urlSeparator` of `-`:

- `/my-project/pages/index.js` -> `/`
- `/my-project/pages/user/register.js` -> `user/register`
- `/my-project/pages/user/register/Index.js` -> `user/register`
- `/my-project/pages/User/LogIn.js` -> `user/log-in`

### Custom routing

When specifying custom routes, each route has the following schema:

- `file` - The path, relative to the `basePath`, of the file that handles the route.
- `path` - The URL path that matches the route.
