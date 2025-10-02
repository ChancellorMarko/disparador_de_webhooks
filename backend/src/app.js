const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importações de configuração
const { testConnection } = require('./config/database');
const { connectRedis } = require('./config/redis');

// Importações de middlewares
const {
  validateRequiredHeaders,
  validateOptionalHeaders,
  validateCorrelationHeaders
} = require('./middlewares/validation');
const { authenticateJWT, optionalAuth } = require('./middlewares/auth');
const {
  errorHandler,
  jsonErrorHandler,
  timeoutErrorHandler,
  connectionErrorHandler,
  notFoundHandler,
  logger
} = require('./middlewares/errorHandler');

// Importações de rotas
const webhookRoutes = require('./routes/webhook');
const protocoloRoutes = require('./routes/protocolo');
const loginRouter = require('./routes/login');

// Criação da aplicação Express
const app = express();

// Configuração de rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos por padrão
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limite de 100 requisições por janela
  message: {
    success: false,
    error: 'Muitas requisições deste IP, tente novamente mais tarde',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Usa o IP do cliente ou uma chave personalizada se fornecida
    return req.headers['x-rate-limit-key'] || req.ip;
  }
});

// Middlewares de segurança e configuração básica
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(limiter);

// Middleware de correlação (deve ser um dos primeiros)
app.use(validateCorrelationHeaders);

// Middleware de logging de requisições
app.use((req, res, next) => {
  logger.info('Requisição recebida', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    correlationId: req.correlationId,
    timestamp: new Date().toISOString()
  });
  next();
});

// Middleware de timeout para requisições longas
app.use((req, res, next) => {
  req.setTimeout(30000, () => {
    logger.warn('Timeout da requisição', {
      url: req.url,
      method: req.method,
      correlationId: req.correlationId
    });
  });
  next();
});

// Rotas públicas (sem autenticação)
app.use('/api/login', loginRouter);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando normalmente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rotas que requerem validação de headers mas não necessariamente autenticação JWT
app.use('/api/webhook', validateOptionalHeaders, webhookRoutes);

// Rotas que requerem autenticação JWT
app.use('/api/protocolo', authenticateJWT, protocoloRoutes);

// Middleware para capturar rotas não encontradas
app.use('*', notFoundHandler);

// Middlewares de tratamento de erros (devem ser os últimos)
app.use(jsonErrorHandler);
app.use(timeoutErrorHandler);
app.use(connectionErrorHandler);
app.use(errorHandler);

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  logger.error('Exceção não capturada:', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  // Em produção, pode ser necessário encerrar o processo
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promise rejeitada não tratada:', {
    reason: reason,
    promise: promise,
    timestamp: new Date().toISOString()
  });
});

// Função para inicializar a aplicação
const initializeApp = async () => {
  try {
    // Testa conexão com o banco de dados
    await testConnection();

    // Conecta ao Redis
    await connectRedis();

    logger.info('Aplicação inicializada com sucesso');
  } catch (error) {
    logger.error('Erro ao inicializar aplicação:', error);
    process.exit(1);
  }
};

// Função para encerrar a aplicação graciosamente
const gracefulShutdown = async (signal) => {
  logger.info(`Recebido sinal ${signal}, encerrando aplicação...`);

  try {
    // Aqui você pode adicionar lógica para encerrar conexões de banco, Redis, etc.
    process.exit(0);
  } catch (error) {
    logger.error('Erro durante encerramento:', error);
    process.exit(1);
  }
};

// Captura sinais de encerramento
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Inicializa a aplicação
initializeApp();

module.exports = app;



