const WebhookService = require("../services/WebhookService");

class WebhookController {
  /**
   * @desc    
   * @route   
   */
  async enviar(req, res, next) {
    try {
      const { softwareHouse } = req.auth;
      const { protocolo_id, evento, dados } = req.body;
      
      const result = await WebhookService.enviarWebhook(softwareHouse.id, protocolo_id, evento, dados);

      res.status(200).json({
        success: true,
        message: "Webhook enviado com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    
   * @route   
   */
  async reenviar(req, res, next) {
    try {
      const { softwareHouse } = req.auth;
      const { id } = req.params;

      const result = await WebhookService.reenviarWebhook(id, softwareHouse.id);

      res.status(200).json({
        success: true,
        message: "Webhook reenviado com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    
   * @route   
   */
  async obterHistorico(req, res, next) {
    try {
      const { softwareHouse } = req.auth;
      const { protocolo_id } = req.params;

      const historico = await WebhookService.obterHistorico(protocolo_id, softwareHouse.id);

      res.status(200).json({
        success: true,
        data: historico,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WebhookController();
