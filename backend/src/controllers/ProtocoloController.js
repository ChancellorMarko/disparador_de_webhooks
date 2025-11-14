const ProtocoloService = require("../services/ProtocoloService");
// Importe seu cliente Redis configurado
const { redisClient } = require("../config/redis"); 

class ProtocoloController {
  async findByUuid(req, res, next) {
    try {
      const { uuid } = req.params;
      const cacheKey = `protocolo:${uuid}`;

      // 1. Tenta buscar do cache primeiro
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }

      const protocolo = await ProtocoloService.findByUuid(uuid);

      // 2. Tratamento de erro para protocolo não encontrado
      if (!protocolo) {
        return res.status(400).json({ message: "Protocolo não encontrado." });
      }
      
      const response = { success: true, data: protocolo };

      // 3. Cache condicional (só salva se o status for 'sent' ou 'enviado')
      if (protocolo.status === 'enviado') { // ou 'sent', dependendo do seu model
          // Salva no cache por 1 hora (3600 segundos)
          await redisClient.set(cacheKey, JSON.stringify(response), { EX: 3600 });
      }

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const { start_date, end_date } = req.query;

      // 1. Validação do intervalo de datas
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 31) {
          return res.status(400).json({ message: 'O intervalo entre as datas não pode ser maior que 31 dias.' });
      }

      const cacheKey = `protocolos:start=${start_date}:end=${end_date}`;

      // 2. Tenta buscar do cache primeiro
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }
      
      const protocolos = await ProtocoloService.findAll(req.query);
      const response = { success: true, data: protocolos };

      // 3. Salva a resposta no cache por 1 dia
      await redisClient.set(cacheKey, JSON.stringify(response), { EX: 86400 });

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProtocoloController();