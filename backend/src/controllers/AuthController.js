const jwt = require('jsonwebtoken');
const SoftwareHouse = require('../models/SoftwareHouse'); // <-- Verifique se o caminho para seu model está correto
const { AppError } = require('../utils/errors');       // <-- Verifique se o caminho para seus utils está correto

class AuthController {
  /**
   * @desc    Autentica uma Software House e retorna um token JWT
   * @route   POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      // 1. Pega as credenciais do corpo da requisição
      //    Renomeamos 'token' para 'staticToken' para não confundir com o token JWT
      const { cnpj, token: staticToken } = req.body;

      if (!cnpj || !staticToken) {
        throw new AppError('CNPJ e Token são obrigatórios.', 400);
      }

      // 2. Busca a Software House no banco de dados pelo CNPJ
      const softwareHouse = await SoftwareHouse.findOne({ where: { cnpj } });

      // 3. Valida se a Software House existe e se o token estático dela é o mesmo enviado
      if (!softwareHouse || softwareHouse.token !== staticToken) {
        throw new AppError('Credenciais inválidas.', 401);
      }
      
      // Valida se a Software House está ativa (opcional, mas recomendado)
      if (softwareHouse.status !== 'ativo') {
          throw new AppError('Esta Software House não está ativa.', 403);
      }

      // 4. *** A CORREÇÃO DEFINITIVA ESTÁ AQUI ***
      //      Cria o "payload": o objeto de dados que será armazenado dentro do token JWT.
      const payload = {
        softwareHouseId: softwareHouse.id, // Incluímos o ID da Software House!
        cnpj: softwareHouse.cnpj,
      };

      // 5. Gera o token JWT usando o payload, a chave secreta e uma data de expiração
      const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d', // O token será válido por 1 dia
      });

      // 6. Retorna o token JWT para o cliente, que deverá usá-lo nas próximas requisições
      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso!',
        token: jwtToken,
      });

    } catch (error) {
      // Passa qualquer erro para o seu middleware de tratamento de erros global
      next(error);
    }
  }
}

module.exports = new AuthController();