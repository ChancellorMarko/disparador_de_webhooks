const request = require("supertest")
const app = require("../../app")
const jwt = require("jsonwebtoken")
const { SoftwareHouse, Cedente, WebhookReprocessado, Servico, Convenio, Conta } = require("../../models")

jest.mock("jsonwebtoken")

describe("Rota de Reenvio - POST /api/reenviar", () => {
  let mockToken

  beforeEach(() => {
    jest.clearAllMocks()
    mockToken = "valid-jwt-token"

    jwt.verify.mockReturnValue({ softwareHouseId: 1 })

    jest.spyOn(SoftwareHouse, "findOne").mockResolvedValue({
      id: 1,
      cnpj: "11222333000144",
      status: "ativo",
    })

    jest.spyOn(Cedente, "findOne").mockResolvedValue({
      id: 10,
      softwarehouse_id: 1,
      status: "ativo",
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("deve criar uma solicitação de reenvio com sucesso e retornar status 201", async () => {
    jest.spyOn(Servico, "findAll").mockResolvedValue([
      {
        id: 1,
        produto: "boleto",
        status: "REGISTRADO",
        convenio: {
          conta: {
            cedente_id: 10,
          },
        },
      },
      {
        id: 2,
        produto: "boleto",
        status: "REGISTRADO",
        convenio: {
          conta: {
            cedente_id: 10,
          },
        },
      },
    ])

    jest.spyOn(WebhookReprocessado, "create").mockResolvedValue({
      protocolo: "mock-protocolo-uuid",
    })

    const requestBody = {
      product: "boleto",
      id: ["1", "2"],
      kind: "webhook",
      type: "disponivel",
    }

    const response = await request(app)
      .post("/api/reenviar")
      .set("Authorization", `Bearer ${mockToken}`)
      .set("x-api-cnpj-sh", "11222333000144")
      .set("x-api-token-sh", "token-sh-valido")
      .set("x-api-cnpj-cedente", "cnpj-cedente-valido")
      .set("x-api-token-cedente", "token-cedente-valido")
      .send(requestBody)
      .expect(201)

    expect(response.body.success).toBe(true)
    expect(response.body.data).toHaveProperty("protocolo")
    expect(WebhookReprocessado.create).toHaveBeenCalled()
  })
})
