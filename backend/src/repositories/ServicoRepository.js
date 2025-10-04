const { Servico, Convenio } = require("../models");
const { Op } = require("sequelize");

class ServicoRepository {
  async create(data) {
    return await Servico.create(data);
  }

  async findById(id) {
    return await Servico.findByPk(id, {
      include: [{ model: Convenio, as: "convenio", required: false }],
    });
  }

  async findAll(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.convenio_id) where.convenio_id = filters.convenio_id;

    return await Servico.findAll({
      where,
      include: [{ model: Convenio, as: "convenio", required: false }],
      // CORRIGIDO: Ordenando pelo campo correto 'created_at'
      order: [["created_at", "DESC"]],
    });
  }

  async findByConvenio(convenioId) {
    return await Servico.findAll({
      where: { convenio_id: convenioId },
      // CORRIGIDO: Ordenando pelo campo correto 'created_at'
      order: [["created_at", "DESC"]],
    });
  }
  
  async findActiveByConvenio(convenioId) {
    return await Servico.findAll({
      where: {
        convenio_id: convenioId,
        status: "ativo",
      },
      // CORRIGIDO: Ordenando pelo campo correto 'created_at'
      order: [["created_at", "DESC"]],
    });
  }

  async update(id, data) {
    const servico = await Servico.findByPk(id);
    if (!servico) return null;
    return await servico.update(data);
  }

  async delete(id) {
    const servico = await Servico.findByPk(id);
    if (!servico) return false;
    await servico.destroy();
    return true;
  }

  async activate(id) {
    return await this.update(id, { status: "ativo" });
  }

  async deactivate(id) {
    return await this.update(id, { status: "inativo" });
  }

  async count(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.convenio_id) where.convenio_id = filters.convenio_id;
    return await Servico.count({ where });
  }
}

module.exports = new ServicoRepository();