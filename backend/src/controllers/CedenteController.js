const CedenteService = require("../services/CedenteService");

class CedenteController {
  /**
   * @desc    Cria um novo Cedente
   * @route   POST /api/cedentes
   */
  async create(req, res, next) {
    try {
      // CORREÇÃO: O ID da SoftwareHouse vem do `req.user`,
      // que foi adicionado pelo middleware `authenticateJWT`.
      const softwareHouseId = req.user.id;
      
      const novoCedente = await CedenteService.create(req.body, softwareHouseId);
      
      res.status(201).json({
        success: true,
        message: "Cedente criado com sucesso.",
        data: novoCedente,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Lista todos os Cedentes da Software House
   * @route   GET /api/cedentes
   */
  async findAll(req, res, next) {
    try {
      // CORREÇÃO: Usa o `req.user.id` para filtrar os cedentes
      const filters = { ...req.query, softwarehouse_id: req.user.id };
      
      const cedentes = await CedenteService.findAll(filters);
      
      res.status(200).json({
        success: true,
        data: cedentes,
      });
    } catch (error) {
      next(error);
    }
  }

  // Os outros métodos (findById, update, delete) não precisam de alteração
  // porque eles já pegam o ID do recurso pelos parâmetros da rota (req.params).
  
  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const cedente = await CedenteService.findById(id);
      res.status(200).json({ success: true, data: cedente });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const cedenteAtualizado = await CedenteService.update(id, req.body);
      res.status(200).json({ success: true, message: "Cedente atualizado com sucesso.", data: cedenteAtualizado });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await CedenteService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CedenteController();