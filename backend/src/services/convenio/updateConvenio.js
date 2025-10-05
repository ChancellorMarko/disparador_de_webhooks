const ConvenioRepository = require("../repositories/ConvenioRepository");
// Assumindo que o findConvenio.js está na mesma pasta
const findConvenio = require("./findConvenio");

class updateConvenio {
  /**
   * Atualiza um Convênio
   */
  async execute(id, data) {
    const convenio = await findConvenio.byId(id);

    delete data.conta_id;

    if (
      data.numero_convenio &&
      data.numero_convenio !== convenio.numero_convenio
    ) {
      const convenioExists = await ConvenioRepository.existsByNumero(
        data.numero_convenio,
        id
      );
      if (convenioExists) {
        throw new Error("Número de convênio já cadastrado");
      }
    }

    return await ConvenioRepository.update(id, data);
  }
}

module.exports = new updateConvenio();