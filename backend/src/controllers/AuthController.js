const jwt = require('jsonwebtoken');
const SoftwareHouse = require('../models/SoftwareHouse'); 
const { AppError } = require('../utils/errors');      

class AuthController {
  /**
   * @desc    Autentica uma Software House e retorna um token JWT
   * @route   POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { cnpj, token: staticToken } = req.body;

      // 1. Valida se o CNPJ e o token estático foram fornecidos
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

      //4. Cria o "payload": o objeto de dados que será armazenado dentro do token JWT.
      const payload = {
        softwareHouseId: softwareHouse.id,
        cnpj: softwareHouse.cnpj,
      };

      // 5. Gera o token JWT usando o payload, a chave secreta e uma data de expiração
      const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
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