const express = require("express");
const router = express.Router();
const CedenteController = require("../controllers/CedenteController");
const { headerAuth } = require("../middlewares/headerAuth");

// Aplica o middleware de autenticação a todas as rotas deste arquivo
router.use(headerAuth);

// Define qual método do controller cuidará de cada endpoint
router.post("/", CedenteController.create);
router.get("/", CedenteController.findAll);
router.get("/:id", CedenteController.findById);
router.put("/:id", CedenteController.update);
router.delete("/:id", CedenteController.delete);

module.exports = router;