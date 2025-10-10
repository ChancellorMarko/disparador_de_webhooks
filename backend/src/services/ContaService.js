const ContaRepository = require("../repositories/ContaRepository");
const CedenteRepository = require("../repositories/CedenteRepository");
const { NotFoundError, ValidationError } = require("../utils/errors");

class ContaService {
  async create(data, cedenteId) {
    const cedente = await CedenteRepository.findById(cedenteId);
    if (!cedente) {
      throw new NotFoundError("Cedente não encontrado");
    }
    if (cedente.status !== "ativo") {
      throw new ValidationError("Cedente inativo");
    }

    const produtosValidos = ["boleto", "pix", "ted", "cobranca_escritural"];
    if (!produtosValidos.includes(data.produto)) {
      throw new ValidationError(`Produto inválido. Valores aceitos: ${produtosValidos.join(", ")}`);
    }

    const contaExistente = await ContaRepository.findByCedenteProdutoBanco(cedenteId, data.produto, data.banco_codigo);
    if (contaExistente) {
      throw new ValidationError("Já existe uma conta com este produto e banco para este cedente", 409);
    }

    const contaData = {
      ...data,
      cedente_id: cedenteId,
      status: "ativo",
      configuracao_notificacao: data.configuracao_notificacao || {
        url: null, email: null, tipos: {}, cancelado: true, pago: true,
        disponivel: true, header: false, ativado: false, header_campo: "",
        header_valor: "", headers_adicionais: [{"x-empresa": "", "content-type": "application/json"}],
      },
    };

    return await ContaRepository.create(contaData);
  }

  async findById(id) {
    const conta = await ContaRepository.findById(id);
    if (!conta) {
      throw new NotFoundError("Conta não encontrada");
    }
    return conta;
  }

  async findAll(filters = {}) {
    return await ContaRepository.findAll(filters);
  }

  async update(id, data) {
    const conta = await this.findById(id);
    delete data.cedente_id;
    if ((data.produto && data.produto !== conta.produto) || (data.banco_codigo && data.banco_codigo !== conta.banco_codigo)) {
      const produto = data.produto || conta.produto;
      const banco_codigo = data.banco_codigo || conta.banco_codigo;
      const contaExistente = await ContaRepository.findByCedenteProdutoBanco(conta.cedente_id, produto, banco_codigo);
      if (contaExistente && contaExistente.id.toString() !== id.toString()) {
        throw new ValidationError("Já existe uma conta com este produto e banco para este cedente", 409);
      }
    }
    return await ContaRepository.update(id, data);
  }

  async delete(id) {
    const conta = await this.findById(id);
    if (conta.convenios && conta.convenios.length > 0) {
      throw new ValidationError("Não é possível deletar conta com convênios associados");
    }
    return await ContaRepository.delete(id);
  }
}

module.exports = new ContaService();
