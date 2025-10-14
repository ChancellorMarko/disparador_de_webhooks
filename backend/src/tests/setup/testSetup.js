// src/tests/setup/testSetup.js

const { beforeAll, afterAll, beforeEach, afterEach } = require('@jest/globals');
const { sequelize } = require('../../models'); // Importa a instância do Sequelize

// Mock do console para evitar logs durante os testes
const originalConsole = global.console;

beforeAll(() => {
  // Suprimir logs durante os testes
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
});

// Limpeza entre testes
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

// Configurações de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

// Hook que executa após todos os testes da suíte finalizarem.
afterAll(async () => {
  // Restaura o console para o seu estado original
  global.console = originalConsole;
  
  // Fecha a conexão com o banco de dados para permitir que o Jest
  // encerra o processo de forma limpa e sem avisos.
  await sequelize.close();
});