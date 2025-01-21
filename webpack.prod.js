const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = () => {
  return merge(common, {
    name: "production",
    mode: "production",
    target: ["web", "es5"],
    devtool: "inline-source-map",
  });
};
