const express = require("express");
const router = express.Router();

const ReenvioController = require("../controllers/ReenvioController");
const { validateReenvio } = require("../validators/ReenvioValidator");
const shAuth = require('../middlewares/shAuth');

// A autenticação (headerAuth) já é aplicada a esta rota no app.js,
// então não precisamos adicioná-la aqui.

// A rota passa primeiro pelo validador do Joi e depois chama o método 'create' do controller.
router.post("/", validateReenvio, ReenvioController.create);

module.exports = router;
