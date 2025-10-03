const express = require('express');
const router = express.Router();
const AuthenticationService = require('../services/AuthenticationService');

/**
 * @route POST /api/login
 * @desc Autentica uma Software House e retorna o token JWT
 * @access Public
 */
router.post('/', async (req, res) => {
    const { cnpj, senha } = req.body;

    if (!cnpj || !senha) {
        return res.status(400).json({
            success: false,
            error: 'CNPJ e senha são obrigatórios'
        });
    }

    try {
        const result = await AuthenticationService.authenticate(cnpj, senha);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
