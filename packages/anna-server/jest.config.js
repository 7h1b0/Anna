module.exports = {
  displayName: 'server',
  testEnvironment: 'jest-environment-node',
  moduleDirectories: ['node_modules', 'test', 'src'],
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  transform: {
    '^.+\\.ts$': ['@swc/jest'],
  },
  automock: false,
  clearMocks: true,
  errorOnDeprecated: true,
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
