const express = require("express");
const router = express.Router();
const CedenteController = require("../controllers/CedenteController");

const { shAuthSimple } = require('../middlewares/shAuthSimple');

router.post("/", shAuthSimple, CedenteController.create);

router.get("/", CedenteController.findAll);
router.get("/:id", CedenteController.findById);
router.put("/:id", CedenteController.update);
router.delete("/:id", CedenteController.delete);

module.exports = router;