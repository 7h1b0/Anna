const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  entry: './index.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  externals: [nodeExternals()],
  plugins: [new CleanWebpackPlugin(path.join(__dirname, 'dist'))],
  bail: true,
  node: false,
  stats: {
    assets: true,
    cached: false,
    chunks: false,
    children: false,
    modules: false,
    hash: false,
    version: true,
    timings: true,
    warnings: true,
    errors: true,
    errorDetails: true,
    builtAt: false,
    entrypoints: false,
  },
};
