module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: [
    '.eslintrc.js',
    'jest.config.js',
    'packages/web-client/src/misc/bookmarklet.js',
    'packages/web-client/src/misc/theme-setter.js',
  ],
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'no-unused-vars': 'off',
    '@typescript-eslint/explicit-member-accessibility': [
      'warn',
      {
        accessibility: 'explicit',
        overrides: {
          constructors: 'no-public',
        },
      },
    ],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['snake_case'],
        leadingUnderscore: 'require',
      },
      {
        selector: 'function',
        modifiers: ['exported'],
        format: ['snake_case'],
        leadingUnderscore: 'forbid',
      },
    ],
  },
}
