const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './index.ts',
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.js', '.ts'],
    modules: ['node_modules', './src'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
  externals: [
    (context, request, callback) => {
      if (/(express|knex)$/.test(request)) {
        return callback(null, `commonjs ${request}`);
      }
      return callback();
    },
  ],
  plugins: [new CleanWebpackPlugin({ verbose: false })],
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
