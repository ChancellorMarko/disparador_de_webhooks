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
      // CORREÇÃO: Adicionando a coluna 'data_criacao' de volta
      data_criacao: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Usa o horário atual do banco como padrão
      },
      convenio_id: {
        type: Sequelize.INTEGER,
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
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.addIndex("servicos", ["convenio_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("servicos");
  },
};