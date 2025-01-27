const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = () => {
  return merge(common, {
    name: "development",
    mode: "development",
    target: "web",
    devtool: "inline-source-map",
    devServer: {
      static: [path.join(__dirname, "data")],
      hot: true,
    },
  });
};
