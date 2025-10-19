'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('servicos', 'produto', {
      type: Sequelize.STRING,
      allowNull: true, // Começa como nulo para não quebrar dados existentes
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('servicos', 'produto');
  }
};