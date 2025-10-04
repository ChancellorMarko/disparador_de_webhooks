const { Convenio, Conta, Servico } = require("../models");
const { Op } = require("sequelize");

class ConvenioRepository {
  async create(data) {
    return await Convenio.create(data);
  }

  async findById(id) {
    return await Convenio.findByPk(id, {
      include: [
        { model: Conta, as: "conta", required: false },
        { model: Servico, as: "servicos", required: false },
      ],
    });
  }
  
  async findByNumero(numeroConvenio) {
    return await Convenio.findOne({
        where: { numero_convenio: numeroConvenio },
        include: [{ model: Conta, as: "conta", required: false }],
    });
  }

  async findAll(filters = {}) {
    const where = {};
    if (filters.numero_convenio) where.numero_convenio = { [Op.like]: `%${filters.numero_convenio}%` };
    if (filters.conta_id) where.conta_id = filters.conta_id;

    return await Convenio.findAll({
      where,
      include: [
        { model: Conta, as: "conta", required: false },
        { model: Servico, as: "servicos", required: false },
      ],
      // CORRIGIDO: Ordenando pelo campo correto 'created_at'
      order: [["created_at", "DESC"]],
    });
  }

  async findByConta(contaId) {
    return await Convenio.findAll({
      where: { conta_id: contaId },
      include: [{ model: Servico, as: "servicos", required: false }],
      // CORRIGIDO: Ordenando pelo campo correto 'created_at'
      order: [["created_at", "DESC"]],
    });
  }

  async update(id, data) {
    const convenio = await Convenio.findByPk(id);
    if (!convenio) return null;
    return await convenio.update(data);
  }

  async delete(id) {
    const convenio = await Convenio.findByPk(id);
    if (!convenio) return false;
    await convenio.destroy();
    return true;
  }

  async count(filters = {}) {
    const where = {};
    if (filters.conta_id) where.conta_id = filters.conta_id;
    return await Convenio.count({ where });
  }

  async existsByNumero(numeroConvenio, excludeId = null) {
    const where = { numero_convenio: numeroConvenio };
    if (excludeId) where.id = { [Op.ne]: excludeId };
    return (await Convenio.count({ where })) > 0;
  }
}

module.exports = new ConvenioRepository();
