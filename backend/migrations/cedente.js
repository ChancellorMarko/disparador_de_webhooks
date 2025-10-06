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
      // REMOVIDO: Campo 'data_criacao' redundante.
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
      softwarehouse_id: {
        type: Sequelize.INTEGER,
        // AJUSTADO: Chaves estrangeiras não devem ser nulas para garantir integridade.
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
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    // Índices continuam os mesmos
    await queryInterface.addIndex("cedentes", ["cnpj"]);
    await queryInterface.addIndex("cedentes", ["token"]);
    await queryInterface.addIndex("cedentes", ["softwarehouse_id"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("cedentes");
  },
};
