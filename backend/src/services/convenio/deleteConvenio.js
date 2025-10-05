const ConvenioRepository = require("../repositories/ConvenioRepository");
// Assumindo que o findConvenio.js está na mesma pasta
const findConvenio = require("./findConvenio");

class deleteConvenio {
  /**
   * Deleta um Convênio
   */
  async execute(id) {
    const convenio = await findConvenio.byId(id);

    if (convenio.servicos && convenio.servicos.length > 0) {
      throw new Error("Não é possível deletar convênio com serviços associados");
    }

    return await ConvenioRepository.delete(id);
  }
}

module.exports = new deleteConvenio();