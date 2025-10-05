const CedenteRepository = require("../repositories/CedenteRepository");
const { NotFoundError, ValidationError } = require("../utils/errors");
// Assumindo que o findCedente.js está na mesma pasta
const findCedente = require("./findCedente"); 

class updateCedente {
  /**
   * Atualiza um Cedente
   */
  async execute(id, data) {
    const cedente = await findCedente.byId(id); // Usa o método de busca separado

    delete data.token;
    delete data.softwarehouse_id;

    if (data.cnpj && data.cnpj !== cedente.cnpj) {
      const cnpjExists = await CedenteRepository.existsByCnpj(data.cnpj, id);
      if (cnpjExists) {
        throw new ValidationError("CNPJ já cadastrado", 409);
      }
    }

    return await CedenteRepository.update(id, data);
  }

  /**
   * Ativa um Cedente
   */
  async activate(id) {
    await findCedente.byId(id);
    return await CedenteRepository.activate(id);
  }

  /**
   * Inativa um Cedente
   */
  async deactivate(id) {
    await findCedente.byId(id);
    return await CedenteRepository.deactivate(id);
  }
  
  /**
   * Valida se uma URL é válida
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Atualiza configuração de notificação do Cedente
   */
  async notificationConfig(id, config) {
    await findCedente.byId(id);

    if (config.webhook_url && !this.isValidUrl(config.webhook_url)) {
      throw new ValidationError("URL do webhook inválida");
    }

    if (config.eventos && !Array.isArray(config.eventos)) {
      throw new ValidationError("Eventos deve ser um array");
    }

    return await CedenteRepository.updateNotificationConfig(id, config);
  }
}

module.exports = new updateCedente();