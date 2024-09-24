const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { HotModuleReplacementPlugin } = require('webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { ProvidePlugin } = require('webpack')

module.exports = (_, argv) => {
  const is_production = argv.mode == 'production'

  const plugins = [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    // Fixes error "process is not defined" when importing UI component which imports next/link like @web-ui/Button
    new ProvidePlugin({
      process: 'process/browser',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/icons', to: 'icons' },
        { from: 'src/views/newtab/newtab.html', to: 'newtab.html' },
        { from: 'src/views/newtab/load-newtab.js', to: 'load-newtab.js' },
        { from: 'src/views/options/options.html', to: 'options.html' },
        {
          from: 'src/views/floating-button/floating-button.html',
          to: 'floating-button.html',
        },
        {
          from: 'src/views/floating-button/floating-button.css',
          to: 'floating-button.css',
        },
        { from: 'src/views/popup/popup.html', to: 'popup.html' },
      ],
    }),
    ...(!is_production
      ? [new ReactRefreshWebpackPlugin(), new HotModuleReplacementPlugin()]
      : []),
  ]

  if (is_production) {
    plugins.push(new CleanWebpackPlugin())
  }

  return {
    entry: {
      background: './src/background/main.ts',
      'detect-theme': './src/views/newtab/detect-theme.ts',
      options: './src/views/options/options.ts',
      newtab: './src/views/newtab/newtab.tsx',
      popup: './src/views/popup/popup.tsx',
      'get-auth-data-content-script':
        './src/content-scripts/get-auth-data-content-script.ts',
      'get-theme-content-script':
        './src/content-scripts/get-theme-content-script.ts',
      'inject-floating-button-content-script':
        './src/content-scripts/inject-floating-button-content-script.ts',
      'inject-popup-content-script':
        './src/content-scripts/inject-popup-content-script.ts',
      'send-chatbot-prompt-content-script':
        './src/content-scripts/send-chatbot-prompt-content-script.ts',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
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
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: ['@svgr/webpack'],
        },
      ],
    },
    plugins,
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
    },
    optimization: {
      minimize: false,
    },
    // cache: {
    //   type: 'filesystem',
    //   buildDependencies: {
    //     config: [__filename], // This makes all dependencies of this file - build dependencies
    //   },
    // },
  }
}
