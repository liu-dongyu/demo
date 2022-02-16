const Koa = require("koa");
const next = require("next");
const static = require("koa-static");
const mount = require("koa-mount");
const range = require("koa-range");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

const staticOptions = {
  maxage: 30 * 24 * 60 * 60 * 1000,
  setHeaders: function (res) {
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Access-Control-Allow-Headers", "Range");
    res.setHeader("Access-Control-Expose-Headers", "Accept-Ranges");
    res.setHeader("Access-Control-Max-Age", "600");
    res.setHeader("Access-Control-Allow-Origin", "*");
  },
};

app.prepare().then(() => {
  const server = new Koa();

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.use(range);
  server.use(static("./pdf", staticOptions));
  server.use(mount("/pdf", static("./pdf", staticOptions)));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
