const proxy = require("http-proxy-middleware");


module.exports = function(app) {
  let apiUrl = process.env.API_URL || "http://0.0.0.0:8080";

  app.use(proxy("/api", {
    target: apiUrl,
    ws: false,
    pathRewrite: {
      '^/api': '/'
    }
  }));
};
