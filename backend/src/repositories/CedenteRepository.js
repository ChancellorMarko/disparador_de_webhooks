const { Cedente, SoftwareHouse, Conta } = require("../models");
const { Op } = require("sequelize");

class CedenteRepository {
  async create(data) {
    return await Cedente.create(data);
  }

  async findById(id) {
    return await Cedente.findByPk(id, {
      include: [
        { model: SoftwareHouse, as: "softwareHouse", required: false },
        { model: Conta, as: "contas", required: false },
      ],
    });
  }

  async findByCnpj(cnpj) {
    return await Cedente.findOne({
      where: { cnpj },
      include: [{ model: SoftwareHouse, as: "softwareHouse", required: false }],
    });
  }

  async findByToken(token) {
    return await Cedente.findOne({
      where: { token },
    });
  }

  async findAll(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.cnpj) where.cnpj = { [Op.like]: `%${filters.cnpj}%` };
    if (filters.softwarehouse_id) where.softwarehouse_id = filters.softwarehouse_id;

    return await Cedente.findAll({
      where,
      include: [
        { model: SoftwareHouse, as: "softwareHouse", required: false },
        { model: Conta, as: "contas", required: false },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  async findBySoftwareHouse(softwarehouseId) {
    return await Cedente.findAll({
      where: { softwarehouse_id: softwarehouseId },
      include: [{ model: Conta, as: "contas", required: false }],
      order: [["created_at", "DESC"]],
    });
  }

  async update(id, data) {
    const cedente = await Cedente.findByPk(id);
    if (!cedente) return null;
    return await cedente.update(data);
  }

  async delete(id) {
    const cedente = await Cedente.findByPk(id);
    if (!cedente) return false;
    await cedente.destroy();
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
    if (filters.softwarehouse_id) where.softwarehouse_id = filters.softwarehouse_id;
    return await Cedente.count({ where });
  }

  async existsByCnpj(cnpj, excludeId = null) {
    const where = { cnpj };
    if (excludeId) where.id = { [Op.ne]: excludeId };
    return (await Cedente.count({ where })) > 0;
  }

  async existsByToken(token, excludeId = null) {
    const where = { token };
    if (excludeId) where.id = { [Op.ne]: excludeId };
    return (await Cedente.count({ where })) > 0;
  }
}

module.exports = new CedenteRepository();
