const CedenteRepository = require("../repositories/CedenteRepository");
const SoftwareHouseRepository = require("../repositories/SoftwareHouseRepository");
const { v4: uuidv4 } = require("uuid");
const { NotFoundError, ValidationError } = require("../utils/errors");

class CedenteService {
  async create(data, softwareHouseId) {
    // >>> CONSOLE.LOG ADICIONADO PARA O TESTE <<<
    console.log('--- EXECUTANDO A NOVA VERSÃO CORRIGIDA DO CEDENTE SERVICE ---');

    const softwareHouse = await SoftwareHouseRepository.findById(softwareHouseId);
    if (!softwareHouse) {
      throw new NotFoundError("Software House não encontrada");
    }
    if (softwareHouse.status !== "ativo") {
      throw new ValidationError("Software House inativa");
    }

    const cnpjExists = await CedenteRepository.existsByCnpj(data.cnpj);
    if (cnpjExists) {
      throw new ValidationError("CNPJ já cadastrado", 409);
    }

    let token;
    let tokenExists = true;
    while (tokenExists) {
      token = uuidv4().replace(/-/g, "").substring(0, 32);
      tokenExists = await CedenteRepository.existsByToken(token);
    }

    const cedenteData = {
      ...data,
      token,
      softwarehouse_id: softwareHouseId,
      status: "ativo",
      data_criacao: new Date(),
      configuracao_notificacao: data.configuracao_notificacao || {
        url: null, email: null, tipos: {}, cancelado: true, pago: true,
        disponivel: true, header: false, ativado: false, header_campo: "",
        header_valor: "", headers_adicionais: [{"x-empresa": "", "content-type": "application/json"}],
      },
    };

    return await CedenteRepository.create(cedenteData);
  }

  async findById(id) {
    const cedente = await CedenteRepository.findById(id);
    if (!cedente) {
      throw new NotFoundError("Cedente não encontrado");
    }
    return cedente;
  }

  async findAll(filters = {}) {
    return await CedenteRepository.findAll(filters);
  }

  async update(id, data) {
    const cedente = await this.findById(id);

    delete data.token;
    delete data.softwarehouse_id;

    if (data.cnpj && data.cnpj !== cedente.cnpj) {
      const cnpjExists = await CedenteRepository.existsByCnpj(data.cnpj, id);
      if (cnpjExists) {
        throw new ValidationError("CNPJ já cadastrado", 409);
      }
    }
    return await CedenteRepository.update(id, data);
  }

  async delete(id) {
    const cedente = await this.findById(id);
    if (cedente.contas && cedente.contas.length > 0) {
      throw new ValidationError("Não é possível deletar cedente com contas associadas");
    }
    return await CedenteRepository.delete(id);
  }
}

module.exports = new CedenteService();