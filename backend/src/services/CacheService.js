const redisClient = require("../config/redis"); // Ajuste o caminho para sua config do Redis
const AppError = require("../utils/errors");

/**
 * Encapsula a lógica de interação com o cache (Redis).
 * Isso torna os outros serviços mais limpos e facilita a troca do sistema de cache no futuro.
 */
class CacheService {
  /**
   * Busca um valor no cache pela chave.
   * @param {string} key - A chave para buscar.
   * @returns {Promise<any | null>} O valor encontrado (já deserializado) ou null.
   */
  static async get(key) {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Erro ao buscar do cache:", error);
      return null;
    }
  }

  /**
   * Salva um valor no cache.
   * @param {string} key - A chave para salvar.
   * @param {any} value - O valor a ser salvo (será serializado).
   * @param {number} ttl - Tempo de vida em segundos (Time To Live).
   */
  static async set(key, value, ttl) {
    try {
      await redisClient.set(key, JSON.stringify(value), {
        EX: ttl, // Define o tempo de expiração em segundos
      });
    } catch (error) {
      console.error("Erro ao salvar no cache:", error);
    }
  }

  /**
   * Deleta uma chave do cache.
   * @param {string} key - A chave a ser deletada.
   */
  static async del(key) {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error("Erro ao deletar do cache:", error);
    }
  }
}

module.exports = CacheService;
