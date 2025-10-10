const express = require("express");
const router = express.Router();
const CedenteController = require("../controllers/CedenteController");

// CORREÇÃO: Importando o middleware SIMPLES de 2 headers
const { shAuthSimple } = require('../middlewares/shAuthSimple');

// O middleware authenticateJWT já foi aplicado no arquivo principal (app.js)

// CORREÇÃO: Aplicando o middleware SIMPLES na rota de criação
router.post("/", shAuthSimple, CedenteController.create);

// As outras rotas não precisam da validação shAuth, então continuam como estavam
router.get("/", CedenteController.findAll);
router.get("/:id", CedenteController.findById);
router.put("/:id", CedenteController.update);
router.delete("/:id", CedenteController.delete);

module.exports = router;