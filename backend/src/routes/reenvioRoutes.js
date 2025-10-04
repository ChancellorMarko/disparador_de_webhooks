const express = require("express")
const router = express.Router()
const ReenvioService = require("../services/ReenvioService")
const { headerAuth } = require("../middlewares/headerAuth")
const { validateReenvio } = require("../validators/reenvioValidator")

/**
 * @route POST /api/reenviar
 * @desc Cria uma nova solicitação de reenvio de webhook
 * @access Private
 */
router.post("/", headerAuth, validateReenvio, async (req, res, next) => {
  try {
    const reenvioData = req.body
    const authData = req.auth // Dados injetados pelo middleware headerAuth

    const result = await ReenvioService.criarReenvio(reenvioData, authData)

    res.status(201).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router