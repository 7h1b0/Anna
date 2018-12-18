module.exports = {
  testEnvironment: 'jest-environment-node',
  moduleDirectories: ['node_modules', 'test/factories'],
  // globalSetup: '<rootDir>/test/setupDatabase.js',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  automock: false,
  clearMocks: true,
  errorOnDeprecated: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
