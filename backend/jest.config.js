// jest.config.js

module.exports = {
  // Ambiente de teste
  testEnvironment: "node",

  // ✅ CORRIGIDO: O Jest deve procurar por arquivos apenas dentro de 'src'.
  roots: ["<rootDir>/src"],

  // ✅ MANTIDO: Este caminho agora está correto e consistente com o resto do arquivo.
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup/testSetup.js"],

  // Adiciona 'src' como um diretório de módulos para imports limpos
  moduleDirectories: ["node_modules", "<rootDir>/src"],

  moduleNameMapper: {
    "^models/(.*)$": "<rootDir>/src/models/$1",
    "^services/(.*)$": "<rootDir>/src/services/$1",
    "^middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
    "^utils/(.*)$": "<rootDir>/src/utils/$1",
    "^config/(.*)$": "<rootDir>/src/config/$1",
  },

  // ✅ CORRIGIDO: Padrão ajustado para encontrar testes dentro de 'src/tests'.
  testMatch: ["<rootDir>/src/tests/**/*.test.js", "<rootDir>/src/tests/**/*.spec.js"],

  // Cobertura de código (já está perfeito)
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/tests/**/*.js", // Ignora todos os arquivos dentro da pasta de testes
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

  // Forçar saída (CUIDADO: use apenas se souber o motivo, pode mascarar handles abertos)
  forceExit: true,

  // Limpeza automática de mocks (já está perfeito)
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
}
