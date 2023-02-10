const path = require('path');


module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
    disableTelemetry: true,
  },
  // viteFinal(config) {
  //   config.resolve.alias['@'] = path.resolve(__dirname, '../src');

  //   // FIX hoisting https://github.com/eirslett/storybook-builder-vite/issues/55#issuecomment-871800293
  //   config.root = path.dirname(require.resolve('storybook-builder-vite'));
  //   config.server.fsServe = undefined;

  //   return {
  //     ...config,
  //     plugins: [
  //       ...config.plugins,
  //       // reactSvgPlugin({
  //       //   defaultExport: 'component',
  //       //   expandProps: 'start',
  //       //   svgo: true,
  //       // }),
  //     ],
  //     define: {
  //       ...config.define,
  //       'process.env': {},
  //       global: {},
  //     },
  //   };
  // },
}
