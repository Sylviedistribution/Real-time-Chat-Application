module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/tests/env.setup.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/db.setup.js"],
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  collectCoverageFrom: ["src/**/*.js", "!src/server.js", "!src/config/**"],
  testTimeout: 30000,
};