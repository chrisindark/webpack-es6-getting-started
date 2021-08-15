const path = require("path");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const Dotenv = require("dotenv-webpack");

const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = function (env, argv) {
  let NODE_ENV = (env && env.NODE_ENV) || argv.mode;
  console.log(NODE_ENV);

  // Build and export the build configuration.
  return {
    // https://webpack.js.org/configuration/target
    target: "web",
    // https://webpack.js.org/configuration/entry-context
    entry: {
      main: path.resolve(__dirname, "src/index.jsx"),
    },
    // https://webpack.js.org/configuration/output
    output: {
      filename: "js/[id].[contenthash].js",
      path: path.resolve(__dirname, "build/"),
      publicPath: "/",
      sourceMapFilename: "js/[id].[contenthash].map",
      chunkFilename: "js/[id].[contenthash].js",
    },
    // https://webpack.js.org/configuration/resolve
    resolve: {
      alias: {},
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css"],
      modules: ["node_modules"],
    },
    // https://webpack.js.org/configuration/module
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: [
            {
              // https://github.com/babel/babel-loader
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-typescript", "@babel/preset-env"],
                plugins: [
                  "dynamic-import-webpack",
                  "@babel/plugin-syntax-dynamic-import",
                  "@babel/plugin-proposal-class-properties",
                  "@babel/plugin-proposal-object-rest-spread",
                  "@babel/plugin-transform-react-jsx",
                  "@babel/plugin-transform-runtime",
                  "@babel/plugin-transform-modules-commonjs",
                ],
              },
            },
            {
              loader: "eslint-loader",
            },
          ],
        },
        {
          test: /(\.scss|\.css|\.less)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              // https://github.com/webpack-contrib/css-loader
              loader: "css-loader",
            },
            {
              loader: "less-loader",
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          // https://github.com/webpack/file-loader
          test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot)$/,
          loader: "file-loader",
        },
      ],
    },
    // https://webpack.js.org/configuration/plugins
    plugins: [
      new BundleAnalyzerPlugin(),
      new Dotenv({
        path: `./.${NODE_ENV}.env`,
      }),
      new ProgressBarPlugin(),
      // https://github.com/johnagan/clean-webpack-plugin
      new CleanWebpackPlugin(),
      // https://webpack.js.org/plugins/define-plugin
      new WebpackManifestPlugin({
        fileName: "asset-manifest.json",
      }),
      new MiniCssExtractPlugin({
        filename: "css/[id].[contenthash].css",
        chunkFilename: "css/[id].[contenthash].css",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "public/*"),
            globOptions: {
              ignore: ["**/index.html"],
            },
            context: "./public/",
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public/index.html"),
      }),
    ].concat(),
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: "vendor",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
          },
          common: {
            test: /[\\/]src[\\/]components[\\/]/,
            chunks: "all",
            minSize: 0,
          },
        },
      },
      // prints more readable module names in the browser console on HMR updates
      minimize: true,
      // NamedModulesPlugin
      namedModules: true,
      namedChunks: true,
      // NoEmitOnErrorsPlugin
      noEmitOnErrors: true,
      // ModuleConcatenationPlugin
      concatenateModules: true,
    },
    externals: {
      // react: "React",
      // "react-dom": "ReactDOM",
      // "react-router-dom": "ReactRouterDOM",
      // antd: "antd",
    },
    stats: "errors-only",
    // https://webpack.js.org/configuration/devtool
    devtool: "source-map",
  };
};
