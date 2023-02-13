const uiKitConfig = require('./packages/ui-kit/jest.config')

module.exports = {
  verbose: true,
  projects: [
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
