module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  ignorePatterns: [
    '.eslintrc.js',
    'gulpfile.js',
    'jest.config.js',
    'webpack.*.js',
    'node_modules/',
    '*.d.ts',
  ],
  extends: [
    'eslint:recommended',
    'google',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-namespace': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
