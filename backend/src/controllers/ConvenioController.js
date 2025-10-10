const ConvenioService = require("../services/ConvenioService");

class ConvenioController {
  /**
   * @desc    Cria um novo Convênio
   * @route   POST /api/convenios
   */
  async create(req, res, next) {
    try {
      // Para criar um convênio, o ID da conta à qual ele pertence é obrigatório
      const { conta_id } = req.body;
      if (!conta_id) {
        return res.status(400).json({ 
          success: false, 
          message: 'O campo conta_id é obrigatório no corpo da requisição.' 
        });
      }
      
      const novoConvenio = await ConvenioService.create(req.body, conta_id);
      
      res.status(201).json({
        success: true,
        message: "Convênio criado com sucesso.",
        data: novoConvenio,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Lista todos os Convênios
   * @route   GET /api/convenios
   */
  async findAll(req, res, next) {
    try {
      const filters = req.query;
      const convenios = await ConvenioService.findAll(filters);
      res.status(200).json({
        success: true,
        data: convenios,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Busca um Convênio específico por ID
   * @route   GET /api/convenios/:id
   */
  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const convenio = await ConvenioService.findById(id);
      res.status(200).json({
        success: true,
        data: convenio,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Atualiza um Convênio
   * @route   PUT /api/convenios/:id
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const convenioAtualizado = await ConvenioService.update(id, req.body);
      res.status(200).json({
        success: true,
        message: "Convênio atualizado com sucesso.",
        data: convenioAtualizado,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Deleta um Convênio
   * @route   DELETE /api/convenios/:id
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await ConvenioService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConvenioController();
