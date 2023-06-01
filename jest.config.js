const apiConfig = require('./packages/api/jest.config')
const uiKitConfig = require('./packages/web-ui/jest.config')

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
      displayName: 'ui',
      rootDir: '<rootDir>/packages/web-ui',
      ...uiKitConfig,
    },
  ],
}
