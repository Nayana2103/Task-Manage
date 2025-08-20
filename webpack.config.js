const webpack = require("webpack"); // to access built-in plugins
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      { test: /\.txt$/, use: "raw-loader" },
      { test: /\.html$/i, loader: "html-loader" },
      { test: /\.(js|jsx)$/, exclude: /node_modules/, use: ["babel-loader"] },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"], // Use @svgr/webpack for SVG handling
      },
      {
        test: /\.(png|jpg|gif|webp)$/, // Handle image files
        use: "file-loader",
      },
      {
        test: /\.(mp3|wav|ogg)$/, // Handle audio files
        use: "file-loader",
      },
      {
        test: /\.scss$/i, // Handle SCSS files
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  // plugins: [
  //   new webpack.IgnorePlugin({
  //     resourceRegExp: /\.(png|jpe?g|gif|woff2?|eot|ttf)$/i,
  //   }),
  // ],
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx'], // Add .jsx to the list of extensions
  },
};