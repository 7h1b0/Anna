const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const cssnano = require('cssnano')({
  preset: [
    'default',
    {
      discardComments: {
        removeAll: true,
      },
    },
  ],
});
const tailwindcss = require('tailwindcss')();

module.exports = () => {
  const isProd = process.env.NODE_ENV === 'production';
  const plugins = isProd
    ? [
        new ManifestPlugin({
          seed: {
            short_name: 'Anna',
            name: 'Anna',
            background_color: '#1A202C',
            description: 'Home automation',
            orientation: 'portrait',
            display: 'standalone',
            theme_color: '#38B2AC',
            start_url: '.',
            icons: [
              {
                src: 'icon-192.png',
                type: 'image/png',
                sizes: '192x192',
                purpose: 'any',
              },
              {
                src: 'icon-512.png',
                type: 'image/png',
                sizes: '512x512',
                purpose: 'any',
              },
              {
                src: 'icon-maskable.png',
                type: 'image/png',
                sizes: '512x512',
                purpose: 'maskable',
              },
            ],
          },
        }),
      ]
    : [new ReactRefreshWebpackPlugin()];

  return {
    mode: isProd ? 'production' : 'development',
    entry: {
      app: ['./src', './src/styles.css'],
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      pathinfo: !isProd,
      publicPath: '/',
    },
    devtool: isProd ? false : 'source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            plugins: [!isProd && require.resolve('react-refresh/babel')].filter(
              Boolean,
            ),
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            { loader: 'css-loader', options: { importLoaders: 1 } },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [tailwindcss, ...(isProd ? [cssnano] : [])],
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      new CleanWebpackPlugin({ verbose: false }),
      new MiniCssExtractPlugin({
        filename: 'styles.[contenthash].css',
        chunkFilename: '[id].css',
        ignoreOrder: false,
      }),
      new CopyPlugin({
        patterns: [{ from: 'src/assets' }],
      }),
      ...plugins,
    ],
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      modules: ['node_modules', '.'],
    },
    performance: {
      hints: false,
    },
    devServer: {
      open: true,
      hot: true,
      contentBase: path.join(__dirname, 'src'),
      compress: true,
      historyApiFallback: true,
      noInfo: true,
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8181',
          secure: false,
        },
      },
    },
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
};
