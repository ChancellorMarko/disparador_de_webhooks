const CedenteService = require("../services/CedenteService");
const { AppError } = require("../utils/errors"); 

class CedenteController {
  /**
   * @desc    
   * @route 
   */
  async create(req, res, next) {
    try {
      const softwareHouseId = req.auth.softwareHouseId;

      // Adicionamos uma verificação para garantir que o token continha o ID
      if (!softwareHouseId) {
        throw new AppError("ID da Software House não encontrado no token.", 403);
      }
      
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
      const softwareHouseId = req.auth.softwareHouseId;

      if (!softwareHouseId) {
        throw new AppError("ID da Software House não encontrado no token.", 403);
      }

      const filters = { ...req.query, softwarehouse_id: softwareHouseId };
      
      const cedentes = await CedenteService.findAll(filters);
      
      res.status(200).json({
        success: true,
        data: cedentes,
      });
    } catch (error) {
      next(error);
    }
  }
  
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