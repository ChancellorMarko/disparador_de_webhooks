const express = require("express")
const router = express.Router()
const ServicoService = require("../services/ServicoService")
const { authenticateJWT } = require("../middlewares/auth")

// Todas as rotas requerem autenticação
router.use(authenticateJWT)

/**
 * @route GET /api/servicos
 * @desc Lista todos os serviços da Software House autenticada
 * @access Private
 */
router.get("/", async (req, res, next) => {
  try {
    const { user } = req
    const { page = 1, limit = 10, convenio_id, ativo } = req.query

    const filters = { software_house_id: user.id }
    if (convenio_id) filters.convenio_id = convenio_id
    if (ativo !== undefined) filters.ativo = ativo === "true"

    const servicos = await ServicoService.findAll(filters, {
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
    })

    res.status(200).json({
      success: true,
      data: servicos,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route GET /api/servicos/:id
 * @desc Busca um serviço específico por ID
 * @access Private
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { user } = req

    const servico = await ServicoService.findById(id, user.id)

    res.status(200).json({
      success: true,
      data: servico,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route POST /api/servicos
 * @desc Cria um novo serviço
 * @access Private
 */
router.post("/", async (req, res, next) => {
  try {
    const { user } = req
    const servicoData = {
      ...req.body,
      software_house_id: user.id,
    }

    const servico = await ServicoService.create(servicoData)

    res.status(201).json({
      success: true,
      data: servico,
      message: "Serviço criado com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route PUT /api/servicos/:id
 * @desc Atualiza um serviço existente
 * @access Private
 */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { user } = req

    const servico = await ServicoService.update(id, req.body, user.id)

    res.status(200).json({
      success: true,
      data: servico,
      message: "Serviço atualizado com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route DELETE /api/servicos/:id
 * @desc Remove um serviço (soft delete)
 * @access Private
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { user } = req

    await ServicoService.delete(id, user.id)

    res.status(200).json({
      success: true,
      message: "Serviço removido com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
