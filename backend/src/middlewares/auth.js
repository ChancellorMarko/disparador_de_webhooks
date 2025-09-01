const AuthenticationService = require('../services/AuthenticationService');

/**
 * Middleware de autenticação JWT
 * Verifica se o token JWT é válido e extrai as informações do usuário
 */
const authenticateJWT = async (req, res, next) => {
  try {
    // Obtém o token do header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Token de autenticação não fornecido',
        code: 'MISSING_TOKEN'
      });
    }

    // Verifica se o header está no formato correto: "Bearer <token>"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        error: 'Formato de token inválido. Use: Bearer <token>',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }

    const token = parts[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token não fornecido',
        code: 'EMPTY_TOKEN'
      });
    }

    try {
      // Verifica e decodifica o token JWT
      const decoded = AuthenticationService.verifyToken(token);
      
      // Verifica se o token é do tipo correto
      if (decoded.type !== 'software_house') {
        return res.status(401).json({
          success: false,
          error: 'Tipo de token inválido',
          code: 'INVALID_TOKEN_TYPE'
        });
      }

      // Adiciona as informações do usuário autenticado ao request
      req.user = {
        id: decoded.id,
        cnpj: decoded.cnpj,
        token_sh: decoded.token_sh,
        type: decoded.type
      };

      // Adiciona o token decodificado para uso posterior
      req.decodedToken = decoded;

      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token expirado',
          code: 'TOKEN_EXPIRED'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: 'Token inválido',
          code: 'INVALID_TOKEN'
        });
      } else {
        return res.status(401).json({
          success: false,
          error: 'Erro na validação do token',
          code: 'TOKEN_VALIDATION_ERROR'
        });
      }
    }
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno na autenticação',
      code: 'AUTHENTICATION_ERROR'
    });
  }
};

/**
 * Middleware de autenticação opcional
 * Similar ao authenticateJWT, mas não falha se não houver token
 * Útil para rotas que podem ser acessadas com ou sem autenticação
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      // Se não há header de autorização, continua sem autenticação
      req.user = null;
      req.decodedToken = null;
      return next();
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      // Se o formato está incorreto, continua sem autenticação
      req.user = null;
      req.decodedToken = null;
      return next();
    }

    const token = parts[1];

    if (!token) {
      // Se não há token, continua sem autenticação
      req.user = null;
      req.decodedToken = null;
      return next();
    }

    try {
      const decoded = AuthenticationService.verifyToken(token);
      
      if (decoded.type === 'software_house') {
        req.user = {
          id: decoded.id,
          cnpj: decoded.cnpj,
          token_sh: decoded.token_sh,
          type: decoded.type
        };
        req.decodedToken = decoded;
      } else {
        req.user = null;
        req.decodedToken = null;
      }
    } catch (jwtError) {
      // Se há erro na validação, continua sem autenticação
      req.user = null;
      req.decodedToken = null;
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação opcional:', error);
    req.user = null;
    req.decodedToken = null;
    next();
  }
};

/**
 * Middleware para verificar se o usuário tem permissão específica
 * @param {string} requiredType - Tipo de usuário requerido
 */
const requireUserType = (requiredType) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Autenticação necessária',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }

    if (req.user.type !== requiredType) {
      return res.status(403).json({
        success: false,
        error: 'Permissão insuficiente para esta operação',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

/**
 * Middleware para verificar se o usuário é o proprietário do recurso
 * @param {string} resourceIdParam - Nome do parâmetro que contém o ID do recurso
 */
const requireOwnership = (resourceIdParam = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Autenticação necessária',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }

    const resourceId = req.params[resourceIdParam];
    
    if (!resourceId) {
      return res.status(400).json({
        success: false,
        error: 'ID do recurso não fornecido',
        code: 'MISSING_RESOURCE_ID'
      });
    }

    // Verifica se o usuário é o proprietário do recurso
    // Esta lógica pode ser personalizada conforme necessário
    if (req.user.id.toString() !== resourceId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Acesso negado: você não é o proprietário deste recurso',
        code: 'ACCESS_DENIED'
      });
    }

    next();
  };
};

module.exports = {
  authenticateJWT,
  optionalAuth,
  requireUserType,
  requireOwnership
};



