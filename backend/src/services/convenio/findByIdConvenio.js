const ConvenioRepository = require("../repositories/ConvenioRepository");

class findConvenio {
  /**
   * Busca Convênio por ID
   */
  async byId(id) {
    const convenio = await ConvenioRepository.findById(id);
    if (!convenio) {
      throw new Error("Convênio não encontrado");
    }
    return convenio;
  }

  /**
   * Busca Convênio por número
   */
  async byNumero(numeroConvenio) {
    const convenio = await ConvenioRepository.findByNumero(numeroConvenio);
    if (!convenio) {
      throw new Error("Convênio não encontrado");
    }
    return convenio;
  }

  /**
   * Lista todos os Convênios com filtros
   */
  async all(filters = {}) {
    return await ConvenioRepository.findAll(filters);
  }

  /**
   * Lista Convênios por Conta
   */
  async byConta(contaId) {
    return await ConvenioRepository.findByConta(contaId);
  }

  /**
   * Conta total de Convênios
   */
  async count(filters = {}) {
    return await ConvenioRepository.count(filters);
  }
}

module.exports = new findConvenio();