const request = require("supertest")
const app = require("../../src/app")
const { sequelize } = require("../../src/config/database")
const SoftwareHouse = require("../../src/models/SoftwareHouse")
const { redisClient } = require("../../src/config/redis")

describe("Authentication Integration Tests", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
    if (redisClient && redisClient.quit) {
      await redisClient.quit()
    }
  })

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await SoftwareHouse.destroy({ where: {} })

      await SoftwareHouse.create({
        cnpj: "12.345.678/0001-90",
        razao_social: "Test Software House",
        nome_fantasia: "Test SH",
        email: "test@example.com",
        senha: "password123",
        ativo: true,
      })
    })

    it("should login successfully with valid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        cnpj: "12.345.678/0001-90",
        senha: "password123",
      })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.token).toBeDefined()
      expect(response.body.refreshToken).toBeDefined()
      expect(response.body.softwareHouse).toBeDefined()
    })

    it("should return 401 with invalid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        cnpj: "12.345.678/0001-90",
        senha: "wrongpassword",
      })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it("should return 401 with non-existent CNPJ", async () => {
      const response = await request(app).post("/api/auth/login").send({
        cnpj: "99.999.999/9999-99",
        senha: "password123",
      })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it("should block after 5 failed attempts", async () => {
      // Make 5 failed login attempts
      for (let i = 0; i < 5; i++) {
        await request(app).post("/api/auth/login").send({
          cnpj: "12.345.678/0001-90",
          senha: "wrongpassword",
        })
      }

      // 6th attempt should be blocked
      const response = await request(app).post("/api/auth/login").send({
        cnpj: "12.345.678/0001-90",
        senha: "password123",
      })

      expect(response.status).toBe(403)
      expect(response.body.error).toContain("bloqueada")
    })
  })

  describe("POST /api/auth/refresh", () => {
    let refreshToken

    beforeEach(async () => {
      await SoftwareHouse.destroy({ where: {} })

      await SoftwareHouse.create({
        cnpj: "12.345.678/0001-90",
        razao_social: "Test Software House",
        email: "test@example.com",
        senha: "password123",
        ativo: true,
      })

      const loginResponse = await request(app).post("/api/auth/login").send({
        cnpj: "12.345.678/0001-90",
        senha: "password123",
      })

      refreshToken = loginResponse.body.refreshToken
    })

    it("should refresh token successfully", async () => {
      const response = await request(app).post("/api/auth/refresh").send({ refreshToken })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.token).toBeDefined()
      expect(response.body.refreshToken).toBeDefined()
    })

    it("should return 401 with invalid refresh token", async () => {
      const response = await request(app).post("/api/auth/refresh").send({ refreshToken: "invalid_token" })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })

  describe("POST /api/auth/logout", () => {
    let authToken

    beforeEach(async () => {
      await SoftwareHouse.destroy({ where: {} })

      await SoftwareHouse.create({
        cnpj: "12.345.678/0001-90",
        razao_social: "Test Software House",
        email: "test@example.com",
        senha: "password123",
        ativo: true,
      })

      const loginResponse = await request(app).post("/api/auth/login").send({
        cnpj: "12.345.678/0001-90",
        senha: "password123",
      })

      authToken = loginResponse.body.token
    })

    it("should logout successfully", async () => {
      const response = await request(app).post("/api/auth/logout").set("Authorization", `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })

    it("should return 401 without auth token", async () => {
      const response = await request(app).post("/api/auth/logout")

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })
})
