const { Servico, Convenio } = require("../models")
const { Op } = require("sequelize")

class ServicoRepository {
  /**
   * Cria um novo Serviço
   */
  async create(data) {
    return await Servico.create(data)
  }

  /**
   * Busca Serviço por ID
   */
  async findById(id) {
    return await Servico.findByPk(id, {
      include: [
        {
          model: Convenio,
          as: "convenio",
          required: false,
        },
      ],
    })
  }

  /**
   * Lista todos os Serviços com filtros opcionais
   */
  async findAll(filters = {}) {
    const where = {}

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.convenio_id) {
      where.convenio_id = filters.convenio_id
    }

    return await Servico.findAll({
      where,
      include: [
        {
          model: Convenio,
          as: "convenio",
          required: false,
        },
      ],
      order: [["data_criacao", "DESC"]],
    })
  }

  /**
   * Busca Serviços por Convênio
   */
  async findByConvenio(convenioId) {
    return await Servico.findAll({
      where: { convenio_id: convenioId },
      order: [["data_criacao", "DESC"]],
    })
  }

  /**
   * Atualiza um Serviço
   */
  async update(id, data) {
    const servico = await Servico.findByPk(id)
    if (!servico) {
      return null
    }
    return await servico.update(data)
  }

  /**
   * Deleta um Serviço
   */
  async delete(id) {
    const servico = await Servico.findByPk(id)
    if (!servico) {
      return false
    }
    await servico.destroy()
    return true
  }

  /**
   * Ativa um Serviço
   */
  async activate(id) {
    return await this.update(id, { status: "ativo" })
  }

  /**
   * Inativa um Serviço
   */
  async deactivate(id) {
    return await this.update(id, { status: "inativo" })
  }

  /**
   * Conta total de Serviços
   */
  async count(filters = {}) {
    const where = {}
    if (filters.status) {
      where.status = filters.status
    }
    if (filters.convenio_id) {
      where.convenio_id = filters.convenio_id
    }
    return await Servico.count({ where })
  }

  /**
   * Busca Serviços ativos por Convênio
   */
  async findActiveByConvenio(convenioId) {
    return await Servico.findAll({
      where: {
        convenio_id: convenioId,
        status: "ativo",
      },
      order: [["data_criacao", "DESC"]],
    })
  }
}

module.exports = new ServicoRepository()
