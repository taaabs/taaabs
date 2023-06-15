/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/utils/testUtils.tsx'],
  moduleNameMapper: {
    '.svg': '<rootDir>/src/__mocks__/svg.ts',
    '.scss': '<rootDir>/src/__mocks__/scss.ts',
    '@web-ui/(.*)': '<rootDir>/src/$1',
  },
}
