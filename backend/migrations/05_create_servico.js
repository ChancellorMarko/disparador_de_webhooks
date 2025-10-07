'use strict';


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("servicos", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      // REMOVIDO: Campo 'data_criacao' redundante.
      convenio_id: {
        type: Sequelize.INTEGER,
        // AJUSTADO: Chaves estrangeiras não devem ser nulas.
        allowNull: false,
        references: {
          model: "convenios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    // Índices continuam os mesmos
    await queryInterface.addIndex("servicos", ["convenio_id"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("servicos");
  },

};
