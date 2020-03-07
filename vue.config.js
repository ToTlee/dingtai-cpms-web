const config = require("./src/config/config");

module.exports = {
  transpileDependencies: ["vue-echarts", "resize-detector"],
  publicPath: "./",
  outputDir: "dingtai",
  productionSourceMap: false,
  devServer: {
    port: 8080,
    proxy: {
      [config.URL_ROOT]: {
        target: config.PROD_URL,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/admin": ""
        }
      }
    }
  }
};
