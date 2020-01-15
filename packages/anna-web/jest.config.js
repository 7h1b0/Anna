module.exports = {
  displayName: 'web',
  testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: ['node_modules'],
  modulePaths: ['<rootDir>/src/'],
  automock: false,
  clearMocks: true,
  errorOnDeprecated: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
};
