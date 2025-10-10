const express = require("express");
const router = express.Router();

const ReenvioController = require("../controllers/ReenvioController");
const { validateReenvio } = require("../validators/ReenvioValidator");
const { authenticateJWT } = require('../middlewares/auth');
const { shAuth } = require('../middlewares/shAuth'); // Importa a versão COMPLETA

// A rota passa pela autenticação JWT, depois pelo shAuth completo, e depois pelo validador
// Esta lógica está PERFEITA.
router.post("/", authenticateJWT, shAuth, validateReenvio, ReenvioController.create);

module.exports = router;