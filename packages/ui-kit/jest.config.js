module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/utils/testUtils.tsx'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
}
