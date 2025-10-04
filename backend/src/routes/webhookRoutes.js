const express = require("express");
const router = express.Router();
const WebhookController = require("../controllers/WebhookController");
const { headerAuth } = require("../middlewares/headerAuth");

// Aplica a autenticação via header em todas as rotas de webhook
router.use(headerAuth);

router.post("/enviar", WebhookController.enviar);
router.post("/reenviar/:id", WebhookController.reenviar);
router.get("/historico/:protocolo_id", WebhookController.obterHistorico);

module.exports = router;