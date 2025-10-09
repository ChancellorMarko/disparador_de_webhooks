const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// --- CONFIGURAÇÃO E INICIALIZAÇÃO ---
const { testConnection } = require("./config/database");
const { connectRedis } = require("./config/redis");
// >>> ADICIONADO: Importação do novo serviço de disparo <<<
const WebhookDispatcherService = require('./services/WebhookDispatcherService');

// --- MIDDLEWARES ---
const { logger, notFoundHandler, errorHandler } = require("./middlewares/errorHandler");
const { headerAuth } = require("./middlewares/headerAuth");
const { authenticateJWT } = require("./middlewares/auth");

// --- ROTAS ---
const authRoutes = require("./routes/authRoutes");
const allApiRoutes = require("./routes");

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

// --- REGISTRO DAS ROTAS ---
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API está funcionando." });
});
app.get("/status", (req, res) => {
  res.status(200).json({ success: true, status: "online", uptime: process.uptime() });
});
app.use("/api/auth", authRoutes);
app.use("/api", authenticateJWT, allApiRoutes);

// --- TRATAMENTO DE ERROS ---
app.use(notFoundHandler);
app.use(errorHandler);

// --- INICIALIZAÇÃO ---
const startServer = async () => {
  try {
    await testConnection();
    await connectRedis();
    
    // >>> ADICIONADO: Lógica que inicia o disparador de webhooks <<<
    console.log('🚀 Disparador de webhooks ativado. Verificando a fila periodicamente.');
    // Roda o worker a cada 1 minuto (60000 ms)
    setInterval(() => {
      WebhookDispatcherService.processarFila();
    }, 60000);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`\n✅ Servidor iniciado e rodando na porta ${PORT}`);
      // Roda o worker uma vez assim que o servidor sobe para limpar a fila inicial
      WebhookDispatcherService.processarFila();
    });
  } catch (error) {
    console.error("\n❌ ERRO FATAL AO INICIALIZAR A APLICAÇÃO:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;