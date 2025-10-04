const express = require("express")
const router = express.Router()
const AuthenticationService = require("../services/AuthenticationService")
const { authenticateJWT } = require("../middlewares/auth")

/**
 * @route POST /api/auth/login
 * @desc Autentica uma Software House e retorna tokens JWT
 * @access Public
 */
router.post("/login", async (req, res, next) => {
  try {
    const { cnpj, senha } = req.body

    if (!cnpj || !senha) {
      return res.status(400).json({
        success: false,
        error: "CNPJ e senha são obrigatórios",
      })
    }

    const result = await AuthenticationService.authenticate(cnpj, senha)

    res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route POST /api/auth/refresh
 * @desc Renova o access token usando o refresh token
 * @access Public
 */
router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: "Refresh token é obrigatório",
      })
    }

    const result = await AuthenticationService.refreshToken(refreshToken)

    res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route POST /api/auth/logout
 * @desc Faz logout e invalida o refresh token
 * @access Private
 */
router.post("/logout", authenticateJWT, async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: "Refresh token é obrigatório",
      })
    }

    await AuthenticationService.logout(refreshToken)

    res.status(200).json({
      success: true,
      message: "Logout realizado com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @route GET /api/auth/me
 * @desc Retorna informações do usuário autenticado
 * @access Private
 */
router.get("/me", authenticateJWT, async (req, res, next) => {
  try {
    const { user } = req

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        cnpj: user.cnpj,
        razao_social: user.razao_social,
        nome_fantasia: user.nome_fantasia,
        email: user.email,
        ativo: user.ativo,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
