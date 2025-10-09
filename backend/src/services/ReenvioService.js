const { WebhookReprocessado } = require("../models");
const { v4: uuidv4 } = require("uuid");
const ServicoRepository = require("../repositories/ServicoRepository");
const { Op } = require("sequelize");
const { AppError } = require("../utils/errors");

const situacaoMap = {
  boleto: { disponivel: "REGISTRADO", cancelado: "BAIXADO", pago: "LIQUIDADO" },
  pagamento: { disponivel: "SCHEDULED_ACTIVE", cancelado: "CANCELLED", pago: "PAID" },
  pix: { disponivel: "ACTIVE", cancelado: "REJECTED", pago: "LIQUIDATED" },
};

class ReenvioService {
  static async criarReenvio(reenvioData, cedente) {
    try {
      const { product, id, kind, type } = reenvioData;

      // >>> ADICIONADO PARA DEPURAÇÃO FINAL <<<
      console.log('VALORES RECEBIDOS PARA VALIDAÇÃO:', { product, type });

      const situacaoEsperada = situacaoMap[product][type];
      
      const idsIncorretos = await this.validarSituacaoDosServicos(id, situacaoEsperada);
      if (idsIncorretos.length > 0) {
        const errorMessage = `A situação do ${product} diverge. IDs incorretos: ${idsIncorretos.join(", ")}`;
        throw new AppError(errorMessage, 422);
      }

      const protocolo = uuidv4();
      await WebhookReprocessado.create({
        id: protocolo,
        data: reenvioData,
        data_criacao: new Date(),
        cedente_id: cedente.id,
        kind,
        type,
        servico_id: JSON.stringify(id),
        protocolo,
      });

      return { protocolo };

    } catch (error) {
      console.error("ERRO REAL CAPTURADO NO REENVIO SERVICE:", error);
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