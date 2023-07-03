const apiConfig = require('./packages/api/jest.config')
const webUiConfig = require('./packages/web-ui/jest.config')
const repositoriesConfig = require('./packages/repositories/jest.config')

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
      ...repositoriesConfig,
    },
    {
      displayName: 'web-ui',
      rootDir: '<rootDir>/packages/web-ui',
      ...webUiConfig,
    },
  ],
}
