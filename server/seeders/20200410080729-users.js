const faker = require('faker');
const bcrypt = require('bcrypt');
const { Role, User } = require('../models');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const adminRole = await Role.findOne({
            where: {
                name: 'admin'
            }
        });

        const userRole = await Role.findOne({
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
                    birthdate: faker.date.past(20),
                    password: bcrypt.hashSync('password', 12),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ],
            {}
        );

        const admin = await User.findOne({
            where: {
                email: 'admin@system.test'
            }
        });

        await admin.addRole(adminRole);
    },

    down: (queryInterface, Sequelize) => {}
};
