// jest.config.js
module.exports = {
  transform: {
    "^.+\\.ts?$": ["@swc/jest"]
  },
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"]
};
