const express = require("express");
const router = express.Router();
const CedenteController = require("../controllers/CedenteController");

// 1. IMPORTE O MIDDLEWARE shAuth
// Lembre-se de usar as chaves {} porque exportamos um objeto
const { shAuth } = require('../middlewares/shAuth');

// O middleware authenticateJWT já foi aplicado no arquivo principal (app.js)

// 2. APLIQUE o shAuth na rota de criação
// O fluxo será: authenticateJWT (do app.js) -> shAuth (daqui) -> CedenteController.create
router.post("/", shAuth, CedenteController.create);

// As outras rotas não precisam da validação shAuth, então continuam como estavam
router.get("/", CedenteController.findAll);
router.get("/:id", CedenteController.findById);
router.put("/:id", CedenteController.update);
router.delete("/:id", CedenteController.delete);

module.exports = router;