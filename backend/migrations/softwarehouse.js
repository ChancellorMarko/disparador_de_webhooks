'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('software_houses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cnpj: {
        type: Sequelize.STRING(18),
        allowNull: false,
        unique: true
      },
      razao_social: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      nome_fantasia: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      senha: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      token_sh: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      ultimo_acesso: {
        type: Sequelize.DATE,
        allowNull: true
      },
      tentativas_login: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      bloqueado_ate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Índices com nomes explícitos para evitar conflito
    await queryInterface.addIndex('software_houses', ['cnpj'], {
      name: 'idx_software_houses_cnpj'
    });
    await queryInterface.addIndex('software_houses', ['email'], {
      name: 'idx_software_houses_email'
    });
    await queryInterface.addIndex('software_houses', ['token_sh'], {
      name: 'idx_software_houses_token_sh'
    });
    await queryInterface.addIndex('software_houses', ['ativo'], {
      name: 'idx_software_houses_ativo'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Primeiro remove os índices nomeados
    await queryInterface.removeIndex('software_houses', 'idx_software_houses_cnpj');
    await queryInterface.removeIndex('software_houses', 'idx_software_houses_email');
    await queryInterface.removeIndex('software_houses', 'idx_software_houses_token_sh');
    await queryInterface.removeIndex('software_houses', 'idx_software_houses_ativo');

    // Depois dropa a tabela
    await queryInterface.dropTable('software_houses');
  }
};