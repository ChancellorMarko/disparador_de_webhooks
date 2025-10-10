const { AppError } = require("../utils/errors");
const { SoftwareHouse } = require("../models");

const shAuthSimple = async (req, res, next) => {
  try {
    const cnpjSh = req.headers['cnpj-sh'];
    const tokenSh = req.headers['token-sh'];

    if (!cnpjSh || !tokenSh) {
      throw new AppError("Headers de autenticação da Software House incompletos (cnpj-sh, token-sh).", 400);
    }

    const softwareHouse = await SoftwareHouse.findOne({ where: { cnpj: cnpjSh, token: tokenSh } });
    if (!softwareHouse) {
      throw new AppError("Credenciais da Software House inválidas.", 403);
    }

    req.softwareHouse = softwareHouse;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { shAuthSimple };