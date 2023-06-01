module.exports = {
  presets: ['next/babel'],
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
    '@emotion',
    'inline-react-svg',
  ],
}
