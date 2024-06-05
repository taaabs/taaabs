const web_ui_config = require('./packages/web-ui/jest.config')
const web_client_config = require('./packages/web-client/jest.config')
const repositories_config = require('./packages/repositories/jest.config')

module.exports = {
  verbose: true,
  projects: [
    {
      displayName: 'repositories',
      rootDir: '<rootDir>/packages/repositories',
      preset: 'ts-jest',
      testEnvironment: 'node',
      ...repositories_config,
    },
    {
      displayName: 'shared',
      rootDir: '<rootDir>/packages/shared',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
    },
    {
      displayName: 'web-client',
      rootDir: '<rootDir>/packages/web-client',
      ...web_client_config,
    },
    {
      displayName: 'web-ui',
      rootDir: '<rootDir>/packages/web-ui',
      ...web_ui_config,
    },
  ],
}
