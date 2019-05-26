module.exports = {
  testEnvironment: 'jest-environment-node',
  moduleDirectories: ['node_modules', 'test', 'src'],
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
