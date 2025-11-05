const ContaRepository = require("../repositories/ContaRepository");
const CedenteRepository = require("../repositories/CedenteRepository");
const { NotFoundError, ValidationError } = require("../utils/errors");

class ContaService {
  /**
   * Cria uma nova conta.
   * @param {object} data - Objeto contendo todos os dados da conta, incluindo cedente_id e opcionalmente configuracao_notificacao.
   */
  async create(data) { // <-- CORREÇÃO AQUI: Recebe apenas 'data'
    // 1. Extrai o cedenteId de dentro do objeto 'data'
    const cedenteId = data.cedente_id;

    // 2. Validação para garantir que cedenteId foi fornecido dentro de 'data'
    if (!cedenteId) {
        throw new ValidationError("O campo cedente_id é obrigatório.");
    }

    // 3. O restante das validações continua igual, usando o 'cedenteId' extraído
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

    // 4. Monta o objeto final para salvar no banco
    const contaData = {
      ...data, // Espalha todos os dados recebidos (incluindo configuracao_notificacao, se houver)
      cedente_id: cedenteId, // Garante que o cedente_id está correto
      status: "ativo", // Define o status padrão
      // Se configuracao_notificacao não vier no 'data', define um padrão
      configuracao_notificacao: data.configuracao_notificacao || {
        url: null, email: null, tipos: {}, cancelado: true, pago: true,
        disponivel: true, header: false, ativado: false, header_campo: "",
        header_valor: "", headers_adicionais: [{"x-empresa": "", "content-type": "application/json"}],
      },
    };

    return await ContaRepository.create(contaData);
  }

  // --- Funções findById, findAll, update, delete permanecem inalteradas ---

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