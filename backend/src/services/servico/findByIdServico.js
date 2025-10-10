const ServicoRepository = require("../repositories/ServicoRepository");
const { NotFoundError } = require("../utils/errors");

class findByIdServico {
  async execute(id) {
    const servico = await ServicoRepository.findById(id);
    if (!servico) {
      throw new NotFoundError("Serviço não encontrado");
    }
    return servico;
  }
}

module.exports = new findByIdServico();