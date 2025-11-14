const express = require("express");
const router = express.Router();
const WebhookController = require("../controllers/WebhookController");


router.post("/enviar", WebhookController.enviar);
router.post("/reenviar/:id", WebhookController.reenviar);
router.get("/historico/:protocolo_id", WebhookController.obterHistorico);

module.exports = router;
