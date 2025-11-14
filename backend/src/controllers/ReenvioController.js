const ReenvioService = require("../services/ReenvioService");

class ReenvioController {
  async create(req, res, next) {
    try {
      const result = await ReenvioService.criarReenvio(req.body, req.cedente);

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

module.exports = new ReenvioController();