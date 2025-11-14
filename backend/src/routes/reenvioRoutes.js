const express = require("express");
const router = express.Router();

const ReenvioController = require("../controllers/ReenvioController");
const { validateReenvio } = require("../validators/ReenvioValidator");
const { authenticateJWT } = require('../middlewares/auth');
const { shAuth } = require('../middlewares/shAuth'); // Importa a versão COMPLETA


router.post("/", authenticateJWT, shAuth, validateReenvio, ReenvioController.create);

module.exports = router;