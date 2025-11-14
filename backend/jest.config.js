// jest.config.js

module.exports = {
  testEnvironment: "node",

  roots: ["<rootDir>/src"],

  setupFilesAfterEnv: ["<rootDir>/src/tests/setup/testSetup.js"],

  moduleDirectories: ["node_modules", "<rootDir>/src"],

  moduleNameMapper: {
    "^models/(.*)$": "<rootDir>/src/models/$1",
    "^services/(.*)$": "<rootDir>/src/services/$1",
    "^middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
    "^utils/(.*)$": "<rootDir>/src/utils/$1",
    "^config/(.*)$": "<rootDir>/src/config/$1",
  },

  testMatch: ["<rootDir>/src/tests/**/*.test.js", "<rootDir>/src/tests/**/*.spec.js"],

  collectCoverageFrom: [
    "src/**/*.js",
    "!src/tests/**/*.js",
    "!**/node_modules/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html", "json"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Transformações
  transform: {
    "^.+\\.js$": "babel-jest",
  },

  // Módulos a serem ignorados
  modulePathIgnorePatterns: ["<rootDir>/node_modules/"],

  // Timeout para testes (já está perfeito)
  testTimeout: 10000,

  // Verbose
  verbose: true,

  // Forçar saída após os testes
  forceExit: true,

  // Limpeza automática de mocks
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
}
