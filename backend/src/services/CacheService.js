const redis = require('redis');
const { AppError } = require("../utils/errors");

class CacheService {
  constructor() {
    this.redisClient = redis.createClient({
      // Coloque sua URL do Redis aqui se tiver
      // url: process.env.REDIS_URL
    });
    this.redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    this.connect();
  }

  async connect() {
    if (!this.redisClient.isOpen) {
      await this.redisClient.connect();
    }
  }

  async get(key) {
    try {
      const data = await this.redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Erro ao buscar do cache:", error);
      return null;
    }
  }

  async set(key, value, ttl) {
    try {
      await this.redisClient.set(key, JSON.stringify(value), {
        EX: ttl,
      });
    } catch (error) {
      console.error("Erro ao salvar no cache:", error);
    }
  }

  async del(key) {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      console.error("Erro ao deletar do cache:", error);
    }
  }
}

// Exporta uma instância da classe, garantindo uma única conexão
module.exports = new CacheService();