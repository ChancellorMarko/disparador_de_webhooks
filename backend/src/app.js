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
const { headerAuth } = require("./middlewares/headerAuth"); // Autenticação de API (Header)
const { authenticateJWT } = require("./middlewares/auth"); // Autenticação de Usuário (JWT)

// --- ROTAS (SEÇÃO CORRIGIDA E SIMPLIFICADA) ---
// Agora importamos apenas os dois pontos de entrada principais para as rotas.
const authRoutes = require("./routes/authRoutes");
const allApiRoutes = require("./routes"); // Importa o index.js, que gerencia todas as outras rotas

// --- CRIAÇÃO DA APLICAÇÃO ---
const app = express();

// --- CONFIGURAÇÃO DE MIDDLEWARES ---
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Requisição recebida: ${req.method} ${req.originalUrl}`);
  next();
});

// --- REGISTRO DAS ROTAS (SEÇÃO CORRIGIDA E UNIFICADA) ---

// 1. Rotas Públicas (sem autenticação)
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API está funcionando." });
});
app.get("/status", (req, res) => {
  res.status(200).json({ success: true, status: "online", uptime: process.uptime() });
});

// 2. Rotas de Autenticação de Usuário (para gerar o token)
app.use("/api/auth", authRoutes);

// 3. Todas as outras rotas da API (protegidas por autenticação)
// O prefixo "/api" será adicionado a todas as rotas definidas em /routes/index.js
// Exemplo: /api/cedentes, /api/contas, /api/reenviar, etc.
// Escolha o middleware de proteção principal aqui (JWT ou Header Auth)
app.use("/api", authenticateJWT, allApiRoutes);

// --- TRATAMENTO DE ERROS ---
app.use(notFoundHandler);
app.use(errorHandler);

// --- INICIALIZAÇÃO ---
const startServer = async () => {
  try {
    await testConnection();
    await connectRedis();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`\n✅ Servidor iniciado e rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("\n❌ ERRO FATAL AO INICIALIZAR A APLICAÇÃO:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;