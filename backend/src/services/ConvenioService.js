const ConvenioRepository = require("../repositories/ConvenioRepository");
const ContaRepository = require("../repositories/ContaRepository");
const { NotFoundError, ValidationError } = require("../utils/errors");

class ConvenioService {
  async create(data, contaId) {
    const conta = await ContaRepository.findById(contaId);
    if (!conta) {
      throw new NotFoundError("Conta não encontrada");
    }
    if (conta.status !== "ativo") {
      throw new ValidationError("Conta inativa");
    }

    const convenioExists = await ConvenioRepository.existsByNumero(data.numero_convenio);
    if (convenioExists) {
      throw new ValidationError("Número de convênio já cadastrado", 409);
    }

    const convenioData = { ...data, conta_id: contaId };
    return await ConvenioRepository.create(convenioData);
  }

  async findById(id) {
    const convenio = await ConvenioRepository.findById(id);
    if (!convenio) {
      throw new NotFoundError("Convênio não encontrado");
    }
    return convenio;
  }

  async findAll(filters = {}) {
    return await ConvenioRepository.findAll(filters);
  }

  async update(id, data) {
    const convenio = await this.findById(id);
    delete data.conta_id;
    if (data.numero_convenio && data.numero_convenio !== convenio.numero_convenio) {
      const convenioExists = await ConvenioRepository.existsByNumero(data.numero_convenio, id);
      if (convenioExists) {
        throw new ValidationError("Número de convênio já cadastrado", 409);
      }
    }
    return await ConvenioRepository.update(id, data);
  }

  async delete(id) {
    const convenio = await this.findById(id);
    if (convenio.servicos && convenio.servicos.length > 0) {
      throw new ValidationError("Não é possível deletar convênio com serviços associados");
    }
    return await ConvenioRepository.delete(id);
  }
}

module.exports = new ConvenioService();