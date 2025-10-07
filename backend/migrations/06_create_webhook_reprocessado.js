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
};'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("webhook_reprocessados", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        // AJUSTADO: Deixamos o Sequelize gerar o UUID na aplicação, não no banco.
        // Isso torna o model a única fonte da verdade e aumenta a portabilidade.
        allowNull: false,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      // REMOVIDO: Campo 'data_criacao' redundante.
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
      kind: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      servico_id: {
        type: Sequelize.TEXT,
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
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    // Índices continuam os mesmos
    await queryInterface.addIndex("webhook_reprocessados", ["cedente_id"]);
    await queryInterface.addIndex("webhook_reprocessados", ["protocolo"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("webhook_reprocessados");
  },
};



