const express = require("express");
const router = express.Router();
const ConvenioController = require("../controllers/ConvenioController");
const { headerAuth } = require("../middlewares/headerAuth");

router.use(headerAuth);

router.post("/", ConvenioController.create);
router.get("/", ConvenioController.findAll);
router.get("/:id", ConvenioController.findById);
router.put("/:id", ConvenioController.update);
router.delete("/:id", ConvenioController.delete);

module.exports = router;