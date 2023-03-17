const path = require('path')
const react = require('@vitejs/plugin-react')
const svgr = require('vite-plugin-svgr')

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
    disableTelemetry: true,
  },
  viteFinal(config) {
    config.plugins = config.plugins.filter(
      (plugin) =>
        !(Array.isArray(plugin) && plugin[0]?.name.includes('vite:react')),
    )

    config.plugins.push(
      react({
        exclude: [/\.stories\.tsx?$/, /node_modules/],
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
    )

    config.plugins.push(
      svgr({
        svgrOptions: {},
      }),
    )

    return {
      ...config,
      resolve: {
        alias: [
          {
            find: '@',
            replacement: path.resolve(__dirname, '../src'),
          },
        ],
      },
    }
  },
}
