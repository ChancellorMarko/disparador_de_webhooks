const express = require("express");
const router = express.Router();
const ContaController = require("../controllers/ContaController");
const { headerAuth } = require("../middlewares/headerAuth");

router.use(headerAuth);

router.post("/", ContaController.create);
router.get("/", ContaController.findAll);
router.get("/:id", ContaController.findById);
router.put("/:id", ContaController.update);
router.delete("/:id", ContaController.delete);

module.exports = router;