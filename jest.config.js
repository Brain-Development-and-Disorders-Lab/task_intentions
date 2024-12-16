// jest.config.js
/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  moduleNameMapper: {
    "\\.(css|scss)$": "<rootDir>/test/__mocks__/styles.js",
    "^src(.*)$": "<rootDir>/src$1",
    "^test(.*)$": "<rootDir>/test$1",
    "webr": require.resolve("webr"),
  },
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  testEnvironment: "./jest.environment.js",
  transformIgnorePatterns: ["/node_modules/(?!(webr))/"],
};
