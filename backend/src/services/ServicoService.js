const ServicoRepository = require("../repositories/ServicoRepository");
const ConvenioRepository = require("../repositories/ConvenioRepository");
const { NotFoundError, ValidationError } = require("../utils/errors");

class ServicoService {
  async create(data, convenioId) {
    const convenio = await ConvenioRepository.findById(convenioId);
    if (!convenio) {
      throw new NotFoundError("Convênio não encontrado");
    }

    const servicoData = { ...data, convenio_id: convenioId, status: "ativo" };
    return await ServicoRepository.create(servicoData);
  }

  async findById(id) {
    const servico = await ServicoRepository.findById(id);
    if (!servico) {
      throw new NotFoundError("Serviço não encontrado");
    }
    return servico;
  }

  async findAll(filters = {}) {
    return await ServicoRepository.findAll(filters);
  }

  async update(id, data) {
    await this.findById(id);
    delete data.convenio_id;
    return await ServicoRepository.update(id, data);
  }

  async delete(id) {
    await this.findById(id);
    return await ServicoRepository.delete(id);
  }
}

module.exports = new ServicoService();