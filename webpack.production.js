const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = () => {
  return {
    name: "production",
    mode: "production",
    target: ["web", "es5"],
    entry: {
      index: "./src/index.tsx",
    },
    devtool: "inline-source-map",
    plugins: [
      new HtmlWebpackPlugin({
        title: "Intentions Game",
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-typescript",
                "@babel/preset-react",
                "@babel/preset-env",
              ],
            },
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.html$/,
          loader: "html-loader",
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
        {
          test: /\.csv$/,
          loader: "csv-loader",
          options: {
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true,
          },
        },
      ],
    },
    resolve: {
      modules: [
        path.resolve(__dirname, "./"),
        path.resolve(__dirname, "node_modules"),
      ],
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
  };
};
