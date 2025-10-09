const ContaService = require("../services/ContaService");

class ContaController {
  /**
   * @desc    Cria uma nova Conta
   * @route   POST /api/contas
   */
  async create(req, res, next) {
    try {
      // O ID do cedente é obrigatório no corpo da requisição para criar uma conta
      const { cedente_id } = req.body;
      if (!cedente_id) {
         return res.status(400).json({ success: false, message: 'O campo cedente_id é obrigatório.' });
      }
      const novaConta = await ContaService.create(req.body, cedente_id);
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
   * @desc    Lista todas as Contas
   * @route   GET /api/contas
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
   * @desc    Busca uma Conta específica por ID
   * @route   GET /api/contas/:id
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
   * @desc    Atualiza uma Conta
   * @route   PUT /api/contas/:id
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
   * @desc    Deleta uma Conta
   * @route   DELETE /api/contas/:id
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
