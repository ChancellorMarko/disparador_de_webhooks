const express = require("express")
const router = express.Router()

// Importar todas as rotas
const authRoutes = require("./authRoutes")
const cedenteRoutes = require("./cedenteRoutes")
const contaRoutes = require("./contaRoutes")
const convenioRoutes = require("./convenioRoutes")
const servicoRoutes = require("./servicoRoutes")
const protocoloRoutes = require("./protocoloRoutes")
const webhookRoutes = require("./webhookRoutes")

// Registrar rotas
router.use("/auth", authRoutes)
router.use("/cedentes", cedenteRoutes)
router.use("/contas", contaRoutes)
router.use("/convenios", convenioRoutes)
router.use("/servicos", servicoRoutes)
router.use("/protocolos", protocoloRoutes)
router.use("/webhooks", webhookRoutes)

// Rota de health check
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API está funcionando",
    timestamp: new Date().toISOString(),
  })
})

module.exports = router
