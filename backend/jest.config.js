module.exports = {
  // Ambiente de teste
  testEnvironment: 'node',

  // Diretórios raiz
  // ALTERADO: Alinhado com a estrutura descrita no README ('__tests__')
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],

  // Arquivos de setup
  // ALTERADO: Caminho corrigido para apontar para a pasta '__tests__'
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/testSetup.js'],

  // Adiciona 'src' como um diretório de módulos para imports limpos
  moduleDirectories: ['node_modules', '<rootDir>/src'],

  // Padrões de arquivos de teste
  // MANTIDO: Este padrão já funciona bem para a estrutura '__tests__'
  testMatch: [
    '**/__tests__/**/*.js',
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Cobertura de código (já está perfeito)
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
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

  // Timeout para testes (já está perfeito)
  testTimeout: 10000,

  // Verbose
  verbose: true,

  // Forçar saída
  forceExit: true,

  // Limpeza automática de mocks (já está perfeito)
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};