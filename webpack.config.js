const path = require("path");
const fs = require("fs");
const WebpackHookPlugin = require("webpack-hook-plugin");
var nodeExternals = require("webpack-node-externals");
module.exports = {
   entry: {
      ngrokStart: "./ngrok/ngrokStart.js",
   },
   output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "..", "start-ngrok"),
   },
   mode: "production",
   // devtool: "inline-source-map",
   plugins: [
      new WebpackHookPlugin({
         onBuildStart: [`node webpack.onBuildStart.js`],
         onBuildEnd: [`node webpack.onBuildEnd.js`],
      }),
   ],
   //for nodejs
   target: "node", // use require() & use NodeJs CommonJS style
   // externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
   externalsPresets: {
      node: true, // in order to ignore built-in modules like path, fs, etc.
   },
};
