const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PreactRefreshPlugin = require('@prefresh/webpack');
const { HotModuleReplacementPlugin } = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (env, argv) => {
  const is_production = argv.mode === 'production';

  return {
    entry: {
      background: './src/background/main.ts',
      newtab: './src/newtab/app.tsx',
      popup: './src/popup/popup.tsx',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      plugins: [new TsconfigPathsPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: is_production
                    ? '[hash:base64:5]'
                    : '[name]__[local]--[hash:base64:5]',
                },
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      ...(!is_production
        ? [new HotModuleReplacementPlugin(), new PreactRefreshPlugin()]
        : []),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/manifest.json', to: 'manifest.json' },
          { from: 'src/icons', to: 'icons' },
          {
            from: 'src/content-scripts/get-token.js',
            to: 'content-scripts/get-token.js',
          },
          { from: 'src/newtab.html', to: 'newtab.html' },
          { from: 'src/detect-theme.js', to: 'detect-theme.js' },
          { from: 'src/options.html', to: 'options.html' },
          { from: 'src/options.js', to: 'options.js' },
          { from: 'src/popup.html', to: 'popup.html' }, 
        ],
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css', // Use [name] to output CSS files with chunk-specific names
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      port: 9000,
      hot: true,
    },
    optimization: {
      minimize: false,
    },
  };
};