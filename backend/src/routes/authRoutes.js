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

    res.status(200).json({
      success: true,
      message: "Login realizado com sucesso!",
      data: result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Retorna informações do usuário autenticado (incluindo o token de API)
 */
router.get("/me", authenticateJWT, async (req, res, next) => {
  try {
    const userId = req.auth.softwareHouseId;
    
    const softwareHouseData = await AuthenticationService.getMe(userId);
    res.status(200).json({ success: true, data: softwareHouseData });
  } catch (error) {
    next(error);
  }
});

module.exports = router;