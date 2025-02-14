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
        { from: 'src/views/options/options.html', to: 'options.html' },
        { from: 'src/views/popup/index.html', to: 'popup.html' },
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
      options: './src/views/options/options.ts',
      popup: './src/views/popup/App.tsx',
      'get-auth-data-content-script':
        './src/content-scripts/get-auth-data-content-script.ts',
      'get-favicon-content-script':
        './src/content-scripts/get-favicon-content-script.ts',
      'get-cover-content-script':
        './src/content-scripts/get-cover-content-script.ts',
      'send-prompt-content-script':
        './src/content-scripts/send-prompt-content-script.ts',
      'get-parsed-html-content-script':
        './src/content-scripts/get-parsed-html-content-script.ts',
      'get-upsert-bookmark-params-content-script':
        './src/content-scripts/get-upsert-bookmark-params-content-script.ts',
      'get-window-dimensions-content-script':
        './src/content-scripts/get-window-dimensions-content-script.ts',
      'get-selected-text-content-script':
        './src/content-scripts/get-selected-text-content-script.ts',
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
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.scss$/,
          exclude: /style\.scss$/,
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
          test: /style\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
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
      // minimize: false,
    },
    // cache: {
    //   type: 'filesystem',
    //   buildDependencies: {
    //     config: [__filename], // This makes all dependencies of this file - build dependencies
    //   },
    // },
  }
}
