const path = require('path');

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: path.join(__dirname, "./src/index.js"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              "@babel/plugin-transform-react-jsx",
              ["@babel/plugin-proposal-class-properties", { "loose": true }],
              "@babel/plugin-proposal-object-rest-spread"
            ]
          }
        }
      }
    ]
  }
};