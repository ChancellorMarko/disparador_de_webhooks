const express = require("express")
const router = express.Router()
const WebhookService = require("../services/WebhookService")
const { authenticateJWT } = require("../middlewares/auth")

// Todas as rotas requerem autenticação
router.use(authenticateJWT)

/**
 * @route POST /api/webhooks/enviar
 * @desc Envia um webhook manualmente
 * @access Private
 */
router.post("/enviar", async (req, res, next) => {
  try {
    const { user } = req
    const { protocolo_id, evento, dados } = req.body

    if (!protocolo_id || !evento || !dados) {
      return res.status(400).json({
        success: false,
        error: "protocolo_id, evento e dados são obrigatórios",
      })
    }

    const result = await WebhookService.enviarWebhook(user.id, protocolo_id, evento, dados)

    res.status(200).json({
      success: true,
      data: result,
      message: "Webhook enviado com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route POST /api/webhooks/reenviar/:id
 * @desc Reenvia um webhook que falhou
 * @access Private
 */
router.post("/reenviar/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { user } = req

    const result = await WebhookService.reenviarWebhook(id, user.id)

    res.status(200).json({
      success: true,
      data: result,
      message: "Webhook reenviado com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route GET /api/webhooks/historico/:protocolo_id
 * @desc Lista o histórico de webhooks de um protocolo
 * @access Private
 */
router.get("/historico/:protocolo_id", async (req, res, next) => {
  try {
    const { protocolo_id } = req.params
    const { user } = req

    const historico = await WebhookService.obterHistorico(protocolo_id, user.id)

    res.status(200).json({
      success: true,
      data: historico,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route GET /api/webhooks/status
 * @desc Verifica o status geral dos webhooks
 * @access Private
 */
router.get("/status", async (req, res, next) => {
  try {
    const { user } = req

    const status = await WebhookService.obterStatus(user.id)

    res.status(200).json({
      success: true,
      data: status,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
