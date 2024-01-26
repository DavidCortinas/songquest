const path = require("path");
const webpack = require("webpack");

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "./static/js"),
      filename: "[name].js"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpe?g|svg|gif)$/i, // Add this rule for image files
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ]
    },
    optimization: {
      minimize: true
    },
    // Set environment variables based on build mode
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      }),
    ],
  };
};
