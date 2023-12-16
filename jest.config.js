module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/test/global/setupAfterEnv.js"],
  collectCoverageFrom: ["<rootDir>/src/**/*.js"],
  coveragePathIgnorePatterns: [
    "<rootDir>/src/docs",
    "<rootDir>/src/seeds",
    "<rootDir>/src/app.js",
    "<rootDir>/src/db.js",
    "<rootDir>/src/index.js",
    "<rootDir>/src/swaggerConfig.js",
  ],
  collectCoverage: true,
};
