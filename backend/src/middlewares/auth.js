const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/errors");

/**
 * Middleware de autenticação JWT
 * Verifica se o token JWT é válido e anexa as informações do usuário à requisição.
 */
const authenticateJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Se o cabeçalho não existir ou não começar com "Bearer ", lança um erro.
      throw new AppError("Token de autenticação não fornecido ou em formato inválido.", 401);
    }

    const token = authHeader.split(" ")[1];

    // Verifica o token de forma síncrona dentro do bloco try...catch
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    req.auth = decodedPayload;

    // Se o token for válido, passa para o próximo middleware ou controller.
    next();

  } catch (error) {
    // O bloco catch vai capturar erros do jwt.verify (token expirado, inválido)
    // e também o erro que lançamos manualmente acima.
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Token inválido.", 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Token expirado.", 401));
    }
    
    // Passa qualquer outro erro para o seu middleware de tratamento de erros global.
    next(error);
  }
};

module.exports = {
  authenticateJWT,
};