const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/errors");

/**
 * Middleware de autenticação JWT
 * Verifica se o token JWT é válido e anexa as informações do usuário à requisição.
 */
const authenticateJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      // Usa o errorHandler para padronizar a resposta de erro
      return next(new AppError("Token de autenticação não fornecido", 401));
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return next(new AppError("Formato de token inválido. Use: Bearer <token>", 401));
    }

    const token = parts[1];
    if (!token) {
      return next(new AppError("Token não fornecido", 401));
    }

    // Verifica o token usando a chave secreta do seu arquivo .env
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(new AppError("Token expirado", 401));
        }
        // Para outros erros (token malformado, etc.)
        return next(new AppError("Token inválido", 403));
      }

      // Anexa os dados do usuário à requisição para uso nos controllers
      req.user = user;
      next();
    });
  } catch (error) {
    // Captura qualquer outro erro inesperado e passa para o errorHandler
    next(error);
  }
};

/**
 * Middleware para verificar se o usuário autenticado tem um tipo específico.
 * Deve ser usado DEPOIS do authenticateJWT.
 * Ex: router.get('/admin', authenticateJWT, requireUserType('admin'));
 * @param {string} requiredType - O tipo de usuário requerido (ex: 'software_house')
 */
const requireUserType = (requiredType) => {
  return (req, res, next) => {
    if (!req.user || req.user.type !== requiredType) {
      return next(new AppError("Permissão insuficiente para esta operação", 403));
    }
    next();
  };
};

module.exports = {
  authenticateJWT,
  requireUserType,
};
