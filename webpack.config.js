const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

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
        include: [path.resolve(__dirname, 'node_modules/')],
      },
    ],
  },
  externals: [
    (context, request, callback) => {
      if (/(express|knex|got)$/.test(request)) {
        return callback(null, `commonjs ${request}`);
      }
      return callback();
    },
  ],
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
    version: false,
    timings: true,
    warnings: true,
    errors: true,
    errorDetails: true,
    builtAt: false,
    entrypoints: false,
  },
};
