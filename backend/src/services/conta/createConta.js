const ContaRepository = require("../repositories/ContaRepository");
const CedenteRepository = require("../repositories/CedenteRepository");
const { NotFoundError, ValidationError } = require("../utils/errors");

class createConta {
  /**
   * Cria uma nova Conta
   */
  async execute(data, cedenteId) {
    const cedente = await CedenteRepository.findById(cedenteId);
    if (!cedente) {
      throw new NotFoundError("Cedente não encontrado");
    }
    if (cedente.status !== "ativo") {
      throw new ValidationError("Cedente inativo");
    }

    const produtosValidos = ["boleto", "pix", "ted", "cobranca_escritural"];
    if (!produtosValidos.includes(data.produto)) {
      throw new ValidationError(
        `Produto inválido. Valores aceitos: ${produtosValidos.join(", ")}`
      );
    }

    const contaExistente = await ContaRepository.findByCedenteProdutoBanco(
      cedenteId,
      data.produto,
      data.banco_codigo
    );
    if (contaExistente) {
      throw new ValidationError(
        "Já existe uma conta com este produto e banco para este cedente",
        409
      );
    }

    const contaData = {
      ...data,
      cedente_id: cedenteId,
      status: "ativo",
      configuracao_notificacao: data.configuracao_notificacao || {
        url: null,
        email: null,
        tipos: {},
        cancelado: true,
        pago: true,
        disponivel: true,
        header: false,
        ativado: false,
        header_campo: "",
        header_valor: "",
        headers_adicionais: [
            {
                "x-empresa": "",
                "content-type": "application/json",
            },
        ],
      },
    };

    return await ContaRepository.create(contaData);
  }
}

module.exports = new createConta();