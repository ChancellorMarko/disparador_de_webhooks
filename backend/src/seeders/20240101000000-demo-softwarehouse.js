'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('senha123', 10);

    return queryInterface.bulkInsert('software_houses', [{
      cnpj: '11222333000144',
      razao_social: 'Software House de Teste LTDA',
      nome_fantasia: 'SH Teste',
      email: 'contato@shteste.com',
      senha: hashedPassword,
      token: uuidv4().replace(/-/g, ""),
      status: 'ativo',
      
      // LINHA ADICIONADA:
      data_criacao: new Date(),

      created_at: new Date(),
      updated_at: new Date(),
    }], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('software_houses', null, {});
  }
};