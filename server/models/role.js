module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('Role', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        }
    });

    Role.ADMIN = 'admin';
    Role.USER = 'user';

    return Role;
};
