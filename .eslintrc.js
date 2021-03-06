module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks', 'jsx-a11y'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  settings: {
    react: {
      version: '16.8',
    },
  },
  env: {
    browser: true,
    jest: true,
    es6: true,
    node: true,
  },
  rules: {
    'react/prop-types': 'off',
    'react/no-unknown-property': 'off', // prevents error with class vs className
    'jsx-a11y/no-onchange': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
};
