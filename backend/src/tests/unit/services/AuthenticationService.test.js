const AuthenticationService = require("../../../src/services/AuthenticationService")
const SoftwareHouse = require("../../../src/models/SoftwareHouse")
const { redisClient } = require("../../../src/config/redis")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const jest = require("jest") // Declaring the jest variable

// Mock dependencies
jest.mock("../../../src/models/SoftwareHouse")
jest.mock("../../../src/config/redis")
jest.mock("jsonwebtoken")
jest.mock("bcryptjs")

describe("AuthenticationService", () => {
  let mockSoftwareHouse

  beforeEach(() => {
    jest.clearAllMocks()

    mockSoftwareHouse = {
      id: 1,
      cnpj: "12.345.678/0001-90",
      razao_social: "Test Software House",
      nome_fantasia: "Test SH",
      email: "test@example.com",
      token_sh: "test_token_sh_123",
      ativo: true,
      ultimo_acesso: new Date(),
      tentativas_login: 0,
      bloqueado_ate: null,
      estaBloqueado: jest.fn().mockReturnValue(false),
      verificarSenha: jest.fn(),
      incrementarTentativas: jest.fn(),
      resetarTentativas: jest.fn(),
      save: jest.fn(),
    }
  })

  describe("authenticate", () => {
    it("should authenticate successfully with valid credentials", async () => {
      const cnpj = "12.345.678/0001-90"
      const senha = "password123"
      const token = "jwt_token"
      const refreshToken = "refresh_token"

      SoftwareHouse.findOne.mockResolvedValue(mockSoftwareHouse)
      mockSoftwareHouse.verificarSenha.mockResolvedValue(true)
      jwt.sign.mockReturnValueOnce(token).mockReturnValueOnce(refreshToken)
      redisClient.setEx = jest.fn().mockResolvedValue("OK")

      const result = await AuthenticationService.authenticate(cnpj, senha)

      expect(result.success).toBe(true)
      expect(result.token).toBe(token)
      expect(result.refreshToken).toBe(refreshToken)
      expect(result.softwareHouse.id).toBe(mockSoftwareHouse.id)
      expect(mockSoftwareHouse.resetarTentativas).toHaveBeenCalled()
      expect(mockSoftwareHouse.save).toHaveBeenCalled()
    })

    it("should throw error when CNPJ not found", async () => {
      SoftwareHouse.findOne.mockResolvedValue(null)

      await expect(AuthenticationService.authenticate("12.345.678/0001-90", "password123")).rejects.toThrow(
        "CNPJ não encontrado ou Software House inativa",
      )
    })

    it("should throw error when software house is blocked", async () => {
      mockSoftwareHouse.estaBloqueado.mockReturnValue(true)
      SoftwareHouse.findOne.mockResolvedValue(mockSoftwareHouse)

      await expect(AuthenticationService.authenticate("12.345.678/0001-90", "password123")).rejects.toThrow(
        "Software House temporariamente bloqueada devido a múltiplas tentativas de login",
      )
    })

    it("should increment login attempts on wrong password", async () => {
      SoftwareHouse.findOne.mockResolvedValue(mockSoftwareHouse)
      mockSoftwareHouse.verificarSenha.mockResolvedValue(false)

      await expect(AuthenticationService.authenticate("12.345.678/0001-90", "wrongpassword")).rejects.toThrow(
        "Senha incorreta",
      )

      expect(mockSoftwareHouse.incrementarTentativas).toHaveBeenCalled()
      expect(mockSoftwareHouse.save).toHaveBeenCalled()
    })
  })

  describe("generateToken", () => {
    it("should generate a valid JWT token", () => {
      const token = "generated_token"
      jwt.sign.mockReturnValue(token)

      const result = AuthenticationService.generateToken(mockSoftwareHouse)

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockSoftwareHouse.id,
          cnpj: mockSoftwareHouse.cnpj,
          token_sh: mockSoftwareHouse.token_sh,
          type: "software_house",
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
      )
      expect(result).toBe(token)
    })
  })

  describe("generateRefreshToken", () => {
    it("should generate a valid refresh token", () => {
      const refreshToken = "generated_refresh_token"
      jwt.sign.mockReturnValue(refreshToken)

      const result = AuthenticationService.generateRefreshToken(mockSoftwareHouse)

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockSoftwareHouse.id,
          cnpj: mockSoftwareHouse.cnpj,
          type: "refresh",
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" },
      )
      expect(result).toBe(refreshToken)
    })
  })

  describe("verifyToken", () => {
    it("should verify a valid token", () => {
      const token = "valid_token"
      const payload = { id: 1, cnpj: "12.345.678/0001-90" }
      jwt.verify.mockReturnValue(payload)

      const result = AuthenticationService.verifyToken(token)

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET)
      expect(result).toEqual(payload)
    })

    it("should throw error for invalid token", () => {
      const token = "invalid_token"
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token")
      })

      expect(() => AuthenticationService.verifyToken(token)).toThrow("Token inválido ou expirado")
    })
  })

  describe("refreshToken", () => {
    it("should refresh token successfully", async () => {
      const refreshToken = "valid_refresh_token"
      const payload = { id: 1, cnpj: "12.345.678/0001-90", type: "refresh" }
      const newToken = "new_jwt_token"
      const newRefreshToken = "new_refresh_token"

      jwt.verify.mockReturnValue(payload)
      redisClient.get = jest.fn().mockResolvedValue(refreshToken)
      SoftwareHouse.findByPk.mockResolvedValue(mockSoftwareHouse)
      jwt.sign.mockReturnValueOnce(newToken).mockReturnValueOnce(newRefreshToken)
      redisClient.setEx = jest.fn().mockResolvedValue("OK")

      const result = await AuthenticationService.refreshToken(refreshToken)

      expect(result.success).toBe(true)
      expect(result.token).toBe(newToken)
      expect(result.refreshToken).toBe(newRefreshToken)
    })

    it("should throw error when refresh token not found in Redis", async () => {
      const refreshToken = "valid_refresh_token"
      const payload = { id: 1, cnpj: "12.345.678/0001-90", type: "refresh" }

      jwt.verify.mockReturnValue(payload)
      redisClient.get = jest.fn().mockResolvedValue(null)

      await expect(AuthenticationService.refreshToken(refreshToken)).rejects.toThrow("Refresh token não encontrado")
    })
  })

  describe("parseTimeToSeconds", () => {
    it("should parse seconds correctly", () => {
      expect(AuthenticationService.parseTimeToSeconds("30s")).toBe(30)
    })

    it("should parse minutes correctly", () => {
      expect(AuthenticationService.parseTimeToSeconds("15m")).toBe(900)
    })

    it("should parse hours correctly", () => {
      expect(AuthenticationService.parseTimeToSeconds("24h")).toBe(86400)
    })

    it("should parse days correctly", () => {
      expect(AuthenticationService.parseTimeToSeconds("7d")).toBe(604800)
    })

    it("should return default value for invalid format", () => {
      expect(AuthenticationService.parseTimeToSeconds("invalid")).toBe(86400)
    })
  })

  describe("validateSoftwareHouseByToken", () => {
    it("should validate software house by token successfully", async () => {
      const tokenSh = "test_token_sh_123"
      SoftwareHouse.findOne.mockResolvedValue(mockSoftwareHouse)

      const result = await AuthenticationService.validateSoftwareHouseByToken(tokenSh)

      expect(SoftwareHouse.findOne).toHaveBeenCalledWith({
        where: { token_sh: tokenSh, ativo: true },
      })
      expect(result).toEqual(mockSoftwareHouse)
    })

    it("should return null when software house not found", async () => {
      SoftwareHouse.findOne.mockResolvedValue(null)

      const result = await AuthenticationService.validateSoftwareHouseByToken("invalid_token")

      expect(result).toBeNull()
    })
  })

  describe("logout", () => {
    it("should remove refresh token from Redis", async () => {
      redisClient.del = jest.fn().mockResolvedValue(1)

      await AuthenticationService.logout(1)

      expect(redisClient.del).toHaveBeenCalledWith("refresh_token:1")
    })
  })
})
