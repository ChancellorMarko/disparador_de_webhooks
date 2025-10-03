const { Convenio, Conta, Servico } = require("../models")
const { Op } = require("sequelize")

class ConvenioRepository {
  /**
   * Cria um novo Convênio
   */
  async create(data) {
    return await Convenio.create(data)
  }

  /**
   * Busca Convênio por ID
   */
  async findById(id) {
    return await Convenio.findByPk(id, {
      include: [
        {
          model: Conta,
          as: "conta",
          required: false,
        },
        {
          model: Servico,
          as: "servicos",
          required: false,
        },
      ],
    })
  }

  /**
   * Busca Convênio por número
   */
  async findByNumero(numeroConvenio) {
    return await Convenio.findOne({
      where: { numero_convenio: numeroConvenio },
      include: [
        {
          model: Conta,
          as: "conta",
          required: false,
        },
      ],
    })
  }

  /**
   * Lista todos os Convênios com filtros opcionais
   */
  async findAll(filters = {}) {
    const where = {}

    if (filters.numero_convenio) {
      where.numero_convenio = { [Op.like]: `%${filters.numero_convenio}%` }
    }

    if (filters.conta_id) {
      where.conta_id = filters.conta_id
    }

    return await Convenio.findAll({
      where,
      include: [
        {
          model: Conta,
          as: "conta",
          required: false,
        },
        {
          model: Servico,
          as: "servicos",
          required: false,
        },
      ],
      order: [["data_criacao", "DESC"]],
    })
  }

  /**
   * Busca Convênios por Conta
   */
  async findByConta(contaId) {
    return await Convenio.findAll({
      where: { conta_id: contaId },
      include: [
        {
          model: Servico,
          as: "servicos",
          required: false,
        },
      ],
      order: [["data_criacao", "DESC"]],
    })
  }

  /**
   * Atualiza um Convênio
   */
  async update(id, data) {
    const convenio = await Convenio.findByPk(id)
    if (!convenio) {
      return null
    }
    return await convenio.update(data)
  }

  /**
   * Deleta um Convênio
   */
  async delete(id) {
    const convenio = await Convenio.findByPk(id)
    if (!convenio) {
      return false
    }
    await convenio.destroy()
    return true
  }

  /**
   * Conta total de Convênios
   */
  async count(filters = {}) {
    const where = {}
    if (filters.conta_id) {
      where.conta_id = filters.conta_id
    }
    return await Convenio.count({ where })
  }

  /**
   * Verifica se número de convênio já existe
   */
  async existsByNumero(numeroConvenio, excludeId = null) {
    const where = { numero_convenio: numeroConvenio }
    if (excludeId) {
      where.id = { [Op.ne]: excludeId }
    }
    const count = await Convenio.count({ where })
    return count > 0
  }

  /**
   * Busca Convênio por Conta e Número
   */
  async findByContaAndNumero(contaId, numeroConvenio) {
    return await Convenio.findOne({
      where: {
        conta_id: contaId,
        numero_convenio: numeroConvenio,
      },
    })
  }
}

module.exports = new ConvenioRepository()
