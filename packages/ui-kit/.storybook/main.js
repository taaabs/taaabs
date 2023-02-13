const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
    disableTelemetry: true,
  },
  viteFinal(config, { configType }) {
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
