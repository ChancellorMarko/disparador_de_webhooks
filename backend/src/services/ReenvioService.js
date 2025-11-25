const { WebhookReprocessado, Servico, Convenio, Conta } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { AppError } = require("../utils/errors");

const situacaoMap = {
  boleto: { 
    disponivel: "REGISTRADO", 
    cancelado: "BAIXADO", 
    pago: "LIQUIDADO" 
  },
  pagamento: { 
    disponivel: "SCHEDULED_ACTIVE", 
    cancelado: "CANCELLED", 
    pago: "PAID" 
  },
  pix: { 
    disponivel: "ACTIVE", 
    cancelado: "REJECTED", 
    pago: "LIQUIDATED" 
  }
};

class ReenvioService {
  static async criarReenvio(reenvioData, cedente) {
    try {
      const { product, id: idsString, kind, type } = reenvioData;
      const ids = idsString.map(id => parseInt(id, 10));
      if (ids.some(isNaN)) {
        throw new AppError("Parâmetro inválido. O array de IDs deve conter apenas números.", 400);
      }

      await this.validarServicos(ids, product, type, cedente.id);
      
      const protocolo = uuidv4();
      await WebhookReprocessado.create({
        id: protocolo,
        data: reenvioData,
        data_criacao: new Date(),
        cedente_id: cedente.id,
        kind,
        type,
        servico_id: JSON.stringify(ids),
        protocolo,
      });

      return { protocolo };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("ERRO INESPERADO NO REENVIO SERVICE:", error);
      throw new AppError("Não foi possível gerar a notificação. Tente novamente mais tarde.", 500);
    }
  }

  static async validarServicos(ids, product, type, cedenteId) {
    const servicos = await Servico.findAll({
      where: { id: { [Op.in]: ids } },
      include: [{
        model: Convenio, as: 'convenio', required: true,
        include: [{
          model: Conta, as: 'conta', required: true,
          where: { cedente_id: cedenteId }
        }]
      }]
    });

    if (servicos.length !== ids.length) {
      const idsEncontrados = servicos.map(s => s.id);
      const idsFaltantes = ids.filter(id => !idsEncontrados.includes(id));
      throw new AppError(`Parâmetro inválido. IDs não encontrados ou não pertencem a você: ${idsFaltantes.join(", ")}`, 400);
    }
    
    const situacaoEsperada = situacaoMap[product]?.[type];
    if (!situacaoEsperada) {
        throw new AppError(`O tipo '${type}' é inválido para o produto '${product}'.`, 400);
    }

    for (const servico of servicos) {
      // Validação do produto (ex: 'boleto')
      if (servico.produto && servico.produto !== product) {
          throw new AppError(`Parâmetro inválido. O serviço de ID ${servico.id} é do produto '${servico.produto}', mas a requisição é para '${product}'.`, 400);
      }

      
      if (servico.status !== situacaoEsperada) {
        throw new AppError(`A situação do ${product} diverge do tipo solicitado. IDs incorretos: ${servico.id}`, 422);
      }
    }

    return true;
  }
}

module.exports = ReenvioService;