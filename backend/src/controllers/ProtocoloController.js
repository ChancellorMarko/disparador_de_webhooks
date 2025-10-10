const ProtocoloService = require("../services/ProtocoloService");

class ProtocoloController {
  /**
   * @desc    Lista protocolos com base nos filtros da documentação
   * @route   GET /api/protocolos
   */
  async findAll(req, res, next) {
    try {
      // Filtros podem vir da query string
      const filters = req.query; 
      // Cedente do usuário autenticado (presumindo que você esteja usando um middleware para isso)
      const cedenteId = req.auth.cedente.id; 

      // Chama o serviço que retorna os resultados
      const resultados = await ProtocoloService.findAll(filters, cedenteId);
      
      // Retorna a resposta de sucesso com os dados
      res.status(200).json({
        success: true,
        data: resultados,
      });
    } catch (error) {
      // Se houver erro, chama o middleware de tratamento de erro
      next(error);
    }
  }

  /**
   * @desc    Busca um protocolo específico pelo seu UUID
   * @route   GET /api/protocolos/:uuid
   */
  async findByUuid(req, res, next) {
    try {
      const { uuid } = req.params; // Extrai o UUID dos parâmetros da URL
      const cedenteId = req.auth.cedente.id; // Cedente do usuário autenticado

      // Chama o serviço que busca o protocolo
      const protocolo = await ProtocoloService.findByUuid(uuid, cedenteId);

      if (!protocolo) {
        return res.status(404).json({
          success: false,
          message: "Protocolo não encontrado.",
        });
      }

      // Retorna a resposta de sucesso com o protocolo encontrado
      res.status(200).json({
        success: true,
        data: protocolo,
      });
    } catch (error) {
      // Se houver erro, chama o middleware de tratamento de erro
      next(error);
    }
  }
}

module.exports = new ProtocoloController();