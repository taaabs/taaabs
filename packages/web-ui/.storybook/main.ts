import type { StorybookConfig } from '@storybook/react-vite'
const path = require('path')
import svgr from 'vite-plugin-svgr'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal(config) {
    config.plugins?.push(
      svgr({
        exportAsDefault: true,
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
      css: {
        modules: {
          generateScopedName: '[name]---[local]---[hash:base64:5]',
        },
      },
    }
  },
  docs: {
    autodocs: true,
  },
}

export default config