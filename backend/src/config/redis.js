const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB || 0,
  retry_strategy: function(options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      console.error('❌ Redis server refused connection');
      return new Error('Redis server refused connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      console.error('❌ Redis retry time exhausted');
      return new Error('Redis retry time exhausted');
    }
    if (options.attempt > 10) {
      console.error('❌ Redis max retry attempts reached');
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
});

redisClient.on('connect', () => {
  console.log('✅ Conectado ao Redis');
});

redisClient.on('error', (err) => {
  console.error('❌ Erro no Redis:', err);
});

redisClient.on('ready', () => {
  console.log('✅ Redis está pronto para uso');
});

redisClient.on('end', () => {
  console.log('⚠️ Conexão com Redis encerrada');
});

// Função para conectar ao Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('❌ Erro ao conectar ao Redis:', error);
  }
};

// Função para desconectar do Redis
const disconnectRedis = async () => {
  try {
    await redisClient.quit();
  } catch (error) {
    console.error('❌ Erro ao desconectar do Redis:', error);
  }
};

module.exports = {
  redisClient,
  connectRedis,
  disconnectRedis
};



