const ServicoService = require("../services/ServicoService");

class ServicoController {
  /**
   * @desc    
   * @route   
   */
  async create(req, res, next) {
    try {
      const { convenio_id } = req.body;
      if (!convenio_id) {
        return res.status(400).json({ 
          success: false, 
          message: 'O campo convenio_id é obrigatório no corpo da requisição.' 
        });
      }

      const novoServico = await ServicoService.create(req.body, convenio_id);

      res.status(201).json({
        success: true,
        message: "Serviço criado com sucesso.",
        data: novoServico,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    
   * @route   
   */
  async findAll(req, res, next) {
    try {
      const filters = req.query;
      const servicos = await ServicoService.findAll(filters);
      res.status(200).json({
        success: true,
        data: servicos,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    
   * @route   
   */
  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const servico = await ServicoService.findById(id);
      res.status(200).json({
        success: true,
        data: servico,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    
   * @route   
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const servicoAtualizado = await ServicoService.update(id, req.body);
      res.status(200).json({
        success: true,
        message: "Serviço atualizado com sucesso.",
        data: servicoAtualizado,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    
   * @route   
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await ServicoService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ServicoController();
