const Koa = require("koa");
const static = require("koa-static");
const range = require("koa-range");
const path = require("path");

const port = parseInt(process.env.PORT, 10) || 3000;
const server = new Koa();

server.use(async (ctx, next) => {
  ctx.res.statusCode = 200;
  await next();
});

server.use(range);

server.use(
  static(path.join(__dirname, "pdf"), {
    maxage: 30 * 24 * 60 * 60 * 1000,
    setHeaders: function (res) {
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Access-Control-Allow-Headers", "Range");
      res.setHeader("Access-Control-Expose-Headers", "Accept-Ranges");
    },
  })
);

server.use(
  static(path.join(__dirname, "demo"), {
    maxage: 30 * 24 * 60 * 60 * 1000,
  })
);

server.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`);
});
