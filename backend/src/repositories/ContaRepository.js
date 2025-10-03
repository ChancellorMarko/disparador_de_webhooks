const { Conta, Cedente, Convenio } = require("../models")
const { Op } = require("sequelize")

class ContaRepository {
  /**
   * Cria uma nova Conta
   */
  async create(data) {
    return await Conta.create(data)
  }

  /**
   * Busca Conta por ID
   */
  async findById(id) {
    return await Conta.findByPk(id, {
      include: [
        {
          model: Cedente,
          as: "cedente",
          required: false,
        },
        {
          model: Convenio,
          as: "convenios",
          required: false,
        },
      ],
    })
  }

  /**
   * Lista todas as Contas com filtros opcionais
   */
  async findAll(filters = {}) {
    const where = {}

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.produto) {
      where.produto = filters.produto
    }

    if (filters.banco_codigo) {
      where.banco_codigo = filters.banco_codigo
    }

    if (filters.cedente_id) {
      where.cedente_id = filters.cedente_id
    }

    return await Conta.findAll({
      where,
      include: [
        {
          model: Cedente,
          as: "cedente",
          required: false,
        },
        {
          model: Convenio,
          as: "convenios",
          required: false,
        },
      ],
      order: [["data_criacao", "DESC"]],
    })
  }

  /**
   * Busca Contas por Cedente
   */
  async findByCedente(cedenteId) {
    return await Conta.findAll({
      where: { cedente_id: cedenteId },
      include: [
        {
          model: Convenio,
          as: "convenios",
          required: false,
        },
      ],
      order: [["data_criacao", "DESC"]],
    })
  }

  /**
   * Busca Contas por produto
   */
  async findByProduto(produto) {
    return await Conta.findAll({
      where: { produto },
      include: [
        {
          model: Cedente,
          as: "cedente",
          required: false,
        },
      ],
      order: [["data_criacao", "DESC"]],
    })
  }

  /**
   * Busca Contas por banco
   */
  async findByBanco(bancocodigo) {
    return await Conta.findAll({
      where: { banco_codigo: bancocodigo },
      include: [
        {
          model: Cedente,
          as: "cedente",
          required: false,
        },
      ],
      order: [["data_criacao", "DESC"]],
    })
  }

  /**
   * Atualiza uma Conta
   */
  async update(id, data) {
    const conta = await Conta.findByPk(id)
    if (!conta) {
      return null
    }
    return await conta.update(data)
  }

  /**
   * Deleta uma Conta
   */
  async delete(id) {
    const conta = await Conta.findByPk(id)
    if (!conta) {
      return false
    }
    await conta.destroy()
    return true
  }

  /**
   * Ativa uma Conta
   */
  async activate(id) {
    return await this.update(id, { status: "ativo" })
  }

  /**
   * Inativa uma Conta
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
   * Conta total de Contas
   */
  async count(filters = {}) {
    const where = {}
    if (filters.status) {
      where.status = filters.status
    }
    if (filters.produto) {
      where.produto = filters.produto
    }
    if (filters.cedente_id) {
      where.cedente_id = filters.cedente_id
    }
    return await Conta.count({ where })
  }

  /**
   * Busca Conta por Cedente, Produto e Banco
   */
  async findByCedenteProdutoBanco(cedenteId, produto, bancocodigo) {
    return await Conta.findOne({
      where: {
        cedente_id: cedenteId,
        produto,
        banco_codigo: bancocodigo,
      },
    })
  }
}

module.exports = new ContaRepository()
