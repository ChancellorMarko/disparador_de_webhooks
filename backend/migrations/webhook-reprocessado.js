'use strict';


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('webhook_reprocessados', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      data: {
        type: Sequelize.JSONB, // PostgreSQL
        allowNull: false,
      },
      data_criacao: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      cedente_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'cedentes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
        type: Sequelize.TEXT, // armazenando array de IDs como JSON.stringify()
        allowNull: false,
      },
      protocolo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },


  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('webhook_reprocessados');
  }
};
