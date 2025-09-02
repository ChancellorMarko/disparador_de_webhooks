const { Sequelize } = require('sequelize');
const config = require('./src/config/database-cli.js').development;

const sequelize = new Sequelize(config);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com banco funcionando!');
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();