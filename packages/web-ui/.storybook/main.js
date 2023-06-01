const path = require('path')
const react = require('@vitejs/plugin-react')
import svgr from 'vite-plugin-svgr'

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
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
          plugins: [
            [
              '@emotion/babel-plugin',
              {
                labelFormat: '[filename]-[local]',
              },
            ],
          ],
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
            find: '@web-ui',
            replacement: path.resolve(__dirname, '../src'),
          },
        ],
      },
      // https://github.com/storybookjs/storybook/issues/18920
      define: {
        'process.env': {},
      },
    }
  },
  docs: {
    autodocs: true,
  },
}
