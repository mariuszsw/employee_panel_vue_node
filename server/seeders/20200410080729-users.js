const faker = require('faker');
const bcrypt = require('bcrypt');
const { role, user } = require('../models');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const adminRole = await role.findOne({
            where: {
                name: 'admin'
            }
        });

        const userRole = await role.findOne({
            where: {
                name: 'user'
            }
        });

        await queryInterface.bulkInsert(
            'Users',
            [
                {
                    name: faker.name.firstName(),
                    surname: faker.name.lastName(),
                    email: 'admin@system.test',
                    password: bcrypt.hashSync('password', 12),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ],
            {}
        );

        const admin = await user.findOne({
            where: {
                email: 'admin@system.test'
            }
        });

        await admin.addRole(adminRole);
    },

    down: (queryInterface, Sequelize) => {}
};
