import type { StorybookConfig } from '@storybook/react-vite'
const path = require('path')
import svgr from 'vite-plugin-svgr'
const crypto = require('crypto')

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  addons: ['@storybook/addon-controls'],
  staticDirs: ['../../web-client/public'],
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
          {
            find: '@shared',
            replacement: path.resolve(__dirname, '../../shared/src'),
          },
        ],
      },
      // https://github.com/storybookjs/storybook/issues/18920
      define: {
        'process.env': {},
      },
      css: {
        modules: {
          generateScopedName: (name, filename) => {
            const isModule = /\.module\.(scss|css)$/i.test(filename)
            if (isModule) {
              const moduleName = path
                .basename(filename)
                .replace(/\.module\.(scss|css)$/i, '')

              // Generate a hash based on the filename and class name
              const hash = crypto
                .createHash('md5')
                .update(`${filename}${name}`)
                .digest('hex')
                .substring(0, 5)

              return `${moduleName}__${name}__${hash}`
            }
            return name
          },
        },
        preprocessorOptions: {
          scss: {
            additionalData: `@use "${path.resolve(
              __dirname,
              '../src/styles/foundation',
            )}" as *;`,
          },
        },
      },
    }
  },
}

export default config
