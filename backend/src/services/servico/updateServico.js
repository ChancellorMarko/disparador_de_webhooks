const ServicoRepository = require("../repositories/ServicoRepository");
const findByIdServico = require("./findByIdServico"); // Importa o serviço de busca

class updateServico {
  async execute(id, data) {
    await findByIdServico.execute(id); // Garante que o serviço existe

    delete data.convenio_id;

    return await ServicoRepository.update(id, data);
  }
}

module.exports = new updateServico();