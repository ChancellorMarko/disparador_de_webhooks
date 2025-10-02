const { sequelize } = require("../../../src/config/database")
const SoftwareHouse = require("../../../src/models/SoftwareHouse")
const bcrypt = require("bcryptjs")
const jest = require("jest") // Declare the jest variable

jest.mock("bcryptjs")

describe("SoftwareHouse Model", () => {
  beforeAll(async () => {
    // Sync database for testing
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Model Validation", () => {
    it("should validate CNPJ format", async () => {
      const invalidCNPJ = "12345678000190" // Without formatting

      await expect(
        SoftwareHouse.create({
          cnpj: invalidCNPJ,
          razao_social: "Test Company",
          email: "test@example.com",
          senha: "password123",
        }),
      ).rejects.toThrow()
    })

    it("should validate email format", async () => {
      await expect(
        SoftwareHouse.create({
          cnpj: "12.345.678/0001-90",
          razao_social: "Test Company",
          email: "invalid-email",
          senha: "password123",
        }),
      ).rejects.toThrow()
    })

    it("should require razao_social", async () => {
      await expect(
        SoftwareHouse.create({
          cnpj: "12.345.678/0001-90",
          email: "test@example.com",
          senha: "password123",
        }),
      ).rejects.toThrow()
    })
  })

  describe("Password Hashing", () => {
    it("should hash password before creating", async () => {
      const hashedPassword = "hashed_password"
      bcrypt.hash.mockResolvedValue(hashedPassword)

      const softwareHouse = await SoftwareHouse.create({
        cnpj: "12.345.678/0001-90",
        razao_social: "Test Company",
        email: "test@example.com",
        senha: "password123",
      })

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 12)
      expect(softwareHouse.senha).toBe(hashedPassword)
    })

    it("should hash password before updating", async () => {
      const hashedPassword = "hashed_password"
      const newHashedPassword = "new_hashed_password"
      bcrypt.hash.mockResolvedValueOnce(hashedPassword).mockResolvedValueOnce(newHashedPassword)

      const softwareHouse = await SoftwareHouse.create({
        cnpj: "12.345.678/0001-90",
        razao_social: "Test Company",
        email: "test@example.com",
        senha: "password123",
      })

      softwareHouse.senha = "newpassword456"
      await softwareHouse.save()

      expect(bcrypt.hash).toHaveBeenCalledWith("newpassword456", 12)
      expect(softwareHouse.senha).toBe(newHashedPassword)
    })
  })

  describe("Instance Methods", () => {
    let softwareHouse

    beforeEach(async () => {
      bcrypt.hash.mockResolvedValue("hashed_password")
      softwareHouse = await SoftwareHouse.create({
        cnpj: "12.345.678/0001-90",
        razao_social: "Test Company",
        email: "test@example.com",
        senha: "password123",
      })
    })

    describe("verificarSenha", () => {
      it("should return true for correct password", async () => {
        bcrypt.compare.mockResolvedValue(true)

        const result = await softwareHouse.verificarSenha("password123")

        expect(bcrypt.compare).toHaveBeenCalledWith("password123", softwareHouse.senha)
        expect(result).toBe(true)
      })

      it("should return false for incorrect password", async () => {
        bcrypt.compare.mockResolvedValue(false)

        const result = await softwareHouse.verificarSenha("wrongpassword")

        expect(result).toBe(false)
      })
    })

    describe("estaBloqueado", () => {
      it("should return false when not blocked", () => {
        softwareHouse.bloqueado_ate = null

        expect(softwareHouse.estaBloqueado()).toBe(false)
      })

      it("should return true when blocked", () => {
        softwareHouse.bloqueado_ate = new Date(Date.now() + 30 * 60 * 1000)

        expect(softwareHouse.estaBloqueado()).toBe(true)
      })

      it("should return false when block period has expired", () => {
        softwareHouse.bloqueado_ate = new Date(Date.now() - 1000)

        expect(softwareHouse.estaBloqueado()).toBe(false)
      })
    })

    describe("incrementarTentativas", () => {
      it("should increment login attempts", () => {
        softwareHouse.tentativas_login = 0

        softwareHouse.incrementarTentativas()

        expect(softwareHouse.tentativas_login).toBe(1)
      })

      it("should block after 5 attempts", () => {
        softwareHouse.tentativas_login = 4

        softwareHouse.incrementarTentativas()

        expect(softwareHouse.tentativas_login).toBe(5)
        expect(softwareHouse.bloqueado_ate).toBeInstanceOf(Date)
      })
    })

    describe("resetarTentativas", () => {
      it("should reset login attempts and unblock", () => {
        softwareHouse.tentativas_login = 5
        softwareHouse.bloqueado_ate = new Date()

        softwareHouse.resetarTentativas()

        expect(softwareHouse.tentativas_login).toBe(0)
        expect(softwareHouse.bloqueado_ate).toBeNull()
        expect(softwareHouse.ultimo_acesso).toBeInstanceOf(Date)
      })
    })

    describe("gerarNovoToken", () => {
      it("should generate a new token_sh", () => {
        const oldToken = softwareHouse.token_sh

        const newToken = softwareHouse.gerarNovoToken()

        expect(newToken).toBeDefined()
        expect(newToken).not.toBe(oldToken)
        expect(newToken.length).toBe(32)
      })
    })
  })
})
