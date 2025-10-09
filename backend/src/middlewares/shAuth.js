const { AppError } = require("../utils/errors");
// ATENÇÃO: Importe Cedente também
const { SoftwareHouse, Cedente } = require("../models");

const shAuth = async (req, res, next) => {
  try {
    const cnpjSh = req.headers['cnpj-sh'];
    const tokenSh = req.headers['token-sh'];
    const cnpjCedente = req.headers['cnpj-cedente'];
    const tokenCedente = req.headers['token-cedente'];

    if (!cnpjSh || !tokenSh || !cnpjCedente || !tokenCedente) {
      throw new AppError("Headers de autenticação incompletos (cnpj-sh, token-sh, cnpj-cedente, token-cedente).", 400);
    }

    const softwareHouse = await SoftwareHouse.findOne({ where: { cnpj: cnpjSh, token: tokenSh } });
    if (!softwareHouse) {
      throw new AppError("Credenciais da Software House inválidas.", 403);
    }

    const cedente = await Cedente.findOne({ where: { cnpj: cnpjCedente, token: tokenCedente } });
    if (!cedente) {
      throw new AppError("Credenciais do Cedente inválidas.", 403);
    }

    if (cedente.softwarehouse_id !== softwareHouse.id) {
      throw new AppError("Este Cedente não pertence à Software House informada.", 403);
    }

    // Anexa as informações à requisição para serem usadas no controller/service
    req.softwareHouse = softwareHouse;
    req.cedente = cedente; // <-- Anexando o cedente encontrado

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { shAuth };