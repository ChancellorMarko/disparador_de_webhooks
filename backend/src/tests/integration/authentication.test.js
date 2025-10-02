const request = require("supertest")
const app = require("../../src/app")
const SoftwareHouse = require("../../src/models/SoftwareHouse")
const { sequelize } = require("../../src/config/database")

describe("Authentication Integration Tests", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  beforeEach(async () => {
    await SoftwareHouse.destroy({ where: {}, truncate: true })
  })

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      // Create test software house
      const softwareHouse = await SoftwareHouse.create({
        cnpj: "11.222.333/0001-81",
        razao_social: "Test SH",
        nome_fantasia: "Test",
        email: "test@test.com",
        senha: "senha123",
        token_sh: "test123456789012345678901234567890",
        ativo: true,
      })

      const response = await request(app).post("/api/auth/login").send({
        cnpj: "11.222.333/0001-81",
        senha: "senha123",
      })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.token).toBeDefined()
      expect(response.body.refreshToken).toBeDefined()
      expect(response.body.softwareHouse.cnpj).toBe("11.222.333/0001-81")
    })

    it("should reject invalid credentials", async () => {
      await SoftwareHouse.create({
        cnpj: "11.222.333/0001-81",
        razao_social: "Test SH",
        nome_fantasia: "Test",
        email: "test@test.com",
        senha: "senha123",
        token_sh: "test123456789012345678901234567890",
        ativo: true,
      })

      const response = await request(app).post("/api/auth/login").send({
        cnpj: "11.222.333/0001-81",
        senha: "wrongpassword",
      })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it("should reject inactive software house", async () => {
      await SoftwareHouse.create({
        cnpj: "11.222.333/0001-81",
        razao_social: "Test SH",
        nome_fantasia: "Test",
        email: "test@test.com",
        senha: "senha123",
        token_sh: "test123456789012345678901234567890",
        ativo: false,
      })

      const response = await request(app).post("/api/auth/login").send({
        cnpj: "11.222.333/0001-81",
        senha: "senha123",
      })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it("should validate required fields", async () => {
      const response = await request(app).post("/api/auth/login").send({
        cnpj: "11.222.333/0001-81",
        // Missing senha
      })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe("POST /api/auth/refresh", () => {
    it("should refresh token with valid refresh token", async () => {
      const softwareHouse = await SoftwareHouse.create({
        cnpj: "11.222.333/0001-81",
        razao_social: "Test SH",
        nome_fantasia: "Test",
        email: "test@test.com",
        senha: "senha123",
        token_sh: "test123456789012345678901234567890",
        ativo: true,
      })

      // First login to get refresh token
      const loginResponse = await request(app).post("/api/auth/login").send({
        cnpj: "11.222.333/0001-81",
        senha: "senha123",
      })

      const { refreshToken } = loginResponse.body

      // Use refresh token to get new access token
      const refreshResponse = await request(app).post("/api/auth/refresh").send({ refreshToken })

      expect(refreshResponse.status).toBe(200)
      expect(refreshResponse.body.success).toBe(true)
      expect(refreshResponse.body.token).toBeDefined()
    })

    it("should reject invalid refresh token", async () => {
      const response = await request(app).post("/api/auth/refresh").send({ refreshToken: "invalid-token" })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })

  describe("Protected Routes", () => {
    let authToken

    beforeEach(async () => {
      await SoftwareHouse.create({
        cnpj: "11.222.333/0001-81",
        razao_social: "Test SH",
        nome_fantasia: "Test",
        email: "test@test.com",
        senha: "senha123",
        token_sh: "test123456789012345678901234567890",
        ativo: true,
      })

      const loginResponse = await request(app).post("/api/auth/login").send({
        cnpj: "11.222.333/0001-81",
        senha: "senha123",
      })

      authToken = loginResponse.body.token
    })

    it("should access protected route with valid token", async () => {
      const response = await request(app).get("/api/protocolos").set("Authorization", `Bearer ${authToken}`)

      expect(response.status).not.toBe(401)
    })

    it("should reject protected route without token", async () => {
      const response = await request(app).get("/api/protocolos")

      expect(response.status).toBe(401)
    })

    it("should reject protected route with invalid token", async () => {
      const response = await request(app).get("/api/protocolos").set("Authorization", "Bearer invalid-token")

      expect(response.status).toBe(401)
    })
  })
})
