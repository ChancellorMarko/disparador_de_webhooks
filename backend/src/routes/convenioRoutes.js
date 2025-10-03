const express = require("express")
const router = express.Router()
const ConvenioService = require("../services/ConvenioService")
const { authenticateJWT } = require("../middlewares/auth")

// Todas as rotas requerem autenticação
router.use(authenticateJWT)

/**
 * @route GET /api/convenios
 * @desc Lista todos os convênios da Software House autenticada
 * @access Private
 */
router.get("/", async (req, res, next) => {
  try {
    const { user } = req
    const { page = 1, limit = 10, ativo } = req.query

    const filters = { software_house_id: user.id }
    if (ativo !== undefined) {
      filters.ativo = ativo === "true"
    }

    const convenios = await ConvenioService.findAll(filters, {
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
    })

    res.status(200).json({
      success: true,
      data: convenios,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route GET /api/convenios/:id
 * @desc Busca um convênio específico por ID
 * @access Private
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { user } = req

    const convenio = await ConvenioService.findById(id, user.id)

    res.status(200).json({
      success: true,
      data: convenio,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route POST /api/convenios
 * @desc Cria um novo convênio
 * @access Private
 */
router.post("/", async (req, res, next) => {
  try {
    const { user } = req
    const convenioData = {
      ...req.body,
      software_house_id: user.id,
    }

    const convenio = await ConvenioService.create(convenioData)

    res.status(201).json({
      success: true,
      data: convenio,
      message: "Convênio criado com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route PUT /api/convenios/:id
 * @desc Atualiza um convênio existente
 * @access Private
 */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { user } = req

    const convenio = await ConvenioService.update(id, req.body, user.id)

    res.status(200).json({
      success: true,
      data: convenio,
      message: "Convênio atualizado com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route DELETE /api/convenios/:id
 * @desc Remove um convênio (soft delete)
 * @access Private
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { user } = req

    await ConvenioService.delete(id, user.id)

    res.status(200).json({
      success: true,
      message: "Convênio removido com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
