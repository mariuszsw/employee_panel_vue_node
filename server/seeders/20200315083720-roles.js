'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'Roles',
            [
                {
                    name: 'user'
                },
                {
                    name: 'admin'
                }
            ],
            {}
        );
    },

    down: (queryInterface, Sequelize) => {}
};
