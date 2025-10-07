const express = require("express");
const router = express.Router();
const WebhookController = require("../controllers/WebhookController");

// A autenticação headerAuth já é aplicada a este grupo de rotas no app.js
// Não é necessário usar router.use() aqui.

router.post("/enviar", WebhookController.enviar);
router.post("/reenviar/:id", WebhookController.reenviar);
router.get("/historico/:protocolo_id", WebhookController.obterHistorico);

module.exports = router;
