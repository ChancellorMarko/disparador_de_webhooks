const ServicoRepository = require("../repositories/ServicoRepository");
const findByIdServico = require("./findByIdServico"); // Importa o serviço de busca

class deleteServico {
  async execute(id) {
    await findByIdServico.execute(id); // Garante que o serviço existe
    return await ServicoRepository.delete(id);
  }
}

module.exports = new deleteServico();