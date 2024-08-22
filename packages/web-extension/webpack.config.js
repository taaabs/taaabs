const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PreactRefreshPlugin = require('@prefresh/webpack')
const { HotModuleReplacementPlugin } = require('webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = (env, argv) => {
  const is_production = argv.mode === 'production'

  const plugins = [
    new MiniCssExtractPlugin({
      filename: '[name].css', // Use [name] to output CSS files with chunk-specific names
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/icons', to: 'icons' },
        { from: 'src/views/newtab/newtab.html', to: 'newtab.html' },
        { from: 'src/views/options/options.html', to: 'options.html' },
        { from: 'src/views/options/options.js', to: 'options.js' },
        { from: 'src/views/popup/popup.html', to: 'popup.html' },
      ],
    }),
    ...(!is_production
      ? [new HotModuleReplacementPlugin(), new PreactRefreshPlugin()]
      : []),
  ]

  if (is_production) {
    plugins.push(new CleanWebpackPlugin())
  }

  return {
    entry: {
      background: './src/background/main.ts',
      newtab: './src/views/newtab/app.tsx',
      popup: './src/views/popup/popup.tsx',
      'detect-theme': './src/helpers/detect-theme.ts',
      'get-auth-data-content-script':
        './src/content-scripts/get-auth-data-content-script.ts',
      'inject-popup-content-script':
        './src/content-scripts/inject-popup-content-script.ts',
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
      ],
    },
    plugins,
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
      hot: true,
    },
    optimization: {
      minimize: false,
    },
  }
}
