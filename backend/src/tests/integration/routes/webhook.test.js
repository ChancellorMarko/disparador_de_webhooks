const express = require('express');
const router = express.Router();
const { validateRequiredHeaders } = require('../middlewares/validation');

/**
 * @route POST /api/webhook/reenviar
 * @desc Reenvia um webhook
 * @access Public (com validação de headers)
 */
router.post('/reenviar', validateRequiredHeaders, async (req, res) => {
  try {
    // A Software House já foi validada pelo middleware
    const { softwareHouse } = req;
    
    // Lógica de reenvio do webhook aqui
    res.status(200).json({
      success: true,
      message: 'Webhook reenviado com sucesso',
      softwareHouse: {
        cnpj: softwareHouse.cnpj,
        razao_social: softwareHouse.razao_social
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/webhook/status
 * @desc Verifica o status dos webhooks
 * @access Public (com validação opcional de headers)
 */
router.get('/status', async (req, res) => {
  try {
    // Se houver headers válidos, usa as informações da Software House
    if (req.softwareHouse) {
      res.status(200).json({
        success: true,
        message: 'Status dos webhooks',
        softwareHouse: {
          cnpj: req.softwareHouse.cnpj,
          razao_social: req.softwareHouse.razao_social
        },
        timestamp: new Date().toISOString()
      });
    } else {
      // Resposta genérica se não houver autenticação
      res.status(200).json({
        success: true,
        message: 'Status dos webhooks (acesso público)',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;



