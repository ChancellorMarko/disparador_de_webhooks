const request = require("supertest");
const app = require("../../app");
const ProtocoloService = require("../../services/ProtocoloService");

// Mock do middleware de autenticação
jest.mock("../../middlewares/auth", () => ({
  authenticateJWT: (req, res, next) => {
    req.auth = { cedente: { id: 1 } };
    return next();
  },
}));

// Mock do Service
jest.mock("../../services/ProtocoloService");

describe("Rota de Protocolos - GET /api/protocolos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ... (outros testes "it" que já estão a passar) ...
  it("deve retornar erro 400 se o filtro start_date for obrigatório e não for fornecido", async () => {
    const response = await request(app)
      .get("/api/protocolos?end_date=2025-10-10")
      .expect(400);
    expect(response.body.error).toContain('"start_date" is required');
  });

  it("deve retornar erro 400 se o intervalo de datas for maior que 31 dias", async () => {
    const response = await request(app)
      .get("/api/protocolos?start_date=2025-01-01&end_date=2025-03-01")
      .expect(400);
    expect(response.body.error).toContain(
      "O intervalo entre as datas não pode exceder 31 dias"
    );
  });


  it("deve retornar 200 com uma consulta válida", async () => {
    const mockData = [{ id: 1, protocolo: "mock-uuid-123" }];

    ProtocoloService.mockImplementation(() => {
      return {
        findAll: jest.fn().mockResolvedValue(mockData),
      };
    });

    const response = await request(app)
      .get("/api/protocolos?start_date=2025-10-01&end_date=2025-10-15")
      .expect(200);

    // **** LINHA DE DIAGNÓSTICO ****
    // Adicione esta linha para ver exatamente o que a API está retornando.
    console.log("CORPO DA RESPOSTA RECEBIDA:", JSON.stringify(response.body, null, 2));
    // *******************************

    expect(response.body.success).toBe(true);
    
    // A linha abaixo continuará a falhar até corrigirmos o controller.
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toEqual(mockData);
  });
});

