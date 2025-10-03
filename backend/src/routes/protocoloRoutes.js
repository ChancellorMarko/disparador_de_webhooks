const express = require("express")
const router = express.Router()
const ProtocoloService = require("../services/ProtocoloService")
const { authenticateJWT } = require("../middlewares/auth")

// Todas as rotas requerem autenticação
router.use(authenticateJWT)

/**
 * @route GET /api/protocolos
 * @desc Lista todos os protocolos da Software House autenticada
 * @access Private
 */
router.get("/", async (req, res, next) => {
  try {
    const { user } = req
    const { page = 1, limit = 10, status, cedente_id, servico_id } = req.query

    const filters = { software_house_id: user.id }
    if (status) filters.status = status
    if (cedente_id) filters.cedente_id = cedente_id
    if (servico_id) filters.servico_id = servico_id

    const protocolos = await ProtocoloService.findAll(filters, {
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
    })

    res.status(200).json({
      success: true,
      data: protocolos,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route GET /api/protocolos/:uuid
 * @desc Busca um protocolo específico por UUID
 * @access Private
 */
router.get("/:uuid", async (req, res, next) => {
  try {
    const { uuid } = req.params
    const { user } = req

    const protocolo = await ProtocoloService.findByUuid(uuid, user.id)

    res.status(200).json({
      success: true,
      data: protocolo,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route POST /api/protocolos
 * @desc Cria um novo protocolo
 * @access Private
 */
router.post("/", async (req, res, next) => {
  try {
    const { user } = req
    const protocoloData = {
      ...req.body,
      software_house_id: user.id,
    }

    const protocolo = await ProtocoloService.create(protocoloData)

    res.status(201).json({
      success: true,
      data: protocolo,
      message: "Protocolo criado com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route PUT /api/protocolos/:uuid
 * @desc Atualiza um protocolo existente
 * @access Private
 */
router.put("/:uuid", async (req, res, next) => {
  try {
    const { uuid } = req.params
    const { user } = req

    const protocolo = await ProtocoloService.update(uuid, req.body, user.id)

    res.status(200).json({
      success: true,
      data: protocolo,
      message: "Protocolo atualizado com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route POST /api/protocolos/:uuid/reprocessar
 * @desc Reprocessa um protocolo com erro
 * @access Private
 */
router.post("/:uuid/reprocessar", async (req, res, next) => {
  try {
    const { uuid } = req.params
    const { user } = req

    const protocolo = await ProtocoloService.reprocessar(uuid, user.id)

    res.status(200).json({
      success: true,
      data: protocolo,
      message: "Protocolo reprocessado com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route DELETE /api/protocolos/:uuid
 * @desc Remove um protocolo
 * @access Private
 */
router.delete("/:uuid", async (req, res, next) => {
  try {
    const { uuid } = req.params
    const { user } = req

    await ProtocoloService.delete(uuid, user.id)

    res.status(200).json({
      success: true,
      message: "Protocolo removido com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
