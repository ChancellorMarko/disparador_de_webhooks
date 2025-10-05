const CedenteRepository = require("../repositories/CedenteRepository");
const { NotFoundError } = require("../utils/errors");

class findCedente {
  /**
   * Busca Cedente por ID
   */
  async byId(id) {
    const cedente = await CedenteRepository.findById(id);
    if (!cedente) {
      throw new NotFoundError("Cedente não encontrado");
    }
    return cedente;
  }

  /**
   * Busca Cedente por CNPJ
   */
  async byCnpj(cnpj) {
    const cedente = await CedenteRepository.findByCnpj(cnpj);
    if (!cedente) {
      throw new NotFoundError("Cedente não encontrado");
    }
    return cedente;
  }

  /**
   * Busca Cedente por token
   */
  async byToken(token) {
    const cedente = await CedenteRepository.findByToken(token);
    if (!cedente) {
      throw new NotFoundError("Cedente não encontrado");
    }
    return cedente;
  }

  /**
   * Lista todos os Cedentes com filtros
   */
  async all(filters = {}) {
    return await CedenteRepository.findAll(filters);
  }

  /**
   * Lista Cedentes por Software House
   */
  async bySoftwareHouse(softwareHouseId) {
    return await CedenteRepository.findBySoftwareHouse(softwareHouseId);
  }

  /**
   * Conta total de Cedentes
   */
  async count(filters = {}) {
    return await CedenteRepository.count(filters);
  }
}

module.exports = new findCedente();