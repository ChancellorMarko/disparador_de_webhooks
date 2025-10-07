const express = require("express");
const router = express.Router();
const AuthenticationService = require("../services/AuthenticationService");
const { authenticateJWT } = require("../middlewares/auth");

/**
 * @route   POST /api/auth/login
 * @desc    Autentica uma Software House e retorna tokens JWT
 */
router.post("/login", async (req, res, next) => {
  try {
    const { cnpj, senha } = req.body;
    const result = await AuthenticationService.authenticate(cnpj, senha);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Retorna informações do usuário autenticado (incluindo o token de API)
 */
// Esta rota é protegida pelo middleware que verifica o token JWT
router.get("/me", authenticateJWT, async (req, res, next) => {
  try {
    // O ID do usuário vem do token que o middleware `authenticateJWT` validou
    const userId = req.user.id;
    const softwareHouseData = await AuthenticationService.getMe(userId);
    res.status(200).json({ success: true, data: softwareHouseData });
  } catch (error) {
    next(error);
  }
});

// Você pode adicionar as rotas de /refresh e /logout aqui também se precisar

module.exports = router;
