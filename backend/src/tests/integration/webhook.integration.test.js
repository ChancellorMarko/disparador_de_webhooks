const request = require("supertest")
const app = require("../../src/app")
const { sequelize } = require("../../src/config/database")
const SoftwareHouse = require("../../src/models/SoftwareHouse")
const AuthenticationService = require("../../src/services/AuthenticationService")

describe("Webhook Integration Tests", () => {
  let softwareHouse
  let authToken

  beforeAll(async () => {
    // Sync database
    await sequelize.sync({ force: true })

    // Create test software house
    softwareHouse = await SoftwareHouse.create({
      cnpj: "12.345.678/0001-90",
      razao_social: "Test Software House",
      nome_fantasia: "Test SH",
      email: "test@example.com",
      senha: "password123",
      ativo: true,
    })

    // Generate auth token
    authToken = AuthenticationService.generateToken(softwareHouse)
  })

  afterAll(async () => {
    await sequelize.close()
  })

  describe("POST /api/webhook/receber", () => {
    it("should receive webhook successfully with valid data", async () => {
      const webhookData = {
        evento: "pedido.criado",
        dados: {
          pedido_id: 12345,
          cliente: "João Silva",
          valor: 150.0,
        },
      }

      const response = await request(app)
        .post("/api/webhook/receber")
        .set("X-Software-House-Token", softwareHouse.token_sh)
        .set("X-Correlation-ID", "test-correlation-123")
        .send(webhookData)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.protocolo).toBeDefined()
    })

    it("should return 400 when missing required headers", async () => {
      const webhookData = {
        evento: "pedido.criado",
        dados: { pedido_id: 12345 },
      }

      const response = await request(app).post("/api/webhook/receber").send(webhookData)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })

    it("should return 401 when software house token is invalid", async () => {
      const webhookData = {
        evento: "pedido.criado",
        dados: { pedido_id: 12345 },
      }

      const response = await request(app)
        .post("/api/webhook/receber")
        .set("X-Software-House-Token", "invalid_token")
        .set("X-Correlation-ID", "test-correlation-123")
        .send(webhookData)

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it("should return 400 when webhook data is invalid", async () => {
      const response = await request(app)
        .post("/api/webhook/receber")
        .set("X-Software-House-Token", softwareHouse.token_sh)
        .set("X-Correlation-ID", "test-correlation-123")
        .send({})

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe("POST /api/webhook/enviar", () => {
    it("should send webhook successfully", async () => {
      const webhookData = {
        url: "https://webhook.site/test",
        metodo: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        corpo: {
          evento: "teste",
          dados: { test: true },
        },
      }

      const response = await request(app)
        .post("/api/webhook/enviar")
        .set("X-Software-House-Token", softwareHouse.token_sh)
        .set("X-Correlation-ID", "test-correlation-123")
        .send(webhookData)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })

    it("should return 400 when URL is missing", async () => {
      const response = await request(app)
        .post("/api/webhook/enviar")
        .set("X-Software-House-Token", softwareHouse.token_sh)
        .set("X-Correlation-ID", "test-correlation-123")
        .send({
          metodo: "POST",
          corpo: { test: true },
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })
})
