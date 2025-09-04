module.exports = {
  // Ambiente de teste
  testEnvironment: 'node',

  // Diretórios raiz
  roots: ['<rootDir>/src', '<rootDir>/tests'],

  // Arquivos de setup
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.js',
    '<rootDir>/__tests__/setup/testSetup.js'
  ],

  // Padrões de arquivos de teste
  testMatch: [
    '**/__tests__/**/*.js',
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.js',
    'services/**/*.js',
    'middlewares/**/*.js',
    'routes/**/*.js',
    '!src/**/*.test.js',
    '!src/app.js',
    '!**/node_modules/**',
    '!**/__tests__/**'
  ],

  // Diretório de cobertura
  coverageDirectory: 'coverage',

  // Relatórios de cobertura
  coverageReporters: ['text', 'lcov', 'html', 'json'],

  // Limite mínimo de cobertura
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Transformações
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // Módulos a serem ignorados
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],

  // Timeout para testes
  testTimeout: 10000,

  // Verbose
  verbose: true,

  // Forçar saída
  forceExit: true,

  // Limpeza automática de mocks
  clearMocks: true,

  // Reset automático de mocks
  resetMocks: true,

  // Restauração automática de mocks
  restoreMocks: true
};