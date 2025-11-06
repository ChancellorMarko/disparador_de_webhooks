const express = require("express");
const router = express.Router();
const ProtocoloController = require("../controllers/ProtocoloController");
const { validateProtocolQuery } = require("../middlewares/validation");

// A rota de busca por UUID chama a função findByUuid do controller
router.get("/:uuid", ProtocoloController.findByUuid);

// Aplica validação da query antes do controller para GET /
router.get("/", validateProtocolQuery, ProtocoloController.findAll);

module.exports = router;
