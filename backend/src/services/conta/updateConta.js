const ContaRepository = require("../repositories/ContaRepository");
const { ValidationError } = require("../utils/errors");
// Assumindo que o findConta.js está na mesma pasta
const findConta = require("./findConta");

class updateConta {
  /**
   * Atualiza uma Conta
   */
  async execute(id, data) {
    const conta = await findConta.byId(id);

    delete data.cedente_id;

    if (
      (data.produto && data.produto !== conta.produto) ||
      (data.banco_codigo && data.banco_codigo !== conta.banco_codigo)
    ) {
      const produto = data.produto || conta.produto;
      const bancocodigo = data.banco_codigo || conta.banco_codigo;
      const contaExistente = await ContaRepository.findByCedenteProdutoBanco(
        conta.cedente_id,
        produto,
        bancocodigo
      );

      if (contaExistente && contaExistente.id !== id) {
        throw new ValidationError(
          "Já existe uma conta com este produto e banco para este cedente",
          409
        );
      }
    }

    return await ContaRepository.update(id, data);
  }

  /**
   * Ativa uma Conta
   */
  async activate(id) {
    await findConta.byId(id);
    return await ContaRepository.activate(id);
  }

  /**
   * Inativa uma Conta
   */
  async deactivate(id) {
    await findConta.byId(id);
    return await ContaRepository.deactivate(id);
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
   * Atualiza configuração de notificação da Conta
   */
  async notificationConfig(id, config) {
    await findConta.byId(id);

    if (config.webhook_url && !this.isValidUrl(config.webhook_url)) {
      throw new ValidationError("URL do webhook inválida");
    }

    if (config.eventos && !Array.isArray(config.eventos)) {
      throw new ValidationError("Eventos deve ser um array");
    }

    return await ContaRepository.updateNotificationConfig(id, config);
  }
}

module.exports = new updateConta();