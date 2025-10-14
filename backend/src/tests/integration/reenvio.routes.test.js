// tests/integration/reenvio.routes.test.js
// VERSÃO CORRIGIDA

const request = require("supertest")
const app = require("../../app")
const jwt = require("jsonwebtoken")
const ServicoRepository = require("../../repositories/ServicoRepository")
const { SoftwareHouse, Cedente, WebhookReprocessado } = require("../../models") // Declaring the jest variable
// Mock das dependências
jest.mock("jsonwebtoken")
jest.mock("../../repositories/ServicoRepository")

// This allows models to load properly in models/index.js
// We'll mock the methods directly in beforeEach instead

describe("Rota de Reenvio - POST /api/reenviar", () => {
  let mockToken

  beforeEach(() => {
    jest.clearAllMocks()
    mockToken = "valid-jwt-token"

    jwt.verify.mockReturnValue({ softwareHouseId: 1 })

    jest.spyOn(SoftwareHouse, "findOne").mockResolvedValue({ id: 1, cnpj: "11222333000144" })
    jest.spyOn(Cedente, "findOne").mockResolvedValue({ id: 10, softwarehouse_id: 1 })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("deve criar uma solicitação de reenvio com sucesso e retornar status 201", async () => {
    ServicoRepository.findAll.mockResolvedValue([
      { id: "boleto1", status: "REGISTRADO" },
      { id: "boleto2", status: "REGISTRADO" },
    ])

    jest.spyOn(WebhookReprocessado, "create").mockResolvedValue({ protocolo: "mock-protocolo-uuid" })

    const requestBody = {
      product: "boleto",
      id: ["boleto1", "boleto2"],
      kind: "webhook",
      type: "disponivel",
    }

    const response = await request(app)
      .post("/api/reenviar")
      .set("Authorization", `Bearer ${mockToken}`)
      .set("cnpj-sh", "11222333000144")
      .set("token-sh", "token-sh-valido")
      .set("cnpj-cedente", "cnpj-cedente-valido")
      .set("token-cedente", "token-cedente-valido")
      .send(requestBody)
      .expect(201)

    expect(response.body.success).toBe(true)
    expect(response.body.data).toHaveProperty("protocolo")
    expect(WebhookReprocessado.create).toHaveBeenCalled()
  })
})
