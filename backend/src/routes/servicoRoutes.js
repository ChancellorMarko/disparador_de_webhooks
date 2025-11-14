const express = require("express")
const router = express.Router()
const ServicoController = require("../controllers/ServicoController")

router.post("/", ServicoController.create)
router.get("/", ServicoController.findAll)
router.get("/:id", ServicoController.findById)
router.put("/:id", ServicoController.update)
router.delete("/:id", ServicoController.delete)

module.exports = router
