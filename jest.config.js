const apiConfig = require('./packages/api/jest.config')
const uiKitConfig = require('./packages/ui-kit/jest.config')

module.exports = {
  verbose: true,
  projects: [
    {
      displayName: 'api',
      rootDir: '<rootDir>/packages/api',
      preset: 'ts-jest',
      ...apiConfig,
    },
    {
      displayName: 'repositories',
      rootDir: '<rootDir>/packages/repositories',
      preset: 'ts-jest',
      testEnvironment: 'node',
    },
    {
      displayName: 'ui-kit',
      rootDir: '<rootDir>/packages/ui-kit',
      ...uiKitConfig,
    },
  ],
}
