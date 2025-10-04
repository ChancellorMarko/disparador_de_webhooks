const { authenticateJWT, optionalAuth, requireUserType, requireOwnership } = require("../../../src/middlewares/auth")
const AuthenticationService = require("../../../src/services/AuthenticationService")
const jest = require("jest")

jest.mock("../../../src/services/AuthenticationService")

describe("Auth Middleware", () => {
  let req, res, next

  beforeEach(() => {
    req = {
      headers: {},
      params: {},
      user: null,
      decodedToken: null,
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
    jest.clearAllMocks()
  })

  describe("authenticateJWT", () => {
    it("should authenticate with valid token", async () => {
      const token = "valid_token"
      const decoded = {
        id: 1,
        cnpj: "12.345.678/0001-90",
        token_sh: "test_token",
        type: "software_house",
      }

      req.headers.authorization = `Bearer ${token}`
      AuthenticationService.verifyToken.mockReturnValue(decoded)

      await authenticateJWT(req, res, next)

      expect(req.user).toEqual({
        id: decoded.id,
        cnpj: decoded.cnpj,
        token_sh: decoded.token_sh,
        type: decoded.type,
      })
      expect(next).toHaveBeenCalled()
    })

    it("should return 401 when no authorization header", async () => {
      await authenticateJWT(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Token de autenticação não fornecido",
        code: "MISSING_TOKEN",
      })
      expect(next).not.toHaveBeenCalled()
    })

    it("should return 401 when token format is invalid", async () => {
      req.headers.authorization = "InvalidFormat token"

      await authenticateJWT(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Formato de token inválido. Use: Bearer <token>",
        code: "INVALID_TOKEN_FORMAT",
      })
    })

    it("should return 401 when token is expired", async () => {
      req.headers.authorization = "Bearer expired_token"
      const error = new Error("Token expired")
      error.name = "TokenExpiredError"
      AuthenticationService.verifyToken.mockImplementation(() => {
        throw error
      })

      await authenticateJWT(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Token expirado",
        code: "TOKEN_EXPIRED",
      })
    })

    it("should return 401 when token type is invalid", async () => {
      req.headers.authorization = "Bearer valid_token"
      AuthenticationService.verifyToken.mockReturnValue({
        id: 1,
        type: "invalid_type",
      })

      await authenticateJWT(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Tipo de token inválido",
        code: "INVALID_TOKEN_TYPE",
      })
    })
  })

  describe("optionalAuth", () => {
    it("should authenticate with valid token", async () => {
      const token = "valid_token"
      const decoded = {
        id: 1,
        cnpj: "12.345.678/0001-90",
        token_sh: "test_token",
        type: "software_house",
      }

      req.headers.authorization = `Bearer ${token}`
      AuthenticationService.verifyToken.mockReturnValue(decoded)

      await optionalAuth(req, res, next)

      expect(req.user).toEqual({
        id: decoded.id,
        cnpj: decoded.cnpj,
        token_sh: decoded.token_sh,
        type: decoded.type,
      })
      expect(next).toHaveBeenCalled()
    })

    it("should continue without authentication when no token", async () => {
      await optionalAuth(req, res, next)

      expect(req.user).toBeNull()
      expect(req.decodedToken).toBeNull()
      expect(next).toHaveBeenCalled()
    })

    it("should continue without authentication when token is invalid", async () => {
      req.headers.authorization = "Bearer invalid_token"
      AuthenticationService.verifyToken.mockImplementation(() => {
        throw new Error("Invalid token")
      })

      await optionalAuth(req, res, next)

      expect(req.user).toBeNull()
      expect(req.decodedToken).toBeNull()
      expect(next).toHaveBeenCalled()
    })
  })

  describe("requireUserType", () => {
    it("should allow access when user type matches", () => {
      req.user = { id: 1, type: "software_house" }
      const middleware = requireUserType("software_house")

      middleware(req, res, next)

      expect(next).toHaveBeenCalled()
    })

    it("should return 401 when user is not authenticated", () => {
      const middleware = requireUserType("software_house")

      middleware(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Autenticação necessária",
        code: "AUTHENTICATION_REQUIRED",
      })
    })

    it("should return 403 when user type does not match", () => {
      req.user = { id: 1, type: "admin" }
      const middleware = requireUserType("software_house")

      middleware(req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Permissão insuficiente para esta operação",
        code: "INSUFFICIENT_PERMISSIONS",
      })
    })
  })

  describe("requireOwnership", () => {
    it("should allow access when user owns the resource", () => {
      req.user = { id: 1 }
      req.params = { id: "1" }
      const middleware = requireOwnership("id")

      middleware(req, res, next)

      expect(next).toHaveBeenCalled()
    })

    it("should return 401 when user is not authenticated", () => {
      req.params = { id: "1" }
      const middleware = requireOwnership("id")

      middleware(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Autenticação necessária",
        code: "AUTHENTICATION_REQUIRED",
      })
    })

    it("should return 403 when user does not own the resource", () => {
      req.user = { id: 1 }
      req.params = { id: "2" }
      const middleware = requireOwnership("id")

      middleware(req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Acesso negado: você não é o proprietário deste recurso",
        code: "ACCESS_DENIED",
      })
    })

    it("should return 400 when resource ID is missing", () => {
      req.user = { id: 1 }
      req.params = {}
      const middleware = requireOwnership("id")

      middleware(req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "ID do recurso não fornecido",
        code: "MISSING_RESOURCE_ID",
      })
    })
  })
})
