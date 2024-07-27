/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.js'],
  moduleNameMapper: {
    '@shared/(.*)': '<rootDir>/../shared/src/$1',
    '@repositories/(.*)': '<rootDir>/../repositories/src/$1',
  },
}
