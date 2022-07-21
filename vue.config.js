const { defineConfig } = require("@vue/cli-service");
const { VantResolver } = require("unplugin-vue-components/resolvers");
const ComponentsPlugin = require("unplugin-vue-components/webpack");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/apicloud": {
        target: "https://d.app3c.cn/mcm/api/",
        changeOrigin: true,
        pathRewrite: {
          "^/apicloud": ""
        }
      }
    }
  },
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()]
      })
    ]
  }
});
