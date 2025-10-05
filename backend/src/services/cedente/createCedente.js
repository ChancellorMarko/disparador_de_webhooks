const CedenteRepository = require("../repositories/CedenteRepository");
const SoftwareHouseRepository = require("../repositories/SoftwareHouseRepository");
const { v4: uuidv4 } = require("uuid");
const { NotFoundError, ValidationError } = require("../utils/errors");

class createCedente {
  /**
   * Cria um novo Cedente
   */
  async execute(data, softwareHouseId) {
    const softwareHouse = await SoftwareHouseRepository.findById(softwareHouseId);
    if (!softwareHouse) {
      throw new NotFoundError("Software House não encontrada");
    }
    if (!softwareHouse.ativo) {
      throw new ValidationError("Software House inativa");
    }

    const cnpjExists = await CedenteRepository.existsByCnpj(data.cnpj);
    if (cnpjExists) {
      throw new ValidationError("CNPJ já cadastrado", 409); // 409 Conflict é mais semântico
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

    return await CedenteRepository.create(cedenteData);
  }
}

module.exports = new createCedente();