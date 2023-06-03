module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-react': {
          runtime: 'automatic',
          importSource: '@emotion/react',
        },
      },
    ],
  ],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        alias: {
          '@': './src',
          '@web-ui': '../web-ui/src',
        },
      },
    ],
    '@emotion/babel-plugin',
  ],
}
