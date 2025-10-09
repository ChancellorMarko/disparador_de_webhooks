const { SoftwareHouse } = require('../models');

/**
 * Middleware para autenticar apenas a SoftwareHouse.
 * Valida os headers 'cnpj-sh' e 'token-sh'.
 */
const shAuth = async (req, res, next) => {
  try {
    const cnpjSh = req.headers['cnpj-sh'];
    const tokenSh = req.headers['token-sh'];

    if (!cnpjSh || !tokenSh) {
      return res.status(401).json({
        success: false,
        error: "Autenticação da Software House incompleta. Verifique os headers 'cnpj-sh' e 'token-sh'.",
      });
    }

    const softwareHouse = await SoftwareHouse.findOne({ where: { cnpj: cnpjSh, token: tokenSh, status: 'ativo' } });

    if (!softwareHouse) {
      return res.status(403).json({
        success: false,
        error: "Acesso proibido. Software House inválida, inativa ou credenciais incorretas.",
      });
    }

    // Anexamos a softwareHouse diretamente ao objeto req para uso no controller.
    req.softwareHouse = softwareHouse;
    return next();

  } catch (error) {
    console.error("Erro no middleware shAuth:", error);
    return res.status(500).json({
      success: false,
      error: "Erro interno no servidor durante a autenticação da Software House.",
    });
  }
};

module.exports = { shAuth };