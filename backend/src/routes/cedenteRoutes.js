const express = require("express")
const router = express.Router()
const CedenteController = require("../controllers/CedenteController")

// The authenticateJWT middleware is already applied at the app level in app.js
// when registering this route: app.use("/api/cedentes", authenticateJWT, cedenteRoutes)

router.post("/", CedenteController.create)
router.get("/", CedenteController.findAll)
router.get("/:id", CedenteController.findById)
router.put("/:id", CedenteController.update)
router.delete("/:id", CedenteController.delete)

module.exports = router
