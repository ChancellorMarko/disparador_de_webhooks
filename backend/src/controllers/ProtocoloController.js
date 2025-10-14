const ProtocoloService = require("../services/ProtocoloService");

// REMOVEMOS a instância que era criada aqui.
// const protocoloService = new ProtocoloService()

class ProtocoloController {
  /**
   * @desc     Lista protocolos com base nos filtros da documentação
   * @route    GET /api/protocolos
   */
  async findAll(req, res, next) {
    try {
      // CORREÇÃO: Criamos a instância do serviço aqui, dentro do método.
      // Agora, o mock do Jest será aplicado corretamente durante os testes.
      const protocoloService = new ProtocoloService();

      const filters = req.query;
      const cedenteId = req.auth.cedente.id;

      // Chama o serviço que retorna os resultados
      const resultados = await protocoloService.findAll(filters, cedenteId);

      // Retorna a resposta de sucesso com os dados
      res.status(200).json({
        success: true,
        data: resultados,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc     Busca um protocolo específico pelo seu UUID
   * @route    GET /api/protocolos/:uuid
   */
  async findByUuid(req, res, next) {
    try {
      // Boa prática: Aplicamos a mesma correção aqui.
      const protocoloService = new ProtocoloService();
      
      const { uuid } = req.params;
      const cedenteId = req.auth.cedente.id;

      const protocolo = await protocoloService.findByUuid(uuid, cedenteId);

      if (!protocolo) {
        return res.status(404).json({
          success: false,
          message: "Protocolo não encontrado.",
        });
      }

      res.status(200).json({
        success: true,
        data: protocolo,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProtocoloController();
