const SoftwareHouseRepository = require("../repositories/SoftwareHouseRepository");
const { ValidationError, NotFoundError } = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthenticationService {
  /**
   * Autentica uma Software House e retorna os tokens JWT.
   */
  async authenticate(cnpj, senha) {
    const softwareHouse = await SoftwareHouseRepository.findByCnpj(cnpj);
    if (!softwareHouse) {
      throw new NotFoundError("Usuário não encontrado ou credenciais inválidas.");
    }

    const isPasswordValid = await bcrypt.compare(senha, softwareHouse.senha);
    if (!isPasswordValid) {
      throw new ValidationError("Usuário não encontrado ou credenciais inválidas.", 401);
    }

    const payload = {
      id: softwareHouse.id,
      cnpj: softwareHouse.cnpj,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    });

    return { accessToken, refreshToken };
  }

  /**
   * ADICIONADO: Busca os dados da Software House autenticada.
   * @param {number} userId - O ID do usuário vindo do token JWT.
   */
  async getMe(userId) {
    const softwareHouse = await SoftwareHouseRepository.findById(userId);
    if (!softwareHouse) {
      throw new NotFoundError("Software House não encontrada.");
    }

    // Retorna os dados, incluindo o token de API fixo
    return {
      id: softwareHouse.id,
      cnpj: softwareHouse.cnpj,
      razao_social: softwareHouse.razao_social,
      nome_fantasia: softwareHouse.nome_fantasia,
      email: softwareHouse.email,
      status: softwareHouse.status,
      // IMPORTANTE: Retornando o token de API para facilitar os testes
      token: softwareHouse.token,
    };
  }
}

module.exports = new AuthenticationService();
