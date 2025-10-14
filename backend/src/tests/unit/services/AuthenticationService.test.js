const AuthenticationService = require('../../../src/services/AuthenticationService');
const SoftwareHouse = require('../../../src/models/SoftwareHouse');
const bcrypt = require('bcryptjs');

// Mock do modelo SoftwareHouse
jest.mock('../../src/models/SoftwareHouse');
jest.mock('../../src/config/redis');

describe('AuthenticationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate a valid software house', async () => {
      const mockSoftwareHouse = {
        id: 1,
        cnpj: '12.345.678/0001-90',
        razao_social: 'Test SH',
        nome_fantasia: 'Test',
        email: 'test@test.com',
        token_sh: 'test123456789012345678901234567890',
        ativo: true,
        estaBloqueado: jest.fn().mockReturnValue(false),
        verificarSenha: jest.fn().mockResolvedValue(true),
        incrementarTentativas: jest.fn(),
        resetarTentativas: jest.fn(),
        save: jest.fn().mockResolvedValue(true)
      };

      SoftwareHouse.findOne.mockResolvedValue(mockSoftwareHouse);

      const result = await AuthenticationService.authenticate('12.345.678/0001-90', 'senha123');

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.softwareHouse.cnpj).toBe('12.345.678/0001-90');
    });

    it('should reject inactive software house', async () => {
      SoftwareHouse.findOne.mockResolvedValue(null);

      await expect(
        AuthenticationService.authenticate('12.345.678/0001-90', 'senha123')
      ).rejects.toThrow('CNPJ não encontrado ou Software House inativa');
    });

    it('should reject blocked software house', async () => {
      const mockSoftwareHouse = {
        cnpj: '12.345.678/0001-90',
        ativo: true,
        estaBloqueado: jest.fn().mockReturnValue(true)
      };

      SoftwareHouse.findOne.mockResolvedValue(mockSoftwareHouse);

      await expect(
        AuthenticationService.authenticate('12.345.678/0001-90', 'senha123')
      ).rejects.toThrow('Software House temporariamente bloqueada devido a múltiplas tentativas de login');
    });

    it('should reject invalid password', async () => {
      const mockSoftwareHouse = {
        cnpj: '12.345.678/0001-90',
        ativo: true,
        estaBloqueado: jest.fn().mockReturnValue(false),
        verificarSenha: jest.fn().mockResolvedValue(false),
        incrementarTentativas: jest.fn(),
        save: jest.fn().mockResolvedValue(true)
      };

      SoftwareHouse.findOne.mockResolvedValue(mockSoftwareHouse);

      await expect(
        AuthenticationService.authenticate('12.345.678/0001-90', 'senhaerrada')
      ).rejects.toThrow('Senha incorreta');
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const mockSoftwareHouse = {
        id: 1,
        cnpj: '12.345.678/0001-90',
        token_sh: 'test123456789012345678901234567890'
      };

      const token = AuthenticationService.generateToken(mockSoftwareHouse);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const mockSoftwareHouse = {
        id: 1,
        cnpj: '12.345.678/0001-90',
        token_sh: 'test123456789012345678901234567890'
      };

      const token = AuthenticationService.generateToken(mockSoftwareHouse);
      const decoded = AuthenticationService.verifyToken(token);

      expect(decoded.id).toBe(1);
      expect(decoded.cnpj).toBe('12.345.678/0001-90');
      expect(decoded.type).toBe('software_house');
    });

    it('should reject invalid token', () => {
      expect(() => {
        AuthenticationService.verifyToken('invalid-token');
      }).toThrow('Token inválido ou expirado');
    });
  });

  describe('validateSoftwareHouseByToken', () => {
    it('should validate a valid token SH', async () => {
      const mockSoftwareHouse = {
        id: 1,
        cnpj: '12.345.678/0001-90',
        razao_social: 'Test SH',
        ativo: true
      };

      SoftwareHouse.findOne.mockResolvedValue(mockSoftwareHouse);

      const result = await AuthenticationService.validateSoftwareHouseByToken('valid-token-sh');

      expect(result).toEqual(mockSoftwareHouse);
    });

    it('should return null for invalid token SH', async () => {
      SoftwareHouse.findOne.mockResolvedValue(null);

      const result = await AuthenticationService.validateSoftwareHouseByToken('invalid-token-sh');

      expect(result).toBeNull();
    });
  });
});
