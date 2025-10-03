const express = require("express")
const router = express.Router()
const ContaService = require("../services/ContaService")
const { authenticateJWT } = require("../middlewares/auth")

// Todas as rotas requerem autenticação
router.use(authenticateJWT)

/**
 * @route GET /api/contas
 * @desc Lista todas as contas da Software House autenticada
 * @access Private
 */
router.get("/", async (req, res, next) => {
  try {
    const { user } = req
    const { page = 1, limit = 10, cedente_id, ativo } = req.query

    const filters = { software_house_id: user.id }
    if (cedente_id) filters.cedente_id = cedente_id
    if (ativo !== undefined) filters.ativo = ativo === "true"

    const contas = await ContaService.findAll(filters, {
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
    })

    res.status(200).json({
      success: true,
      data: contas,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route GET /api/contas/:id
 * @desc Busca uma conta específica por ID
 * @access Private
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { user } = req

    const conta = await ContaService.findById(id, user.id)

    res.status(200).json({
      success: true,
      data: conta,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route POST /api/contas
 * @desc Cria uma nova conta bancária
 * @access Private
 */
router.post("/", async (req, res, next) => {
  try {
    const { user } = req
    const contaData = {
      ...req.body,
      software_house_id: user.id,
    }

    const conta = await ContaService.create(contaData)

    res.status(201).json({
      success: true,
      data: conta,
      message: "Conta criada com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route PUT /api/contas/:id
 * @desc Atualiza uma conta existente
 * @access Private
 */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { user } = req

    const conta = await ContaService.update(id, req.body, user.id)

    res.status(200).json({
      success: true,
      data: conta,
      message: "Conta atualizada com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route DELETE /api/contas/:id
 * @desc Remove uma conta (soft delete)
 * @access Private
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { user } = req

    await ContaService.delete(id, user.id)

    res.status(200).json({
      success: true,
      message: "Conta removida com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
