const {
  validateRequiredHeaders,
  validateOptionalHeaders,
  validateCNPJHeader,
  validateTokenSHHeader,
  validateRateLimitHeaders,
  validateCorrelationHeaders,
  isValidCNPJFormat,
  isValidTokenSHFormat,
  generateCorrelationId
} = require('middlewares/validation'); // ALTERADO: Caminho limpo para 'src/middlewares/validation'

// Mock do serviço de autenticação
jest.mock('services/AuthenticationService', () => ({ // ALTERADO: Caminho limpo para 'src/services/AuthenticationService'
  validateSoftwareHouseByToken: jest.fn(),
}));

const AuthenticationService = require('services/AuthenticationService'); // ALTERADO: Caminho limpo para 'src/services/AuthenticationService'

describe('Middleware de Validação', () => {
  let mockReq, mockRes, mockNext;

  // Objeto Software House falso para usar nos testes de sucesso
  const mockSoftwareHouse = {
    id: 1,
    cnpj: '12.345.678/0001-95',
    razao_social: 'Software House Teste',
    nome_fantasia: 'SH Teste',
    email: 'contato@sh.com',
    token_sh: 'abcdefghijklmnopqrstuvwxzy123456',
    ativo: true
  };

  beforeEach(() => {
    // Reseta os mocks antes de cada teste
    jest.clearAllMocks();

    // Cria mocks simples para req, res e next
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
    };
    mockNext = jest.fn();
  });

  // --- Testes para validateRequiredHeaders ---
  describe('validateRequiredHeaders', () => {
    it('deve chamar next() e adicionar softwareHouse ao req se os headers forem válidos', async () => {
      mockReq.headers = {
        'cnpj-sh': mockSoftwareHouse.cnpj,
        'token-sh': mockSoftwareHouse.token_sh,
      };
      AuthenticationService.validateSoftwareHouseByToken.mockResolvedValue(mockSoftwareHouse);

      await validateRequiredHeaders(mockReq, mockRes, mockNext);

      expect(AuthenticationService.validateSoftwareHouseByToken).toHaveBeenCalledWith(mockSoftwareHouse.token_sh);
      expect(mockReq.softwareHouse).toEqual(mockSoftwareHouse);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('deve retornar 400 se o header cnpj-sh estiver ausente', async () => {
      await validateRequiredHeaders(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        code: 'MISSING_CNPJ_SH_HEADER'
      }));
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar 400 se o header token-sh estiver ausente', async () => {
      mockReq.headers['cnpj-sh'] = mockSoftwareHouse.cnpj;
      
      await validateRequiredHeaders(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        code: 'MISSING_TOKEN_SH_HEADER'
      }));
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar 400 se o formato do CNPJ for inválido', async () => {
      mockReq.headers = {
        'cnpj-sh': '123456789',
        'token-sh': mockSoftwareHouse.token_sh,
      };

      await validateRequiredHeaders(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        code: 'INVALID_CNPJ_FORMAT'
      }));
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar 400 se o formato do token SH for inválido', async () => {
      mockReq.headers = {
        'cnpj-sh': mockSoftwareHouse.cnpj,
        'token-sh': 'token-invalido',
      };

      await validateRequiredHeaders(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        code: 'INVALID_TOKEN_SH_FORMAT'
      }));
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar 401 se o token SH for inválido (Software House não encontrada)', async () => {
      mockReq.headers = {
        'cnpj-sh': mockSoftwareHouse.cnpj,
        'token-sh': mockSoftwareHouse.token_sh,
      };
      AuthenticationService.validateSoftwareHouseByToken.mockResolvedValue(null);

      await validateRequiredHeaders(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        code: 'INVALID_TOKEN_SH'
      }));
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar 403 se o CNPJ não corresponder ao token', async () => {
      mockReq.headers = {
        'cnpj-sh': '11.222.333/0001-44', // CNPJ diferente
        'token-sh': mockSoftwareHouse.token_sh,
      };
      AuthenticationService.validateSoftwareHouseByToken.mockResolvedValue(mockSoftwareHouse);

      await validateRequiredHeaders(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        code: 'CNPJ_TOKEN_MISMATCH'
      }));
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar 500 se ocorrer um erro interno', async () => {
      mockReq.headers = {
        'cnpj-sh': mockSoftwareHouse.cnpj,
        'token-sh': mockSoftwareHouse.token_sh,
      };
      AuthenticationService.validateSoftwareHouseByToken.mockRejectedValue(new Error('Erro no banco'));

      await validateRequiredHeaders(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        code: 'HEADER_VALIDATION_ERROR'
      }));
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  // --- Testes para validateOptionalHeaders ---
  describe('validateOptionalHeaders', () => {
    it('deve chamar next() se os headers opcionais não estiverem presentes', async () => {
      await validateOptionalHeaders(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.softwareHouse).toBeUndefined();
    });

    it('deve chamar next() e adicionar softwareHouse se os headers opcionais forem válidos', async () => {
      mockReq.headers = {
        'cnpj-sh': mockSoftwareHouse.cnpj,
        'token-sh': mockSoftwareHouse.token_sh,
      };
      AuthenticationService.validateSoftwareHouseByToken.mockResolvedValue(mockSoftwareHouse);

      await validateOptionalHeaders(mockReq, mockRes, mockNext);

      expect(mockReq.softwareHouse).toEqual(mockSoftwareHouse);
      expect(mockNext).toHaveBeenCalled();
    });

    it('deve retornar 400 se o formato do CNPJ opcional for inválido', async () => {
      mockReq.headers = {
        'cnpj-sh': '123',
        'token-sh': mockSoftwareHouse.token_sh,
      };

      await validateOptionalHeaders(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve chamar next() mesmo que o serviço de autenticação falhe (erro interno)', async () => {
      mockReq.headers = {
        'cnpj-sh': mockSoftwareHouse.cnpj,
        'token-sh': mockSoftwareHouse.token_sh,
      };
      AuthenticationService.validateSoftwareHouseByToken.mockRejectedValue(new Error('Erro no banco'));

      await validateOptionalHeaders(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.softwareHouse).toBeUndefined();
    });
  });

  // --- Testes para validateCNPJHeader ---
  describe('validateCNPJHeader', () => {
    it('deve chamar next() se o header cnpj-sh for válido', () => {
      mockReq.headers['cnpj-sh'] = mockSoftwareHouse.cnpj;
      validateCNPJHeader(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('deve retornar 400 se o header cnpj-sh estiver ausente', () => {
      validateCNPJHeader(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar 400 se o formato do cnpj-sh for inválido', () => {
      mockReq.headers['cnpj-sh'] = 'formato-invalido';
      validateCNPJHeader(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  // --- Testes para validateTokenSHHeader ---
  describe('validateTokenSHHeader', () => {
    it('deve chamar next() e adicionar softwareHouse se o token for válido', async () => {
      mockReq.headers['token-sh'] = mockSoftwareHouse.token_sh;
      AuthenticationService.validateSoftwareHouseByToken.mockResolvedValue(mockSoftwareHouse);

      await validateTokenSHHeader(mockReq, mockRes, mockNext);

      expect(mockReq.softwareHouse).toEqual(mockSoftwareHouse);
      expect(mockNext).toHaveBeenCalled();
    });

    it('deve retornar 400 se o header token-sh estiver ausente', async () => {
      await validateTokenSHHeader(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar 401 se o token SH for inválido', async () => {
      mockReq.headers['token-sh'] = mockSoftwareHouse.token_sh;
      AuthenticationService.validateSoftwareHouseByToken.mockResolvedValue(null);

      await validateTokenSHHeader(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  // --- Testes para validateRateLimitHeaders ---
  describe('validateRateLimitHeaders', () => {
    it('deve adicionar a chave de rate limit ao req se o header existir', () => {
      const key = 'user-123-limit';
      mockReq.headers['x-rate-limit-key'] = key;
      validateRateLimitHeaders(mockReq, mockRes, mockNext);
      expect(mockReq.rateLimitKey).toBe(key);
      expect(mockNext).toHaveBeenCalled();
    });

    it('deve chamar next() sem adicionar nada se o header não existir', () => {
      validateRateLimitHeaders(mockReq, mockRes, mockNext);
      expect(mockReq.rateLimitKey).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  // --- Testes para validateCorrelationHeaders ---
  describe('validateCorrelationHeaders', () => {
    it('deve usar o ID de correlação do header se existir', () => {
      const correlationId = 'corr-id-externo-123';
      mockReq.headers['x-correlation-id'] = correlationId;
      
      validateCorrelationHeaders(mockReq, mockRes, mockNext);

      expect(mockReq.correlationId).toBe(correlationId);
      expect(mockRes.setHeader).toHaveBeenCalledWith('x-correlation-id', correlationId);
      expect(mockNext).toHaveBeenCalled();
    });

    it('deve gerar um novo ID de correlação se o header não existir', () => {
      // Espiona a função para garantir que foi chamada
      const generateSpy = jest.spyOn({ generateCorrelationId }, 'generateCorrelationId');
      
      validateCorrelationHeaders(mockReq, mockRes, mockNext);

      expect(generateSpy).toHaveBeenCalled();
      expect(mockReq.correlationId).toBeDefined();
      expect(mockReq.correlationId).toMatch(/^corr_\d+_[a-z0-9]+$/);
      expect(mockRes.setHeader).toHaveBeenCalledWith('x-correlation-id', mockReq.correlationId);
      expect(mockNext).toHaveBeenCalled();
      
      generateSpy.mockRestore(); // Restaura a implementação original
    });
  });

  // --- Testes para funções auxiliares ---
  describe('Funções Auxiliares', () => {
    it('isValidCNPJFormat deve retornar true para um CNPJ válido', () => {
      expect(isValidCNPJFormat('12.345.678/0001-95')).toBe(true);
    });

    it('isValidCNPJFormat deve retornar false para um CNPJ inválido', () => {
      expect(isValidCNPJFormat('12.345.678/0001-9')).toBe(false); // Faltando dígito
      expect(isValidCNPJFormat('12345678000195')).toBe(false); // Sem pontuação
      expect(isValidCNPJFormat('ab.cde.fgh/ijkl-mn')).toBe(false); // Com letras
    });

    it('isValidTokenSHFormat deve retornar true para um token válido', () => {
      expect(isValidTokenSHFormat('abcdefghijklmnopqrstuvwxzy123456')).toBe(true);
    });

    it('isValidTokenSHFormat deve retornar false para um token inválido', () => {
      expect(isValidTokenSHFormat('abc')).toBe(false); // Muito curto
      expect(isValidTokenSHFormat('abcdefghijklmnopqrstuvwxzy1234567')).toBe(false); // Muito longo
      expect(isValidTokenSHFormat('abcdefghijklmnopqrstuvwxzy-123456')).toBe(false); // Com caractere especial
    });
  });
});