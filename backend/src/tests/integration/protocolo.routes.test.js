const request = require("supertest")
const app = require("../../app")
const ProtocoloService = require("../../services/ProtocoloService")
const { redisClient } = require("../../config/redis")

jest.mock("../../config/redis", () => ({
  redisClient: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue("OK"),
  },
}))

jest.mock("../../middlewares/auth", () => ({
  authenticateJWT: (req, res, next) => {
    req.auth = { cedente: { id: 1 } }
    return next()
  },
}))

jest.mock("../../services/ProtocoloService", () => ({
  findAll: jest.fn(),
  findByUuid: jest.fn(),
}))

describe("Rota de Protocolos - GET /api/protocolos", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("deve retornar erro 400 se o filtro start_date for obrigatório e não for fornecido", async () => {
    const response = await request(app).get("/api/protocolos?end_date=2025-10-10").expect(400)
    expect(response.body.error).toContain('"start_date" is required')
  })

  it("deve retornar erro 400 se o intervalo de datas for maior que 31 dias", async () => {
    const response = await request(app).get("/api/protocolos?start_date=2025-01-01&end_date=2025-03-01").expect(400)
    expect(response.body.error).toContain("O intervalo entre as datas não pode exceder 31 dias")
  })

  it("deve retornar 200 com uma consulta válida", async () => {
    const mockData = [{ id: 1, protocolo: "mock-uuid-123" }]

    ProtocoloService.findAll.mockResolvedValue(mockData)

    const response = await request(app).get("/api/protocolos?start_date=2025-10-01&end_date=2025-10-15").expect(200)

    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(response.body.data).toEqual(mockData)
  })
})
