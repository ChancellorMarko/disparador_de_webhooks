const { WebhookReprocessado } = require("../models");
const { v4: uuidv4 } = require("uuid");
const CacheService = require("./CacheService"); // Usando o novo CacheService
const ServicoRepository = require("../repositories/ServicoRepository");
const { Op } = require("sequelize");
const { AppError } = require("../utils/errors");

const situacaoMap = {
  boleto: { disponivel: "REGISTRADO", cancelado: "BAIXADO", pago: "LIQUIDADO" },
  pagamento: { disponivel: "SCHEDULED_ACTIVE", cancelado: "CANCELLED", pago: "PAID" },
  pix: { disponivel: "ACTIVE", cancelado: "REJECTED", pago: "LIQUIDATED" },
};

class ReenvioService {
  static async criarReenvio(reenvioData, auth) {
    const { product, id, kind, type } = reenvioData;
    const { cedente } = auth;

    const cacheKey = `reenvio:${JSON.stringify(reenvioData)}`;
    const cachedRequest = await CacheService.get(cacheKey);
    if (cachedRequest) {
      throw new AppError("Requisição idêntica já processada na última hora.", 429);
    }

    const situacaoEsperada = situacaoMap[product][type];
    const idsIncorretos = await this.validarSituacaoDosServicos(id, situacaoEsperada);
    if (idsIncorretos.length > 0) {
      const errorMessage = `A situação do ${product} diverge do tipo solicitado. IDs incorretos: ${idsIncorretos.join(", ")}`;
      throw new AppError(errorMessage, 422);
    }

    try {
      const protocolo = uuidv4();
      await WebhookReprocessado.create({
        id: protocolo, data: reenvioData, cedente_id: cedente.id,
        kind, type, servico_id: JSON.stringify(id), protocolo,
      });
      await CacheService.set(cacheKey, { processed: true }, 3600); // Salva no cache por 1 hora
      return { protocolo };
    } catch (error) {
      console.error("Falha ao salvar no banco de dados:", error);
      throw new AppError("Não foi possível gerar a notificação. Tente novamente mais tarde.", 500);
    }
  }

  static async validarSituacaoDosServicos(ids, situacaoEsperada) {
    const servicosEncontrados = await ServicoRepository.findAll({
      where: { id: { [Op.in]: ids } },
      attributes: ["id", "status"],
    });

    const idsEncontrados = new Set(servicosEncontrados.map(s => s.id.toString()));
    const idsIncorretos = ids.filter(id => !idsEncontrados.has(id.toString()));

    servicosEncontrados.forEach(servico => {
      if (servico.status !== situacaoEsperada) {
        idsIncorretos.push(servico.id);
      }
    });

    return [...new Set(idsIncorretos)];
  }
}

module.exports = ReenvioService;