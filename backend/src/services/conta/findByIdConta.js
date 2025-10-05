const ContaRepository = require("../repositories/ContaRepository");
const { NotFoundError } = require("../utils/errors");

class findConta {
  /**
   * Busca Conta por ID
   */
  async byId(id) {
    const conta = await ContaRepository.findById(id);
    if (!conta) {
      throw new NotFoundError("Conta não encontrada");
    }
    return conta;
  }

  /**
   * Lista todas as Contas com filtros
   */
  async all(filters = {}) {
    return await ContaRepository.findAll(filters);
  }

  /**
   * Lista Contas por Cedente
   */
  async byCedente(cedenteId) {
    return await ContaRepository.findByCedente(cedenteId);
  }

  /**
   * Lista Contas por Produto
   */
  async byProduto(produto) {
    return await ContaRepository.findByProduto(produto);
  }

  /**
   * Lista Contas por Banco
   */
  async byBanco(bancocodigo) {
    return await ContaRepository.findByBanco(bancocodigo);
  }

  /**
   * Conta total de Contas
   */
  async count(filters = {}) {
    return await ContaRepository.count(filters);
  }
}

module.exports = new findConta();