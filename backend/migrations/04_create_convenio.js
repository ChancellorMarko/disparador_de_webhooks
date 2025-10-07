'use strict';


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("convenios", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      numero_convenio: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // REMOVIDO: Campo 'data_criacao' redundante.
      conta_id: {
        type: Sequelize.INTEGER,
        // AJUSTADO: Chaves estrangeiras não devem ser nulas.
        allowNull: false,
        references: {
          model: "contas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    });
    // Índices continuam os mesmos
    await queryInterface.addIndex("convenios", ["conta_id"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("convenios");
  },
};
