const express = require("express")
const router = express.Router()
const CedenteService = require("../services/CedenteService")
const { authenticateJWT } = require("../middlewares/auth")

// Todas as rotas requerem autenticação
router.use(authenticateJWT)

/**
 * @route GET /api/cedentes
 * @desc Lista todos os cedentes da Software House autenticada
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

    const cedentes = await CedenteService.findAll(filters, {
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
    })

    res.status(200).json({
      success: true,
      data: cedentes,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route GET /api/cedentes/:id
 * @desc Busca um cedente específico por ID
 * @access Private
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { user } = req

    const cedente = await CedenteService.findById(id, user.id)

    res.status(200).json({
      success: true,
      data: cedente,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route POST /api/cedentes
 * @desc Cria um novo cedente
 * @access Private
 */
router.post("/", async (req, res, next) => {
  try {
    const { user } = req
    const cedenteData = {
      ...req.body,
      software_house_id: user.id,
    }

    const cedente = await CedenteService.create(cedenteData)

    res.status(201).json({
      success: true,
      data: cedente,
      message: "Cedente criado com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route PUT /api/cedentes/:id
 * @desc Atualiza um cedente existente
 * @access Private
 */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { user } = req

    const cedente = await CedenteService.update(id, req.body, user.id)

    res.status(200).json({
      success: true,
      data: cedente,
      message: "Cedente atualizado com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route DELETE /api/cedentes/:id
 * @desc Remove um cedente (soft delete)
 * @access Private
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { user } = req

    await CedenteService.delete(id, user.id)

    res.status(200).json({
      success: true,
      message: "Cedente removido com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
