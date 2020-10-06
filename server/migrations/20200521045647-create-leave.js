'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Leaves', {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            leaveDays: {
                allowNull: false,
                type: Sequelize.INTEGER
            },

            start: {
                allowNull: false,
                type: Sequelize.DATEONLY
            },

            end: {
                allowNull: false,
                type: Sequelize.DATEONLY
            },

            approved: {
                allowNull: false,
                type: Sequelize.BOOLEAN
            },

            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                onDelete: 'CASCADE',
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            },

            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Leaves');
    }
};
