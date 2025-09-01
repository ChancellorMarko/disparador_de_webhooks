'use strict';

Modulo.exports = {

    async up(queryInterface, Sequelize){
        await queryInterface.createTable( 'cedentes',{
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.literal('gen_random_uuid()')

            },
            nome: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            created_at:{
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW')
            },
            update_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW')
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('cedentes');
    }
};


