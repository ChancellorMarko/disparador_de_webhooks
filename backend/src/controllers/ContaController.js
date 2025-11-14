const ContaService = require("../services/ContaService");

class ContaController {
  /**
   * @desc    
   * @route   
   */
  async create(req, res, next) {
    try {
      // 1. Armazena o corpo inteiro da requisição
      const dadosConta = req.body;

      // 2. A validação do 'cedente_id' continua importante
      if (!dadosConta.cedente_id) {
         return res.status(400).json({ success: false, message: 'O campo cedente_id é obrigatório.' });
      }

      // 3. Cria a nova Conta usando o serviço
      const novaConta = await ContaService.create(dadosConta);

      res.status(201).json({
        success: true,
        message: "Conta criada com sucesso.",
        data: novaConta,
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
      const contas = await ContaService.findAll(filters);
      res.status(200).json({
        success: true,
        data: contas,
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
      const conta = await ContaService.findById(id);
      res.status(200).json({
        success: true,
        data: conta,
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
      const contaAtualizada = await ContaService.update(id, req.body);
      res.status(200).json({
        success: true,
        message: "Conta atualizada com sucesso.",
        data: contaAtualizada,
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
      await ContaService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ContaController();
