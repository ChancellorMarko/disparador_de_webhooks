const express = require("express")
const router = express.Router()
const ConvenioController = require("../controllers/ConvenioController")

// The authenticateJWT middleware is already applied at the app level in app.js
// when registering this route: app.use("/api/convenios", authenticateJWT, convenioRoutes)

// Registra os métodos do controller para cada endpoint
router.post("/", ConvenioController.create)
router.get("/", ConvenioController.findAll)
router.get("/:id", ConvenioController.findById)
router.put("/:id", ConvenioController.update)
router.delete("/:id", ConvenioController.delete)

module.exports = router
