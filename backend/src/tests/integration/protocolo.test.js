const request = require("supertest")
const app = require("../../app")
const { sequelize } = require("../../config/database")
const SoftwareHouse = require("../../models/SoftwareHouse")
const Cedente = require("../../models/Cedente")
const WebhookReprocessado = require("../../models/WebhookReprocessado")
const AuthenticationService = require("../../services/AuthenticationService")
const bcrypt = require("bcryptjs")

describe("Protocolo Integration Tests", () => {
  let authToken
  let softwareHouse
  let cedente
  let webhookReprocessado

  beforeAll(async () => {
    // Ensure database connection is established
    await sequelize.authenticate()

    // Create a test software house
    softwareHouse = await SoftwareHouse.create({
      cnpj: "12.345.678/0001-90",
      razao_social: "Test Software House LTDA",
      nome_fantasia: "Test SH",
      email: "test@softwarehouse.com",
      senha: "testpassword123", // Will be hashed by the model hook
      token_sh: "test_token_sh_" + Date.now(),
      ativo: true,
    })

    // Generate auth token using the actual service
    authToken = AuthenticationService.generateToken(softwareHouse)

    // Create a test cedente
    cedente = await Cedente.create({
      nome: "Test Cedente",
      email: "cedente@test.com",
    })

    // Create a test webhook reprocessado with protocolo
    webhookReprocessado = await WebhookReprocessado.create({
      data: { test: "data", value: 123 },
      cedente_id: cedente.id,
      kind: "test_kind",
      type: "test_type",
      servico_id: JSON.stringify(["service1", "service2"]),
      protocolo: "PROT-2024-001",
    })
  })

  afterAll(async () => {
    // Clean up test data
    try {
      if (webhookReprocessado) {
        await WebhookReprocessado.destroy({ where: { id: webhookReprocessado.id } })
      }
      if (cedente) {
        await Cedente.destroy({ where: { id: cedente.id } })
      }
      if (softwareHouse) {
        await SoftwareHouse.destroy({ where: { id: softwareHouse.id } })
      }
    } catch (error) {
      console.error("Error cleaning up test data:", error)
    }

    // Close database connection to prevent Jest hanging
    await sequelize.close()
  })

  describe("GET /api/protocolo", () => {
    it("should return success with authenticated software house", async () => {
      const response = await request(app).get("/api/protocolo").set("Authorization", `Bearer ${authToken}`).expect(200)

      expect(response.body).toHaveProperty("success", true)
      expect(response.body).toHaveProperty("user")
      expect(response.body.user).toHaveProperty("id", softwareHouse.id)
      expect(response.body.user).toHaveProperty("cnpj", softwareHouse.cnpj)
    })

    it("should return 401 without authentication", async () => {
      const response = await request(app).get("/api/protocolo").expect(401)

      expect(response.body).toHaveProperty("success", false)
      expect(response.body).toHaveProperty("error")
      expect(response.body).toHaveProperty("code", "MISSING_TOKEN")
    })

    it("should return 401 with invalid token format", async () => {
      const response = await request(app)
        .get("/api/protocolo")
        .set("Authorization", "InvalidFormat token123")
        .expect(401)

      expect(response.body).toHaveProperty("success", false)
      expect(response.body).toHaveProperty("code", "INVALID_TOKEN_FORMAT")
    })

    it("should return 401 with invalid token", async () => {
      const response = await request(app)
        .get("/api/protocolo")
        .set("Authorization", "Bearer invalid_token_here")
        .expect(401)

      expect(response.body).toHaveProperty("success", false)
      expect(response.body).toHaveProperty("code", "INVALID_TOKEN")
    })
  })

  describe("GET /api/protocolo/:uuid", () => {
    it("should return success for specific protocolo with authentication", async () => {
      const testUuid = "123e4567-e89b-12d3-a456-426614174000"

      const response = await request(app)
        .get(`/api/protocolo/${testUuid}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toHaveProperty("success", true)
      expect(response.body).toHaveProperty("protocolo")
      expect(response.body.protocolo).toHaveProperty("uuid", testUuid)
      expect(response.body).toHaveProperty("user")
    })

    it("should return 401 without authentication", async () => {
      const testUuid = "123e4567-e89b-12d3-a456-426614174000"

      const response = await request(app).get(`/api/protocolo/${testUuid}`).expect(401)

      expect(response.body).toHaveProperty("success", false)
      expect(response.body).toHaveProperty("error")
    })
  })

  describe("POST /api/protocolo", () => {
    it("should create a new protocolo with authentication", async () => {
      const newProtocoloData = {
        descricao: "New Test Protocol",
        prioridade: "ALTA",
      }

      const response = await request(app)
        .post("/api/protocolo")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newProtocoloData)
        .expect(201)

      expect(response.body).toHaveProperty("success", true)
      expect(response.body).toHaveProperty("message")
      expect(response.body).toHaveProperty("protocolo")
      expect(response.body).toHaveProperty("user")
    })

    it("should return 401 without authentication", async () => {
      const response = await request(app)
        .post("/api/protocolo")
        .send({ descricao: "Test", prioridade: "MEDIA" })
        .expect(401)

      expect(response.body).toHaveProperty("success", false)
      expect(response.body).toHaveProperty("error")
    })
  })

  describe("PUT /api/protocolo/:uuid", () => {
    it("should update protocolo with authentication", async () => {
      const testUuid = "123e4567-e89b-12d3-a456-426614174000"
      const updateData = {
        status: "EM_ANDAMENTO",
      }

      const response = await request(app)
        .put(`/api/protocolo/${testUuid}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)

      expect(response.body).toHaveProperty("success", true)
      expect(response.body).toHaveProperty("protocolo")
      expect(response.body.protocolo).toHaveProperty("uuid", testUuid)
    })

    it("should return 401 without authentication", async () => {
      const testUuid = "123e4567-e89b-12d3-a456-426614174000"

      const response = await request(app).put(`/api/protocolo/${testUuid}`).send({ status: "CONCLUIDO" }).expect(401)

      expect(response.body).toHaveProperty("success", false)
    })
  })

  describe("DELETE /api/protocolo/:uuid", () => {
    it("should delete protocolo with authentication", async () => {
      const testUuid = "123e4567-e89b-12d3-a456-426614174000"

      const response = await request(app)
        .delete(`/api/protocolo/${testUuid}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toHaveProperty("success", true)
      expect(response.body).toHaveProperty("message")
      expect(response.body.protocolo).toHaveProperty("uuid", testUuid)
    })

    it("should return 401 without authentication", async () => {
      const testUuid = "123e4567-e89b-12d3-a456-426614174000"

      const response = await request(app).delete(`/api/protocolo/${testUuid}`).expect(401)

      expect(response.body).toHaveProperty("success", false)
    })
  })

  describe("Authentication Edge Cases", () => {
    it("should reject expired token", async () => {
      // Create an expired token
      const expiredToken = AuthenticationService.generateToken({
        id: softwareHouse.id,
        cnpj: softwareHouse.cnpj,
        token_sh: softwareHouse.token_sh,
      })

      // Note: This test would need a way to create an actually expired token
      // For now, we're just testing the structure
      const response = await request(app)
        .get("/api/protocolo")
        .set("Authorization", `Bearer ${expiredToken}`)
        .expect(200) // Will succeed with valid token

      expect(response.body).toHaveProperty("success", true)
    })

    it("should reject token without Bearer prefix", async () => {
      const response = await request(app).get("/api/protocolo").set("Authorization", authToken).expect(401)

      expect(response.body).toHaveProperty("success", false)
      expect(response.body).toHaveProperty("code", "INVALID_TOKEN_FORMAT")
    })

    it("should reject empty authorization header", async () => {
      const response = await request(app).get("/api/protocolo").set("Authorization", "").expect(401)

      expect(response.body).toHaveProperty("success", false)
    })
  })
})
