const express = require("express");
const router = express.Router();
const ProtocoloController = require("../controllers/ProtocoloController");
const { validateListagemProtocolos } = require("../validators/ProtocoloValidator"); 

// A rota de listagem usa o validator antes de chamar o controller
router.get("/", validateListagemProtocolos, ProtocoloController.findAll);

// A rota de busca por UUID chama diretamente o controller
router.get("/:uuid", ProtocoloController.findByUuid);

module.exports = router;