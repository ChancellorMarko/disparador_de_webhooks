const express = require("express");
const router = express.Router();
const ProtocoloController = require("../controllers/ProtocoloController");

router.get("/:uuid", ProtocoloController.findByUuid);

router.get("/", ProtocoloController.findAll);

module.exports = router;