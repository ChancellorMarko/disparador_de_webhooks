const express = require("express")
const router = express.Router()
const ServicoController = require("../controllers/ServicoController")

// The authenticateJWT middleware is already applied at the app level in app.js
// when registering this route: app.use("/api/servicos", authenticateJWT, servicoRoutes)

// Registra os métodos do controller para cada endpoint
router.post("/", ServicoController.create)
router.get("/", ServicoController.findAll)
router.get("/:id", ServicoController.findById)
router.put("/:id", ServicoController.update)
router.delete("/:id", ServicoController.delete)

module.exports = router
