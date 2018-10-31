module.exports = {
  testEnvironment: 'jest-environment-node',
  moduleDirectories: ['node_modules', 'test/factories'],
  setupTestFrameworkScriptFile: '<rootDir>/test/setup.js',
  automock: false,
  clearMocks: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
