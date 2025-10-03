const { SoftwareHouse, Cedente } = require("../models")
const { Op } = require("sequelize")

class SoftwareHouseRepository {
  /**
   * Cria uma nova Software House
   */
  async create(data) {
    return await SoftwareHouse.create(data)
  }

  /**
   * Busca Software House por ID
   */
  async findById(id) {
    return await SoftwareHouse.findByPk(id, {
      include: [
        {
          model: Cedente,
          as: "cedentes",
          required: false,
        },
      ],
    })
  }

  /**
   * Busca Software House por CNPJ
   */
  async findByCnpj(cnpj) {
    return await SoftwareHouse.findOne({
      where: { cnpj },
    })
  }

  /**
   * Busca Software House por token
   */
  async findByToken(token) {
    return await SoftwareHouse.findOne({
      where: { token },
    })
  }

  /**
   * Lista todas as Software Houses com filtros opcionais
   */
  async findAll(filters = {}) {
    const where = {}

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.cnpj) {
      where.cnpj = { [Op.like]: `%${filters.cnpj}%` }
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
      order: [["data_criacao", "DESC"]],
    })
  }

  /**
   * Atualiza uma Software House
   */
  async update(id, data) {
    const softwareHouse = await SoftwareHouse.findByPk(id)
    if (!softwareHouse) {
      return null
    }
    return await softwareHouse.update(data)
  }

  /**
   * Deleta uma Software House
   */
  async delete(id) {
    const softwareHouse = await SoftwareHouse.findByPk(id)
    if (!softwareHouse) {
      return false
    }
    await softwareHouse.destroy()
    return true
  }

  /**
   * Ativa uma Software House
   */
  async activate(id) {
    return await this.update(id, { status: "ativo" })
  }

  /**
   * Inativa uma Software House
   */
  async deactivate(id) {
    return await this.update(id, { status: "inativo" })
  }

  /**
   * Conta total de Software Houses
   */
  async count(filters = {}) {
    const where = {}
    if (filters.status) {
      where.status = filters.status
    }
    return await SoftwareHouse.count({ where })
  }

  /**
   * Verifica se CNPJ já existe
   */
  async existsByCnpj(cnpj, excludeId = null) {
    const where = { cnpj }
    if (excludeId) {
      where.id = { [Op.ne]: excludeId }
    }
    const count = await SoftwareHouse.count({ where })
    return count > 0
  }

  /**
   * Verifica se token já existe
   */
  async existsByToken(token, excludeId = null) {
    const where = { token }
    if (excludeId) {
      where.id = { [Op.ne]: excludeId }
    }
    const count = await SoftwareHouse.count({ where })
    return count > 0
  }
}

module.exports = new SoftwareHouseRepository()
