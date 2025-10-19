const ProtocoloService = require("../services/ProtocoloService");

class ProtocoloController {
  async findByUuid(req, res, next) {
    try {
      const { uuid } = req.params;
      const protocolo = await ProtocoloService.findByUuid(uuid);
      res.status(200).json({ success: true, data: protocolo });
    } catch (error) {
      next(error);
    }
  }

  // NOVA FUNÇÃO IMPLEMENTADA
  async findAll(req, res, next) {
    try {
      // Passa os filtros da URL (req.query) para o serviço
      const protocolos = await ProtocoloService.findAll(req.query);
      res.status(200).json({ success: true, data: protocolos });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProtocoloController();