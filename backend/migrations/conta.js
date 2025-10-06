'use strict';


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("contas", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      // REMOVIDO: Campo 'data_criacao' redundante.
      produto: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      banco_codigo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cedente_id: {
        type: Sequelize.INTEGER,
        // AJUSTADO: Chaves estrangeiras não devem ser nulas.
        allowNull: false,
        references: {
          model: "cedentes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      configuracao_notificacao: {
        type: Sequelize.JSONB,
        allowNull: true,
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
    await queryInterface.addIndex("contas", ["cedente_id"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("contas");
  },
};
