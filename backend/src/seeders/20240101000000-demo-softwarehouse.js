'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('senha123', 12);
    
    return queryInterface.bulkInsert('software_houses', [{
      cnpj: '12.345.678/0001-90',
      razao_social: 'Software House Demo Ltda',
      nome_fantasia: 'Demo SH',
      email: 'demo@softwarehouse.com',
      senha: hashedPassword,
      token_sh: 'demo123456789012345678901234567890',
      ativo: true,
      tentativas_login: 0,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('software_houses', { cnpj: '12.345.678/0001-90' }, {});
  }
};
