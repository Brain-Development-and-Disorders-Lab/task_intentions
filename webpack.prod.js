const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = () => {
  return merge(common, {
    name: "production",
    mode: "production",
    target: ["web", "es5"],
    devtool: "inline-source-map",
    plugins: [
      new CopyPlugin({
        patterns: [{ from: "data" }],
      }),
    ],
  });
};
