const express = require("express");
const router = express.Router();
const ProtocoloController = require("../controllers/ProtocoloController");

// A rota de busca por UUID chama a função findByUuid do controller
router.get("/:uuid", ProtocoloController.findByUuid);

router.get("/", ProtocoloController.findAll);

module.exports = router;