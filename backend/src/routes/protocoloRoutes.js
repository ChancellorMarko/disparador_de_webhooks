const express = require("express");
const router = express.Router();
const ProtocoloController = require("../controllers/ProtocoloController");
const { headerAuth } = require("../middlewares/headerAuth");
// Supondo que você criou o validador em 'src/validators/protocoloValidator.js'
const { validateListagemProtocolos } = require("../validators/protocoloValidator"); 

router.use(headerAuth);

// A rota de listagem passa primeiro pelo validador e depois chama o controller
router.get("/", validateListagemProtocolos, ProtocoloController.findAll);

// A rota de busca por UUID chama diretamente o controller
router.get("/:uuid", ProtocoloController.findByUuid);

module.exports = router;