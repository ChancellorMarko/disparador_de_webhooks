const { AppError } = require("../utils/errors");
const { SoftwareHouse, Cedente } = require("../models");

const shAuth = async (req, res, next) => {
  try {
    const cnpjSh = req.headers['cnpj-sh'];
    const tokenSh = req.headers['token-sh'];
    const cnpjCedente = req.headers['cnpj-cedente'];
    const tokenCedente = req.headers['token-cedente'];

    if (!cnpjSh || !tokenSh || !cnpjCedente || !tokenCedente) {
      throw new AppError("Headers de autenticação incompletos.", 400);
    }

    const softwareHouse = await SoftwareHouse.findOne({ where: { cnpj: cnpjSh, token: tokenSh } });
    if (!softwareHouse) throw new AppError("Credenciais da Software House inválidas.", 403);

    const cedente = await Cedente.findOne({ where: { cnpj: cnpjCedente, token: tokenCedente } });
    if (!cedente) throw new AppError("Credenciais do Cedente inválidas.", 403);

    if (cedente.softwarehouse_id !== softwareHouse.id) {
      throw new AppError("Este Cedente não pertence à Software House.", 403);
    }

    // Perfeito: anexa o cedente na requisição
    req.cedente = cedente;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { shAuth };