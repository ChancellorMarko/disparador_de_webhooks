const { SoftwareHouse, Cedente } = require("./models"); 
const AppError = require("../utils/AppError"); // Supondo uma classe de erro

const headerAuth = async (req, res, next) => {
  try {
    const {
      "cnpj-sh": cnpjSh,
      "token-sh": tokenSh,
      "cnpj-cedente": cnpjCedente,
      "token-cedente": tokenCedente,
    } = req.headers;

    // 1. Valida se todos os 4 headers obrigatórios estão presentes
    if (!cnpjSh || !tokenSh || !cnpjCedente || !tokenCedente) {
      throw new AppError(
        "Headers de autenticação incompletos. São necessários: cnpj-sh, token-sh, cnpj-cedente, token-cedente.",
        401 // Unauthorized
      );
    }

    // 2. Valida a Software House
    const softwareHouse = await SoftwareHouse.findOne({
      where: { cnpj: cnpjSh, token: tokenSh, status: "ativo" },
    });
    if (!softwareHouse) {
      throw new AppError("Software House não autorizada ou inativa.", 403); // Forbidden
    }

    // 3. Valida o Cedente E se ele pertence à Software House
    const cedente = await Cedente.findOne({
      where: {
        cnpj: cnpjCedente,
        token: tokenCedente,
        softwarehouse_id: softwareHouse.id, // A validação mais importante
        status: "ativo",
      },
    });
    if (!cedente) {
      throw new AppError("Cedente não autorizado, inativo ou não pertence a esta Software House.", 403);
    }

    // 4. Anexa os dados à requisição para uso nos Controllers
    req.auth = { softwareHouse, cedente };

    next();
  } catch (error) {
    next(error); // Passa o erro para o middleware de erro global
  }
};

module.exports = { headerAuth };
