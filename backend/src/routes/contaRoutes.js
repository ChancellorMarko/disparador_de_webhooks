const express = require("express")
const router = express.Router()
const ContaController = require("../controllers/ContaController")

// The authenticateJWT middleware is already applied at the app level in app.js
// when registering this route: app.use("/api/contas", authenticateJWT, contaRoutes)

// Registra os métodos do controller para cada endpoint
router.post("/", ContaController.create)
router.get("/", ContaController.findAll)
router.get("/:id", ContaController.findById)
router.put("/:id", ContaController.update)
router.delete("/:id", ContaController.delete)

module.exports = router