const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./example/components.web.jsx",
  output: {
    filename: "components.js",
    path: path.resolve(__dirname, "docs"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./example/template.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.web.jsx$/i,
        use: "babel-loader",
      },
      {
        test: /\.raw\.[a-z]+$/i,
        loader: "raw-loader",
      },
      {
        test: /\.file\.[a-z]+$/i,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
    ],
  },
};
