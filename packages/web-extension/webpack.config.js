const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  return {
    entry: {
      background: './src/background/main.js',
      ['new-tab']: './src/new-tab/index.tsx',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
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
                  localIdentName: isProduction
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
      !isProduction && new ReactRefreshWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/manifest.json', to: 'manifest.json' },
          { from: 'src/icons', to: 'icons' },
          {
            from: 'src/content-scripts/get-token.js',
            to: 'content-scripts/get-token.js',
          },
          { from: 'src/new-tab.html', to: 'new-tab.html' },
          { from: 'src/detect-theme.js', to: 'detect-theme.js' },
          { from: 'src/settings.html', to: 'settings.html' },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: 'style.css',
      }),
    ].filter(Boolean),
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
    },
    optimization: {
      minimize: isProduction,
    },
  }
}
