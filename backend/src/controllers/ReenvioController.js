const ReenvioService = require("../services/ReenvioService");

class ReenvioController {
  /**
   * @desc    Cria uma nova solicitação de reenvio de webhook
   * @route   POST /api/reenviar
   */
  async create(req, res, next) {
    try {
      const reenvioData = req.body;
      const authData = req.auth; // Injetado pelo middleware headerAuth

      const result = await ReenvioService.criarReenvio(reenvioData, authData);

      res.status(201).json({
        success: true,
        message: "Solicitação de reenvio criada com sucesso.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

// A linha mais importante: exporta a instância para ser usada nas rotas
module.exports = new ReenvioController();