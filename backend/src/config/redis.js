const redis = require("redis")
require("dotenv").config()

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("❌ Redis max retry attempts reached")
        return new Error("Max retry attempts reached")
      }
      const delay = Math.min(retries * 100, 3000)
      console.log(`⚠️ Tentando reconectar ao Redis (tentativa ${retries})...`)
      return delay
    },
  },
  password: process.env.REDIS_PASSWORD || undefined,
  database: process.env.REDIS_DB || 0,
})

redisClient.on("connect", () => {
  console.log("✅ Conectando ao Redis...")
})

redisClient.on("ready", () => {
  console.log("✅ Redis está pronto para uso")
})

redisClient.on("error", (err) => {
  console.error("❌ Erro no Redis:", err.message)
})

redisClient.on("end", () => {
  console.log("⚠️ Conexão com Redis encerrada")
})

// Função para conectar ao Redis
const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect()
    }
  } catch (error) {
    console.error("❌ Erro ao conectar ao Redis:", error.message)
    throw error
  }
}

// Função para desconectar do Redis
const disconnectRedis = async () => {
  try {
    if (redisClient.isOpen) {
      await redisClient.quit()
    }
  } catch (error) {
    console.error("❌ Erro ao desconectar do Redis:", error.message)
  }
}

module.exports = {
  redisClient,
  connectRedis,
  disconnectRedis,
}
