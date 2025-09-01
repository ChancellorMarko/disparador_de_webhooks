'use strict';

MediaSourceHandle.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('contas', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()')
            },
            numero: {
                type: Sequelize.STRING,
                allowNull: false
            },
            agencia: {
                type: Sequelize.STRING,
                allowNull: false
            },
            cedente_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {model: 'cedentes', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW')
            },
            update_at: {
                typr: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW')
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('contas');
    }
};


