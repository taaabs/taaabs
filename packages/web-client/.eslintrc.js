module.exports = {
  extends: 'next/core-web-vitals',
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  root: true,
  ignorePatterns: ['.eslintrc.js', 'next.config.js'],
}
