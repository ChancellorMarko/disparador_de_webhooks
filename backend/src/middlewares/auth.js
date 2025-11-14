const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/errors");

const authenticateJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError("Token de autenticação não fornecido ou em formato inválido.", 401);
    }

    const token = authHeader.split(" ")[1];


    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    req.auth = decodedPayload;

    next();

  } catch (error) {

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