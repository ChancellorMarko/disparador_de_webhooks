const { SoftwareHouse, Cedente } = require("../models");
const { Op } = require("sequelize");

class SoftwareHouseRepository {
  async create(data) {
    return await SoftwareHouse.create(data);
  }

  async findById(id) {
    return await SoftwareHouse.findByPk(id, {
      include: [
        {
          model: Cedente,
          as: "cedentes",
          required: false,
        },
      ],
    });
  }

  async findByCnpj(cnpj) {
    return await SoftwareHouse.findOne({
      where: { cnpj },
    });
  }

  async findByToken(token) {
    return await SoftwareHouse.findOne({
      where: { token },
    });
  }

  async findAll(filters = {}) {
    const where = {};
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.cnpj) {
      where.cnpj = { [Op.like]: `%${filters.cnpj}%` };
    }
    return await SoftwareHouse.findAll({
      where,
      include: [
        {
          model: Cedente,
          as: "cedentes",
          required: false,
        },
      ],
      // CORRIGIDO: Ordenando pelo campo correto 'created_at'
      order: [["created_at", "DESC"]],
    });
  }

  async update(id, data) {
    const softwareHouse = await SoftwareHouse.findByPk(id);
    if (!softwareHouse) {
      return null;
    }
    return await softwareHouse.update(data);
  }

  async delete(id) {
    const softwareHouse = await SoftwareHouse.findByPk(id);
    if (!softwareHouse) {
      return false;
    }
    await softwareHouse.destroy();
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
    if (filters.status) {
      where.status = filters.status;
    }
    return await SoftwareHouse.count({ where });
  }

  async existsByCnpj(cnpj, excludeId = null) {
    const where = { cnpj };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }
    const count = await SoftwareHouse.count({ where });
    return count > 0;
  }

  async existsByToken(token, excludeId = null) {
    const where = { token };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }
    const count = await SoftwareHouse.count({ where });
    return count > 0;
  }
}

module.exports = new SoftwareHouseRepository();