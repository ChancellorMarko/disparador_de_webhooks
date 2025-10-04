const express = require("express");
const router = express.Router();

// Importar todas as suas rotas de negócio
const cedenteRoutes = require("./cedenteRoutes");
const contaRoutes = require("./contaRoutes");
const convenioRoutes = require("./convenioRoutes");
const servicoRoutes = require("./servicoRoutes");
const protocoloRoutes = require("./protocoloRoutes");
const webhookRoutes = require("./webhookRoutes");
const reenvioRoutes = require("./reenvioRoutes");
// Se você mantiver o login com JWT para um painel, descomente a linha abaixo
// const authRoutes = require("./authRoutes");

// Registrar as rotas nos seus respectivos endpoints
// Ex: /api/cedentes, /api/contas, etc.
router.use("/cedentes", cedenteRoutes);
router.use("/contas", contaRoutes);
router.use("/convenios", convenioRoutes);
router.use("/servicos", servicoRoutes);
router.use("/protocolos", protocoloRoutes); // Corrigido para /protocolos
router.use("/webhooks", webhookRoutes);     // Corrigido para /webhooks
router.use("/reenviar", reenvioRoutes);
// Se mantiver o login, descomente a linha abaixo
// router.use("/auth", authRoutes);

module.exports = router;
