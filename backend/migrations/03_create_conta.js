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
      // ADICIONADO: Conforme a documentação
      data_criacao: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
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
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("contas");
  },
};