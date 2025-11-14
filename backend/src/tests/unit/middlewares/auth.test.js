const { authenticateJWT } = require('../../../middlewares/auth'); // CORREÇÃO
const jwt = require('jsonwebtoken');
const { AppError } = require('../../../utils/errors');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('deve chamar next() e anexar dados em req.auth com um token válido', () => {
    // Arrange
    const token = 'valid-token';
    const payload = { softwareHouseId: 1, cnpj: '123' };
    req.headers.authorization = `Bearer ${token}`;
    jwt.verify.mockReturnValue(payload);

    // Act
    authenticateJWT(req, res, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(req.auth).toEqual(payload);
    expect(next).toHaveBeenCalledWith(); // Chamado sem argumentos em caso de sucesso
  });

  it('deve chamar next(error) se o header de autorização estiver ausente', () => {
    // Act
    authenticateJWT(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].message).toContain('não fornecido');
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });
  
  it('deve chamar next(error) se o token for inválido (jwt.verify lança erro)', () => {
    // Arrange
    const token = 'invalid-token';
    req.headers.authorization = `Bearer ${token}`;
    jwt.verify.mockImplementation(() => {
      throw new jwt.JsonWebTokenError('invalid token');
    });

    // Act
    authenticateJWT(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].message).toContain('Token inválido');
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });
});