const { WebhookReprocessado } = require('../models');
const { AppError } = require('../utils/errors');
const { Op } = require('sequelize'); // Importe o Op para fazer buscas por período

class ProtocoloService {
  async findByUuid(uuid) {
    const protocolo = await WebhookReprocessado.findByPk(uuid);
    if (!protocolo) {
      throw new AppError("Protocolo não encontrado.", 400);
    }
    return protocolo;
  }

  // NOVA FUNÇÃO IMPLEMENTADA
  async findAll(filters) {
    const { start_date, end_date } = filters;

    // Validação 1: Filtros de data são obrigatórios
    if (!start_date || !end_date) {
      throw new AppError("Os filtros 'start_date' e 'end_date' são obrigatórios.", 400);
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Validação 2: Intervalo de datas não pode ser maior que 31 dias
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays > 31) {
      throw new AppError("O intervalo entre as datas não pode ser maior que 31 dias.", 400);
    }

    // Busca no banco de dados usando o período
    const protocolos = await WebhookReprocessado.findAll({
      where: {
        // Busca registros cuja data de criação esteja ENTRE a data de início e a de fim
        created_at: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['created_at', 'DESC']], // Ordena pelos mais recentes
    });

    return protocolos;
  }
}

module.exports = new ProtocoloService();