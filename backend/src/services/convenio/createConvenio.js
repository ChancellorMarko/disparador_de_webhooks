const ConvenioRepository = require("../repositories/ConvenioRepository");
const ContaRepository = require("../repositories/ContaRepository");

class createConvenio {
  /**
   * Cria um novo Convênio
   */
  async execute(data, contaId) {
    const conta = await ContaRepository.findById(contaId);
    if (!conta) {
      throw new Error("Conta não encontrada");
    }
    if (conta.status !== "ativo") {
      throw new Error("Conta inativa");
    }

    const convenioExists = await ConvenioRepository.existsByNumero(
      data.numero_convenio
    );
    if (convenioExists) {
      throw new Error("Número de convênio já cadastrado");
    }

    const convenioData = {
      ...data,
      conta_id: contaId,
    };

    return await ConvenioRepository.create(convenioData);
  }
}

module.exports = new createConvenio();