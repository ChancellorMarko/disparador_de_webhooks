const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "disparador_webhooks",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  
  timezone: 'America/Sao_Paulo', 

  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    max: 3,
    timeout: 3000,
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
});

// Teste de conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com o banco de dados estabelecida com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco de dados:", error.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  testConnection,
};