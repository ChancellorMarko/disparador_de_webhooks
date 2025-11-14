const express = require("express");
const router = express.Router();
const ProtocoloController = require("../controllers/ProtocoloController");
const { validateProtocolQuery } = require("../middlewares/validation");


router.get("/:uuid", ProtocoloController.findByUuid);


router.get("/", validateProtocolQuery, ProtocoloController.findAll);

module.exports = router;
