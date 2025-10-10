const express = require("express");
const router = express.Router();

// Importar apenas as rotas de negócio que usam a autenticação por header
const protocoloRoutes = require("./protocoloRoutes");
const webhookRoutes = require("./webhookRoutes");
const reenvioRoutes = require("./reenvioRoutes");

// Registrar apenas as rotas de negócio
router.use("/protocolos", protocoloRoutes);
router.use("/webhooks", webhookRoutes);
router.use("/reenviar", reenvioRoutes);

module.exports = router;