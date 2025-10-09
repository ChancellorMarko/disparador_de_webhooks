'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("webhook_reprocessados", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      // ADICIONADO: Conforme a documentação
      data_criacao: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
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
      kind: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      servico_id: {
        type: Sequelize.TEXT, // Armazena um array de IDs como string
        allowNull: false,
      },
      protocolo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
    await queryInterface.dropTable("webhook_reprocessados");
},
};