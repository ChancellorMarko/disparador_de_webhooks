const {
  ProtocoloRepository,
  CedenteRepository,
  ContaRepository,
  ConvenioRepository,
  ServicoRepository,
  SoftwareHouseRepository,
} = require("../repositories");
const { ValidationError, NotFoundError } = require("../utils/errors");

class ProtocoloService {
  async create(data) {
    const { cedente_id, conta_id, convenio_id, servico_id, software_house_id } = data;

    const cedente = await CedenteRepository.findById(cedente_id);
    if (!cedente || cedente.status !== 'ativo') throw new ValidationError("Cedente inválido ou inativo");

    const conta = await ContaRepository.findById(conta_id);
    if (!conta || conta.status !== 'ativo' || conta.cedente_id !== cedente.id) throw new ValidationError("Conta inválida, inativa ou não pertence ao cedente");

    // Adicione validações similares para Convenio, Servico e SoftwareHouse...
    
    const protocoloData = { ...data, status: "pendente", tentativas: 0 };
    return await ProtocoloRepository.create(protocoloData);
  }

  async findById(id) {
    const protocolo = await ProtocoloRepository.findById(id);
    if (!protocolo) {
      throw new NotFoundError("Protocolo não encontrado");
    }
    return protocolo;
  }

  async list(filters = {}) {
    // Sua lógica de paginação e listagem aqui...
    return await ProtocoloRepository.findAll(filters);
  }

  async updateStatus(id, status, dados_resposta = null) {
    const protocolo = await this.findById(id);
    // Sua lógica de transição de status...
    const updateData = { status };
    if (dados_resposta) updateData.dados_resposta = dados_resposta;
    if (status === "erro") updateData.tentativas = protocolo.tentativas + 1;

    return await ProtocoloRepository.update(id, updateData);
  }

  async reprocess(id) {
    const protocolo = await this.findById(id);
    if (protocolo.status !== "erro") {
      throw new ValidationError("Apenas protocolos com status 'erro' podem ser reprocessados");
    }
    if (protocolo.tentativas >= 3) {
      throw new ValidationError("Protocolo excedeu o limite máximo de 3 tentativas");
    }
    return await ProtocoloRepository.update(id, { status: "pendente" });
  }
}

module.exports = new ProtocoloService();
