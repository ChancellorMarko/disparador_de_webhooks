const ServicoRepository = require("../repositories/ServicoRepository");
const ConvenioRepository = require("../repositories/ConvenioRepository");
const { NotFoundError } = require("../utils/errors");

class createServico {
  async execute(data, convenioId) {
    const convenio = await ConvenioRepository.findById(convenioId);
    if (!convenio) {
      throw new NotFoundError("Convênio não encontrado");
    }

    const servicoData = {
      ...data,
      convenio_id: convenioId,
      status: "ativo",
    };

    return await ServicoRepository.create(servicoData);
  }
}

module.exports = new createServico();