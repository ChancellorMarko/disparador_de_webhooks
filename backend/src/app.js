const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// --- CONFIGURAÇÃO E INICIALIZAÇÃO ---
const { testConnection } = require("./config/database");
const { connectRedis } = require("./config/redis");

// --- MIDDLEWARES ---
const { logger, notFoundHandler, errorHandler } = require("./middlewares/errorHandler");
// Importa o middleware de autenticação via header que criamos
const { headerAuth } = require("./middlewares/headerAuth");

// --- ROTAS ---
const routes = require("./routes"); // Importa o index.js das rotas

// --- CRIAÇÃO DA APLICAÇÃO ---
const app = express();

// --- CONFIGURAÇÃO DE MIDDLEWARES DE SEGURANÇA E UTILITÁRIOS ---

// Helmet para adicionar headers de segurança
app.use(helmet());

// CORS para permitir requisições de origens diferentes
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : "*",
    credentials: true,
  })
);

// Parsers para JSON e URL-encoded bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate Limiter para proteger contra ataques de força bruta
const limiter = rateLimit({
  windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    error: "Muitas requisições deste IP, tente novamente mais tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Logger de requisições
app.use((req, res, next) => {
  logger.info(`Requisição recebida: ${req.method} ${req.originalUrl}`, { ip: req.ip });
  next();
});

// --- REGISTRO DAS ROTAS ---

// Rotas Públicas (não precisam de autenticação)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API está funcionando normalmente",
    timestamp: new Date().toISOString(),
  });
});
app.get("/status", (req, res) => {
    res.status(200).json({
      success: true,
      status: "online",
      uptime: process.uptime(),
    });
});


// Rotas de Negócio (TODAS protegidas pelo middleware headerAuth)
// Esta é a forma correta de proteger toda a sua API de uma só vez.
app.use("/api", headerAuth, routes);


// --- TRATAMENTO DE ERROS ---

// Middleware para capturar rotas não encontradas (404)
// Deve vir DEPOIS de todas as rotas válidas
app.use(notFoundHandler);

// Middleware de Erro Global
// Deve ser o ÚLTIMO middleware a ser registrado
app.use(errorHandler);


// --- INICIALIZAÇÃO E ENCERRAMENTO ---

const startServer = async () => {
  try {
    await testConnection(); // Testa a conexão com o banco
    await connectRedis();   // Conecta ao Redis
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error("Erro fatal ao inicializar a aplicação:", error);
    process.exit(1);
  }
};

// Inicia a aplicação
startServer();

module.exports = app;