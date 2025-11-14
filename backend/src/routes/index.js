const express = require("express");
const router = express.Router();
const cedenteRoutes = require("./cedenteRoutes");
const contaRoutes = require("./contaRoutes");
const convenioRoutes = require("./convenioRoutes");
const servicoRoutes = require("./servicoRoutes");
const protocoloRoutes = require("./protocoloRoutes");
const webhookRoutes = require("./webhookRoutes");
const reenvioRoutes = require("./reenvioRoutes");

router.use("/cedentes", cedenteRoutes);
router.use("/contas", contaRoutes);
router.use("/convenios", convenioRoutes);
router.use("/servicos", servicoRoutes);
router.use("/protocolos", protocoloRoutes);
router.use("/webhooks", webhookRoutes);     
router.use("/reenviar", reenvioRoutes);

module.exports = router;
