const express = require("express");
const router = express.Router();

const ReenvioController = require("../controllers/ReenvioController");
const { validateReenvio } = require("../validators/ReenvioValidator");
const { authenticateJWT } = require('../middlewares/auth'); // Importação do JWT
const { shAuth } = require('../middlewares/shAuth');     // Importação correta com chaves {}

// A rota agora passa pela autenticação JWT, depois pelo shAuth, e depois pelo validador
router.post("/", authenticateJWT, shAuth, validateReenvio, ReenvioController.create);

module.exports = router;