const CedenteRepository = require("../repositories/CedenteRepository");
const { ValidationError } = require("../utils/errors");
// Assumindo que o findCedente.js está na mesma pasta
const findCedente = require("./findCedente");

class deleteCedente {
  /**
   * Deleta um Cedente
   */
  async execute(id) {
    const cedente = await findCedente.byId(id);

    if (cedente.contas && cedente.contas.length > 0) {
      throw new ValidationError(
        "Não é possível deletar cedente com contas associadas"
      );
    }

    return await CedenteRepository.delete(id);
  }
}

module.exports = new deleteCedente();