const ContaRepository = require("../repositories/ContaRepository");
const { ValidationError } = require("../utils/errors");
// Assumindo que o findConta.js está na mesma pasta
const findConta = require("./findConta");

class deleteConta {
  /**
   * Deleta uma Conta
   */
  async execute(id) {
    const conta = await findConta.byId(id);

    if (conta.convenios && conta.convenios.length > 0) {
      throw new ValidationError(
        "Não é possível deletar conta com convênios associados"
      );
    }

    return await ContaRepository.delete(id);
  }
}

module.exports = new deleteConta();