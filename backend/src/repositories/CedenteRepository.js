const { Cedente, SoftwareHouse, Conta, WebhookReprocessado } = require("../models")
const { Op } = require("sequelize")

class CedenteRepository {
  /**
   * Cria um novo Cedente
   */
  async create(data) {
    return await Cedente.create(data)
  }

  /**
   * Busca Cedente por ID
   */
  async findById(id) {
    return await Cedente.findByPk(id, {
      include: [
        {
          model: SoftwareHouse,
          as: "softwareHouse",
          required: false,
        },
        {
          model: Conta,
          as: "contas",
          required: false,
        },
      ],
    })
  }

  /**
   * Busca Cedente por CNPJ
   */
  async findByCnpj(cnpj) {
    return await Cedente.findOne({
      where: { cnpj },
      include: [
        {
          model: SoftwareHouse,
          as: "softwareHouse",
          required: false,
        },
      ],
    })
  }

  /**
   * Busca Cedente por token
   */
  async findByToken(token) {
    return await Cedente.findOne({
      where: { token },
    })
  }

  /**
   * Lista todos os Cedentes com filtros opcionais
   */
  async findAll(filters = {}) {
    const where = {}

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.cnpj) {
      where.cnpj = { [Op.like]: `%${filters.cnpj}%` }
    }

    if (filters.softwarehouse_id) {
      where.softwarehouse_id = filters.softwarehouse_id
    }

    return await Cedente.findAll({
      where,
      include: [
        {
          model: SoftwareHouse,
          as: "softwareHouse",
          required: false,
        },
        {
          model: Conta,
          as: "contas",
          required: false,
        },
      ],
      order: [["data_criacao", "DESC"]],
    })
  }

  /**
   * Busca Cedentes por Software House
   */
  async findBySoftwareHouse(softwarehouseId) {
    return await Cedente.findAll({
      where: { softwarehouse_id: softwarehouseId },
      include: [
        {
          model: Conta,
          as: "contas",
          required: false,
        },
      ],
      order: [["data_criacao", "DESC"]],
    })
  }

  /**
   * Atualiza um Cedente
   */
  async update(id, data) {
    const cedente = await Cedente.findByPk(id)
    if (!cedente) {
      return null
    }
    return await cedente.update(data)
  }

  /**
   * Deleta um Cedente
   */
  async delete(id) {
    const cedente = await Cedente.findByPk(id)
    if (!cedente) {
      return false
    }
    await cedente.destroy()
    return true
  }

  /**
   * Ativa um Cedente
   */
  async activate(id) {
    return await this.update(id, { status: "ativo" })
  }

  /**
   * Inativa um Cedente
   */
  async deactivate(id) {
    return await this.update(id, { status: "inativo" })
  }

  /**
   * Atualiza configuração de notificação
   */
  async updateNotificationConfig(id, config) {
    return await this.update(id, { configuracao_notificacao: config })
  }

  /**
   * Conta total de Cedentes
   */
  async count(filters = {}) {
    const where = {}
    if (filters.status) {
      where.status = filters.status
    }
    if (filters.softwarehouse_id) {
      where.softwarehouse_id = filters.softwarehouse_id
    }
    return await Cedente.count({ where })
  }

  /**
   * Verifica se CNPJ já existe
   */
  async existsByCnpj(cnpj, excludeId = null) {
    const where = { cnpj }
    if (excludeId) {
      where.id = { [Op.ne]: excludeId }
    }
    const count = await Cedente.count({ where })
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
    const count = await Cedente.count({ where })
    return count > 0
  }
}

module.exports = new CedenteRepository()
