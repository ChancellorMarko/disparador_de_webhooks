'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("software_houses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // REMOVIDO: Campo 'data_criacao' redundante. 'created_at' já cumpre este papel.
      cnpj: {
        type: Sequelize.STRING(14),
        allowNull: false,
        unique: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    // Índices continuam os mesmos
    await queryInterface.addIndex("software_houses", ["cnpj"]);
    await queryInterface.addIndex("software_houses", ["token"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("software_houses");
  },
};
