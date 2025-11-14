'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cedentes", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      data_criacao: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      cnpj: {
        type: Sequelize.STRING(14),
        allowNull: false,
        unique: true,
      },
      razao_social: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nome_fantasia: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      softwarehouse_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "software_houses",
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
    await queryInterface.dropTable("cedentes");
  },
};