const winston = require('winston');

// Configuração do logger Winston
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'disparador-webhooks-api' },
  transports: [
    new winston.transports.File({ 
      filename: process.env.LOG_FILE || 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: process.env.LOG_FILE || 'logs/combined.log' 
    })
  ]
});

// Adiciona console logging em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

/**
 * Middleware de tratamento de erros global
 * Captura todos os erros não tratados e os formata adequadamente
 */
const errorHandler = (err, req, res, next) => {
  // Log do erro
  logger.error('Erro capturado pelo middleware global:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    correlationId: req.correlationId,
    softwareHouse: req.softwareHouse ? req.softwareHouse.cnpj : null,
    timestamp: new Date().toISOString()
  });

  // Se a resposta já foi enviada, não podemos enviar outra
  if (res.headersSent) {
    return next(err);
  }

  // Determina o status HTTP apropriado
  let statusCode = 500;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let message = 'Erro interno do servidor';

  // Mapeia tipos de erro para códigos HTTP apropriados
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = 'Erro de validação';
  } else if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    errorCode = 'DATABASE_VALIDATION_ERROR';
    message = 'Erro de validação no banco de dados';
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    errorCode = 'DUPLICATE_ENTRY';
    message = 'Registro duplicado';
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    errorCode = 'FOREIGN_KEY_VIOLATION';
    message = 'Violação de chave estrangeira';
  } else if (err.name === 'SequelizeDatabaseError') {
    statusCode = 500;
    errorCode = 'DATABASE_ERROR';
    message = 'Erro no banco de dados';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'INVALID_TOKEN';
    message = 'Token inválido';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = 'TOKEN_EXPIRED';
    message = 'Token expirado';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorCode = 'UNAUTHORIZED';
    message = 'Não autorizado';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    errorCode = 'FORBIDDEN';
    message = 'Acesso negado';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    errorCode = 'NOT_FOUND';
    message = 'Recurso não encontrado';
  } else if (err.name === 'RateLimitError') {
    statusCode = 429;
    errorCode = 'RATE_LIMIT_EXCEEDED';
    message = 'Limite de requisições excedido';
  } else if (err.statusCode) {
    // Se o erro já tem um statusCode definido
    statusCode = err.statusCode;
    errorCode = err.errorCode || 'CUSTOM_ERROR';
    message = err.message || message;
  } else if (err.code) {
    // Mapeia códigos de erro específicos
    switch (err.code) {
      case 'MISSING_TOKEN':
        statusCode = 401;
        errorCode = 'MISSING_TOKEN';
        message = 'Token de autenticação não fornecido';
        break;
      case 'INVALID_TOKEN':
        statusCode = 401;
        errorCode = 'INVALID_TOKEN';
        message = 'Token inválido';
        break;
      case 'TOKEN_EXPIRED':
        statusCode = 401;
        errorCode = 'TOKEN_EXPIRED';
        message = 'Token expirado';
        break;
      case 'MISSING_CNPJ_SH_HEADER':
        statusCode = 400;
        errorCode = 'MISSING_CNPJ_SH_HEADER';
        message = 'Header cnpj-sh é obrigatório';
        break;
      case 'MISSING_TOKEN_SH_HEADER':
        statusCode = 400;
        errorCode = 'MISSING_TOKEN_SH_HEADER';
        message = 'Header token-sh é obrigatório';
        break;
      case 'INVALID_CNPJ_FORMAT':
        statusCode = 400;
        errorCode = 'INVALID_CNPJ_FORMAT';
        message = 'Formato de CNPJ inválido';
        break;
      case 'INVALID_TOKEN_SH_FORMAT':
        statusCode = 400;
        errorCode = 'INVALID_TOKEN_SH_FORMAT';
        message = 'Formato de token-sh inválido';
        break;
      case 'INVALID_TOKEN_SH':
        statusCode = 401;
        errorCode = 'INVALID_TOKEN_SH';
        message = 'Token SH inválido ou Software House inativa';
        break;
      case 'CNPJ_TOKEN_MISMATCH':
        statusCode = 403;
        errorCode = 'CNPJ_TOKEN_MISMATCH';
        message = 'CNPJ não corresponde ao token SH fornecido';
        break;
      default:
        // Mantém o status 500 para erros não mapeados
        break;
    }
  }

  // Prepara a resposta de erro
  const errorResponse = {
    success: false,
    error: message,
    code: errorCode,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  };

  // Adiciona detalhes adicionais em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = err.message;
  }

  // Adiciona ID de correlação se disponível
  if (req.correlationId) {
    errorResponse.correlationId = req.correlationId;
  }

  // Adiciona informações da Software House se disponível
  if (req.softwareHouse) {
    errorResponse.softwareHouse = {
      cnpj: req.softwareHouse.cnpj,
      id: req.softwareHouse.id
    };
  }

  // Envia a resposta de erro
  res.status(statusCode).json(errorResponse);
};

/**
 * Middleware para capturar erros de sintaxe JSON
 */
const jsonErrorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    logger.error('Erro de sintaxe JSON:', {
      error: err.message,
      url: req.url,
      method: req.method,
      body: req.body
    });

    return res.status(400).json({
      success: false,
      error: 'Formato JSON inválido',
      code: 'INVALID_JSON',
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method
    });
  }
  next(err);
};

/**
 * Middleware para capturar erros de timeout
 */
const timeoutErrorHandler = (err, req, res, next) => {
  if (err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT') {
    logger.error('Erro de timeout:', {
      error: err.message,
      code: err.code,
      url: req.url,
      method: req.method
    });

    return res.status(408).json({
      success: false,
      error: 'Timeout da requisição',
      code: 'REQUEST_TIMEOUT',
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method
    });
  }
  next(err);
};

/**
 * Middleware para capturar erros de conexão
 */
const connectionErrorHandler = (err, req, res, next) => {
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    logger.error('Erro de conexão:', {
      error: err.message,
      code: err.code,
      url: req.url,
      method: req.method
    });

    return res.status(503).json({
      success: false,
      error: 'Serviço temporariamente indisponível',
      code: 'SERVICE_UNAVAILABLE',
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method
    });
  }
  next(err);
};

/**
 * Middleware para capturar erros não tratados
 */
const unhandledErrorHandler = (err, req, res, next) => {
  // Se chegou até aqui, é um erro não tratado
  logger.error('Erro não tratado:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Envia resposta de erro genérica
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    code: 'UNHANDLED_ERROR',
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  });
};

/**
 * Middleware para capturar erros de rota não encontrada
 */
const notFoundHandler = (req, res) => {
  logger.warn('Rota não encontrada:', {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    code: 'ROUTE_NOT_FOUND',
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  });
};

module.exports = {
  errorHandler,
  jsonErrorHandler,
  timeoutErrorHandler,
  connectionErrorHandler,
  unhandledErrorHandler,
  notFoundHandler,
  logger
};



