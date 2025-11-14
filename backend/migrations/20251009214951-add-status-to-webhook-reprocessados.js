'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('webhook_reprocessados', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pendente',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('webhook_reprocessados', 'status');
  }
};
