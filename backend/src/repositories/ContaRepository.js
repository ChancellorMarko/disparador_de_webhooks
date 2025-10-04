const { Conta, Cedente, Convenio } = require("../models");
const { Op } = require("sequelize");

class ContaRepository {
  async create(data) {
    return await Conta.create(data);
  }

  async findById(id) {
    return await Conta.findByPk(id, {
      include: [
        { model: Cedente, as: "cedente", required: false },
        { model: Convenio, as: "convenios", required: false },
      ],
    });
  }

  async findAll(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.produto) where.produto = filters.produto;
    if (filters.banco_codigo) where.banco_codigo = filters.banco_codigo;
    if (filters.cedente_id) where.cedente_id = filters.cedente_id;

    return await Conta.findAll({
      where,
      include: [
        { model: Cedente, as: "cedente", required: false },
        { model: Convenio, as: "convenios", required: false },
      ],
      // CORRIGIDO: Ordenando pelo campo correto 'created_at'
      order: [["created_at", "DESC"]],
    });
  }

  async findByCedente(cedenteId) {
    return await Conta.findAll({
      where: { cedente_id: cedenteId },
      include: [{ model: Convenio, as: "convenios", required: false }],
      // CORRIGIDO: Ordenando pelo campo correto 'created_at'
      order: [["created_at", "DESC"]],
    });
  }
  
  // ... (outros métodos findBy... também precisam da correção na ordenação)
  
  async update(id, data) {
    const conta = await Conta.findByPk(id);
    if (!conta) return null;
    return await conta.update(data);
  }

  async delete(id) {
    const conta = await Conta.findByPk(id);
    if (!conta) return false;
    await conta.destroy();
    return true;
  }

  async activate(id) {
    return await this.update(id, { status: "ativo" });
  }

  async deactivate(id) {
    return await this.update(id, { status: "inativo" });
  }

  async updateNotificationConfig(id, config) {
    return await this.update(id, { configuracao_notificacao: config });
  }

  async count(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.produto) where.produto = filters.produto;
    if (filters.cedente_id) where.cedente_id = filters.cedente_id;
    return await Conta.count({ where });
  }

  async findByCedenteProdutoBanco(cedenteId, produto, bancocodigo) {
    return await Conta.findOne({
      where: {
        cedente_id: cedenteId,
        produto,
        banco_codigo: bancocodigo,
      },
    });
  }
}

module.exports = new ContaRepository();
