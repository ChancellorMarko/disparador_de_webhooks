'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('protocolos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      protocolo: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
      },
      cedente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'cedentes', key: 'id' },
        onDelete: 'CASCADE',
      },
      conta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'contas', key: 'id' },
        onDelete: 'CASCADE',
      },
      convenio_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'convenios', key: 'id' },
        onDelete: 'CASCADE',
      },
      servico_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'servicos', key: 'id' },
        onDelete: 'CASCADE',
      },
      software_house_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'software_houses', key: 'id' },
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pendente',
      },
      tentativas: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      dados_requisicao: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      dados_resposta: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      erro_mensagem: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      processado_em: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('protocolos');
  }
};