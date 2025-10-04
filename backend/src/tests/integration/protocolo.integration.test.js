const request = require("supertest")
const app = require("../../src/app")
const { sequelize } = require("../../src/config/database")
const SoftwareHouse = require("../../src/models/SoftwareHouse")
const AuthenticationService = require("../../src/services/AuthenticationService")

describe("Protocolo Integration Tests", () => {
  let softwareHouse
  let authToken

  beforeAll(async () => {
    await sequelize.sync({ force: true })

    softwareHouse = await SoftwareHouse.create({
      cnpj: "12.345.678/0001-90",
      razao_social: "Test Software House",
      email: "test@example.com",
      senha: "password123",
      ativo: true,
    })

    authToken = AuthenticationService.generateToken(softwareHouse)
  })

  afterAll(async () => {
    await sequelize.close()
  })

  describe("GET /api/protocolo/:protocolo", () => {
    it("should return 401 without authentication", async () => {
      const response = await request(app).get("/api/protocolo/TEST-123")

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it("should return 404 for non-existent protocol", async () => {
      const response = await request(app)
        .get("/api/protocolo/NONEXISTENT-123")
        .set("Authorization", `Bearer ${authToken}`)

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
    })
  })

  describe("GET /api/protocolo", () => {
    it("should list protocols with authentication", async () => {
      const response = await request(app).get("/api/protocolo").set("Authorization", `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.protocolos)).toBe(true)
    })

    it("should return 401 without authentication", async () => {
      const response = await request(app).get("/api/protocolo")

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it("should support pagination", async () => {
      const response = await request(app)
        .get("/api/protocolo?page=1&limit=10")
        .set("Authorization", `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.pagination).toBeDefined()
    })
  })
})
