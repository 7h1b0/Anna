module.exports = {
  testEnvironment: 'jest-environment-node',
  moduleDirectories: ['node_modules', 'test', 'src'],
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
      branches: 75,
      functions: 75,
      lines: 75,
    },
  },
};
