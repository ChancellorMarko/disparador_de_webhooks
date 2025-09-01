'use strict'

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('servicos', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('gen_random_uuid()'),
                primaryKey: true,
                allowNull: false,
            },
            data_criacao: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('NOW()'),
            },
            convenio_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'convenios',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            status:{
                type: Sequelize.STRING,
                allowNull: false,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('servicos');
    }
};


