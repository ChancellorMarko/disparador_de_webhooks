const ReenvioService = require("../services/ReenvioService");
const { redisClient } = require("../config/redis"); 

class ReenvioController {
  async create(req, res, next) {
    try {
      const { product, id, kind, type } = req.body;

      // --- LÓGICA DE CACHE (REDIS) ---
      // 1. Cria a chave única para o cache
      const sortedIds = Array.isArray(id) ? [...id].sort().join(',') : id;
      const cacheKey = `${product}:${sortedIds}:${kind}:${type}`;

      // 2. Verifica se já existe resposta salva no cache
      const cachedResponse = await redisClient.get(cacheKey);
      if (cachedResponse) {
        console.log(`[CACHE] Retornando resposta em cache para: ${cacheKey}`);
        return res.status(200).json(JSON.parse(cachedResponse));
      }
      // --------------------------------

      // Se não estiver em cache, processa normalmente
      const result = await ReenvioService.criarReenvio(req.body, req.cedente);

      const response = {
        success: true,
        message: "Solicitação de reenvio criada com sucesso.",
        data: result,
      };

      // --- SALVAR NO CACHE ---
      // 3. Salva o sucesso no Redis por 1 hora (3600 segundos)
      await redisClient.set(cacheKey, JSON.stringify(response), { EX: 3600 });
      // -----------------------

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReenvioController();